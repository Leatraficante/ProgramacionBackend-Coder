const fs = require('fs');

class ProductManager {
    constructor(path) {
        this.path = path;
    }

    getProducts = async () => {
        try {
            if (fs.existsSync(this.path)) {
                const data = await fs.promises.readFile(this.path, 'utf-8');
                const products = JSON.parse(data);
                return products;
            } else {
                return [];
            }
        } catch (error) {
            console.log(error);
        }
    }

    addProduct = async (product) => {
        try {
            const products = await this.getProducts();
    
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
            const products = await this.getProducts();

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
            const products = await this.getProducts();

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
            const products = await this.getProducts();
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

module.exports = ProductManager;