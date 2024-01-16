import passport from 'passport';
import jwt from 'passport-jwt';
import { passportStrategiesEnum, accessRolesEnum } from './enums.js';
import usersModel from '../dao/DBManager/models/users.model.js';
import configs from './configs.js'
import GitHubStrategy from 'passport-github2'

const JWTStrategy = jwt.Strategy;
const extractJwt = jwt.ExtractJwt;

const initPassport = () => {
    passport.use(passportStrategiesEnum.JWT, new JWTStrategy({
        jwtFromRequest: extractJwt.fromExtractors([cookieExtractor]),
        secretOrKey: configs.privateKeyJwt
    }, async (jwt_payload, done) => {
        try {
            return done(null, jwt_payload.user);
        } catch (error) {
            return done(error);
        }
    }));

    // implementacion de auth con github 
    passport.use(passportStrategiesEnum.GITHUB, new GitHubStrategy({
        clientID: configs.githubClientId,
        clientSecret: configs.githubSecret,
        callbackURL: configs.githubCallback,
        scope: ['user:email']
        
    }, async (accesToken, refreshToken, profile, done) => {
        try {
            const email = profile.emails[0].value;

            const user = await usersModel.findOne({ email });

            if(!user) {
                //crear cuenta o usuario desde 0
                const newUser = {
                    first_name: profile._json.name,
                    last_name:'',
                    age: 18,
                    email,
                    password: ''
                }
                const result = await usersModel.create(newUser);
                return done(null, result); // passport va a setear el elemento user req.user
            } else {
                return done(null, user);
            }
   
        } catch (error) {
            return done('Invalid register credentials')

        }
    }));


    // Serializar y deserializar (obtener data del usuario, si se esta logeando X, traer la info de X y no de Y)
    passport.serializeUser((user, done) => {
        done(null, user._id);
    });

    passport.deserializeUser(async (id, done) => {
        const user = await usersModel.findById(id);
        done(null, user);
    })

};

const cookieExtractor = req => {
    let token = null;
    if (req && req.cookies) {
        token = req.cookies['coderCookieToken'];
    }
    return token;
};

const passportCall = (strategy) => {
    return async (req, res, next) => {
        passport.authenticate(strategy, { session: false }, function (err, user, info) {
            if (err) {
                console.error('Error en autenticación:', err);
                return next(err);
            }

            if (!user) {
                const errorMessage = info.message ? info.message : 'Usuario no autenticado.';
                console.error('Error de autenticación:', errorMessage);
                return res.status(401).json({ status: 'error', error: errorMessage });
            }

            req.user = user;
            next();
        })(req, res, next);
    };
};




export { initPassport, passportCall }


