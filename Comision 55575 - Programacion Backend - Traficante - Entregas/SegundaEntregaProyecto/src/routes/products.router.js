import { Router } from "express";
// import ProductManager from "../ProductManager.js";
import Products from '../dao/DBManager/ProductManager.js'
import { productsModel } from "../dao/DBManager/models/products.model.js";

const productsRouter = Router();
// const productManager = new ProductManager("./products.json");
const productManager = new Products();

// Get products
productsRouter.get("/", async (req, res) => {
  try {
    // let products = await productManager.getAll();
    let products = await productManager.getAll();
    const limit = Number(req.query.limit);
    const category = req.query.category;

    if (category) {
      products = products.filter(product => product.category === category);
    };

    if (limit !== undefined && !isNaN(limit)) {
      products = products.slice(0, limit);
    }
  
    const { page = 1 } = req.query;
    const { docs, hasPrevPage, hasNextPage, nextPage, prevPage } = await productsModel.paginate({}, { limit: 3, page, lean: true });
    res.render('products', {
        products: docs,
        hasPrevPage,
        hasNextPage,
        nextPage,
        prevPage
    });
  } catch (error) {
    res.status(500).send({ status: 'error', message: error.message })
  }
});

//Get products by Id
productsRouter.get("/:pid", async (req, res) => {
  try {
    const { pid } = req.params;
    const product = await productManager.getById(pid);
    if (product) {
      return res.status(201).send({ status: 'success', payload: product })
    } else {
      res.status(404).send({ error: "Not Found" });
    }
  } catch (error) {
    res.status(500).send({ status: 'error', message: error.message })
  }
});
// productsRouter.get("/:pid", async (req, res) => {
//   const productId = Number(req.params.pid);
//   try {
//     const product = await productManager.getProductById(productId);
//     res.json(product);
//   } catch (error) {
//     res.status(404).send({ error: "Not Found" });
//   }
// });

// Add new product
productsRouter.post("/", async (req, res) => {
  // const newProduct = req.body;
  try {
    const { title, description, code, price, stock, category } = req.body;
    if (!title || !description || !code || !price || !stock || !category) {
      return res.status(400).send({ states: 'error', message: 'Incomplete Values' })
    }

    const result = await productManager.save({
      title,
      description,
      code,
      price,
      stock,
      category
    });
    res.status(201).send({ status: 'success', payload: result })

  } catch (error) {
    res.status(500).send({ status: 'error', message: error.message })
  }
});

// Update Product
productsRouter.put("/:pid", async (req, res) => {
  try {
    const { title, description, code, price, stock, category } = req.body;
    const { pid } = req.params;
    if (!title || !description || !code || !price || !stock || !category) {
      return res.status(400).send({ states: 'error', message: 'Incomplete Values' })
    };

    const result = await productManager.update(pid, {
      title,
      description,
      code,
      price,
      stock,
      category
    });

    res.send({ status: 'success', payload: result });


  } catch (error) {
    res.status(500).send({ status: 'error', message: error.message })

  }
});

//Delete product
productsRouter.delete("/:pid", async (req, res) => {
  try {
    const { pid } = req.params;
    const deletedProduct = await productManager.delete(pid);
    res.status(200).send("Product deleted");
  } catch (error) {
    res.status(404).json({ error: "Not Found" });
  }
});

export default productsRouter;
