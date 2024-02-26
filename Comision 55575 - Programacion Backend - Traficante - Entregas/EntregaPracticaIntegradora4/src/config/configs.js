import dotenv from 'dotenv';

dotenv.config(); // Cargar el .env en la raíz del proyecto

const configs = {
    port: process.env.PORT,
    mongoUrl: process.env.MONGO_URL,
    privateKeyJwt: process.env.PRIVATE_KEY_JWT,
    adminEmail: process.env.ADMIN_EMAIL,
    adminPassword: process.env.ADMIN_PASSWORD,
    persistence: process.env.PERSISTENCE,
    userNodemailer: process.env.USER_NODEMAILER,
    passwordNodemailer: process.env.PASSWORD_NODEMAILER
};

export default configs;
