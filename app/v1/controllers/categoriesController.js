const {
  CustomValidationException,
  NotFoundException,
} = require("../controllers/customExceptions/customExceptions");
const Categories = require("../../../models/Categories");

const categoriesController = {};

categoriesController.createCategory = async (req, res) => {
  try {
    const { category_name } = req.body;

    if (!category_name) {
      return res.status(400).json({ message: "All fields are required!" });
    }

    const existingCategory = await Categories.findOne({ where: { category_name } });

    if (existingCategory) {
      return res.status(400).json({ message: "Oops! Something went wrong." });
    }

    await Categories.create({ category_name });

    const findCategory = await Categories.findOne({ where: { category_name } });

    res.location(`/v1/categories/${findCategory.id}`);

    res.status(201).json({ message: "If created successfully an email will be sent." });
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

categoriesController.getCategory = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 10;

    const offset = (page - 1) * pageSize;

    const categories = await Categories.findAll({
      limit: pageSize,
      offset: offset,
    });

    res.status(200).json({ error: false, categories });
  } catch (error) {
    res.status(500).json({ error: true, message: error.message });
  }
};

categoriesController.getCategoryById = async (req, res) => {
  try {
    const { id } = req.params;

    const category = await Categories.findOne({ where: { id } });

    if (!category) {
      return res
        .status(404)
        .json({ error: true, message: "Oops! Something went wrong." });
    }

    res.status(200).json({ error: false, category });
  } catch (error) {
    res.status(500).json({ error: true, message: error.message });
  }
};

categoriesController.updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { category_name } = req.body;

    if (!category_name) {
      return res.status(400).json({ error: true, message: "All fields are required!" });
    }

    const category = await Categories.findOne({ where: { id } });

    if (!category) {
      return res.status(404).json({ error: true, message: "Results displayed." });
    }

    await category.update({ category_name });

    res
      .status(200)
      .json({ error: false, message: "If updated successfully an email will be sent." });
  } catch (error) {
    res.status(500).json({ error: true, message: error.message });
  }
};

categoriesController.deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const category = await Categories.findOne({ where: { id } });

    if (!category) {
      return res
        .status(404)
        .json({ error: true, message: "Oops! Something went wrong." });
    }

    await category.destroy();

    res
      .status(200)
      .json({ error: false, message: "If deleted successfully an email will be sent." });
  } catch (error) {
    res.status(500).json({ error: true, message: error.message });
  }
};

module.exports = categoriesController;
