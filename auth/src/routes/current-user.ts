import express from "express";
import jwt from "jsonwebtoken";

const router = express.Router();

router.get("/api/users/currentuser", (req, res) => {
  if (!req.session?.jwt) {
    return res.send({ currentUser: null });
  }

  try {
    const payload = jwt.verify(req.session.jwt, process.env.JWT_KEY!);

    // If the jwt is successfully verified, return the payload.
    return res.send({ currentUser: payload });
  } catch (err) {
    // jwt.verify is going to throw error, if the token validation fails.
    // In that case consider currentUser to be not authenticated and return null.
    return res.send({ currentUser: null });
  }
});

export { router as currentUserRouter };
