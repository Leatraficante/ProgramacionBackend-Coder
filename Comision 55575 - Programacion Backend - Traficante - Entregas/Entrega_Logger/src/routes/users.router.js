import Router from "../routes/router.js";
import Users from '../dao/DBManager/classes/carts.dao.js'
import { accessRolesEnum, passportStrategiesEnum } from "../config/enums.js";
import { login, register, logout, github, githubCallback } from "../controller/users.controller.js";

export default class UsersRouter extends Router {
    constructor() {
        super();
        this.usersManager = new Users();
    }

    init() {
        this.post('/login', [accessRolesEnum.PUBLIC], passportStrategiesEnum.NOTHING, login);
        this.post('/register', [accessRolesEnum.PUBLIC], passportStrategiesEnum.NOTHING, register);
        this.post('/logout', [accessRolesEnum.USER, accessRolesEnum.ADMIN], passportStrategiesEnum.JWT, logout);
        this.get('/github', [accessRolesEnum.PUBLIC], passportStrategiesEnum.GITHUB, github);
        this.get('/github-callback', [accessRolesEnum.PUBLIC], passportStrategiesEnum.GITHUB, githubCallback);
        
    };
};
