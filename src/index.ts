import express from "express";
import authRoutes from "./routes/auth.routes";
import mainRoutes from "./routes/main.routes";

const app = express();
app.use(express.json());

app.use("/auth", authRoutes);
app.use("/main", mainRoutes);


const server = app.listen(3000, () => {
  console.log(`
🚀 Server ready at: http://localhost:3000
⭐️ See sample requests: http://pris.ly/e/ts/rest-express#3-using-the-rest-api`);
});
