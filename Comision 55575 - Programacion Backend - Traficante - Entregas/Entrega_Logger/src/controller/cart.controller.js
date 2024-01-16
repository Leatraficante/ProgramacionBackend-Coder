import * as cartService from '../services/cart.service.js'


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
        req.logger.error(error.message);
        res.sendClientError({ error: error.message });
    }
};

const purchase = async (req, res) => {
    try {
        const { cid } = req.params;
        const { user } = req.user;

        const result = await cartService.purchaseService(cid, user);
        
        res.send({ result });
    } catch (error) {
        req.logger.error(error.message);
        res.status(500).send()
    }
}

export {
    getAll,
    saveCart,
    getById,
    addProductToCart,
    deleteProductFromCart,
    deleteCart,
    purchase
}