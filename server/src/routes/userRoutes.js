import express from "express";
import {
  userRegisteration,
  userLogin,
  getAllUsers,
} from "../controller/userController.js";
import validate from "../middleware/validate.js";
import {
  userRegisterSchema,
  userLoginSchema,
} from "../validation/userValidation.js";

const router = express.Router();

router.post("/register", validate(userRegisterSchema), userRegisteration);
router.post("/login", validate(userLoginSchema), userLogin);
router.get("/users", getAllUsers);

export default router;
