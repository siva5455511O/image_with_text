import express from "express";
import dotenv from "dotenv";
import cors from "cors"
import connectDB from "./config/db.js";
import imagerouter from "./routes/imageroutes.js";
dotenv.config();

const app = express();

app.use(express.json());
app.use(cors())

connectDB()

app.use("/api", imagerouter);

app.listen(process.env.PORT, () => {
  console.log(`server running on ${process.env.PORT}`);
});
