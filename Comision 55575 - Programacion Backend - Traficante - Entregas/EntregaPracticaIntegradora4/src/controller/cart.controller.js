import * as cartService from '../services/cart.service.js'
import * as productService from '../services/products.service.js'


const getAll = async (req, res) => {
    try {
        let cart = await cartService.getAllCartService();
        res.sendSuccess(cart)
    } catch (error) {
        req.logger.error(error.message);
        res.sendServerError(error.message);
    }
};

const saveCart = async (req, res) => {
    try {
        const userId = req.user._id;
        const result = await cartService.saveCartService(userId);
        res.sendSuccessNewResults(result);
    } catch (error) {
        req.logger.error(error.message);
        res.sendServerError(error.message);
    }
};


const getById = async (req, res) => {

    try {
        const cartId = req.params.cid;
        const cart = await cartService.getByIdService(cartId);
        if (cart) {
            res.sendSuccess(cart)
        } else {
            res.status(404).send({ error: "Not Found" });
        }
    } catch (error) {
        req.logger.error(error.message);
        res.sendServerError(error.message);
    }
};


const addProductToCart = async (req, res) => {
    const cartId = req.params.cid;
    const productId = req.params.pid;
    const quantity = req.body.quantity;

    const product = await productService.getByIdProductsService(productId);

    if (req.user.email === product.owner) {
        return res.status(403).send({ error: 'No authorization to add this product to the cart' });
    }

    try {
        const updatedCart = await cartService.addProductToCartService(cartId, productId, quantity);
        return res.redirect('/api/carts')
    } catch (error) {
        req.logger.error(error.message);
        res.status(404).json({ error: error.message });
    }
};

const deleteProductFromCart = async (req, res) => {
    try {
        const { cid, pid } = req.params;
        const result = await cartService.deleteProductFromCartService(cid, pid);

        res.sendSuccess({ message: 'Product deleted successfully', deletedProduct: result });
    } catch (error) {
        req.logger.error(error.message);
        res.sendClientError({ error: error.message });
    }
};

const deleteCart = async (req, res) => {
    try {
        const { cid } = req.params;
        const deletedCart = await cartService.deleteCartService(cid);
        res.sendSuccess(`Cart deleted`)
    } catch (error) {
        res.status(404).json({ error: "Not Found" });
    }
};

const purchase = async (req, res) => {
    try {
        const cartId = req.params.cid;
        const user  = req.user;

        const result = await cartService.purchaseService(cartId, user)

        res.sendSuccess(result)

    } catch (error) {
        req.logger.error(error.message);
        res.sendClientError({ error: error.message });
    }
};

export {
    getAll,
    saveCart,
    getById,
    addProductToCart,
    deleteProductFromCart,
    deleteCart,
    purchase
}