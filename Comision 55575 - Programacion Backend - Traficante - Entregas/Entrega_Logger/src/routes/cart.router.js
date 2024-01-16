import Router from "../routes/router.js";
import Carts from '../dao/DBManager/classes/carts.dao.js'
import { accessRolesEnum, passportStrategiesEnum } from "../config/enums.js";
import { getAll, saveCart, getById, addProductToCart, deleteProductFromCart, deleteCart, purchase } from '../controller/cart.controller.js'


export default class CartRouter extends Router {
  constructor() {
    super();
    this.cartManager = new Carts();
  }

  init() {
    this.get('/', [accessRolesEnum.USER], passportStrategiesEnum.JWT, getAll);
    this.post('/', [accessRolesEnum.USER], passportStrategiesEnum.JWT, saveCart);
    this.post('/:cid/purchase', [accessRolesEnum.USER], passportStrategiesEnum.JWT, purchase);
    this.get('/:cid', [accessRolesEnum.USER], passportStrategiesEnum.JWT, getById);
    this.post('/:cid/product/:pid', [accessRolesEnum.USER], passportStrategiesEnum.JWT, addProductToCart);
    this.delete('/:cid/product/:pid', [accessRolesEnum.USER], passportStrategiesEnum.JWT, deleteProductFromCart);
    this.delete('/:cid', [accessRolesEnum.USER], passportStrategiesEnum.JWT, deleteCart);

  };
};

