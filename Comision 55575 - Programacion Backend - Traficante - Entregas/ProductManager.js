/*
- Clase ProdcutManager;
- constructor this.products = [];
- Propiedades: 
title (nombre del producto)
description (descripción del producto)
price (precio)
thumbnail (ruta de imagen)
code (código identificador)
stock (número de piezas disponibles)
- addProduct = (propiedades) {variables = propiedades};
Validar que no se repita el campo “code” y que todos los campos sean obligatorios
Al agregarlo, debe crearse con un id autoincrementable
- getProducts = () => {
        return this.products;
    }
- getProductById = () .find ?

*/



class ProductManager {
    constructor() {
        this.products = [];
    }

    getProducts = () => {
        return this.products;
    }

    addProduct = (title, description, price, thumbnail, code, stock) => {
        const product = {
            title,
            description,
            price,
            thumbnail,
            code,
            stock
        }

        const codeValidation = this.products.some(product => product.code === code);

        if (codeValidation) {
            console.error(`Error: el codigo ${code} ya fue agregado.`)
            return;
        }

        if (this.products.length === 0) {
            product.id = 1;
        } else {
            product.id = this.products[this.products.length - 1].id + 1;
        }

        this.products.push(product);
    }

    getProductById = (id) => {
        const findProduct = this.products.find(product => product.id === id);
        
        if (findProduct) {
            return findProduct
        } else {
            console.log('Not Found')
            return null; 
        }
    }

}

const productoNuevo = new ProductManager();
productoNuevo.addProduct('producto prueba', 'este es un producto prueba', 200, 'sin imagen', 'abc123', 25);
productoNuevo.addProduct('producto prueba 2', 'este es un producto prueba 2', 200, 'sin imagen', 'abc123', 25);
productoNuevo.addProduct('producto 3', 'este es un producto 3', 150, 'sin imagen', '123probando', 5);
productoNuevo.addProduct('producto 4', 'este es un producto 4', 234, 'sin imagen', 'codigo000', 320);
productoNuevo.addProduct('producto 5', 'este es un producto 5', 175, 'sin imagen', 'AAA-456', 2525);
productoNuevo.addProduct('producto 6', 'este es un producto 6', 234, 'sin imagen', 'DSA000-111', 777);

console.log(productoNuevo.getProductById(171));
console.log(productoNuevo.getProducts());