import { promises } from 'fs';

export default class ProductManager {
    constructor(path) {
        this.path = path;
    }

    getAll = async () => {
        try { 
            const products = await promises.readFile(this.path, 'utf-8');
            return JSON.parse(products);
        } catch (error) {
            console.log(error);
            return [];
        }
    }

    addProduct = async (product) => {
        try {
            const products = await this.getAll();
    
            if (products.length === 0) {
                product.id = 1;
            } else {
                const lastProductId = products[products.length - 1].id;
                product.id = lastProductId + 1;
            }
    
            products.push(product);
    
            await fs.promises.writeFile(this.path, JSON.stringify(products, null, '\t'));
    
            return products;
    
        } catch (error) {
            console.log(error);
        }
    }
    

    updateProduct = async (productId, updatedProduct) => {
        try {
            const products = await this.getAll();

            const index = products.findIndex((product) => product.id === productId);

            if (index !== -1) {
                updatedProduct.id = productId;
                products[index] = updatedProduct;

                await fs.promises.writeFile(this.path, JSON.stringify(products, null, '\t'));

                return updatedProduct;
            } else {
                throw new Error(`Product with ID ${productId} not found.`);
            }
        } catch (error) {
            console.log(error);
        }
    }

    deleteProduct = async (productId) => {
        try {
            const products = await this.getAll();

            const index = products.findIndex((product) => product.id === productId);

            if (index !== -1) {
                const deletedProduct = products.splice(index, 1)[0];

                await fs.promises.writeFile(this.path, JSON.stringify(products, null, '\t'));

                return deletedProduct;
            } else {
                throw new Error(`Product with ID ${productId} not found.`);
            }
        } catch (error) {
            console.log(error);
        }
    }

    getProductById = async (productId) => {
        try {
            const products = await this.getAll();
            const product = products.find((p) => p.id === productId);

            if (product) {
                return product;
            } else {
                throw new Error(`Product with ID ${productId} not found.`);
            }
        } catch (error) {
            console.log(error);
        }
    }
}
