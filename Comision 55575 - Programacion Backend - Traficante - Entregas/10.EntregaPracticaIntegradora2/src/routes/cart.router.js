import Router from "../routes/router.js";
import Carts from '../dao/DBManager/CartManager.js'
import { accessRolesEnum, passportStrategiesEnum } from "../config/enums.js";


export default class CartRouter extends Router {
  constructor() {
    super();
    this.cartManager = new Carts();
  }

  init() {
    this.get('/', [accessRolesEnum.USER], passportStrategiesEnum.JWT, this.getAll);
    this.post('/', [accessRolesEnum.USER], passportStrategiesEnum.JWT, this.saveCart);
    this.get('/:cid', [accessRolesEnum.USER], passportStrategiesEnum.JWT, this.getById);
    this.post('/:cid/product/:pid', [accessRolesEnum.USER], passportStrategiesEnum.JWT, this.addProductToCart);
    this.delete('/:cid/product/:pid', [accessRolesEnum.USER], passportStrategiesEnum.JWT, this.deleteProductFromCart);
    this.delete('/:cid', [accessRolesEnum.USER], passportStrategiesEnum.JWT, this.deleteCart);
  };



  async getAll(req, res) {
    try {
      let cart = await this.cartManager.getAll();
      res.sendSuccess(cart)
    } catch (error) {
      res.sendServerError(error.message);
    }
  };

  async saveCart(req, res) {
    try {
      const userId = req.user._id;
      const result = await this.cartManager.save(userId);
      res.sendSuccessNewResults(result);
    } catch (error) {
      res.sendServerError(error.message);
    }
}


  async getById(req, res) {
    const cartId = req.params.cid;
    try {
      const cart = await this.cartManager.getById(cartId);
      if (cart) {
        res.sendSuccess(cart)
      } else {
        res.status(404).send({ error: "Not Found" });
      }
    } catch (error) {
      res.sendServerError(error.message);
    }
  };


  async addProductToCart(req, res) {
    const cartId = req.params.cid;
    const productId = req.params.pid;
    const quantity = req.body.quantity;

    try {
      const updatedCart = await this.cartManager.addProductToCart(cartId, productId, quantity);
      return res.redirect('/api/carts')
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  };

  async deleteProductFromCart(req, res) {
    try {
      const { cid, pid } = req.params;
      const result = await this.cartManager.deleteProductFromCart(cid, pid);
  
      res.sendSuccess({ message: 'Product deleted successfully', deletedProduct: result });
    } catch (error) {
      res.sendClientError({ error: error.message });
    }
  }

  async deleteCart(req, res) {
    try {
      const { cid } = req.params;
      const deletedCart = await this.cartManager.delete(cid);
      res.sendSuccess(`Cart deleted`)
    } catch (error) {
      res.status(404).json({ error: "Not Found" });
    }
  };

};

