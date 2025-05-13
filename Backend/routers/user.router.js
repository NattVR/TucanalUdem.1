import { Router } from "express";
import { UserController } from "../controllers/user.controller.js";

const router = Router();

router.post('/register', UserController.UserRegister);
router.post('/login', UserController.login);
router.get('/auth/google', UserController.authUrl);
router.get('/redirect', UserController.googleRedirect);
router.post('/createEvent', UserController.createEvent);
export default router; 