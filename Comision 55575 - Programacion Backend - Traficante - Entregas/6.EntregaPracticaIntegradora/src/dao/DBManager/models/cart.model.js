import mongoose from "mongoose";

const cartCollection = 'cart';

const cartSchema = new mongoose.Schema({
    products: [
        {
            productId: {
                type: String,
                required: true
            },
            quantity: {
                type: Number,
                required: true
            }
        }
    ]
});

export const cartModel = mongoose.model(cartCollection, cartSchema);