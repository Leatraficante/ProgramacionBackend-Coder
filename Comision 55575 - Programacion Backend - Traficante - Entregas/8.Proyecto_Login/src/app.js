import express from 'express';
import viewsRouter from '../src/routes/views.router.js';
import productsRouter from '../src/routes/products.router.js' ;
import cartRouter from '../src/routes/cart.router.js';
import messagesRouter from '../src/routes/messages.router.js';
import sessionsRouter from './routes/sessions.router.js';
import session from 'express-session';
import handlebars from 'express-handlebars';
import mongoose from 'mongoose';
import { __dirname } from '../src/utils.js'
import { Server } from "socket.io";
import MongoStore from 'connect-mongo';


//levantar servidor
const app = express();

//Establecer conexion a DB:
try {
  await mongoose.connect('mongodb+srv://leatraficante:d1LWOJnFqJMofzlE@cluster55575lt.lsnu5gt.mongodb.net/EntregaProyectoLogin?retryWrites=true&w=majority');
  console.log('DB connected')
} catch (error) {
  console.error(error.message);
};

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Servidor archivos estaticos
app.use(express.static(`${__dirname}/public`));

//confirugracion de motor de plantillas
app.engine("handlebars", handlebars.engine());
//path absoluto
app.set("views", `${__dirname}/views`);


app.set("view engine", "handlebars");

app.use(session({ //ESTO DEBE ESTAR SETEADO ANTES QUE LAS RUTAS PARA QUE FUNCIONE
  store: MongoStore.create({
      client: mongoose.connection.getClient(),
      ttl: 3600
  }),
  secret: 'Coder5575secret',
  resave: true,
  saveUninitialized: true, 

}));

//definir routes
app.use('/', viewsRouter);
app.use('/api/products', productsRouter);
app.use('/api/carts', cartRouter);
app.use('/api/messages', messagesRouter);
app.use('/api/sessions', sessionsRouter);


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