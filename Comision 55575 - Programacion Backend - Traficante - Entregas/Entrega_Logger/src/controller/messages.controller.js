import * as messagesService from '../services/messages.service.js'

const getAll = async (req, res) => {
    const messages = await messagesService.getAllMessagesService();
    res.sendSuccess(messages);
};

const createNewMessage = async (req, res) => {
    const { user, message } = req.body;
    try {
        const nuevoMensaje = await messagesService.createNewMessageService(user, message);
        res.status(200).json({ status: 'success', message: 'Message created', data: nuevoMensaje });
    } catch (error) {
        req.logger.error(error.message);
        res.status(500).send({ status: 'error', message: error.message });
    }
};

export {
    getAll,
    createNewMessage
};