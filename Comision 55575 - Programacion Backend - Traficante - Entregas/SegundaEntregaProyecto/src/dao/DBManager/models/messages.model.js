import mongoose from "mongoose";
import mongoosePaginate from 'mongoose-paginate-v2';

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
    },
    date: {
        type: Date,
        default: Date.now
    }

});

messageSchema.plugin(mongoosePaginate); 

export const messageModel = mongoose.model(messageCollection, messageSchema);

