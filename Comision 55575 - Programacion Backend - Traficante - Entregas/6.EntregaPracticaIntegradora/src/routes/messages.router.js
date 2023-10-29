import { Router } from "express";
import Messages from '../dao/FileManager/MessagesManager.js';

const messagesRouter = Router();
const messagesManager = new Messages();

messagesRouter.get("/", async (req, res) => {
  try {
    let messages = await messagesManager.getAll();
    res.render("chat", { messages });
  } catch (error) {
    res.status(500).send({ status: 'error', message: error.message })
  }
});




export default messagesRouter;
