import express from "express";
import { Login, Logout, GetMe } from "../controllers/Auth.js";
const router = express.Router();

router.get("/getme", GetMe);
router.post("/login", Login);
router.delete("/logout", Logout);
export default router;
