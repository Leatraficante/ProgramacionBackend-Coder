import Router from "../routes/router.js";
import Users from '../dao/DBManager/users.manager.js'
import { accessRolesEnum, passportStrategiesEnum } from "../config/enums.js";
import { createHash, generateToken, isValidPassword, generateSuperadminToken } from "../utils.js";
import configs from "../config/configs.js";


export default class UsersRouter extends Router {
    constructor() {
        super();
        this.usersManager = new Users();
    }

    init() {
        this.post('/login', [accessRolesEnum.PUBLIC], passportStrategiesEnum.NOTHING, this.login);
        this.post('/register', [accessRolesEnum.PUBLIC], passportStrategiesEnum.NOTHING, this.register);

    };

    async login(req, res) {
        try {
            const { email, password } = req.body;

            if (email === configs.adminEmail && password === configs.adminPassword) {
                const superadminToken = generateSuperadminToken();
                res.cookie('coderCookieToken', superadminToken, { maxAge: 60 * 60 * 1000, httpOnly: true })
                    .send({ status: 'success', message: 'Superadmin login success' });;
            } 

            const user = await this.usersManager.getByEmail(email);

            if (!user) return res.status(401).send({ status: 'error', message: 'Invalid Credentials' })

            const isValidCredentials = isValidPassword(password, user.password);
            if (!isValidCredentials) {
                return res.status(401).json({ status: 'error', message: 'Invalid Credentials' });
            }


            //generar jwt:
            const { password: _, ...userResult } = user; // generamos un nuevo objeto excluyendo el atributo passowrd
            const accesToken = generateToken(userResult);
            res.cookie('coderCookieToken', accesToken, { maxAge: 60 * 60 * 1000, httpOnly: true })
                .send({ status: 'success', message: 'login succes' });
            console.log(user)
            console.log(userResult)


        } catch (error) {
            res.status(500).send({ status: 'error', message: error.message })
        }
    };

    async register(req, res) {
        try {
            const { first_name, last_name, email, age, password, role } = req.body
            if (!first_name || !last_name || !email || !age || !password || !role) {
                return res.status(400).json({ status: 'error', message: 'Incomplete Values' });

            }

            const userExist = await this.usersManager.getByEmail(email);

            if (userExist) {
                return res.status(400).json({ status: 'error', message: 'User already Exists' });

            }

            const hashedPassword = createHash(password);

            const newUser = {
                ...req.body
            }

            newUser.password = hashedPassword;

            const result = await this.usersManager.save(newUser);

            res.status(200).json({ status: 'success', data: result });
            console.log('User Created')

            const accesToken = generateToken(newUser);
            res.send({ status: 'success', access_token: accesToken });
            console.log('User Token Created')


        } catch (error) {
            res.status(500).send({ status: 'error', message: error.message })
        }
    };

};
