import { promises as fsPromises, existsSync } from "fs";

export default class CartManager {
  constructor(path) {
    this.path = path;

    if (!existsSync(path)) {
      fsPromises
        .writeFile(path, JSON.stringify([], null, 2))
        .then(() => console.log(`File ${path} created.`))
        .catch((error) => console.error(error));
    }
  }

  getAllCarts = async () => {
    try {
      const carts = await fsPromises.readFile(this.path, "utf-8");
      return JSON.parse(carts);
    } catch (error) {
      console.log(error);
      return [];
    }
  };

  createCart = async () => {
    try {
      const carts = await this.getAllCarts();
      const newCart = {};

      if (carts.length === 0) {
        newCart.id = 1;
      } else {
        const lastCartId = carts[carts.length - 1].id;
        newCart.id = lastCartId + 1;
      }

      carts.push(newCart);

      await fsPromises.writeFile(this.path, JSON.stringify(carts, null, "\t"));

      return newCart;
    } catch (error) {
      console.log(error);
      return null;
    }
  };

  addProductToCart = async (cartId, productId, quantity) => {
    try {
      const carts = await this.getAllCarts();
      const cart = carts.find((c) => c.id === cartId);

      if (cart) {
        if (!cart.products) {
          cart.products = [];
        }

        const products = await fsPromises.readFile("./products.json", "utf-8");
        const parsedProducts = JSON.parse(products);

        const product = parsedProducts.find((p) => p.id === productId);

        if (product) {
          const existsProductInCart = cart.products.findIndex(
            (p) => p.product === productId
          );

          if (existsProductInCart !== -1) {
            cart.products[existsProductInCart].quantity += quantity;
          } else {
            cart.products.push({ product: productId, quantity });
          }

          await fsPromises.writeFile(this.path, JSON.stringify(carts, null, 2));

          return cart;
        } else {
          throw new Error(
            `Product with ID ${productId} not found in products.json.`
          );
        }
      } else {
        throw new Error(`Cart with ID ${cartId} not found.`);
      }
    } catch (error) {
      console.log(error);
      return null;
    }
  };
}
