import { Router } from "express";
import { UserController } from "../controllers/user.controller.js";

const router = Router();

router.post('/register', UserController.UserRegister);
router.post('/login', UserController.login);
router.get('/checkAuth', UserController.checkAuth);
router.post('/getEvents', UserController.getAllEvents);
router.post('/createEvent', UserController.createEvent);
router.post('/logout', UserController.logout);// post
//NUEVOS 
router.get('/certificado/:tipo', UserController.generarCertificado);
router.get('/certificado-pdf/:tipo', UserController.generarPDF);

export default router; 