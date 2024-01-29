import UsersRepository from '../repository/users.repository.js';
import * as viewsService from '../services/views.service.js'
import configs from '../config/configs.js';
import jwt from 'jsonwebtoken';
import { createHash } from '../utils.js';
import { sendEmail } from '../services/mail.service.js'

const usersRepository = new UsersRepository();

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

const forgotPasword = async (req, res) => {
    res.render('forgot-password')
};

const forgotPasswordVerification = async (req, res) => {
    const { email } = req.body;
    const user = await usersRepository.getByEmail(email);
 
    if (!user) {
        return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    //user exist, one time link password reset
    const secret = configs.privateKeyJwt + user.password;
    const payload = {
        email: user.email,
        id: user._id
    }
    const token = jwt.sign(payload, secret, { expiresIn: '60m' });

    const emailResetPassword = {
        to: user.email,
        subject: 'Reset password',
        html: `<p>Haz clic en el siguiente enlace para restablecer la contraseña:</p>
               <a href="http://localhost:8080/api/users/reset-password/${user._id}/${token}">
                   Restablecer Contraseña
               </a>`
    };
    

    await sendEmail(emailResetPassword);

    console.log(emailResetPassword)
    res.send('Reset passowrd link was sent to your email.')
};


const resetPassword = async (req, res) => {
    const { id, token } = req.params;
    const user = await usersRepository.getById(id);

    if (!user) {
        return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    if (id !== user._id.toString()) {
        return res.status(404).json({ message: 'ID incorrecto' });
    }

    const secret = configs.privateKeyJwt + user.password;
    try {
        const payload = jwt.verify(token, secret)
        res.render('reset-password', { email: user.email })

    } catch (error) {
        console.log(error)
        res.send(error.message)
    }
};

const resetPasswordConfirm = async (req, res) => {
    const { id, token } = req.params;
    const user = await usersRepository.getById(id);

    const { password1, password2 } = req.body;

    if (!user) {
        return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    if (id !== user._id.toString()) {
        return res.status(404).json({ message: 'ID incorrecto' });
    }

    const secret = configs.privateKeyJwt + user.password;

    try {
        const payload = jwt.verify(token, secret);

        if (password1 !== password2) {
            return res.status(400).json({ message: 'Las contraseñas no coinciden, intente nuevamente' });
        }

        user.email = user.email;

        const hashedPassword = createHash(password1);

        user.password = hashedPassword;

        await user.save();

        res.redirect('/api/users/reset-pass-success')

    } catch (error) {
        console.log(error);
        res.send(error.message);
    }
};

const resetPassSucces = async (req, res) => {
    try {
        res.render("reset-pass-success");
    } catch (error) {
        res.status(500).send({ status: 'error', message: error.message })
    }
};

const admin = async (req, res) => {
    const user = req.user;
    res.send(user)
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
    cartId,
    forgotPasword,
    forgotPasswordVerification,
    resetPassword,
    resetPasswordConfirm,
    resetPassSucces,
    admin
};