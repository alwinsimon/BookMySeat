import express from "express";
import { json } from "body-parser";

const app = express();

app.use(json());

const PORT = 3000;

app.get("/api/users/currentuser", (req, res) => {
  res.send("Hello World!");
});

app.listen(PORT, () => {
  console.log(`AUTH SERVICE listening on PORT: ${PORT} !!!!!`);
});
