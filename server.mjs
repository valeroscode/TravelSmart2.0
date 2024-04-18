import express, { static as expressStatic } from "express";
import { fileURLToPath } from "url";
import { join, dirname } from "path";
const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Serve static files from the 'build' directory
app.use(expressStatic(join(__dirname, "/build")));

// Handle all other routes by serving 'index.html'
app.get("*", (req, res) => {
  res.sendFile(join(__dirname, "/build/index.html"));
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
