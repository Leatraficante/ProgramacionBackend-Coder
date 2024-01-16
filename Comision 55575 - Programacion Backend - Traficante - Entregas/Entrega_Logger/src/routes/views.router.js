import Router from "../routes/router.js";
import Products from '../dao/DBManager/classes/products.dao.js';
import Carts from "../dao/DBManager/classes/carts.dao.js";
import Messages from '../dao/DBManager/classes/messages.dao.js'
import { accessRolesEnum, passportStrategiesEnum } from "../config/enums.js";
import { login, loginRedirect, logout, register, profile, productsView, cartsView, messagesView, productId, cartId, loginError, loggerTest } from '../controller/views.controller.js'


export default class ViewsRouter extends Router {
    constructor() {
        super();
        this.productManager = new Products();
        this.cartManager = new Carts();
        this.messagesManager = new Messages();

    }

    init() {
        this.get('/api/users/register', [accessRolesEnum.PUBLIC], passportStrategiesEnum.NOTHING, register);
        this.get('/api/users/login', [accessRolesEnum.PUBLIC], passportStrategiesEnum.NOTHING, login);
        this.get('/api/users/logout', [accessRolesEnum.USER, accessRolesEnum.ADMIN], passportStrategiesEnum.JWT, logout);
        this.get('/', [accessRolesEnum.PUBLIC], passportStrategiesEnum.NOTHING, loginRedirect);
        this.get('/profile', [accessRolesEnum.USER, accessRolesEnum.ADMIN], passportStrategiesEnum.JWT, profile);
        this.get('/api/products', [accessRolesEnum.USER, accessRolesEnum.ADMIN], passportStrategiesEnum.JWT, productsView);
        this.get('/api/carts', [accessRolesEnum.USER], passportStrategiesEnum.JWT, cartsView);
        this.get('/api/messages-view', [accessRolesEnum.USER], passportStrategiesEnum.JWT, messagesView);
        this.get('/api/products/:productId', [accessRolesEnum.USER, accessRolesEnum.ADMIN], passportStrategiesEnum.JWT, productId);
        this.get('/api/carts/:cid', [accessRolesEnum.USER], passportStrategiesEnum.JWT, cartId);
        this.get('/api/users/login?error=loginError', [accessRolesEnum.PUBLIC], passportStrategiesEnum.NOTHING, loginError)
        this.get('/api/loggerTest', [accessRolesEnum.PUBLIC], passportStrategiesEnum.NOTHING, loggerTest)
    };
};

