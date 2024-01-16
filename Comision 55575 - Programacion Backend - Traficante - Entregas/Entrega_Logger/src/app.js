import express from 'express';
import handlebars from 'express-handlebars';
import { __dirname } from '../src/utils.js'
import { Server } from "socket.io";
import { initPassport } from './config/passport.config.js';
import passport from 'passport';
import mongoose from 'mongoose';

import cookieParser from 'cookie-parser';

import UsersRouter from '../src/routes/users.router.js';
import ViewsRouter from '../src/routes/views.router.js';
import CartRouter from '../src/routes/cart.router.js';
import ProductRouter from '../src/routes/products.router.js';
import MessagesRouter from '../src/routes/messages.router.js';

import mockingProductsRouter from './routes/mockingProducts.router.js';

import configs from './config/configs.js'

import { addLogger } from './loggers.js';

//levantar servidor
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

app.use(addLogger);

const usersRouter = new UsersRouter();
const viewsRouter = new ViewsRouter();
const cartRouter = new CartRouter();
const productRouter = new ProductRouter();
const messagesRouter = new MessagesRouter();


// passport:
initPassport();
app.use(passport.initialize());

app.use((req, res, next) => {
  next();
});

app.use(express.static(`${__dirname}/public`));
app.engine("handlebars", handlebars.engine());
app.set("views", `${__dirname}/views`);
app.set("view engine", "handlebars");


//definir routes
app.use('/', viewsRouter.getRouter());
app.use('/api/carts', cartRouter.getRouter());
app.use('/api/products', productRouter.getRouter());
app.use('/api/users', usersRouter.getRouter());
app.use('/api/messages-view', messagesRouter.getRouter());
app.use('/api/mockingproducts', mockingProductsRouter)

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something went wrong!');
});

try {
  await mongoose.connect(configs.mongoUrl);
  console.log('DB connected')
} catch (error) {
  console.error(error.message);
};

const server = app.listen(configs.port, () => {
  console.log(`Connected in ${configs.port}`);
});



const socketServer = new Server(server);

const messages = [];

socketServer.on("connection", (socket) => {
  console.log("Nuevo cliente conectado");

  socket.on("message", (data) => {
    messages.push(data);
    socketServer.emit("messageLogs", messages);
  });

  socket.on("authenticated", (data) => {
    socket.emit("messageLogs", messages);
    socket.broadcast.emit('newUserConnected', data)
  });
});