//importar dependencias
import express from 'express';
import productsRouter from '../src/routes/products.router.js' ;
import cartRouter from '../src/routes/cart.router.js';
import messagesRouter from '../src/routes/messages.router.js';

import viewsRouter from '../src/routes/views.router.js';

import handlebars from 'express-handlebars';
import mongoose from 'mongoose';
import { __dirname } from '../src/utils.js'

import { Server } from "socket.io";



//levantar servidor
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Servidor archivos estaticos
app.use(express.static(`${__dirname}/public`));

//confirugracion de motor de plantillas
app.engine("handlebars", handlebars.engine());
//path absoluto
app.set("views", `${__dirname}/views`);


app.set("view engine", "handlebars");

//definir routes
app.use('/', viewsRouter);
app.use('/api/products', productsRouter);
app.use('/api/carts', cartRouter);
app.use('/api/messages', messagesRouter);


//Establecer conexion a DB:
try {
    //string de conexion (tomar el link de la pag de mongoose; agregar password; agreegar nombre de DB antes del ?retryWrites=....)
    await mongoose.connect('mongodb+srv://leatraficante:d1LWOJnFqJMofzlE@cluster55575lt.lsnu5gt.mongodb.net/EntregaPracticaIntegradora?retryWrites=true&w=majority');
    console.log('DB connected')
} catch (error) {
    console.log(error.message);
    res.status(500).send({ error: error.message });
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
    // enviamos todos los msgs almacenados hasta el momento
    // solo al cliente que se acaba de conectar
    socket.emit("messageLogs", messages);
    socket.broadcast.emit('newUserConnected', data)
  });
});