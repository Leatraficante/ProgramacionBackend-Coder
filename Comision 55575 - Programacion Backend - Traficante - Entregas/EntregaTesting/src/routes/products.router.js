import Router from "../routes/router.js";
import Products from '../dao/DBManager/classes/products.dao.js'
import { accessRolesEnum, passportStrategiesEnum } from "../config/enums.js";
import { getAll, getById, saveProduct, updateProduct, deleteProduct } from '../controller/products.controller.js'


export default class ProductRouter extends Router {
  constructor() {
    super();
    this.productManager = new Products();
  }

  init() {
    this.get('/', [accessRolesEnum.USER], passportStrategiesEnum.JWT, getAll);
    this.get('/:pid', [accessRolesEnum.USER, accessRolesEnum.ADMIN], passportStrategiesEnum.JWT, getById);
    this.post('/', [accessRolesEnum.ADMIN], passportStrategiesEnum.JWT, saveProduct);
    this.put('/:pid', [accessRolesEnum.ADMIN], passportStrategiesEnum.JWT, updateProduct);
    this.delete('/:pid', [accessRolesEnum.ADMIN], passportStrategiesEnum.JWT, deleteProduct);
  };
};

