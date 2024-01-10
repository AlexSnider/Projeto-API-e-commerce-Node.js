const Categories = require("../../models/Categories");

const categoriesController = {};

categoriesController.createCategory = async (req, res) => {
  try {
    const { category_name } = req.body;

    if (!category_name) {
      return res.status(400).json({ message: "All fields are required..." });
    }

    const existingCategory = await Categories.findOne({ where: { category_name } });

    if (existingCategory) {
      return res.status(400).json({ message: "Category already exists!" });
    }

    const category = await Categories.create({ category_name });

    res.status(201).json({ message: "Category created successfully!", category });
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

categoriesController.getCategory = async (req, res) => {
  try {
    const categories = await Categories.findAll();

    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

categoriesController.getCategoryById = async (req, res) => {
  try {
    const { id } = req.params;

    const category = await Categories.findOne({ where: { id } });

    if (!category) {
      return res.status(404).json({ message: "Category not found!" });
    }

    res.status(200).json(category);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

categoriesController.updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { category_name } = req.body;

    if (!category_name) {
      return res.status(400).json({ message: "All fields are required..." });
    }

    const category = await Categories.findOne({ where: { id } });

    if (!category) {
      return res.status(404).json({ message: "Category not found!" });
    }

    await category.update({ category_name });

    res.status(200).json({ message: "Category updated successfully!" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

categoriesController.deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const category = await Categories.findOne({ where: { id } });

    if (!category) {
      return res.status(404).json({ message: "Category not found!" });
    }

    await category.destroy();

    res.status(200).json({ message: "Category deleted successfully!" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = categoriesController;
