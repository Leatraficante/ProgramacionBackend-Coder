import { fileURLToPath } from "url";
import { dirname } from "path";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { PRIVATE_KEY_JWT } from '../src/config/constants.js'

const __filename = fileURLToPath(import.meta.url); //obtener url de manera especifica desde el directorio donde estamos trabajando
const __dirname = dirname(__filename);

//implementacion de generacin del token JWT y validacion
const generateToken = (user) => {
    const token = jwt.sign({ user }, PRIVATE_KEY_JWT, { expiresIn: '24h' })
    return token;
};

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


export {
    generateToken,
    authorization,
    createHash,
    isValidPassword,
    __dirname
};
