import { Router } from "express";
import Products from '../dao/DBManager/ProductManager.js'
import { productsModel } from "../dao/DBManager/models/products.model.js";

const productsRouter = Router();
const productManager = new Products();

//Get products
productsRouter.get("/api/products", async (req, res) => {
  try {
    const products = await productManager.getAll();
    res.status(201).send({ status: 'success', payload: product })
  } catch (error) {
    console.log(error)
    res.status(500).send({ status: 'error', message: error.message });
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
      res.status(404).send({ error: "Product not Found" });
    }
  } catch (error) {
    console.log(error)
    res.status(500).send({ status: 'error', message: error.message })
  }
});


// Add new product
productsRouter.post("/", async (req, res) => {
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
    console.log(error)
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
    console.log(error)
    res.status(500).send({ status: 'error', message: error.message })

  }
});

//Delete product
productsRouter.delete("/:pid", async (req, res) => {
  try {
    const { pid } = req.params;
    const deletedProduct = await productManager.delete(pid);
    res.status(200).send({ status: 'success', message: 'Product deleted' });
  } catch (error) {
    console.log(error)
    res.status(404).json({ error: "Product not Found" });
  }
});

export default productsRouter;
