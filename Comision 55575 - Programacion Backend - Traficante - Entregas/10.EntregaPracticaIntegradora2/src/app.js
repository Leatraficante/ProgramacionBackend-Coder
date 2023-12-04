import express from 'express';
import handlebars from 'express-handlebars';
import mongoose from 'mongoose';
import { __dirname } from '../src/utils.js'
import { Server } from "socket.io";
import { initPassport } from './config/passport.config.js';
import passport from 'passport';
import cookieParser from 'cookie-parser';

import UsersRouter from '../src/routes/users.router.js';
import ViewsRouter from '../src/routes/views.router.js';
import CartRouter from '../src/routes/cart.router.js';
import ProductRouter from '../src/routes/products.router.js';
import MessagesRouter from '../src/routes/messages.router.js';




//levantar servidor
const app = express();

app.use(cookieParser());

const usersRouter = new UsersRouter();
const viewsRouter = new ViewsRouter();
const cartRouter = new CartRouter();
const productRouter = new ProductRouter();
const messagesRouter = new MessagesRouter();

// passport:
initPassport();
app.use(passport.initialize());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


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


//Establecer conexion a DB:
try {
  await mongoose.connect('mongodb+srv://leatraficante:d1LWOJnFqJMofzlE@cluster55575lt.lsnu5gt.mongodb.net/PractInteg2?retryWrites=true&w=majority');
  console.log('DB connected')
} catch (error) {
  console.error(error.message);
};

const server = app.listen('8080', console.log('Connected in 8080'));

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