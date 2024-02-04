import Products from '../dao/DBManager/classes/products.dao.js';
import Carts from '../dao/DBManager/classes/carts.dao.js';
import { productsModel } from '../dao/DBManager/models/products.model.js';

const productManager = new Products();
const cartManager = new Carts();

const productsViewService = async (req) => {
    const user = req.user;
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

    return {
        user,
        products: docs,
        hasPrevPage,
        hasNextPage,
        nextPage,
        prevPage
    }

};

const cartsViewService = async () => {
    const carts = cartManager.getAll();
    return carts 

};

const productIdService = async (productId) => {
    return productManager.getById(productId);
};


const cartIdService = async (cartId) => {
    return cartManager.getById(cartId)
};


export {
    productsViewService,
    cartsViewService,
    productIdService,
    cartIdService
}