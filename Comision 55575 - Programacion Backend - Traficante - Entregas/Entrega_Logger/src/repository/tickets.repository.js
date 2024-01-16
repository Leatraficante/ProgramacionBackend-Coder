import TicketsDao from '../dao/DBManager/classes/tickets.dao.js'


export default class TicketRepository {
    constructor(dao) {
        this.dao = new TicketsDao();
    }

    save = async (ticket) => {
        const result = await this.dao.save(ticket);
        return result;
    }
};