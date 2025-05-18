import { Router } from "express";
import { UserController } from "../controllers/user.controller.js";

const router = Router();

router.post('/register', UserController.UserRegister);
router.post('/login', UserController.login);
router.get('/checkAuth', UserController.checkAuth);
//router.get('/auth/google', UserController.authUrl);
//router.get('/redirect', UserController.googleRedirect);
router.post('/createEvent', UserController.createEvent);
router.get('/logout', UserController.logout);// post
export default router; 