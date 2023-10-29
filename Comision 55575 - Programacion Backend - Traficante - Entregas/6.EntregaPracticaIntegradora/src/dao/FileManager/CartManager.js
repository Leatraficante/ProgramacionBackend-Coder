// import { promises as fsPromises, existsSync } from "fs";

import { cartModel } from '../DBManager/models/cart.model.js';

export default class Carts {
  constructor() {
    console.log('Working on Carts DB')
  }

  getAll = async () => {
    const carts = await cartModel.find().lean();//metodo para transforamr de BSON a POJO
    return carts;
  };

  save = async (cart) => {
    const result = await cartModel.create(cart);
    return result;
  };

  delete = async (id) => {
    const result = await cartModel.deleteOne({ _id: id });
    return result;
  };

  getById = async (id) => {
    const result = await cartModel.findById(id).lean();
    return result;
  };

  addProductToCart = async (cartId, productId, quantity) => {
    const cart = await cartModel.findById(cartId);
    if (!cart) {
      return { error: "Cart not found" };
    }

    const existsProductInCart = cart.products && cart.products.find((product) => product.productId === productId);

    if (existsProductInCart) {
      existsProductInCart.quantity += quantity;
    } else {
      if (!cart.products) {
        cart.products = [];
      }

      cart.products.push({ productId, quantity });
    }

    const result = await cart.save()

    return result;
  }

};



// export default class CartManager {
//   constructor(path) {
//     this.path = path;

//     if (!existsSync(path)) {
//       fsPromises
//         .writeFile(path, JSON.stringify([], null, 2))
//         .then(() => console.log(`File ${path} created.`))
//         .catch((error) => console.error(error));
//     }
//   }

//   getAllCarts = async () => {
//     try {
//       const carts = await fsPromises.readFile(this.path, "utf-8");
//       return JSON.parse(carts);
//     } catch (error) {
//       console.log(error);
//       return [];
//     }
//   };

//   createCart = async () => {
//     try {
//       const carts = await this.getAllCarts();
//       const newCart = {};

//       if (carts.length === 0) {
//         newCart.id = 1;
//       } else {
//         const lastCartId = carts[carts.length - 1].id;
//         newCart.id = lastCartId + 1;
//       }

//       carts.push(newCart);

//       await fsPromises.writeFile(this.path, JSON.stringify(carts, null, "\t"));

//       return newCart;
//     } catch (error) {
//       console.log(error);
//       return null;
//     }
//   };

//   addProductToCart = async (cartId, productId, quantity) => {
//     try {
//       const carts = await this.getAllCarts();
//       const cart = carts.find((c) => c.id === cartId);

//       if (cart) {
//         if (!cart.products) {
//           cart.products = [];
//         }

//         const products = await fsPromises.readFile("./products.json", "utf-8");
//         const parsedProducts = JSON.parse(products);

//         const product = parsedProducts.find((p) => p.id === productId);

//         if (product) {
//           const existsProductInCart = cart.products.findIndex(
//             (p) => p.product === productId
//           );

//           if (existsProductInCart !== -1) {
//             cart.products[existsProductInCart].quantity += quantity;
//           } else {
//             cart.products.push({ product: productId, quantity });
//           }

//           await fsPromises.writeFile(this.path, JSON.stringify(carts, null, 2));

//           return cart;
//         } else {
//           throw new Error(
//             `Product with ID ${productId} not found in products.json.`
//           );
//         }
//       } else {
//         throw new Error(`Cart with ID ${cartId} not found.`);
//       }
//     } catch (error) {
//       console.log(error);
//       return null;
//     }
//   };
// }
