import express from "express";
import __dirname from "./utils.js";
import productsRouter from "./routes/products.router.js";
import cartsRouter from "./routes/carts.router.js";
import messagesRouter from './routes/messages.router.js';
import usersRouter from './routes/users.router.js';
import viewsRouter from './routes/views.router.js';
import sessionsRouter from './routes/sessions.router.js';
import {engine} from "express-handlebars";
import initializePassport from "./config/passport.config.js";
import passport from "passport";
import dotenvConfig from "./config/dotenv.config.js";
import logger from "./config/winston.config.js";
import services from './dao/index.js';
import cluster from 'cluster';
import os from 'os';
import cookieParser from "cookie-parser";


// initializations
const app = express();
const PORT = dotenvConfig.app.PORT || 8080;
const modoCluster = process.argv[2] == 'CLUSTER'
const numCPUs = os.cpus().length;

// settings
app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views',__dirname+'/views');

// middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/", express.static(__dirname + "/public"));
app.use(cookieParser());
initializePassport();
app.use(passport.initialize());

// routes
app.use("/api/carts", cartsRouter);
app.use('/api/messages',messagesRouter);
app.use("/api/products", productsRouter);
app.use('/api/users', usersRouter );
app.use('/api/sessions', sessionsRouter);
app.use('/',viewsRouter);
app.use(function (req, res, next) {
  res.status(404).send({
    message: "Error route not implemented",
  });
});


// Starting the server app
if(modoCluster && cluster.isPrimary) {
  logger.log('info', `Master ${process.pid} process is running`)

  for (let i=0; i<numCPUs;i++){
    cluster.fork();
  };

  cluster.on('exit', worker => {
    logger.log('info', `Worker ${worker.process.pid} died ${new Date().toLocaleString()}`);
    cluster.fork();
  })

} else {
  app.listen(PORT, () => {
    logger.log('info', `server listening on http://localhost:${PORT} process: ${process.pid}`);
    logger.log('info',`Persistence: ${services.persistence}`)
  });
}



