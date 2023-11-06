import { Router } from "express";
import Products from "../dao/DBManager/ProductManager.js";
import Carts from '../dao/DBManager/CartManager.js';
import Messages from "../dao/DBManager/MessagesManager.js";


const viewsRouter = Router();

const cartManager = new Carts();
const productManager = new Products();
const messagesManager = new Messages();


viewsRouter.get('/api/products-view', async (req, res) => {
    try {
        const products = await productManager.getAll();
        res.render('products', { products });
    } catch (error) {
        console.log(error.message);
    }
});


viewsRouter.get('/api/carts-view', async (req, res) => {
    try {
        const carts = await cartManager.getAll();
        res.render('carts', { carts });
    } catch (error) {
        console.log(error.message);
    }
});

viewsRouter.get('/api/messages-view', async (req, res) => {
    try {
        res.render('messages');
    } catch (error) {
        console.log(error.message);
    }
});

// vista para productId
viewsRouter.get('/api/products/:productId', async (req, res) => {
    const productId = req.params.productId;
    try {
        const product = await productManager.getById(productId);
        res.render('productDetails', { product });
    } catch (error) {
        console.log(error.message);
    }
});

// vista para el carritoId
viewsRouter.get('/api/carts/:cid', async (req, res) => {
    const cartId = req.params.cid;
    try {
        const cart = await cartManager.getById(cartId);
        res.render('cartDetails', { cart });
    } catch (error) {
        console.log(error.message);
    }
});



export default viewsRouter;

