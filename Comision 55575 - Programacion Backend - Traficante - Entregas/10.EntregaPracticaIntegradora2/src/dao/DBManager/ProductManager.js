import { productsModel } from './models/products.model.js';

export default class Products {
  constructor() {
    console.log('Working on Products DB')
  }

  getAll = async () => {
    const products = await productsModel.find().lean();//metodo para transforamr de BSON a POJO
    return products;
  };

  save = async (product) => {
    const result = await productsModel.create(product);
    return result;
  };

  update = async (id, product) => {
    const result = await productsModel.updateOne({ _id: id }, product);
    return result;
  };

  delete = async (id) => {
    const result = await productsModel.deleteOne({ _id: id });
    return result;
  };

  getById = async (id) => {
    const result = await productsModel.findById(id).lean();
    return result;
  }
};

