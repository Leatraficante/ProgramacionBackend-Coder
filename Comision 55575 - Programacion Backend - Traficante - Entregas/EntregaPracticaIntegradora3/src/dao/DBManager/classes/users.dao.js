import usersModel from "../models/users.model.js";

export default class UsersDao {
    constructor() {
        console.log('Working Users with DB');
    }

    getByEmail = async (email) => {
        const user = await usersModel.findOne({ email }).lean();
        return user;
    };


    save = async (user) => {
        const result = await usersModel.create(user);
        return result;
    };

    getById = async (userId) => {
        const user = await usersModel.findById(userId)
        return user;
    }
}

