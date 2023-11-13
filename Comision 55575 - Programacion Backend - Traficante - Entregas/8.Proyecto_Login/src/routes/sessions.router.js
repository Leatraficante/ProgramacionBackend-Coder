import { Router } from 'express';
import usersModel from '../dao/DBManager/models/users.model.js'

const sessionsRouter = Router();

sessionsRouter.post('/register', async (req, res) => {
    try {
        const { first_name, last_name, age, email, password } = req.body;

        if (!first_name || !last_name || !age || !email || !password) {
            return res.status(422).send({ status: 'error', message: 'Incomplete Values' })
        }
        const userExist = await usersModel.findOne({ email });
        if (userExist) {
            res.status(400).send({ status: 'error', message: 'User already exists' })
        }
        await usersModel.create({
            first_name,
            last_name,
            email,
            age,
            password
        });

        res.status(201).send({ status: 'success', message: 'User registered' })
    } catch (error) {
        res.status(500).send({ status: 'error', message: error.message })
    }
});

sessionsRouter.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await usersModel.findOne({ email, password });
        if (!user) {
            res.status(400).send({ status: 'error', message: 'Credenciales no válidas' });
        } else {
            if (email === 'adminCoder@coder.com' && password === 'adminCod3r123') {
                user.role = 'admin';
            } else {
                user.role = 'usuario';
            }
            req.session.user = user;
            return res.send({ status: 'success', message: 'Inicio de sesión exitoso' });
        }
    } catch (error) {
        console.log(error.message);
        res.status(500).send({ status: 'error', message: error.message });
    }
});



sessionsRouter.get('/logout', async (req, res) => {
    try {
        req.session.destroy();
        res.redirect('/login');
    } catch (error) {
        res.status(500).send({ status: 'error', message: error.message })
    }
});

export default sessionsRouter;
