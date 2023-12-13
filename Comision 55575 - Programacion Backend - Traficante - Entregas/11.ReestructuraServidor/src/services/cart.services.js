import Carts from '../dao/DBManager/CartManager.js'

const cartManager = new Carts();

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

export {
    getAllCartService,
    saveCartService,
    getByIdService,
    addProductToCartService,
    deleteProductFromCartService,
    deleteCartService
};
