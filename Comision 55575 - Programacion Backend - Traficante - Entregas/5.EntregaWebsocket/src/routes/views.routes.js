import { Router } from "express";
import ProductManager from "../manager/ProductManager.js";

const viewsRouter = Router();
const productManager = new ProductManager('./products.json');

viewsRouter.get("/", async (req, res) => {
  res.render("realTimeProducts", { products: productManager.getAll() });
});

export default viewsRouter;
