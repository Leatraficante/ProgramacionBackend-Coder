import { messageModel } from '../models/messages.model.js'

export default class MessagesDao {
  constructor() {
    console.log('Working on Messages DB');
  }

  getAll = async () => {
    const messages = await messageModel.find().lean();
    return messages;
  };

  createNewMessage = async (user, message) => {
    let nuevoMensaje = new messageModel({
      user,
      message,
    });

    try {
      let mensajeGuardado = await nuevoMensaje.save();
      return mensajeGuardado;
    } catch (error) {
      throw error;
    }
  };
}
