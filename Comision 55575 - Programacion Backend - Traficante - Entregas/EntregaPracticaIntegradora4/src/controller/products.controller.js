import * as productService from '../services/products.service.js';
import CustomError from '../errors/CustomErrors.js'
import { EErrors } from '../config/enums.js';

const getAll = async (req, res) => {
    try {
        const products = await productService.getAllProductsService();
        res.sendSuccess(products);
    } catch (error) {
        req.logger.error(error.message);
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
        req.logger.error(error.message);
        res.sendServerError(error.message);
    }
};

// const saveProduct = async (req, res) => {
//     try {
//         const productData = req.body;
//         const result = await productService.saveProductService(productData);
//         res.sendSuccessNewResults(result);
//     } catch (error) {
//         console.error(error);
//         res.sendServerError(error.message);
//     }
// };

const saveProduct = async (req, res) => {
    try {
        const { title, description, code, price, stock, category } = req.body;
        if (!title || !description || !code || !price || !stock || !category) {
            // throw CustomError.createError({
            //     name: 'ProductError',
            //     cause: 'Invalid data types, all fields are required',
            //     message: 'Error trying to create product, all fields are requiered, plase try again',
            //     code: EErrors.INVALID_TYPE_ERROR
            // })
            return res.status(400).send({ status: "error", error: "Incomplete values" })
        }

        const owner = req.user.email;
        const productData = { title, description, code, price, stock, category, owner };
        const result = await productService.saveProductService(productData);
        res.sendSuccessNewResults(result);

    } catch (error) {
        req.logger.error(error.message);
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
        req.logger.error(error.message);
        res.sendServerError(error.message);
    }
};

const deleteProduct = async (req, res) => {
    try {
        const { pid } = req.params;
        const product = await productService.getByIdProductsService(pid);

        if (!product) {
            return res.status(404).send({ error: "Product not Found" });
        }

        if (req.user.role === 'ADMIN') {
            await productService.deleteProductService(pid);
            return res.sendSuccess(`Product deleted`);
        }

        if (req.user.role === 'PREMIUM' && req.user.email === product.owner) {
            await productService.deleteProductService(pid);
            return res.sendSuccess(`Product deleted`);
        }

        return res.status(403).send({ error: 'No authorization to delete this product' });
    } catch (error) {
        req.logger.error(error.message);
        return res.status(500).send({ error: "Internal Server Error" });
    }
};


export {
    getAll,
    getById,
    saveProduct,
    updateProduct,
    deleteProduct,
};