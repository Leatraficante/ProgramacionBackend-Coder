// import { promises as fsPromises, existsSync } from "fs";
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

// class ProductManager {
//   constructor(path) {
//     this.path = path;

//     if (!existsSync(path)) {
//       fsPromises
//         .writeFile(path, JSON.stringify([], null, 2))
//         .then(() => console.log(`File ${path} created.`))
//         .catch((error) => console.error(error));
//     }
//   }

//   getAll = async () => {
//     try {
//       const products = await fsPromises.readFile(this.path, "utf-8");
//       return JSON.parse(products);
//     } catch (error) {
//       console.log(error);
//       return [];
//     }
//   };

//   addProduct = async (product) => {
//     try {
//       const products = await this.getAll();

//       if (products.length === 0) {
//         product.id = 1;
//       } else {
//         const lastProductId = products[products.length - 1].id;
//         product.id = lastProductId + 1;
//       }

//       products.push(product);

//       await fsPromises.writeFile(
//         this.path,
//         JSON.stringify(products, null, "\t")
//       );

//       return products;
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   updateProduct = async (productId, updatedProduct) => {
//     try {
//       const products = await this.getAll();

//       const index = products.findIndex((product) => product.id === productId);

//       if (index !== -1) {
//         updatedProduct.id = productId;
//         products[index] = updatedProduct;

//         await fsPromises.writeFile(
//           this.path,
//           JSON.stringify(products, null, "\t")
//         );

//         return updatedProduct;
//       } else {
//         throw new Error(`Product with ID ${productId} not found.`);
//       }
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   deleteProduct = async (productId) => {
//     try {
//       const products = await this.getAll();

//       const index = products.findIndex((product) => product.id === productId);

//       if (index !== -1) {
//         const deletedProduct = products.splice(index, 1)[0];

//         await fsPromises.writeFile(
//           this.path,
//           JSON.stringify(products, null, "\t")
//         );

//         return deletedProduct;
//       } else {
//         throw new Error(`Product with ID ${productId} not found.`);
//       }
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   getProductById = async (productId) => {
//     try {
//       const products = await this.getAll();
//       const product = products.find((p) => p.id === productId);

//       if (product) {
//         return product;
//       } else {
//         throw new Error(`Product with ID ${productId} not found.`);
//       }
//     } catch (error) {
//       console.log(error);
//     }
//   };
// }

// export default ProductManager;
