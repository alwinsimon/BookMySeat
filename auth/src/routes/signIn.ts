import express, { Request, Response } from "express";
import { body } from "express-validator";

import { validateRequest } from "../middlewares/validate-request";

const router = express.Router();

router.post(
  "/api/users/signin",
  [
    body("email").isEmail().withMessage("Provide a valid email."),
    body("password")
      .trim()
      .notEmpty()
      .withMessage("A password must be provided."),
  ],
  validateRequest,
  (req: Request, res: Response) => {
    res.status(200).send("Hello World!");
  }
);

export { router as signInRouter };
