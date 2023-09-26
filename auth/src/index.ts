import express from "express";
import { json } from "body-parser";

const app = express();

app.use(json());

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`AUTH SERVICE listening on PORT: ${PORT} !!!!!`);
});
