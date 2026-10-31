
const crypto = require("crypto");

const razorpay = require("../config/razorpay");
const Cart = require("../models/Cart");
const Payment = require("../models/Payment");
const Order = require("../models/Order");

// 1. Create a Razorpay payment order
const createPaymentOrder = async (req, res, next) => {
    try {
        const { deliveryAddress } = req.body;

        // Validate delivery address
        if (
            !deliveryAddress ||
            !deliveryAddress.street ||
            !deliveryAddress.city ||
            !deliveryAddress.pincode ||
            !deliveryAddress.phone
        ) {
            return res.status(400).json({
                success: false,
                message: "Please provide complete delivery address"
            });
        }

        // Fetch logged-in user's cart
        const cart = await Cart.findOne({
            user: req.user._id
        }).populate(
            "items.foodItem",
            "name image price isAvailable"
        );

        if (!cart || cart.items.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Your cart is empty"
            });
        }

        // Prepare cart items
        const paymentItems = cart.items.map((item) => {
            if (!item.foodItem || !item.foodItem.isAvailable) {
                throw new Error("A food item in your cart is unavailable");
            }

            return {
                foodItem: item.foodItem._id,
                name: item.foodItem.name,
                price: item.price,
                quantity: item.quantity,
                image: item.foodItem.image
            };
        });

        // Calculate total on backend
        const totalPrice = paymentItems.reduce(
            (total, item) => total + item.price * item.quantity,
            0
        );

        // Razorpay expects amount in paise
        const amountInPaise = Math.round(totalPrice * 100);

        // Create Razorpay order
        const razorpayOrder = await razorpay.orders.create({
            amount: amountInPaise,
            currency: "INR",
            receipt: `foodies_${Date.now()}`
        });

        // Save payment attempt in MongoDB
        const payment = await Payment.create({
            user: req.user._id,
            items: paymentItems,
            deliveryAddress,
            amount: amountInPaise,
            currency: "INR",
            razorpayOrderId: razorpayOrder.id
        });

        res.status(201).json({
            success: true,
            message: "Payment order created",
            data: {
                paymentId: payment._id,
                razorpayOrderId: razorpayOrder.id,
                amount: razorpayOrder.amount,
                currency: razorpayOrder.currency,
                keyId: process.env.RAZORPAY_KEY_ID
            }
        });

    } catch (error) {
        next(error);
    }
};


// 2. Verify payment and create Foodies order
const verifyPayment = async (req, res, next) => {
    try {
        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature
        } = req.body;

        if (
            !razorpay_order_id ||
            !razorpay_payment_id ||
            !razorpay_signature
        ) {
            return res.status(400).json({
                success: false,
                message: "Payment verification details are missing"
            });
        }

        // Find payment attempt belonging to logged-in user
        const payment = await Payment.findOne({
            razorpayOrderId: razorpay_order_id,
            user: req.user._id
        });

        if (!payment) {
            return res.status(404).json({
                success: false,
                message: "Payment record not found"
            });
        }

        // Avoid creating duplicate Foodies orders
        if (payment.status === "Paid" && payment.order) {
            return res.status(200).json({
                success: true,
                message: "Payment already verified",
                data: { order: payment.order }
            });
        }

        // Generate expected signature using secret key
        const expectedSignature = crypto
            .createHmac(
                "sha256",
                process.env.RAZORPAY_KEY_SECRET
            )
            .update(`${razorpay_order_id}|${razorpay_payment_id}`)
            .digest("hex");

        const expectedBuffer = Buffer.from(expectedSignature);
        const receivedBuffer = Buffer.from(razorpay_signature);

        const signatureIsValid =
            expectedBuffer.length === receivedBuffer.length &&
            crypto.timingSafeEqual(expectedBuffer, receivedBuffer);

        if (!signatureIsValid) {
            return res.status(400).json({
                success: false,
                message: "Invalid payment signature"
            });
        }

        // Confirm payment details with Razorpay
        const razorpayPayment = await razorpay.payments.fetch(
            razorpay_payment_id
        );

        if (
            razorpayPayment.order_id !== razorpay_order_id ||
            razorpayPayment.amount !== payment.amount ||
            razorpayPayment.currency !== payment.currency ||
            razorpayPayment.status !== "captured"
        ) {
            return res.status(400).json({
                success: false,
                message: "Payment has not been successfully captured"
            });
        }

        // Create Foodies order only after verification
        const order = await Order.create({
            user: req.user._id,
            items: payment.items,
            deliveryAddress: payment.deliveryAddress,
            totalPrice: payment.amount / 100,
            paymentMethod: "Online",
            isPaid: true,
            paidAt: new Date()
        });

        // Update payment record
        payment.razorpayPaymentId = razorpay_payment_id;
        payment.status = "Paid";
        payment.order = order._id;
        await payment.save();

        // Clear cart after successful order creation
        const cart = await Cart.findOne({
            user: req.user._id
        });

        if (cart) {
            cart.items = [];
            cart.totalPrice = 0;
            await cart.save();
        }

        res.status(200).json({
            success: true,
            message: "Payment verified and order placed successfully!",
            data: { order }
        });

    } catch (error) {
        next(error);
    }
};


module.exports = {
    createPaymentOrder,
    verifyPayment
};
