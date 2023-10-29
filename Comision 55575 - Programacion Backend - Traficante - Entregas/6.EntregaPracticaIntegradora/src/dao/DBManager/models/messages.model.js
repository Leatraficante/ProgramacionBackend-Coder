import mongoose from "mongoose";

const messageCollection = 'message';

const messageSchema = new mongoose.Schema({
    user: {
        type: String,
        required: true,
        unique: true
    },
    message: {
        type: String,
        required: true
    }

});

export const messageModel = mongoose.model(messageCollection, messageSchema);