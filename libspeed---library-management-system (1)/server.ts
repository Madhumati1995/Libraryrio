import express from "express";
import { createServer as createViteServer } from "vite";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;
  const DB_PATH = path.join(__dirname, "books.json");
  const USERS_PATH = path.join(__dirname, "users.json");

  app.use(express.json());

  // Helper to read DB
  const readDB = async (filePath: string) => {
    try {
      const data = await fs.readFile(filePath, "utf-8");
      return JSON.parse(data);
    } catch (error) {
      return [];
    }
  };

  // Helper to write DB
  const writeDB = async (filePath: string, data: any) => {
    await fs.writeFile(filePath, JSON.stringify(data, null, 2));
  };

  // API Routes for Books
  app.get("/api/books", async (req, res) => {
    const books = await readDB(DB_PATH);
    res.json(books);
  });

  app.post("/api/books", async (req, res) => {
    const books = await readDB(DB_PATH);
    const newBook = { ...req.body, id: Math.random().toString(36).substr(2, 9) };
    books.push(newBook);
    await writeDB(DB_PATH, books);
    res.status(201).json(newBook);
  });

  app.put("/api/books/:id", async (req, res) => {
    const { id } = req.params;
    let books = await readDB(DB_PATH);
    const index = books.findIndex((b: any) => b.id === id);
    if (index !== -1) {
      books[index] = { ...books[index], ...req.body };
      await writeDB(DB_PATH, books);
      res.json(books[index]);
    } else {
      res.status(404).send("Book not found");
    }
  });

  app.delete("/api/books/:id", async (req, res) => {
    const { id } = req.params;
    let books = await readDB(DB_PATH);
    books = books.filter((b: any) => b.id !== id);
    await writeDB(DB_PATH, books);
    res.status(204).send();
  });

  // API Routes for Users
  app.get("/api/users", async (req, res) => {
    const users = await readDB(USERS_PATH);
    res.json(users);
  });

  app.post("/api/users", async (req, res) => {
    const users = await readDB(USERS_PATH);
    const newUser = { ...req.body, id: "u" + Math.random().toString(36).substr(2, 5) };
    users.push(newUser);
    await writeDB(USERS_PATH, users);
    res.status(201).json(newUser);
  });

  app.put("/api/users/:id", async (req, res) => {
    const { id } = req.params;
    let users = await readDB(USERS_PATH);
    const index = users.findIndex((u: any) => u.id === id);
    if (index !== -1) {
      users[index] = { ...users[index], ...req.body };
      await writeDB(USERS_PATH, users);
      res.json(users[index]);
    } else {
      res.status(404).send("User not found");
    }
  });

  app.delete("/api/users/:id", async (req, res) => {
    const { id } = req.params;
    let users = await readDB(USERS_PATH);
    users = users.filter((u: any) => u.id !== id);
    await writeDB(USERS_PATH, users);
    res.status(204).send();
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
