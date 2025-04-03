import { Router } from "express";
import { checkAuth, login, logout, signup, updateProfile } from "../controllers/authController.js";
import { protectRoute } from "../middleware/auth.middle.js";

const router = Router();

router.post("/signup", signup);

router.post("/login", login);

router.get("/logout", logout);

router.put("/update-profile",protectRoute,updateProfile);

router.get("/check",protectRoute,checkAuth);

export default router;
