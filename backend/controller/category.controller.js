import Category from "../models/category.model.js";

// Create a new category
export const createCategory = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ error: "Category name is required" });
    }

    const existingCategory = await Category.findOne({ name });
    if (existingCategory) {
      return res.status(400).json({ error: "Category already exists" });
    }

    const newCategory = new Category({ name });
    await newCategory.save();

    res.status(201).json({ message: "Category created successfully!", newCategory });
  } catch (error) {
    console.error("Error creating category:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Get all categories
export const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res.status(200).json(categories);
  } catch (error) {
    console.error("Error fetching categories:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
