import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import cors from "cors";

import errorHandler from "./middleware/errorHandler.js";
import userRoutes from "./routes/userRoutes.js";
import conversationRoutes from "./routes/conversationRoutes.js";

const app = express();

// Middlewares
app.use(helmet());
app.use(morgan("dev"));
app.use(cors());
app.use(express.json());

// Routes
app.use("/api", userRoutes);
app.use("/api", conversationRoutes);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

// Error Handler
app.use(errorHandler);

export default app;
