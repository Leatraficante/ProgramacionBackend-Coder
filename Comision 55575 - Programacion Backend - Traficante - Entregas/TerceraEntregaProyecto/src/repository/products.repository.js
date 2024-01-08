// import ProductDto from '../DTOs/products.dto.js';
import ProductsDao from '../dao/DBManager/classes/products.dao.js'

export default class ProductsRepository {
  constructor(dao) {
    this.dao = new ProductsDao();
  }

  getAllProducts = async () => {
    const result = await this.dao.getAll();
    return result;
  };

  createProduct = async (product) => {
    const productToInsert = new ProductDto(product);
    const result = this.dao.save(productToInsert);
    return result;
  };

  updateProduct = async (id, product) => {
    const result = this.dao.update(id, product);
    return result;
  };

  deleteProduct = async (id) => {
    const result = this.dao.delete(id);
    return result;
  };

  getProductById = async (id) => {
    const result = this.dao.getById(id);
    return result;
  };
}
