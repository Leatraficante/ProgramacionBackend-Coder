import Router from "../routes/router.js";
import Products from "../dao/DBManager/ProductManager.js";
import Carts from '../dao/DBManager/CartManager.js';
import Messages from "../dao/DBManager/MessagesManager.js";
import { accessRolesEnum, passportStrategiesEnum } from "../config/enums.js";
import { productsModel } from '../dao/DBManager/models/products.model.js'

export default class ViewsRouter extends Router {
    constructor() {
        super();
        this.productManager = new Products();
        this.cartManager = new Carts();
        this.messagesManager = new Messages();

    }

    init() {
        this.get('/api/users/register', [accessRolesEnum.PUBLIC], passportStrategiesEnum.NOTHING, this.register);
        this.get('/api/users/login', [accessRolesEnum.PUBLIC], passportStrategiesEnum.NOTHING, this.login);
        this.get('/', [accessRolesEnum.PUBLIC], passportStrategiesEnum.NOTHING, this.loginRedirect);
        this.get('/profile', [accessRolesEnum.USER], passportStrategiesEnum.JWT, this.profile);
        this.get('/api/products', [accessRolesEnum.USER], passportStrategiesEnum.JWT, this.productsView);
        this.get('/api/carts', [accessRolesEnum.USER], passportStrategiesEnum.JWT, this.cartsView);
        this.get('/api/messages-view', [accessRolesEnum.USER], passportStrategiesEnum.JWT, this.messagesView);
        this.get('/api/products/:productId', [accessRolesEnum.USER], passportStrategiesEnum.JWT, this.productId);
        this.get('/api/carts/:cid', [accessRolesEnum.USER], passportStrategiesEnum.JWT, this.cartId);
    };

    async getAll(req, res) {
        try {
            const carts = await this.cartManager.getAll();
            res.render('carts', { carts });
        } catch (error) {
            console.log(error.message);
        }
    };

    register(req, res) {
        res.render('register');
    };

    login(req, res) {
        res.render('login');
    };

    loginRedirect(req, res) {
        return res.redirect('/api/users/login')
    };

    profile(req, res) {
        const user = req.user;
        console.log(user);
        res.render('profile', { user });
    }

    async productsView(req, res) {
        try {
            const user = req.user;
            const limit = Number(req.query.limit);
            const category = req.query.category;
            const { page = 1 } = req.query;

            const allProducts = await this.productManager.getAll();

            const { docs, hasPrevPage, hasNextPage, nextPage, prevPage } = await productsModel.paginate({}, { limit: 3, page, lean: true });

            let products = allProducts;
            if (category) {
                products = products.filter(product => product.category === category);
            }

            if (limit !== undefined && !isNaN(limit)) {
                products = products.slice(0, limit);
            }

            res.render('products', {
                user,
                products: docs,
                hasPrevPage,
                hasNextPage,
                nextPage,
                prevPage
            });
        } catch (error) {
            console.log(error.message);
        }
    };

    async cartsView(req, res) {
        try {
            const carts = await this.cartManager.getAll();
            res.render('carts', { carts });
        } catch (error) {
            console.log(error.message);
        }
    };

    async messagesView(req, res) {
        try {
            res.render('messages');
        } catch (error) {
            console.log(error.message);
        }
    };

    async productId(req, res) {
        const user = req.user;
        console.log(user)
        const cartId = req.user.cart.cartId;
        console.log(cartId)
        const productId = req.params.productId;
        try {
            const product = await this.productManager.getById(productId);
            res.render('productDetails', { product, user, cartId });
        } catch (error) {
            console.log(error.message);
        }
    };

    async cartId(req, res) {
        const cartId = req.params.cid;
        try {
            const cart = await this.cartManager.getById(cartId);
            res.render('cartDetails', { cart });
        } catch (error) {
            console.log(error.message);
        }
    };
};

