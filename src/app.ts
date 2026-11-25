import express from "express";
import errorHandler from "./middlewares/errorhandler.js";
import adminAuthRoute from "./modules/admin/admin.routes.js";
import notFound from "./middlewares/notFound.js";

const app = express();

app.use(express.json());
app.use("/api/v1/admin", adminAuthRoute);

app.use(notFound);
app.use(errorHandler);

export default app;
