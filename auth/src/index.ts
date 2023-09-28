import express from "express";
import { json } from "body-parser";

import { currentUserRouter } from "./routes/current-user";
import { signInRouter } from "./routes/signIn";
import { signOutRouter } from "./routes/signOut";
import { signUpRouter } from "./routes/signUp";

const app = express();

app.use(json());

const PORT = 3000;


app.use(currentUserRouter);
app.use(signInRouter);
app.use(signOutRouter);
app.use(signUpRouter);


app.listen(PORT, () => {
  console.log(`AUTH SERVICE listening on PORT: ${PORT} !!!!!`);
});
