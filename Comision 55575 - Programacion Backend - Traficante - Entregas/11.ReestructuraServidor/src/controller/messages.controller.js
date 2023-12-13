import { getAllMessagesService, createNewMessageService } from '../services/messages.services.js';

const getAll = async (req, res) => {
    const messages = await getAllMessagesService();
    res.sendSuccess(messages);
};

const createNewMessage = async (req, res) => {
    const { user, message } = req.body;
    try {
        const nuevoMensaje = await createNewMessageService(user, message);
        res.status(200).json({ status: 'success', message: 'Message created', data: nuevoMensaje });
    } catch (error) {
        res.status(500).send({ status: 'error', message: error.message });
    }
};

export {
    getAll,
    createNewMessage
};