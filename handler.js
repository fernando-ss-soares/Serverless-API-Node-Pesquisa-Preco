import serverless from "serverless-http";
import express from "express";
import router from "./src/routes/router.js";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();

const app = express();

app.use(
  cors({
    origin: "*",
  })
);

app.use(
  express.urlencoded({
    extended: true,
  })
);

app.use(express.json());

const { DB_URL_CONNECTION } = process.env;

app.use("/auth", router.auth);
app.use("/marketplace/google", router.googleShopping);
app.use("/marketplace/mercadolivre", router.mercadolivre);
app.use("/search/marketplace", router.search);

app.use((req, res, next) => {
  return res.status(404).json({
    error: "Not Found",
  });
});

try {
  mongoose.connect(DB_URL_CONNECTION);
} catch (error) {
  throw new Error(
    JSON.stringify({
      error: {
        message:
          "Não foi possível conectar ao banco de dados. Verificar os logs e tente novamente.",
      },
    })
  );
}

export const handler = serverless(app);
