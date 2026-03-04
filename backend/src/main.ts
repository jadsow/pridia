import express from "express";
import projectRouter from "./routes";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use("/projects", projectRouter);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
