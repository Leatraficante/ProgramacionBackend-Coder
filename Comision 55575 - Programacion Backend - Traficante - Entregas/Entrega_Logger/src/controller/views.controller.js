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

const loginError = (req, res) => {
    res.render('loginError');
};

const loggerTest = (req, res) => {
    req.logger.fatal('prueba fatal');
    req.logger.error('prueba error');
    req.logger.warning('prueba warning');
    req.logger.info('prueba info');
    req.logger.http('prueba http');
    req.logger.debug('prueba debug');
    res.send({ result: 'Probando loggers' })

};

const profile = (req, res) => {
    const user = req.user;
    res.render('profile', { user });
};

const productsView = async (req, res) => {
    try {
        const productData = await viewsService.productsViewService(req);
        res.render('products', productData)
    } catch (error) {
        req.logger.error(error.message);
    }
};

const cartsView = async (req, res) => {
    try {
        const carts = await viewsService.cartsViewService();
        res.render('carts', { carts });
    } catch (error) {
        req.logger.error(error.message);
    }
};

const messagesView = async (req, res) => {
    try {
        res.render('messages');
    } catch (error) {
        req.logger.error(error.message);
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
        req.logger.error(error.message);
    }
};

const cartId = async (req, res) => {
    const cartId = req.params.cid;
    try {
        const cart = await viewsService.cartIdService(cartId);
        res.render('cartDetails', { cart });
    } catch (error) {
        req.logger.error(error.message);
    }
};


export {
    login,
    logout,
    loginRedirect,
    loginError,
    register,
    profile,
    loggerTest,
    productsView,
    cartsView,
    messagesView,
    productId,
    cartId
};