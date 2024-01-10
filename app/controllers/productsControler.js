const Products = require("../../models/Products");
const Categories = require("../../models/Categories");

const productsController = {};

productsController.createProduct = async (req, res) => {
  try {
    const { name, description, unit_price, stock, categoryId } = req.body;

    if (!name || !description || !unit_price || !stock || !categoryId) {
      return res.status(400).json({ message: "All fields are required..." });
    }

    const existingProduct = await Products.findOne({ where: { name } });
    const existingCategory = await Categories.findOne({
      where: { id: categoryId },
    });

    if (existingProduct) {
      return res.status(400).json({
        message:
          "Product already exists or it's name is the same as another product already created!",
      });
    }

    const categories = await Categories.findAll();

    if (!existingCategory) {
      return res.status(404).json({
        message: "Category not found. Try again selecting a valid category...",
        categories,
      });
    }

    const product = await Products.create({
      name,
      description,
      unit_price,
      stock,
      categoryId,
    });

    res.status(201).json({ message: "Product created successfully!", product });
  } catch (error) {
    if (error instanceof CustomValidationException) {
      res.status(400).json({ message: error.message });
    } else if (error instanceof NotFoundException) {
      res.status(404).json({ message: error.message });
    } else {
      res.status(500).json({ message: error.message });
    }
  }
};

productsController.getProducts = async (req, res) => {
  try {
    const products = await Products.findAll();

    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

productsController.getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Products.findOne({ where: { id } });

    if (!product) {
      return res.status(404).json({ message: "Product not found!" });
    }

    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

productsController.getProductsByCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;

    const products = await Products.findAll({
      where: { categoryId },
    });

    const category = await Categories.findAll();

    if (!category) {
      return res.status(404).json({ message: "Category not found!" });
    }

    if (products.length === 0) {
      return res.status(404).json({ message: "No products found in this category!" });
    }

    res.status(200).json(products);
  } catch (error) {
    if (error instanceof CustomValidationException) {
      res.status(400).json({ message: error.message });
    } else if (error instanceof NotFoundException) {
      res.status(404).json({ message: error.message });
    } else {
      res.status(500).json({ message: error.message });
    }
  }
};

productsController.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, unit_price, stock, categoryId } = req.body;

    const product = await Products.findOne({ where: { id } });

    if (!product) {
      return res.status(404).json({ message: "Product not found!" });
    }

    const updateAttributes = {
      name,
      description,
      unit_price,
      stock,
      categoryId,
    };

    let attributesFound = false;

    for (const key of Object.keys(updateAttributes)) {
      if (
        updateAttributes[key] !== undefined &&
        updateAttributes[key] !== " " &&
        updateAttributes[key] !== null
      ) {
        const updateObj = { [key]: updateAttributes[key] };
        await Products.update(updateObj, { where: { id } });
        attributesFound = true;
      }
    }

    if (!attributesFound) {
      return res.status(400).json({
        message: "At least one field must be provided",
      });
    }

    res.status(200).json({ message: "Product updated successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

productsController.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Products.findOne({ where: { id } });

    if (!product) {
      return res.status(404).json({ message: "Product not found!" });
    }

    await Products.destroy({ where: { id } });

    res.status(200).json({ message: "Product deleted successfully!" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = productsController;
