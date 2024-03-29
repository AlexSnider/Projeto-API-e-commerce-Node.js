const {
  CustomValidationException,
  NotFoundException,
} = require("./customExceptions/customExceptions");

const Products = require("../../../models/Products");
const Categories = require("../../../models/Categories");

const productsController = {};

productsController.createProduct = async (req, res) => {
  try {
    const { name, description, unit_price, stock, categoryId } = req.body;

    if (!name || !description || !unit_price || !stock || !categoryId) {
      return res.status(400).json({ message: "All fields are required!" });
    }

    const existingProduct = await Products.findOne({ where: { name } });
    const existingCategory = await Categories.findOne({
      where: { id: categoryId },
    });

    if (existingProduct) {
      return res.status(400).json({
        message: "Oops! Something went wrong. Try again.",
      });
    }

    const categories = await Categories.findAll();

    if (!existingCategory) {
      return res.status(404).json({
        message: "Oops! Something went wrong. Try again.",
        categories,
      });
    }

    await Products.create({
      name,
      description,
      unit_price,
      stock,
      categoryId,
    });

    const products = await Products.findOne({ where: { name } });
    res.location(`/v1/products/${products.id}`);

    res
      .status(201)
      .json({ error: false, message: "If created successfully an email will be sent." });
  } catch (error) {
    if (error instanceof CustomValidationException) {
      res.status(400).json({ error: true, message: error.message });
    } else if (error instanceof NotFoundException) {
      res.status(404).json({ error: true, message: error.message });
    } else {
      res.status(500).json({ error: true, message: error.message });
    }
  }
};

productsController.getProducts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 10;

    const offset = (page - 1) * pageSize;

    const products = await Products.findAll({
      limit: pageSize,
      offset: offset,
    });

    res.status(200).json({ error: false, products });
  } catch (error) {
    res.status(500).json({ error: true, message: error.message });
  }
};

productsController.getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Products.findOne({ where: { id } });

    if (!product) {
      return res.status(404).json({ error: true, message: "Oops! Something went wrong." });
    }

    res.status(200).json({ error: false, product });
  } catch (error) {
    res.status(500).json({ error: true, message: error.message });
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
      return res.status(404).json({ message: "Oops! Something went wrong." });
    }

    if (products.length === 0) {
      return res.status(404).json({ message: "Oops! Something went wrong." });
    }

    res.status(200).json({ error: false, products });
  } catch (error) {
    if (error instanceof CustomValidationException) {
      res.status(400).json({ error: true, message: error.message });
    } else if (error instanceof NotFoundException) {
      res.status(404).json({ error: true, message: error.message });
    } else {
      res.status(500).json({ error: true, message: error.message });
    }
  }
};

productsController.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, unit_price, stock, categoryId } = req.body;

    const product = await Products.findOne({ where: { id } });

    if (!product) {
      return res.status(404).json({ error: true, message: "Oops! Something went wrong." });
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
        error: true,
        message: "At least one field must be provided.",
      });
    }

    res
      .status(200)
      .json({ error: false, message: "If updated successfully an email will be sent." });
  } catch (error) {
    res.status(500).json({ error: true, message: error.message });
  }
};

productsController.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Products.findOne({ where: { id } });

    if (!product) {
      return res.status(404).json({ error: true, message: "Oops! Something went wrong." });
    }

    await Products.destroy({ where: { id } });

    res
      .status(200)
      .json({ error: false, message: "If deleted successfully an email will be sent." });
  } catch (error) {
    res.status(500).json({ error: true, message: error.message });
  }
};

module.exports = productsController;
