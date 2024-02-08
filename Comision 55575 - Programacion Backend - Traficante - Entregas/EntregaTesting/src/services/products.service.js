import ProductsRepository from '../repository/products.repository.js';
import ProductDto from '../DTOs/products.dto.js';
import Products from '../dao/factory.js';

const productsRepository = new ProductsRepository(Products);

export const getAllProductsService = async () => {
  return productsRepository.getAllProducts();
};

export const getByIdProductsService = async (pid) => {
  const product = await productsRepository.getProductById(pid);
  if (product) {
    return product;
  }
};

export const saveProductService = async (productData) => {
  const productDto = new ProductDto(productData);
  const result = await productsRepository.createProduct(productDto);
  return result;
};

export const updateProductService = async (pid, productData) => {
  const productDto = new ProductDto(productData);
  await productsRepository.updateProduct(pid, productDto);
};

export const deleteProductService = async (pid) => {
  await productsRepository.deleteProduct(pid);
};
