import express, { Request, Response } from "express";

const router = express.Router();

router.get("/api/orders", async (req: Request, res: Response) => {
  res.status(200).send({ status: "indexOrderRouter" });
});

export { router as indexOrderRouter };
