import * as usersService from "../services/users.service.js";
import configs from "../config/configs.js";
import { generateToken } from "../utils.js";
import passport from "passport";

const github = (req, res, next) => {
    passport.authenticate('github', {
        scope: ['user:email']
    })(req, res, next);
};

const githubCallback = async (req, res) => {
    try {
        if (!req.user) {
            console.error('GitHub Callback: No se obtuvo información del usuario.');
            res.redirect('/api/users/login');
            return;
        }

        const user = req.user;
        console.log('GitHub User:', user);

        const accessToken = generateToken(user);
        res.cookie("coderCookieToken", accessToken, { maxAge: 24 * 60 * 60 * 1000, httpOnly: true });
        res.redirect('/api/products');
    } catch (error) {
        console.error('Falla en el inicio de sesión con GitHub:', error);
        res.redirect('/api/users/login');
    }
};



const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (email === configs.adminEmail && password === configs.adminPassword) {
            const adminToken = generateToken({ email: configs.adminEmail, role: 'ADMIN' });

            res.cookie('coderCookieToken', adminToken, { maxAge: 24 * 60 * 60 * 1000, httpOnly: true })
                .send({ status: 'success', message: 'Admin login successful' });
            return;
        }

        const result = await usersService.loginService(email, password);

        res.cookie('coderCookieToken', result.access_token, { maxAge: 24 * 60 * 60 * 1000, httpOnly: true })
            .send({ status: 'success', message: 'Login successful' });

    } catch (error) {
        res.status(500).send({ status: 'error', message: error.message })
    }
};

const register = async (req, res) => {
    try {
        const userData = req.body;
        const result = await usersService.registerService(userData);

        if (result.status === 'success') {
            res.status(201).json(result);
        } else {
            res.status(400).json(result);
        }
    } catch (error) {
        res.status(500).send({ status: 'error', message: error.message });
    }
};


const logout = async (req, res) => {
    try {
        await usersService.logoutService();
        res.clearCookie('coderCookieToken');
        res.redirect("/login");
    } catch (error) {
        console.error('Error al realizar la operación de logout:', error);
        res.status(500).send({ status: 'error', message: error.message })
    }
};




export {
    login,
    register,
    logout,
    github,
    githubCallback

};