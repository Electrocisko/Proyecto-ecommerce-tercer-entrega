import winston, { format } from 'winston';  
import dotenvConfig from './dotenv.config.js';
const { combine, simple, timestamp, printf } = format;

let logLevel = dotenvConfig.app.LOGS

const logger = winston.createLogger({
    format: combine(
        simple(),
        timestamp(),
        printf( info => `[${info.timestamp}] ${info.level} ${info.message}`)
        ),
    transports:[
        new winston.transports.Console({level:logLevel}),
        new winston.transports.File({ filename: 'error.log', level: 'error' }),
        new winston.transports.File({ filename: 'warn.log', level: 'warn' }),
    ]
});

export default logger;