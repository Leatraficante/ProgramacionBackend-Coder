import { cartModel } from '../models/cart.model.js';
import usersModel from '../models/users.model.js'
import { productsModel } from '../models/products.model.js'

export default class CartsDao {
  constructor() {
    console.log('Working on Carts DB')
  }

  // get all carts
  getAll = async () => {
    const carts = await cartModel.find().lean();//metodo para transforamr de BSON a POJO
    return carts;
  };

  // save cart
  save = async (userId) => {
    const user = await usersModel.findOne({ _id: userId }).lean();
    const cart = await cartModel.create({ user: user._id });
    await usersModel.findByIdAndUpdate(user._id, { cart: { cartId: cart._id } });
    return cart;
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
    const cart = await cartModel.findById(cartId).populate('products.productId');

    if (!cart) {
      return { error: "Cart not found" };
    }

    const existingProductIndex = cart.products.findIndex(product => product.productId === productId);

    if (existingProductIndex !== -1) {
      cart.products[existingProductIndex].quantity += parseInt(quantity);
    } else {
      const productDetails = await productsModel.findById(productId);

      if (!productDetails) {
        return { error: "Product not found" };
      }
      const parsedQuantity = parseInt(quantity);

      cart.products.push({ productId: productDetails, quantity: parsedQuantity });
    }

    const result = await cart.save();
    return result;
  };

  deleteProductFromCart = async (cartId, productId) => {
    const cart = await cartModel.findById(cartId);
    if (!cart) {
      return { error: "Cart not found" };
    }

    const existsProductInCartIndex = cart.products.findIndex((product) => product._id == productId);

    if (existsProductInCartIndex !== -1) {
      // Utiliza splice para eliminar el producto del array.
      cart.products.splice(existsProductInCartIndex, 1);
      const result = await cartModel.updateOne({ _id: cartId }, { $set: { products: cart.products } });
      return result;
    } else {
      return 'Product not found';
    }
  };

  updateProducts = async (cartId, products) => {
    const result = await cartModel.findByIdAndUpdate(cartId, { products }, { new: true }).lean();
    return result;
};

  updateProductInCart = async (cartId, productId, newQuantity) => {
    const cart = await cartModel.findById(cartId);

    if (!cart) {
      return { error: "Cart not found" };
    }

    const existingProductIndex = cart.products.findIndex(product => product.productId.toString() === productId);

    if (existingProductIndex !== -1) {
      cart.products[existingProductIndex].quantity = newQuantity;
      const result = await cart.save();
      return result;
    } else {
      return { error: "Product not found in cart" };
    }
  };


};