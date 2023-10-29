import { messageModel } from '../DBManager/models/messages.model.js';

export default class Messages {
  constructor() {
    console.log('Working on Messages DB')
  }

  getAll = async () => {
    const messages = await messageModel.find().lean();//metodo para transforamr de BSON a POJO
    return messages;
  };

};
