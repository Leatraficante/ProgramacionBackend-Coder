// import { PRIVATE_KEY_JWT } from './constants.js';

const passportStrategiesEnum = {
    JWT: 'jwt',
    NOTHING: 'na',
    GITHUB: 'github',
};

const accessRolesEnum = {
    ADMIN: 'ADMIN',
    USER: 'USER',
    PUBLIC: 'PUBLIC'
};

export {
    passportStrategiesEnum,
    accessRolesEnum
};
