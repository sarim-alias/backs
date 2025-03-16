import express from "express";
import { signup, login, logout } from "../controller/auth.controller.js";
import { adminSignup, adminLogin, adminLogout } from "../controller/admin.auth.controller.js";

const router = express.Router();

// Admin
router.post("/admin/signup", adminSignup);
router.post("/admin/login", adminLogin);
router.post("/admin/logout", adminLogout);

// User
router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);

export default router;