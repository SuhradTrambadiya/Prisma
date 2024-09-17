import express from "express";
import "dotenv/config";

import userRoutes from "./Routes/User.Routes"; // No need for ".js" extension in TypeScript
import taskRoutes from "./Routes/Task.Routes";
const app = express();

// Middleware to parse JSON bodies
app.use(express.json());

const port = process.env.PORT || 3000;

app.get("/", (req, res) => {
  return res.send("hi");
});

// Use the user routes
app.use("/User", userRoutes); // Use app.use instead of app.route
app.use("/task", taskRoutes);
app.listen(port, () => {
  console.log(`App is running on port ${port}`);
});
