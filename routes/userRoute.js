import express from "express";
import dotenv from "dotenv";
import {
  getUsers,
  createUser,
  login,
  update,
  getOneUser,
  updateAnotherUser,
} from "../controllers/userController.js";
import { requireSignIn } from "../middlewares/auth.js";

dotenv.config();

const router = express.Router();

router.get("/", requireSignIn, getUsers);

router.get("/:id", requireSignIn, getOneUser);

router.put("/update", requireSignIn, update);

router.put("/:id", requireSignIn, updateAnotherUser);

router.post("/signup", createUser);

router.post("/login", login);

export default router;
