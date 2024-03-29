import Carts from '../dao/DBManager/classes/carts.dao.js'
import mongoose from 'mongoose';
import ProductsRepository from '../repository/products.repository.js'
import CartsRepository from '../repository/carts.repository.js'
import * as ticketsService from './ticket.service.js'

const cartManager = new Carts();
const productsReposity = new ProductsRepository();
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
    return cartManager.addProductToCart(cartId, productId, quantity);
};

const deleteProductFromCartService = async (cid, pid) => {
    const result = await cartManager.deleteProductFromCart(cid, pid);
    return { message: 'Product deleted successfully', deletedProduct: result };
};

const deleteCartService = async (cid) => {
    const deletedCart = await cartManager.delete(cid);
    return `Cart deleted`;
};

const purchaseService = async (cid, user) => {
    //Transacciones
    const session = await mongoose.startSession();
    session.startTransaction();

    let amount = 0;

    //En este arreglo vamos a ir almacenando los productos que no tenemos stock
    const outStock = [];

    cart.products.forEach(async ({ product, quantity }) => {
        if(product.stock >= quantity) {
            amount += product.price * quantity;
            product.stock -= quantity;
            // Utilizar el repostiory de productos y actualizar el producto con el stock correspondiente
            await productsReposity.updateProduct(id, product)
        } else {
            outStock.push({ product, quantity });
        }
    });

    const ticket = await ticketsService.generatePurchase(user, amount);
    //actulizar el carrito con el nuevo arreglo de productos que no pudieron comprarse
    //utilizar el repository de carritos para poder actualizar los productos
    await cartsRepository.updateProducts(cid, outStock);

    await session.commitTransaction();

    //catch
    await session.abortTransaction();
    //finally
    session.endSession();
}


export {
    getAllCartService,
    saveCartService,
    getByIdService,
    addProductToCartService,
    deleteProductFromCartService,
    deleteCartService,
    purchaseService
};
