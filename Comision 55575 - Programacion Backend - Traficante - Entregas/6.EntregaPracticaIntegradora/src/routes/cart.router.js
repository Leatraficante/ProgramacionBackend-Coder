import { Router } from "express";
// import CartManager from "../CartManager.js";
import Carts from '../dao/FileManager/CartManager.js';

const cartRouter = Router();
const cartManager = new Carts();

//Get all carts
cartRouter.get("/", async (req, res) => {
  try {
    // let carts = await cartManager.getAllCarts();
    let carts = await cartManager.getAll();
    res.send({ status: 'success', payload: carts })
  } catch (error) {
    res.status(500).send({ status: 'error', message: error.message })
  }
});

//Create new Cart
cartRouter.post("/", async (req, res) => {
  try {
    // const newCart = await cartManager.createCart();
    const newCart = req.body;
    const result = await cartManager.save(newCart);
    res.status(201).send({ status: 'success', payload: result })
  } catch (error) {
    res.status(500).send({ status: 'error', message: error.message })
  }
});

//Get Cart by ID
cartRouter.get("/:cid", async (req, res) => {
  const cartId = req.params.cid;
  try {
    // const cart = await cartManager.getCartById(cartId);
    const cart = await cartManager.getById(cartId);
    // res.json(cart.products);
    if (cart) {
      return res.status(201).send({ status: 'success', payload: cart })
    } else {
      res.status(404).send({ error: "Not Found" });
    }
  } catch (error) {
    res.status(500).send({ status: 'error', message: error.message })
  }
});

//Add product to cart
cartRouter.post("/:cid/product/:pid", async (req, res) => {
  const cartId = req.params.cid;
  const productId = req.params.pid;
  const quantity = req.body.quantity;

  try {
    const updatedCart = await cartManager.addProductToCart(cartId, productId, quantity);
    res.json(updatedCart.products);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

export default cartRouter;
