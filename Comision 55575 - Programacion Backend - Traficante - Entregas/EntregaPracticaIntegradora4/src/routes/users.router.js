import Router from "../routes/router.js";
import Users from '../dao/DBManager/classes/users.dao.js'
import { accessRolesEnum, passportStrategiesEnum } from "../config/enums.js";
import { login, register, logout, github, githubCallback, uploadDocuments, userToPremium } from "../controller/users.controller.js";
import { upload } from "../middleware/multer.config.js";

export default class UsersRouter extends Router {
    constructor() {
        super();
        this.usersManager = new Users();
    }

    init() {
        this.post('/login', [accessRolesEnum.PUBLIC], passportStrategiesEnum.NOTHING, login);
        this.post('/register', [accessRolesEnum.PUBLIC], passportStrategiesEnum.NOTHING, register);
        this.post('/logout', [accessRolesEnum.USER, accessRolesEnum.ADMIN, accessRolesEnum.PREMIUM_USER], passportStrategiesEnum.JWT, logout);
        this.get('/github', [accessRolesEnum.PUBLIC], passportStrategiesEnum.GITHUB, github);
        this.get('/github-callback', [accessRolesEnum.PUBLIC], passportStrategiesEnum.GITHUB, githubCallback);
        this.post('/:uid/documents', [accessRolesEnum.USER, accessRolesEnum.ADMIN, accessRolesEnum.PREMIUM_USER], passportStrategiesEnum.JWT, upload.any(), uploadDocuments);
        this.put('/premium/:uid', [accessRolesEnum.ADMIN], passportStrategiesEnum.JWT, userToPremium)
    };
};
