import { Request, Response, NextFunction } from "express";
import { NotAuthorizedError } from "../errors/not-authorized-error";

export const requireAuth = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.currentUser) {
    // If there is no currentUser property (Added by currentUser middleware if there is a valid jwt) in the request object,
    // Either the currentUser middleware was not called or the user/userData is found invalid by the currentUser middleware
    // In both cases, throw error denoting that the user is not authorized to access the requested resource.
    throw new NotAuthorizedError();
  }

  // If currentUser property (Added by currentUser middleware if there is a valid jwt) in the request object - User is Authorized
  // Allow the request to proceed by calling the next function.
  next();
};
