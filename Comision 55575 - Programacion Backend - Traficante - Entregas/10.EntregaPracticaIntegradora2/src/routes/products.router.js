import Router from "../routes/router.js";
import Products from '../dao/DBManager/ProductManager.js'
import { accessRolesEnum, passportStrategiesEnum } from "../config/enums.js";


export default class ProductRouter extends Router {
  constructor() {
    super();
    this.productManager = new Products();
  }

  init() {
    this.get('/', [accessRolesEnum.USER], passportStrategiesEnum.JWT, this.getAll); ///api/products
    this.get('/:pid', [accessRolesEnum.USER], passportStrategiesEnum.JWT, this.getById);
    this.post('/', [accessRolesEnum.USER], passportStrategiesEnum.JWT, this.saveProduct);
    this.put('/:pid', [accessRolesEnum.USER], passportStrategiesEnum.JWT, this.updateProduct);
    this.delete('/:pid', [accessRolesEnum.USER], passportStrategiesEnum.JWT, this.deleteProduct);
  };

  async getAll (req, res) {
    try {
      const products = await this.productManager.getAll();
      res.sendSuccess(cart)
    } catch (error) {
      console.log(error)
      res.sendServerError(error.message);
    }
  };

  async getById (req, res) {
    try {
      const { pid } = req.params;
      const product = await this.productManager.getById(pid);
      if (product) {
        res.sendSuccess(product)
      } else {
        res.status(404).send({ error: "Product not Found" });
      }
    } catch (error) {
      console.log(error)
      res.sendServerError(error.message);
    }
  };

  async saveProduct (req, res) {
    try {
      const { title, description, code, price, stock, category } = req.body;
      if (!title || !description || !code || !price || !stock || !category) {
        return res.status(400).send({ states: 'error', message: 'Incomplete Values' })
      }
  
      const result = await this.productManager.save({
        title,
        description,
        code,
        price,
        stock,
        category
      });
      res.sendSuccessNewResults(result)
  
    } catch (error) {
      console.log(error)
      res.sendServerError(error.message);
    }
  };

  async updateProduct (req, res) {
    try {
      const { title, description, code, price, stock, category } = req.body;
      const { pid } = req.params;
      if (!title || !description || !code || !price || !stock || !category) {
        return res.status(400).send({ states: 'error', message: 'Incomplete Values' })
      };
  
      const result = await this.productManager.update(pid, {
        title,
        description,
        code,
        price,
        stock,
        category
      });
  
      res.sendSuccessNewResults(result)
  
  
    } catch (error) {
      console.log(error)
      res.sendServerError(error.message);
  
    }
  };

  async deleteProduct (req, res) {
    try {
      const { pid } = req.params;
      const deletedProduct = await this.productManager.delete(pid);
      res.sendSuccess(`Product deleted`)
    } catch (error) {
      console.log(error)
      res.status(404).json({ error: "Product not Found" });
    }
  };
};

