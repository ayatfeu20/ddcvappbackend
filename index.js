//importerar alla packages
import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import userRoutes from "./routes/userRoute.js";
import connectDB from "./config/db.js";
import path from "path";
import ErrorHandler from "./middlewares/errorHandler.js";
import helmet from "helmet";

const app = express();
const __dirname = path.resolve(path.dirname(""));
const PORT = process.env.PORT || 9999;

app.use(express.json({ limit: "25mb" }));
app.use(express.urlencoded({ limit: "25mb", extended: true }));
app.use(cors());
app.use(
  helmet({
    contentSecurityPolicy: false,
  })
);
app.use(bodyParser.json({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.use("/users", userRoutes);

app.use(express.static(path.join(__dirname, "client", "build")));

app.get("/*", (_req, res) => {
  res.sendFile(path.join(__dirname, "client", "build", "index.html"));
});


// app.use(ErrorHandler);

connectDB().then(() => {
  app.listen(PORT, () => console.log(`connected to server on port ${PORT}`));
}).catch(() => {
  console.log("Unable to connect to DB")
});

