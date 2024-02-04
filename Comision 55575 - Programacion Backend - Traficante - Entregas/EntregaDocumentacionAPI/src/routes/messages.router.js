import Router from "../routes/router.js";
import Messages from '../dao/DBManager/classes/messages.dao.js'
import { accessRolesEnum, passportStrategiesEnum } from "../config/enums.js";
import { getAll, createNewMessage } from "../controller/messages.controller.js";


export default class MessagesRouter extends Router {
  constructor() {
    super();
    this.messagesManager = new Messages();
  }

  init() {
    this.get('/', [accessRolesEnum.USER], passportStrategiesEnum.JWT, getAll);
    this.post('/', [accessRolesEnum.USER], passportStrategiesEnum.JWT, createNewMessage);
  }
};



