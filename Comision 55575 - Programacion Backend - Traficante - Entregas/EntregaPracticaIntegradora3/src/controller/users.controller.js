import passport from "passport";
import * as usersService from "../services/users.service.js";
import { InvalidCredentials, UserAlreadyExists } from "../utils/custom.exceptions.js";

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
        req.logger.error(error.message);
        console.error('Falla en el inicio de sesión con GitHub:', error);
        res.redirect('/api/users/login');
    }
}

const github = async (req, res) => {
    passport.authenticate('github', {
        scope: ['user:email']
    })(req, res);
};


const register = async (req, res) => {
    try {
        const { first_name, last_name, email, age, password, role } = req.body;

        if (!first_name || !last_name || !email || !age || !password || !role) {
            return res.sendClientError('incomplete values')
        }

        const result = await usersService.registerService({ ...req.body })

        res.sendSuccessNewResults(result);

    } catch (error) {
        if (error instanceof UserAlreadyExists) {
            return res.sendClientError(error.message);
        }
        res.sendServerError(error.message);
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.sendClientError('incomplete values')
        }

        const result = await usersService.loginService(email, password);

        res.cookie('coderCookieToken', result.access_token, { maxAge: 24 * 60 * 60 * 1000, httpOnly: true })
            .send({ status: 'success', message: 'Login successful' });

    } catch (error) {
        if (error instanceof InvalidCredentials) {
            return res.sendClientError(error.message);
        }
        res.sendServerError(error.message);
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
    githubCallback,
    github
};