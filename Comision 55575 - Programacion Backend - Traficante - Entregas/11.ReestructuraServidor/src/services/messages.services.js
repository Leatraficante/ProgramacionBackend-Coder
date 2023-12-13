import Messages from '../dao/DBManager/MessagesManager.js'

const messagesManager = new Messages();

const getAllMessagesService = async () => {
    return messagesManager.getAll();
};

const createNewMessageService = async (user, message) => {
    return messagesManager.createNewMessage(user, message);
};

export {
    getAllMessagesService,
    createNewMessageService
};