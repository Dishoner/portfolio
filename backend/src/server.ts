import dotenv from "dotenv";
import app from "./app";

// Load environment variables
dotenv.config();

const PORT = 4000;

app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
