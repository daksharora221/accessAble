import express from "express";
import cors from "cors";
import placesRouter from "./routes/places.js";
import feedbackRouter from "./routes/feedback.js";

const app = express();
app.use(cors());
app.use(express.json());
app.use("/api/places", placesRouter);
app.use("/api/places", placesRouter);
app.use("/api/feedback", feedbackRouter);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
