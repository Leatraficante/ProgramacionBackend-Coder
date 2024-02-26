import Carts from '../dao/DBManager/classes/carts.dao.js'
import mongoose from 'mongoose';
import ProductsRepository from '../repository/products.repository.js'
import CartsRepository from '../repository/carts.repository.js'
import * as ticketsService from './ticket.service.js'

const cartManager = new Carts();
const productsRepository = new ProductsRepository();
const cartsRepository = new CartsRepository();

const getAllCartService = async () => {
    return cartManager.getAll();
};

const saveCartService = async (userId) => {
    return cartManager.save(userId);
};

const getByIdService = async (cartId) => {
    const cart = await cartManager.getById(cartId);
    if (cart) {
        return cart;
    } else {
        throw { status: 404, message: "Not Found" };
    }
};

const addProductToCartService = async (cartId, productId, quantity) => {
    return cartsRepository.addProductToCart(cartId, productId, quantity);
};

const deleteProductFromCartService = async (cid, pid) => {
    const result = await cartManager.deleteProductFromCart(cid, pid);
    return { message: 'Product deleted successfully', deletedProduct: result };
};

const deleteCartService = async (cid) => {
    const deletedCart = await cartManager.delete(cid);
    return `Cart deleted`;
};

const purchaseService = async (cartId, user) => {
    const cart = await cartManager.getById(cartId);

    if (!cart) {
        throw { status: 404, message: "Cart not found" };
    }

    // stock 
    for (const product of cart.products) {
        const productId = product.productId;
        const productDetails = await productsRepository.getProductById(productId);
        if (productDetails.stock < product.quantity) {
            throw { status: 400, message: `Insufficient stock for product ${productDetails.name}` };
        }
    }

    // monto total de la compra
    let totalAmount = 0;
    for (const product of cart.products) {
        const productId = product.productId;
        const productDetails = await productsRepository.getProductById(productId);
        totalAmount += productDetails.price * product.quantity;
    }

    // Redondear el precio final
    totalAmount = parseFloat(totalAmount.toFixed(2));

    // Generar el ticket de compra
    await ticketsService.generatePurchase(user, totalAmount);

    // update stock:
    for (const product of cart.products) {
        const productId = product.productId;
        const productDetails = await productsRepository.getProductById(productId);
        await productsRepository.updateProduct(productId, { stock: productDetails.stock - product.quantity });
    }

    // Limpiar el carrito
    await cartManager.delete(cartId);

    return { message: 'Compra finalizada exitosamente' };
};




export {
    getAllCartService,
    saveCartService,
    getByIdService,
    addProductToCartService,
    deleteProductFromCartService,
    deleteCartService,
    purchaseService
};
