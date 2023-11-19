import passport from 'passport';
import local from 'passport-local';
import usersModel from '../dao/DBManager/models/users.model.js';
import { createHash, isValidPassword } from '../utils.js';
import GitHubStrategy from 'passport-github2';

// atuenticacion con user y pass
const LocalStrategy = local.Strategy;

const initPassport = () => {
    // implementacion de registro 
    passport.use('register', new LocalStrategy({
        passReqToCallback: true, // permite acceder al obj req como cualquier otro mw
        usernameField: 'email'
    }, async (req, username, password, done) => {
        try {
            const { first_name, last_name, age } = req.body;
            const user = await usersModel.findOne({ email: username });
            if (user) {
                return done(null, false);
            }

            const userToSave = {
                first_name,
                last_name,
                email: username,
                age,
                password: createHash(password)
            }

            const result = await usersModel.create(userToSave);
            return done(null, result); // passport va a setear el elemento user req.user
        } catch (error) {
            return done(null, false, { message: 'Invalid credentials' });


        }
    }));

    //implementacion de login
    passport.use('login', new LocalStrategy({
        usernameField: 'email'
    }, async (username, password, done) => {
        try {
            const user = await usersModel.findOne({ email: username });
            if (!user || !isValidPassword(password, user.password)) {
                return done(null, false)
            }

            return done(null, user)

        } catch (error) {
            return done(null, false, { message: 'Invalid credentials' });


        }
    }));

    // implementacion de auth con github 
    passport.use('github', new GitHubStrategy({
        clientID: 'Iv1.3cb387b7c72cee43',
        clientSecret: 'a7559998990883bfcd3116853c997b7e88f07452',
        callbackURL: 'http://localhost:8080/api/sessions/github-callback',
        scope: [ 'user:email' ] //traer email asoc a cuenta de github

    }, async (accesToken, refreshToken, profile, done) => {
        try {
            console.log(profile);

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

export { initPassport };