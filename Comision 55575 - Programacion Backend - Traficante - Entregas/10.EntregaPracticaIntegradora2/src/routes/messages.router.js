import Router from "../routes/router.js";
import Messages from '../dao/DBManager/MessagesManager.js'
import { accessRolesEnum, passportStrategiesEnum } from "../config/enums.js";


export default class MessagesRouter extends Router {
  constructor() {
    super();
    this.messagesManager = new Messages();
  }

  init() {
    this.get('/', [accessRolesEnum.USER], passportStrategiesEnum.JWT, this.getAll);
    this.post('/', [accessRolesEnum.USER], passportStrategiesEnum.JWT, this.createNewMessage);
  }

  async getAll(req, res) {
    try {
      let messages = await this.messagesManager .getAll();
      res.sendSuccess(messages)
    } catch (error) {
      res.sendServerError(error.message);
    }
  };

  async createNewMessage (req, res) {
    const { user, message } = req.body;
    try {
      const nuevoMensaje = await messagesManager.createNewMessage(user, message);
      res.status(200).json({ status: 'success', message: 'Message created', data: nuevoMensaje });
    } catch (error) {
      res.status(500).send({ status: 'error', message: error.message });
    }
  };

};



