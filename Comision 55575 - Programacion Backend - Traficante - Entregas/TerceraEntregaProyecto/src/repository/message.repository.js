import MessagesDao from '../dao/DBManager/classes/messages.dao.js'

export default class MessagesRepository {
    constructor(dao) {
        this.dao = new MessagesDao();
    }

    getAll = async () => {
        const result = await this.dao.getAll();
        return result;
    };

    createProduct = async (product) => {
        const productToInsert = new ProductDto(product);
        const result = this.dao.save(productToInsert);
        return result;
    };

    createNewMessage = async (user, message) => {
        let nuevoMensaje = new MessagesDto(user, message);
        let mensajeGuardado = nuevoMensaje.save();
        console.log('Mensaje guardado con éxito:', mensajeGuardado);
        return mensajeGuardado;
    };
}
