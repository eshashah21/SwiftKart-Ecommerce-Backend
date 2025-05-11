const productService = require("../services/Product.Service");

const createProduct = async (req, res) => {
  try {
    const product = await productService.createProduct(req.body);
    return res.status(201).send(product);
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
};

const deleteProduct = async (req, res) => {
  const productId = req.params.id;
  try {
    const product = await productService.deleteProduct(productId);
    return res.status(201).send(product);
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
};

const updateProduct = async (req, res) => {
    const productId = req.params.id;
    console.log('Updating product with ID:', productId); // Log product ID
    try {
        const updatedProduct = await productService.updateProduct(productId, req.body);
        console.log('Updated product:', updatedProduct); // Log updated product
        return res.status(200).send(updatedProduct);
    } catch (error) {
        console.error('Error updating product:', error); // Log error
        return res.status(500).send({ error: error.message });
    }
};

const findProductById = async (req, res) => {
  const productId = req.params.id;
  try {
    const product = await productService.findProductById(productId);
    return res.status(201).send(product);
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
};

const getAllProducts = async (req, res) => {
  try {
    console.log("API endpoint called with query parameters:", req.query);
    const products = await productService.getAllProducts(req.query);
    console.log("Products response:", products);
    return res.status(200).send(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    return res.status(500).send({ error: error.message });
  }
};

const createMultipleProducts = async (req, res) => {
  const productId = req.params.id;
  try {
    const products = await productService.createMultipleProduct(req.body);
    return res.status(201).send({ message: "Products created successfully" });
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
};

module.exports = {
  createProduct,
  deleteProduct,
  updateProduct,
  findProductById,
  getAllProducts,
  createMultipleProducts,
};