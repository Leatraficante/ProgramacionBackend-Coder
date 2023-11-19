import { cartModel } from './models/cart.model.js';

export default class Carts {
  constructor() {
    console.log('Working on Carts DB')
  }

  // get all carts
  getAll = async () => {
    const carts = await cartModel.find().lean();//metodo para transforamr de BSON a POJO
    return carts;
  };

  // save cart
  save = async (cart) => {
    const result = await cartModel.create(cart);
    return result;
  };

  //delete cart
  delete = async (cid) => {
    const result = await cartModel.deleteOne({ _id: cid });
    return result;
  };

  // get cart by id
  getById = async (id) => {
    const result = await cartModel.findById(id).lean();
    return result;
  };

  // add product to cart
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


  //delete product form cart:
  deleteProductFromCart = async (cartId, productId) => {
    const cart = await cartModel.findById(cartId);
    if (!cart) {
      return { error: "Cart not found" };
    }

    const existsProductInCartIndex = cart.products.findIndex((product) => product._id == productId);

    if (existsProductInCartIndex !== -1) {
      // Utiliza splice para eliminar el producto del array.
      cart.products.splice(existsProductInCartIndex, 1);
      const result = await cartModel.findByIdAndUpdate(cartId, cart);
      return result;
    } else {
      return 'Product not found';
    }
  };



  // PUT api/carts/:cid deberá actualizar el carrito con un arreglo de productos
  updateProduct = async (cid,) => {
    const result = await cartModel.updateOne({ _id: cid });
  }

};