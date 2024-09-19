"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const main_routes_1 = __importDefault(require("./routes/main.routes"));
const users_routes_1 = __importDefault(require("./routes/users.routes"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use("/auth", auth_routes_1.default);
app.use(main_routes_1.default);
app.use(users_routes_1.default);
app.get("/", (res) => {
    res.json({ message: "Server is up and running" });
});
const server = app.listen(3000, () => {
    console.log(`
🚀 Server ready at: http://localhost:3000
⭐️ See sample requests: http://pris.ly/e/ts/rest-express#3-using-the-rest-api`);
});
//# sourceMappingURL=index.js.map