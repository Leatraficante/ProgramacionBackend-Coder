import { messageModel } from './models/messages.model.js';

export default class Messages {
  constructor() {
    console.log('Working on Messages DB')
  }

  getAll = async () => {
    const messages = await messageModel.find().lean();//metodo para transforamr de BSON a POJO
    return messages;
  };

  createNewMessage = async (user, message) => {
    const nuevoMensaje = new messageModel({
      user,
      message,
    });

    try {
      const mensajeGuardado = await nuevoMensaje.save();
      console.log('Mensaje guardado con éxito:', mensajeGuardado);
      return mensajeGuardado;
    } catch (err) {
      console.error('Error al guardar el mensaje:', err);
      throw err;
    }
  }



};
