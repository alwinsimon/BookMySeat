import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

interface UserPayload {
  id: string;
  email: string;
}

declare global {
  namespace Express {
    interface Request {
      currentUser?: UserPayload;
    }
  }
}

export const currentUser = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.session?.jwt) {
    // If there is no jwt, pass on to the next function
    return next();
  }

  // If there is a jwt present
  try {
    const payload = jwt.verify(
      req.session.jwt,
      process.env.JWT_KEY!
    ) as UserPayload;

    // If the jwt is successfully verified, return the payload.
    req.currentUser = payload;
  } catch (err) {
    // jwt.verify is going to throw error, if the token validation fails.
    // It can be ignored as we have nothing to do in this middleware about this particular error.
  }

  next();
};
