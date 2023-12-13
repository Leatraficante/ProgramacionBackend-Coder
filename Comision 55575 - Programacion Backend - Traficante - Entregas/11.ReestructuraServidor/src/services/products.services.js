import Products from '../dao/DBManager/ProductManager.js'

const productManager = new Products();

const getAllProductsService = async () => {
    return productManager.getAll();
};

const getByIdProductsService = async (pid) => {
    const product = await productManager.getById(pid);
    if (product) {
        return product;
    } else {
        res.status(404).send({ error: "Product not Found" });
    }
};

const saveProductService = async (productData) => {
    const { title, description, code, price, stock, category } = productData;
    if (!title || !description || !code || !price || !stock || !category) {
        throw { status: 400, message: 'Incomplete Values' };
    }

    return productManager.save({
        title,
        description,
        code,
        price,
        stock,
        category
    });
};

const updateProductService = async (pid, productData) => {
    const { title, description, code, price, stock, category } = productData;
    if (!title || !description || !code || !price || !stock || !category) {
        return res.status(400).send({ states: 'error', message: 'Incomplete Values' })
    };

    await productManager.update(pid, {
        title,
        description,
        code,
        price,
        stock,
        category
    });
};

const deleteProductService = async (pid) => {
    await productManager.delete(pid);
};

export {
    getAllProductsService,
    getByIdProductsService,
    saveProductService,
    updateProductService,
    deleteProductService
};

