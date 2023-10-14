import express, { Request, Response } from "express";
import { Ticket } from "../models/ticket";
import { NotFoundError } from "@bookmyseat/common";

const router = express.Router();

router.get("/api/tickets/:ticketId", async (req: Request, res: Response) => {
  const ticket = await Ticket.findById(req.params.ticketId);

  if (!ticket) {
    throw new NotFoundError();
  }

  res.send(ticket);
});

export { router as showTicketRouter };
