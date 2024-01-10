import UsersDao from '../dao/DBManager/classes/users.dao.js';

export default class UsersRepository {
    constructor() {
        this.dao = new UsersDao();
    }

    getByEmail = async (email) => {
        const result = await this.dao.getByEmail(email);
        return result;
    }

    save = async (user) => {
        const result = await this.dao.save(user);
        return result;
    }


};