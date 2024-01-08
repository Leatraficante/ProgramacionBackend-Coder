import * as productService from '../services/products.service.js'

const getAll = async (req, res) => {
    try {
        const products = await productService.getAllProductsService();
        res.sendSuccess(products);
    } catch (error) {
        console.error(error);
        res.sendServerError(error.message);
    }
};

const getById = async (req, res) => {
    try {
        const { pid } = req.params;
        const product = await productService.getByIdProductsService(pid);
        if (product) {
            res.sendSuccess(product);
        } else {
            res.status(404).send({ error: "Product not Found" });
        }
    } catch (error) {
        console.error(error);
        res.sendServerError(error.message);
    }
};

const saveProduct = async (req, res) => {
    try {
        const productData = req.body;
        const result = await productService.saveProductService(productData);
        res.sendSuccessNewResults(result);
    } catch (error) {
        console.error(error);
        res.sendServerError(error.message);
    }
};

const updateProduct = async (req, res) => {
    try {
        const { pid } = req.params;
        const productData = req.body;
        const result = await productService.updateProductService(pid, productData);
        res.sendSuccessNewResults(result);
    } catch (error) {
        console.error(error);
        res.sendServerError(error.message);
    }
};

const deleteProduct = async (req, res) => {
    try {
        const { pid } = req.params;
        await productService.deleteProductService(pid);
        res.sendSuccess(`Product deleted`);
    } catch (error) {
        console.error(error);
        res.status(404).json({ error: "Product not Found" });
    }
};

export {
    getAll,
    getById,
    saveProduct,
    updateProduct,
    deleteProduct
};