import { Router } from "express";
import Carts from '../dao/DBManager/CartManager.js'

const cartRouter = Router();
const cartManager = new Carts();

// Obtener todos los carts
cartRouter.get("/", async (req, res) => {
  try {
    let carts = await cartManager.getAll();
    res.send({ status: 'success', payload: carts })
  } catch (error) {
    res.status(500).send({ status: 'error', message: error.message })
  }
});

//Crear nuevo cart
cartRouter.post("/", async (req, res) => {
  try {
    const newCart = req.body;
    const result = await cartManager.save(newCart);
    res.status(201).send({ status: 'success', payload: result })
  } catch (error) {
    res.status(500).send({ status: 'error', message: error.message })
  }
});

//Cart by id
cartRouter.get("/:cid", async (req, res) => {
  const cartId = req.params.cid;
  try {
    const cart = await cartManager.getById(cartId);
    if (cart) {
      return res.status(201).send({ status: 'success', payload: cart })
    } else {
      res.status(404).send({ error: "Not Found" });
    }
  } catch (error) {
    res.status(500).send({ status: 'error', message: error.message })
  }
});

//Agregar product to cart
cartRouter.post("/:cid/product/:pid", async (req, res) => {
  const cartId = req.params.cid;
  const productId = req.params.pid;
  const quantity = parseInt(req.body.quantity);

  try {
    const updatedCart = await cartManager.addProductToCart(cartId, productId, quantity);
    res.json(updatedCart.products);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

//(DELETE api/carts/:cid/product/:pid ) delte segun id
cartRouter.delete('/:cid/product/:pid', async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const result = await cartManager.deleteProductFromCart(cid, pid);

    return res.status(201).send({ status: 'success', message: 'Product deleted' });
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

// delete el cart completo
cartRouter.delete('/:cid', async (req, res) => {
  try {
    const { cid } = req.params;
    const deletedCart = await cartManager.delete(cid);
    res.status(200).send("Cart deleted");
  } catch (error) {
    res.status(404).json({ error: "Not Found" });
  }
});


// PUT api/carts/:cid deberá actualizar el carrito con un arreglo de productos
cartRouter.put('/:cid', async (req, res) => {
  try {


  } catch (error) {
  } res.status(500).send({ status: 'error', message: error.message })

});




export default cartRouter;
