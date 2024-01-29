import * as cartService from '../services/cart.service.js'


const getAll = async (req, res) => {
    try {
        let cart = await cartService.getAllCartService();
        res.sendSuccess(cart)
    } catch (error) {
        res.sendServerError(error.message);
    }
};

const saveCart = async (req, res) => {
    try {
        const userId = req.user._id;
        const result = await cartService.saveCartService(userId);
        res.sendSuccessNewResults(result);
    } catch (error) {
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
        res.sendServerError(error.message);
    }
};


const addProductToCart = async (req, res) => {
    const cartId = req.params.cid;
    const productId = req.params.pid;
    const quantity = req.body.quantity;

    try {
        const updatedCart = await cartService.addProductToCartService(cartId, productId, quantity);
        return res.redirect('/api/carts')
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
};

const deleteProductFromCart = async (req, res) => {
    try {
        const { cid, pid } = req.params;
        const result = await cartService.deleteProductFromCartService(cid, pid);

        res.sendSuccess({ message: 'Product deleted successfully', deletedProduct: result });
    } catch (error) {
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