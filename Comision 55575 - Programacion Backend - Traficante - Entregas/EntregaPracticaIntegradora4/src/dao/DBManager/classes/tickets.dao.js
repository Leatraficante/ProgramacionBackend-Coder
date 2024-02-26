import ticketModel from "../models/tickets.model.js";

export default class TicketDao {
    save = async (ticket) => {
        return await ticketModel.create(ticket);
      };
};