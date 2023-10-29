import { Router } from "express";
import Products from '../dao/FileManager/ProductManager.js';
import Carts from '../dao/FileManager/CartManager.js';
import Messages from "../dao/FileManager/MessagesManager.js";

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


export default viewsRouter;