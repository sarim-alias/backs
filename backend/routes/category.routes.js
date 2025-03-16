import express from "express";
import { createCategory, getAllCategories } from "../controller/category.controller.js";
import Category from "../models/category.model.js";

const router = express.Router();

// Category.
router.post("/create", createCategory);
router.get("/", getAllCategories);

export default router;
