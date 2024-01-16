import CartsDao from '../dao/DBManager/classes/carts.dao.js'

export default class CartsRepository {
    constructor(dao) {
        this.dao = new CartsDao();
    }

    getAllCarts = async () => {
        const result = await this.dao.getAll();
        return result;
    };

    createCart = async (userId) => {
        const result = await this.dao.save(userId);
        return result;
    };

    deleteCart = async (cartId) => {
        const result = await this.dao.delete(cartId);
        return result;
    };

    getCartById = async (cartId) => {
        const result = await this.dao.getById(cartId);
        return result;
    };

    addProductToCart = async (cartId, productId, quantity) => {
        const result = await this.dao.addProductToCart(cartId, productId, quantity);
        return result;
    };

    deleteProductFromCart = async (cartId, productId) => {
        const result = await this.dao.deleteProductFromCart(cartId, productId);
        return result;
    };

    updateProducts = async (cartId, products) => {
        const updatedCart = await this.dao.updateProducts(cartId, products);
        return result;
    };

    updateProductInCart = async (cartId, productId, newQuantity) => {
        const result = await this.dao.updateProductInCart(cartId, productId, newQuantity);
        return result;
    };

}
