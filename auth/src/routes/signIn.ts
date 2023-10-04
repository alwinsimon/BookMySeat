import express, { Request, Response } from "express";
import { body, validationResult } from "express-validator";
import { RequestValidationError } from "../errors/request-validation-error";

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
  (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new RequestValidationError(errors.array());
    }

    res.status(200).send("Hello World!");
  }
);

export { router as signInRouter };
