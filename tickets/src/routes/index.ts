import express, { Request, Response } from "express";
import { Ticket } from "../models/ticket";

const router = express.Router();

router.get("/api/tickets", async (req: Request, res: Response) => {
  
  // Fetch all Tickets that are available to make a booking (ie, which are not reserved by any order)
  const tickets = await Ticket.find({orderId: undefined});

  res.send(tickets);
});

export { router as indexTicketRouter };
