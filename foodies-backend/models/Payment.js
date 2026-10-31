const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        items: [
            {
                foodItem: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "FoodItem",
                    required: true
                },
                name: String,
                price: Number,
                quantity: Number,
                image: String
            }
        ],

        deliveryAddress: {
            street: { type: String, required: true },
            city: { type: String, required: true },
            pincode: { type: String, required: true },
            phone: { type: String, required: true }
        },

        amount: {
            type: Number,
            required: true
        },

        currency: {
            type: String,
            default: "INR"
        },

        razorpayOrderId: {
            type: String,
            required: true,
            unique: true
        },

        razorpayPaymentId: {
            type: String
        },

        status: {
            type: String,
            enum: ["Created", "Paid", "Failed"],
            default: "Created"
        },

        order: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Order"
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Payment", paymentSchema);