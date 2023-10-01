import { Router } from "express";
import CartManager from "../CartManager.js";

const cartRouter = Router();
const cartManager = new CartManager("./cart.json");

cartRouter.get("/", async (req, res) => {
  try {
    let carts = await cartManager.getAllCarts();

    res.status(200).json(carts);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

cartRouter.post("/", async (req, res) => {
  try {
    const newCart = await cartManager.createCart();
    res.status(201).json(newCart);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

cartRouter.get("/:cid", async (req, res) => {
  const cartId = Number(req.params.cid);
  try {
    const cart = await cartManager.getCartById(cartId);
    res.json(cart.products);
  } catch (error) {
    res.status(404).json({ error: "Not Found" });
  }
});

cartRouter.post("/:cid/product/:pid", async (req, res) => {
  const cartId = Number(req.params.cid);
  const productId = Number(req.params.pid);
  const quantity = Number(req.body.quantity);

  try {
    const updatedCart = await cartManager.addProductToCart(cartId, productId, quantity);
    res.json(updatedCart.products);
  } catch (error) {
    res.status(404).json({ error: "Not Found" });
  }
});

export default cartRouter;
