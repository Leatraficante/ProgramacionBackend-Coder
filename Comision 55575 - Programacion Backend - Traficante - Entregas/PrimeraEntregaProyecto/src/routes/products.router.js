import { Router } from "express";
import ProductManager from "../ProductManager.js";

const productsRouter = Router();
const productManager = new ProductManager("./products.json");

productsRouter.get("/", async (req, res) => {
  try {
    let products = await productManager.getAll();
    const limit = Number(req.query.limit);

    if (limit !== undefined && !isNaN(limit)) {
      products = products.slice(0, limit);
    }

    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

productsRouter.get("/:pid", async (req, res) => {
  const productId = Number(req.params.pid);
  try {
    const product = await productManager.getProductById(productId);
    res.json(product);
  } catch (error) {
    res.status(404).send({ error: "Not Found" });
  }
});

productsRouter.post("/", async (req, res) => {
  const newProduct = req.body;
  try {
    const products = await productManager.addProduct(newProduct);
    res.status(201).json(products);
  } catch (error) {
    return res.status(400).send({ status: "error", error: "incomplete values" });
  }
});

productsRouter.put("/:pid", async (req, res) => {
  const productId = Number(req.params.pid);
  const updatedProduct = req.body;
  try {
    const product = await productManager.updateProduct(productId, updatedProduct);
    res.json(product);
  } catch (error) {
    res.status(404).json({ status: "error", error: "incomplete values" });
  }
});

productsRouter.delete("/:pid", async (req, res) => {
  const productId = Number(req.params.pid);
  try {
    const deletedProduct = await productManager.deleteProduct(productId);
    res.status(200).send("Product deleted");
  } catch (error) {
    res.status(404).json({ error: "Not Found" });
  }
});

export default productsRouter;
