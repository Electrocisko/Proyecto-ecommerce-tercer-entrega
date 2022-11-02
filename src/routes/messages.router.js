import { Router } from 'express';
import nodemailer from 'nodemailer';
import dotenvConfig from '../config/dotenv.config.js';
import logger from "../config/winston.config.js";

const router = Router();
let email = dotenvConfig.nodemail.NM_EMAIL;
let code = dotenvConfig.nodemail.NM_CODE;
let addressee = dotenvConfig.nodemail.NM_ADDRESSEE;


const transporter = nodemailer.createTransport({
    service: 'gmail',
    port: 587,
    auth: {
        user: email,
        pass: code
    }
});

router.post('/mail',async (req,res) => {    
    try {
        let listProducts = req.body.Products.products;
        let newList = listProducts.map( (item) =>  {
            return {
                id: item.productId,
                product: item.product,
                price: item.price,
                cuantity: item.cuantity
            }
        })

        let dataHtml = `<p><strong>Pedido de: </strong>${req.body.user}</p>
                        <p> <strong>mail:</strong> ${req.body.email}</p>
                        <p><strong> Userid:</strong> ${req.body.id}</p>
                        <p><strong>Id de carrito:</strong> ${req.body.cartId}</p>
                        <p>${JSON.stringify(newList)}
                        `

        await transporter.sendMail({
            from: 'App Server',
            to: addressee,
            subject: 'Pedido',
            html: dataHtml
            });
           res.send({
            message: 'Mail succes'
           })
            
    } catch (error) {
        logger.log('error',`Error en message ${error}`)
    }
});

export  default router;