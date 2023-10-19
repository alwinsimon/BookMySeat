import express, { Request, Response } from "express";
import { requireAuth } from "@bookmyseat/common";
import { Order } from "../models/order";

const router = express.Router();

router.get("/api/orders", requireAuth, async (req: Request, res: Response) => {
  
  // Find all the orders user did and populate them with ticket information
  const orders = await Order.find({ userId: req.currentUser!.id }).populate(
    "ticket"
  );

  res.status(200).send(orders);
});

export { router as indexOrderRouter };
