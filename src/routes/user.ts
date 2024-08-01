import express from 'express';
import * as UserController from '@/controllers/user';
import { isAuth, Fresh_isAuth } from '@/middlewares/index';

const router = express.Router();

router.get('/dummy-data', isAuth, UserController.getData);

router.post('/register', UserController.signup);

router.post('/login', UserController.login);

router.post('/change-password', isAuth, UserController.EditPassword);

router.post('/Validate_refresh_token', Fresh_isAuth, UserController.Validate_refresh_token);

export default router;
