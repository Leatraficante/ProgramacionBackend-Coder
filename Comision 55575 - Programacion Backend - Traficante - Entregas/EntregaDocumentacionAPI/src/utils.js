import { fileURLToPath } from "url";
import { dirname } from "path";
import path from "path";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import configs from "./config/configs.js";
import { fakerES as faker } from '@faker-js/faker';

const __filename = fileURLToPath(import.meta.url); //obtener url de manera especifica desde el directorio donde estamos trabajando
const __dirname = dirname(__filename);

const __mainDirname = path.join(__dirname, '..',) 

//implementacion de generacin del token JWT y validacion
const generateToken = (user) => {
    const token = jwt.sign({ user }, configs.privateKeyJwt, { expiresIn: '24h' })
    return token;
};

const generateSuperadminToken = () => {
    const superadminToken = jwt.sign({ role: 'superadmin' }, configs.privateKeyJwt, { expiresIn: '24h' });
    return superadminToken;
}

const authorization = (role) => {
    return async (req, res, next) => {
        if (req.user.role !== role) return res.status(403).send({status: 'error', message: 'not permissions'});//403: forbidden
        next();
    }
} 

//1. hashear nuestra pass:
const createHash = password =>
    bcrypt.hashSync(password, bcrypt.genSaltSync(10));

//2. Metodo para validar pass:
const isValidPassword = (plainPassword, hashedPassword) =>
    bcrypt.compareSync(plainPassword, hashedPassword);


// Productos aleatorios con fakerJS
const randomProduct = () => {
    return {
        title: faker.commerce.productName(),
        description: faker.commerce.productDescription(),
        code: faker.number.int(),
        price: faker.commerce.price(), 
        stock: faker.number.int({ max: 100 }),
        category: faker.commerce.department(),
    }
};

const generateProducts = () => {
    const numberOfProducts = faker.number.int({ min: 1, max: 2 });

    let randromProducts = [];

    for(let i=0; i < numberOfProducts; i++) {
        randromProducts.push(randomProduct());
    }

    return randromProducts;
};


export {
    generateToken,
    generateSuperadminToken,
    authorization,
    createHash,
    isValidPassword,
    __dirname,
    generateProducts,
    __mainDirname
};
