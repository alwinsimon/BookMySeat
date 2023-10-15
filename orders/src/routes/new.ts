import express, { Request, Response } from "express";

const router = express.Router();

router.post("/api/orders", async (req: Request, res: Response) => {
  res.status(201).send({ status: "newOrderRouter" });
});

export { router as newOrderRouter };
