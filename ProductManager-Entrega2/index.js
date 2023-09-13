const ProductManager = require('./Manager/ProductManager');

const manager = new ProductManager('./files/productos.json');

const env = async () => {
        const productos = await manager.getProducts();
        console.log(productos);

        const product1 = {
            title: 'Producto 1',
            description: 'Descripcion del p1',
            price: 45,
            thumbnail: 'Sin Imagen',
            code: 'FFF333',
            stock: 7,
        };

        await manager.addProduct(product1);

        const product2 = {
            title: 'Producto 2',
            description: 'Descripcion del p2',
            price: 123,
            thumbnail: 'Sin Imagen',
            code: '000111',
            stock: 90,
        };

        await manager.addProduct(product2);

        const product3 = {
            title: 'Producto 3',
            description: 'Descripcion del p3',
            price: 150,
            thumbnail: 'Sin Imagen',
            code: 'LALA1111',
            stock: 10,
        };

        await manager.addProduct(product3);

        const productosAgregados = await manager.getProducts();
        console.log(productosAgregados);

        const updatedProduct = {
            title: 'Producto Actualizado',
            description: 'Nueva descripción',
            price: 50,
            thumbnail: 'Nueva imagen',
            code: 'Codigo nuevo',
            stock: 10000,
        };
        const updatedProductResult = await manager.updateProduct(1, updatedProduct);
        console.log('Producto actualizado:', updatedProductResult);
    
        const deletedProduct = await manager.deleteProduct(2);
        console.log('Producto eliminado:', deletedProduct);
    
        const productIdToGet = 3;
        const productById = await manager.getProductById(productIdToGet);
        console.log('Producto con ID', productIdToGet, ':', productById);

}

env();