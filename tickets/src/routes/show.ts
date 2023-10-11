import express, { Request, Response } from "express";
import { Ticket } from "../models/ticket";
import { NotFoundError } from "@bookmyseat/common";

const router = express.Router();

router.get("/api/ticket/:ticketId", async (req: Request, res: Response) => {
  const ticket = Ticket.findById(req.params.ticketId);

  if (!ticket) {
    throw new NotFoundError();
  }

  res.sendStatus(200).send(ticket);
});

export { router as showTicketRouter };
