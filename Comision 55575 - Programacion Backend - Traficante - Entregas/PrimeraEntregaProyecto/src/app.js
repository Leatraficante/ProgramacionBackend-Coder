import express from "express";
import cartRouter from "./routes/cart.router.js";
import productsRouter from "./routes/products.router.js";
import ProductManager from "./ProductManager.js";
import CartManager from "./CartManager.js";

const productManager = new ProductManager("./products.json");
const cartManager = new CartManager("./cart.json");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/carts", cartRouter);
app.use("/api/products", productsRouter);   

app.use((err, req, res, next) => {
  console.log(err.message);
  res.status(500).send({ error: err.message });
  next();
});

app.listen(8080, console.log("Listening on 8080"));
