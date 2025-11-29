const mongoose = required ("mongoose");

const OrderSchema = new mongoose.Schema(
    {
        userId: {type: String, required: true },

        products: [
            {
                productId: {type: String, required: true},
                quantity: { type: Number, default: 1},
                amount: {type: Number, required: true}
            }
        ],

        totalAmount: { type: Number, required:true },
        status: {type: String, required: true, default: "pending"}
    },
    {timestamps: true}
);

module.exports = mongoose.model("Order", OrderSchema)