import "dotenv/config";
import app from "./app.js";
import pool from "./config/db.js";

const PORT = process.env.PORT || 5000;

try {
  pool.query("SELECT 1");
  console.log("Database is connected");
} catch (err) {
  console.error("Database is failed to connect");
  console.error(`code: ${err.code}`);
  console.error(`message: ${err.message} || (no message)`);

  process.exit(1)
}
app.listen(PORT, () => {
  console.log(`Server is running on PORT ${PORT}`);
});
