import { createHash, generateToken, isValidPassword } from "../utils.js";
import UsersRepository from '../repository/users.repository.js';
import { InvalidCredentials, UserAlreadyExists } from "../utils/custom.exceptions.js";
import { loginInvalidCredentials } from "../utils/custom.html.js";
import { sendEmail } from "./mail.service.js";

const usersRepository = new UsersRepository();

const loginService = async (email, password) => {

    const user = await usersRepository.getByEmail(email);

    if (!user) {
        throw new InvalidCredentials('incorrect credentials');
    }

    const comparePassword = isValidPassword(password, user.password);

    if (!comparePassword) {
        //Enviar un correo electrónico
        const emailInvalidCredentials = {
            to: user.email,
            subject: 'Login fallido',
            html: loginInvalidCredentials
        };

        await sendEmail(emailInvalidCredentials);

        throw new InvalidCredentials('incorrect credentials');
    }

    const { password: _, ...userResult } = user;
    const accessToken = generateToken(userResult);

    return { status: 'success', message: 'Login successful', access_token: accessToken };
};



const registerService = async (user) => {

    const userByEmail = await usersRepository.getByEmail(user.email);

    if (userByEmail) {
        throw new UserAlreadyExists('user already exists')
    }

    const hashedPassword = createHash(user.password);

    const newUser = {
        ...user
    }

    newUser.password = hashedPassword;

    const result = await usersRepository.save(newUser);
    console.log('User Created', newUser);
    return { status: 'success', data: result };
};


const logoutService = async () => {
    return { status: 'success', message: 'Logout completed successfully.' }
};


export {
    loginService,
    registerService,
    logoutService
};