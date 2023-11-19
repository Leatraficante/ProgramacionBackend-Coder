import { Router } from 'express';
import usersModel from '../dao/DBManager/models/users.model.js'
import { createHash, isValidPassword } from '../utils.js';
import passport from 'passport';

const sessionsRouter = Router();

sessionsRouter.post('/register', passport.authenticate('register', { failureRedirect: 'fail-register' }), async (req, res) => {
    res.status(201).send({ status: 'succes', message: 'User registered' })
});

sessionsRouter.get('/fail-register', async (req, res) => {
    res.status(500).send({ status: 'error', message: 'register fail' })
});

sessionsRouter.post('/login', passport.authenticate('login', { failureRedirect: 'fail-login' }), async (req, res) => {
    if (!req.user) {
        res.status(401).send({ status: 'error', message: 'Invalid Credentials' })
    }

    req.session.user = {
        name: `${req.user.first_name}, ${req.user.last_name}`,
        email: req.user.email,
        age: req.user.age,
        role: 'usuario'
    }

    return res.send({ status: 'success', message: 'Login success' })
});

sessionsRouter.get('/fail-login', async (req, res) => {
    res.status(500).send({ status: 'error', message: 'login fail' })
});

sessionsRouter.get('/github', passport.authenticate('github', {scope: [ 'user:email' ]}), async (req, res) => {
    res.send({status: 'success', message: 'User registered'})
});


sessionsRouter.get('/github-callback', passport.authenticate('github', {failureRedirect: '/login'}), async (req, res) => {
    req.session.user = req.user;
    res.redirect('/');
});


sessionsRouter.get('/logout', async (req, res) => {
    try {
        req.session.destroy();
        res.redirect('/');
    } catch (error) {
        res.status(500).send({ status: 'error', message: error.message })
    }
});

export default sessionsRouter;