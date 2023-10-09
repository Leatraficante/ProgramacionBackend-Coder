import { Router } from "express";
import ProductManager from "../manager/ProductManager.js";

const productRouter = Router();
const productManager = new ProductManager('./products.json');

productRouter.post("/", async (req, res) => {
  const io = req.app.get("socketio");

  await productManager.addProduct(req.body);

  io.emit("showProducts", await productManager.getAll());

  res.send({
    status: "success",
  });
});

productRouter.delete("/:pid", async (req, res) => {
  const io = req.app.get("socketio");

  await productManager.deleteProduct(req.params.pid);

  io.emit("showProducts", await productManager.getAll());

  res.send({
    status: "success",
  });
});

export default productRouter;
