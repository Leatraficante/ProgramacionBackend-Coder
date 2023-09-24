import express from 'express';
import ProductManager from './ProductManager.js';

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const productManager = new ProductManager('./productos.json');


app.get('/products', async (req, res) => {
    const limit = Number(req.query.limit) || undefined;
    let products = await productManager.getAll();

    if (limit !== undefined && !isNaN(limit)) {
        products = products.slice(0, limit);
    }

    res.send(products);
});

// Producto según su id
app.get('/products/:id', async (req, res) => { 
    const productId = Number(req.params.id);
    const product = await productManager.getProductById(productId);
    if (!product) return res.status(404).send({ error: 'Producto no encontrado' });
    res.send(product);
});


app.listen(8080, () => console.log('Listening on 8080'));

