import mongoose from "mongoose";

const messagesCollection = 'messages';

const messageSchema = new mongoose.Schema({
    user: {
        type: String,
        required: true,
    },
    message: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        default: Date.now,
    },
});

export const messageModel = mongoose.model(messagesCollection, messageSchema);
