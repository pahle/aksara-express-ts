import express from "express";
import authRoutes from "./routes/auth.routes";
import mainRoutes from "./routes/main.routes";
import usersRoutes from "./routes/users.routes";
import { Response } from "express";

const app = express();
app.use(express.json());

app.use("/auth", authRoutes);
app.use("", mainRoutes);
app.use("", usersRoutes);

// create a / route to test the server

app.get("/", (res: Response) => {
  res.json({ message: "Server is up and running" });
});

const server = app.listen(3000, () => {
  console.log(`
🚀 Server ready at: http://localhost:3000
⭐️ See sample requests: http://pris.ly/e/ts/rest-express#3-using-the-rest-api`);
});
