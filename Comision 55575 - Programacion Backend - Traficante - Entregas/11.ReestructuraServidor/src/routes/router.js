import { Router as expressRouter } from 'express';
import passport from 'passport';
import { accessRolesEnum, passportStrategiesEnum } from '../config/enums.js';

export default class Router {
    constructor() {
        this.router = expressRouter();
        this.init();
    }

    getRouter() {
        return this.router;
    }

    init() { };

    get(path, policies, strategy, ...callbacks) {
        this.router.get(
            path,
            this.applyCustomPassportCall(strategy),
            this.handlePolicies(policies),
            this.generateCustomResponse,
            this.applyCallbacks(callbacks)
        )
    };

    post(path, policies, strategy, ...callbacks) {
        this.router.post(
            path,
            this.applyCustomPassportCall(strategy),
            this.handlePolicies(policies),
            this.generateCustomResponse,
            this.applyCallbacks(callbacks)
        )
    };

    put(path, policies, strategy, ...callbacks) {
        this.router.put(
            path,
            this.applyCustomPassportCall(strategy),
            this.handlePolicies(policies),
            this.generateCustomResponse,
            this.applyCallbacks(callbacks)
        )
    };

    delete(path, policies, strategy, ...callbacks) {
        this.router.delete(
            path,
            this.applyCustomPassportCall(strategy),
            this.handlePolicies(policies),
            this.generateCustomResponse,
            this.applyCallbacks(callbacks)
        )
    };

    generateCustomResponse = (req, res, next) => {
        res.sendSuccess = (data) => {
            res.status(200).json({ data });
        };

        res.sendSuccessNewResults = (data) => {
            res.status(201).json({ data });
        }

        res.sendClientError = (error) => {
            res.status(400).json({ error })
        };

        res.sendServerError = (error) => {
            res.status(500).json({ error })
        };

        next();
    };

    // en el caso de que el token no sea valido, cada vez que tengamos errores de validacion en el jwt, que no llegue en los headres de la petcion
    // retornar mensajes de manera mas especifica.
    // si no tenemos el user lo obtenemos
    applyCustomPassportCall = (strategy) => (req, res, next) => {
        if (strategy === passportStrategiesEnum.JWT) {
            passport.authenticate(strategy, { session: false }, (err, user, info) => {
                if (err) return next(err);
    
                if (!user) {
                    return res.status(401).json({ error: 'Invalid authentication' });
                }
    
                req.user = user;
                next();
            })(req, res, next); // Llamada a passport.authenticate
        } else {
            next();
        }
    };
    
    

    handlePolicies = (policies) => (req, res, next) => {
        try {
            if (policies[0] === accessRolesEnum.PUBLIC) return next();

            const user = req.user;

            if (!policies.includes(user.role.toUpperCase())) {
                // El usuario no tiene los permisos necesarios
                return res.status(403).json({ error: 'No permissions' });
            };

            return next();
        } catch (error) {
            // Error al verificar el token
            return res.status(401).json({ error: 'Invalid Token' });
        }
    };


    applyCallbacks(callbacks) {
        // mapear callbacks uno a uno obteniendo parametros (req, res)
        return callbacks.map((callback) => async (...params) => {
            try {
                await callback.apply(this, params);
                //apply va a ejecutar la funcion callback a la isntancia de nuestra clase

            } catch (error) {
                params[1].status(500).json({ status: 'error', message: error.message });
            }

        }) // req, res

    };

}