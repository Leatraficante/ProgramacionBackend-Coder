import { Router } from "express";
import Products from "../dao/DBManager/ProductManager.js";
import Carts from '../dao/DBManager/CartManager.js';
import Messages from "../dao/DBManager/MessagesManager.js";
import { productsModel } from "../dao/DBManager/models/products.model.js";


const viewsRouter = Router();

const cartManager = new Carts();
const productManager = new Products();
const messagesManager = new Messages();


// Middleware de acceso público
const publicAccess = (req, res, next) => {
    if (req.session && req.session.user) { // Verificar que req.session y req.session.user estén definidos
        return res.redirect('/api/products'); // Redirigir al perfil si ya ha iniciado sesión
    }
    next(); // Llamar a next() aquí para continuar con la ejecución de la siguiente función middleware.
};

// Middleware para establecer el acceso privado
const privateAccess = (req, res, next) => {
    if (!req.session || !req.session.user) { // Verificar que req.session y req.session.user estén definidos
        return res.redirect('/login'); // Redirigir al inicio de sesión si no ha iniciado sesión
    }
    next(); // Llamar a next() aquí para continuar con la ejecución de la siguiente función middleware.
};

viewsRouter.get('/register', publicAccess, (req, res) => {
    res.render('register');
});

viewsRouter.get('/login', publicAccess, (req, res) => {
    res.render('login');
});

viewsRouter.get('/', privateAccess, (req, res) => {
    return res.redirect('/login')
});

viewsRouter.get('/profile', privateAccess, (req, res) => {
    res.render('profile', {
        user: req.session?.user,
    });
});

viewsRouter.get('/api/products', privateAccess, async (req, res) => {
    try {
        const user = req.session?.user;
        const limit = Number(req.query.limit);
        const category = req.query.category;
        const { page = 1 } = req.query;

        const allProducts = await productManager.getAll();

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
});


viewsRouter.get('/api/carts', privateAccess, async (req, res) => {
    try {
        const carts = await cartManager.getAll();
        res.render('carts', { carts });
    } catch (error) {
        console.log(error.message);
    }
});

viewsRouter.get('/api/carts-view', privateAccess, async (req, res) => {
    try {
        const carts = await cartManager.getAll();
        res.render('carts', { carts });
    } catch (error) {
        console.log(error.message);
    }
});

viewsRouter.get('/api/messages-view', privateAccess, async (req, res) => {
    try {
        res.render('messages');
    } catch (error) {
        console.log(error.message);
    }
});

// vista para productId
viewsRouter.get('/api/products/:productId', privateAccess, async (req, res) => {
    const productId = req.params.productId;
    try {
        const product = await productManager.getById(productId);
        res.render('productDetails', { product });
    } catch (error) {
        console.log(error.message);
    }
});

// vista para el carritoId
viewsRouter.get('/api/carts/:cid', privateAccess, async (req, res) => {
    const cartId = req.params.cid;
    try {
        const cart = await cartManager.getById(cartId);
        res.render('cartDetails', { cart });
    } catch (error) {
        console.log(error.message);
    }
});



export default viewsRouter;

