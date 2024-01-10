import { createHash, generateToken, isValidPassword } from "../utils.js";
import configs from '../config/configs.js';
import UsersRepository from '../repository/users.repository.js';

const usersRepository = new UsersRepository();

const loginService = async (email, password) => {
    if (email === configs.adminEmail && password === configs.adminPassword) {
        const adminToken = generateToken({ email: configs.adminEmail, role: 'ADMIN' });
        return { status: 'success', message: 'Admin login successful', access_token: adminToken };
    }

    const user = await usersRepository.getByEmail(email);

    if (!user || !isValidPassword(password, user.password)) {
        return { status: 'error', message: 'Invalid Credentials' };
    }

    const { password: _, ...userResult } = user;
    const accessToken = generateToken(userResult);

    return { status: 'success', message: 'Login successful', access_token: accessToken };
};



const registerService = async (userData) => {
    const { first_name, last_name, email, age, password, role } = userData;
    if (!first_name || !last_name || !email || !age || !password || !role) {
        console.log(userData);
        return { status: 'error', message: 'Incomplete Values' };
    }

    const userExist = await usersRepository.getByEmail(email);

    if (userExist) {
        return { status: 'error', message: 'User already exists' };
    }

    const hashedPassword = createHash(password);

    const newUser = {
        ...userData,
        password: hashedPassword,
    };

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
        logoutService,

    };