import "dotenv/config";
import app from "./app.js";
import pool from "./config/db.js";

const PORT = process.env.PORT || 5000;

try {
  await pool.query("SELECT 1");
  console.log("Database is connected");
} catch (err: unknown) {
  console.error("Database is failed to connect");

  if (err instanceof Error) {
    const errs = err as Error & { code?: string };
    console.error(`code: ${errs.code ?? "UNKNOWN_ERROR"}`);
    console.error(`message: ${err.message} || (no message)`);
  } else {
    console.error("Unknown error", err);
  }

  process.exit(1);
}
app.listen(PORT, () => {
  console.log(`Server is running on PORT ${PORT}`);
});
