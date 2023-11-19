import { Router } from "express";
import Messages from '../dao/DBManager/MessagesManager.js'

const messagesRouter = Router();
const messagesManager = new Messages();

messagesRouter.get("/", async (req, res) => {
  try {
    let messages = await messagesManager.getAll();
    res.status(200).json({ status: 'success', messages });
  } catch (error) {
    res.status(500).send({ status: 'error', message: error.message })
  }
});

messagesRouter.post("/", async (req, res) => {
  const { user, message } = req.body;
  try {
    const nuevoMensaje = await messagesManager.createNewMessage(user, message);
    res.status(200).json({ status: 'success', message: 'Message created', data: nuevoMensaje });
  } catch (error) {
    res.status(500).send({ status: 'error', message: error.message });
  }
});

messagesRouter.post("/", async (req, res) => {
  const { user, message } = req.body;
  try {
    const nuevoMensaje = await messagesManager.createNewMessage(user, message);
    res.status(200).json({ status: 'success', message: 'Message created', data: nuevoMensaje });
  } catch (error) {
    res.status(500).send({ status: 'error', message: error.message });
  }
});

export default messagesRouter;

