import * as viewsService from '../services/views.service.js'

const register = (req, res) => {
    res.render('register');
};

const login = (req, res) => {
    res.render('login');
};

const logout = (req, res) => {
    res.render('logout');
};

const loginRedirect = (req, res) => {
    res.redirect('/api/users/login')
};

const profile = (req, res) => {
    const user = req.user;
    console.log(user);
    res.render('profile', { user });
};

const productsView = async (req, res) => {
    try {
       const productData = await viewsService.productsViewService(req);
       res.render('products', productData)
    } catch (error) {
        console.log(error.message);
    }
};

const cartsView = async (req, res) => {
    try {
        const carts = await viewsService.cartsViewService();
        res.render('carts', { carts });
    } catch (error) {
        console.log(error.message);
    }
};

const messagesView = async (req, res) => {
    try {
        res.render('messages');
    } catch (error) {
        console.log(error.message);
    }
};

const productId = async (req, res) => {
    const user = req.user;
    const cartId = req.user.cart.cartId;
    const productId = req.params.productId;
    try {
        const product = await viewsService.productIdService(productId);
        res.render('productDetails', { product, user, cartId });
    } catch (error) {
        console.log(error.message);
    }
};

const cartId = async (req, res) => {
    const cartId = req.params.cid;
    try {
        const cart = await viewsService.cartIdService(cartId);
        res.render('cartDetails', { cart });
    } catch (error) {
        console.log(error.message);
    }
};

export {
    login,
    logout,
    loginRedirect,
    register,
    profile,
    productsView,
    cartsView,
    messagesView,
    productId,
    cartId
};