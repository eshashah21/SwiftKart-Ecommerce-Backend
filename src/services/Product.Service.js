const Category = require("../models/Category.Model");
const Product = require("../models/Product.Model");

/**
 * Creates a product and its associated categories.
 * @param {Object} reqData - The product and category details.
 * @returns {Object} - The saved product.
 * @throws {Error} - Throws an error if the product creation fails.
 */
async function createProduct(reqData) {
  // Find or create the top-level category
  let topLevel = await Category.findOne({ name: reqData.topLevelCategory });
  if (!topLevel) {
    topLevel = new Category({ name: reqData.topLevelCategory, level: 1 });
    await topLevel.save();
  }

  // Find or create the second-level category
  let secondLevel = await Category.findOne({
    name: reqData.secondLevelCategory,
    parentCategory: topLevel._id,
  });
  if (!secondLevel) {
    secondLevel = new Category({
      name: reqData.secondLevelCategory,
      parentCategory: topLevel._id,
      level: 2,
    });
    await secondLevel.save();
  }

  // Find or create the third-level category
  let thirdLevel = await Category.findOne({
    name: reqData.thirdLevelCategory,
    parentCategory: secondLevel._id,
  });
  if (!thirdLevel) {
    thirdLevel = new Category({
      name: reqData.thirdLevelCategory,
      parentCategory: secondLevel._id,
      level: 3,
    });
    await thirdLevel.save();
  }

  // Create the product
  const product = new Product({
    title: reqData.title,
    color: reqData.color,
    description: reqData.description,
    discountedPrice: reqData.discountedPrice,
    discountPresent: reqData.discountPresent,
    imageUrl: reqData.imageUrl,
    brand: reqData.brand,
    price: reqData.price,
    sizes: reqData.size,  // Sizes should be an array, hence using "sizes"
    quantity: reqData.quantity,
    category: thirdLevel._id,
  });

  // Save and return the product
  return await product.save();
}

/**
 * Deletes a product by its ID.
 * @param {string} productId - The ID of the product to delete.
 * @returns {string} - A message indicating the product was deleted.
 * @throws {Error} - Throws an error if the product is not found.
 */
async function deleteProduct(productId) {
  const product = await findProductById(productId);
  await Product.findByIdAndDelete(productId);
  return "Product deleted successfully";
}

/**
 * Updates an existing product by its ID.
 * @param {string} productId - The ID of the product to update.
 * @param {Object} reqData - The new product data.
 * @returns {Object} - The updated product.
 * @throws {Error} - Throws an error if updating the product fails.
 */
const updateProduct = async (productId, reqData) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(productId, reqData, { new: true });
    return updatedProduct;
  } catch (error) {
    throw new Error("Error updating product: " + error.message);
  }
};

/**
 * Finds a product by its ID.
 * @param {string} id - The product ID.
 * @returns {Object} - The found product.
 * @throws {Error} - Throws an error if the product is not found.
 */
async function findProductById(id) {
  const product = await Product.findById(id).populate("category").exec();
  if (!product) {
    throw new Error("Product not found with id: " + id);
  }
  return product;
}

/**
 * Retrieves all products with filtering, sorting, and pagination.
 * @param {Object} reqQuery - Query parameters for filtering, sorting, and pagination.
 * @returns {Object} - A paginated list of products matching the filters.
 */
async function getAllProducts(reqQuery) {
  let { category, color, sizes, minPrice, maxPrice, minDiscount, sort, stock, pageNumber, pageSize } = reqQuery;

  pageNumber = Math.max(1, pageNumber || 1);
  pageSize = pageSize || 10;

  let query = Product.find().populate("category");

  if (category) {
    const existCategory = await Category.findOne({ name: category });
    if (existCategory) {
      query = query.where("category").equals(existCategory._id);
    } else {
      return { content: [], currentPage: pageNumber, totalPages: 0 };
    }
  }

  if (color) {
    const colorSet = new Set(color.split(",").map((color) => color.trim().toLowerCase()));
    const colorRegex = new RegExp([...colorSet].join("|"), "i");
    query = query.where("color").regex(colorRegex);
  }

  // Repeat for other filters...

  const totalProducts = await Product.countDocuments(query);
  const skip = (pageNumber - 1) * pageSize;
  query = query.skip(skip).limit(pageSize);
  const products = await query.exec();

  const totalPages = Math.ceil(totalProducts / pageSize);
  return {
    content: products,
    currentPage: pageNumber,
    totalPages: totalPages,
    totalProducts: totalProducts,
  };
}

/**
 * Creates multiple products.
 * @param {Array} products - An array of product data to create.
 */
async function createMultipleProduct(products) {
  for (let product of products) {
    await createProduct(product);
  }
}

module.exports = {
  createProduct,
  deleteProduct,
  updateProduct,
  findProductById,
  getAllProducts,
  createMultipleProduct,
};
