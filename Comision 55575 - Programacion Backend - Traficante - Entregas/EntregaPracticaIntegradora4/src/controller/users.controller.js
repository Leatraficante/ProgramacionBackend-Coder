import passport from "passport";
import * as usersService from "../services/users.service.js";
import { InvalidCredentials, UserAlreadyExists } from "../utils/custom.exceptions.js";
import usersModel from "../dao/DBManager/models/users.model.js";

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
        req.logger.error(error.message);
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
        req.logger.error(error.message);
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
        req.logger.error(error.message);
        console.error('Error al realizar la operación de logout:', error);
        res.status(500).send({ status: 'error', message: error.message })
    }
};

const test = async (req, res) => {
    console.log("test")
    res.sendSuccess(accessToken);
};

const uploadDocuments = async (req, res) => {
    try {
        const userId = req.params.uid;
        const files = req.files;

        if (!files || files.length === 0) {
            return res.status(400).send({ error: 'No se han enviado archivos' });
        }

        const user = await usersModel.findById(userId);

        const filenames = files.map(file => file.filename);

        user.documents = filenames;

        await user.save();

        res.sendSuccess({ message: 'Documentos subidos correctamente' });
    } catch (error) {
        req.logger.error(error.message);
        res.sendServerError('Error al subir documentos');
    }
};

const userToPremium = async (req, res) => {
    try {
        const userId = req.params.uid;
        const user = await usersModel.findById(userId);

        if (!user) {
            return sendClientError(res, 'Usuario no encontrado');
        }
        
        if (user.role === 'PREMIUM') {
            return res.sendClientError('El usuario ya es PREMIUM');
        } else if (user.documents.some(doc => doc.includes('identification')) &&
            user.documents.some(doc => doc.includes('address')) &&
            user.documents.some(doc => doc.includes('account-status'))) {
            user.role = 'PREMIUM';
            await user.save();
            return res.sendSuccess({ message: 'Rol de usuario cambiado a premium exitosamente' });
        } else {
            return res.sendClientError({ message: 'El usuario debe cargar todos los documentos requeridos' });
        }
       

    } catch (error) {
        req.logger.error(error.message);
        res.sendServerError('Error al intentar cambiar el usuario a premium');
    }
}



export {
    login,
    register,
    logout,
    githubCallback,
    github,
    test,
    uploadDocuments,
    userToPremium
};