import { Router } from "express";
import logger from "../config/winston.config.js";
import dotenvConfig from "../config/dotenv.config.js";
import jwt from 'jsonwebtoken';

const router = new Router();

router.get('/register', async (req,res) => {
    logger.log('info',`request type ${req.method} en route ${req.path} ${new Date()}`)
    res.render('register')
});

router.get('/login', async (req,res) => {
    logger.log('info',`request type ${req.method} en route ${req.path} ${new Date()}`)
    res.render('login')
});

router.get('/',async (req,res) => {
    logger.log('info',`request type ${req.method} en route ${req.path} ${new Date()}`)
    res.render('index')
});

router.get('/menu',(req,res) => {
    logger.log('info',`request type ${req.method} en route ${req.path} ${new Date()}`)
    try {
        const token = req.cookies[dotenvConfig.jwt.COOKIE];
        if(!token) res.render('login');
        const user = jwt.verify(token,dotenvConfig.jwt.SECRET);
        logger.log('debug',`user: ${JSON.stringify(user)}`)
        res.render('menu',{user: user});
    } catch (error) {
        logger.log('error', `Error en route menu ${error}`)
    }
});

router.get('/cart',(req,res) => {
    logger.log('info',`request type ${req.method} en route ${req.path} ${new Date()}`)
    try {
        const token = req.cookies[dotenvConfig.jwt.COOKIE];
        if(!token) res.render('login');
        const user = jwt.verify(token,dotenvConfig.jwt.SECRET);
        res.render('cart',{user: user});
    } catch (error) {
        logger.log('error', `Error en route menu ${error}`)
    }
});


router.get('/enterproducts',(req,res) => {
    logger.log('info',`request type ${req.method} en route ${req.path} ${new Date()}`)
    try {
        const token = req.cookies[dotenvConfig.jwt.COOKIE];
        if(!token) res.render('login');
        const user = jwt.verify(token,dotenvConfig.jwt.SECRET);
        console.log(user.admin)
        if(!user.admin) {res.render('errorAdmin')}
        else {
            res.render('adminProducts');
        }
    } catch (error) {
        logger.log('error', `Error en route menu ${error}`)
    }
});


router.get('/modifproducts',(req,res) => {
    logger.log('info',`request type ${req.method} en route ${req.path} ${new Date()}`)
    try {
        const token = req.cookies[dotenvConfig.jwt.COOKIE];
        if(!token) res.render('login');
        const user = jwt.verify(token,dotenvConfig.jwt.SECRET);
        console.log(user.admin)
        if(!user.admin) {res.render('errorAdmin')}
        else {
            res.render('modifProducts');
        }
    } catch (error) {
        logger.log('error', `Error en route menu ${error}`)
    }
});




router.get('/errorlogin',(req,res) => {
    logger.log('info',`request type ${req.method} en route ${req.path} ${new Date()}`)
    res.render('errorLogin')
});

router.get('/errorregister', (req,res) => {
    logger.log('info',`request type ${req.method} en route ${req.path} ${new Date()}`)
    res.render('errorRegister');
});

export default router;

