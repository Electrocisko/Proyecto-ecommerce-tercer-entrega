import dotenv from 'dotenv';

let aux = process.env.NODE_ENV+'.env'

dotenv.config({
    path: aux
});

export default {
    app: {
        PORT:process.env.PORT,
        NODE_ENV: process.env.NODE_ENV || 'development',
        HOST: process.env.HOST || '127.0.0.1',
        LOGS: process.env.LOGS || 'silly'
    },
    mongo:{
        MONGO_URL: process.env.MONGO_URL 
    },
    jwt: {
        SECRET: process.env.JWT_SECRET,
        COOKIE: process.env.JWT_COOKIE
    },
    nodemail: {
        NM_EMAIL: process.env.NM_EMAIL,
        NM_CODE: process.env.NM_CODE,
        NM_ADDRESSEE: process.env.NM_ADDRESSEE
    }
}