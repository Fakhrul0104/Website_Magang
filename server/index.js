

import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { randomUUID } from "node:crypto";
import db from "./db.js";

dotenv.config();

const app = express();


const allowedOrigins = [
  "http://localhost:8443",
  "http://127.0.0.1:8443",
  "http://10.101.25.50:8443",
  "http://10.101.26.108:8443",
];

app.use(
  cors({
    origin: allowedOrigins,
    methods: ["GET", "POST", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type"],
  })
);

app.use(express.json({ limit: "10mb" }));

const allowedIcons = [
  "anchor", "ship", "compass",
];

// Mengambil semua tautan aktif untuk halaman utama
app.get("/api/links", async (req, res) => {
  try {
    const [rows] = await db.execute(`
      SELECT
        l.id, l.title, l.description, l.url,
        c.name AS category, l.icon, l.image
      FROM links l
      JOIN categories c ON c.id = l.category_id
      WHERE l.is_active = TRUE
      ORDER BY c.name, l.sort_order, l.title
    `);

    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Gagal mengambil tautan" });
  }
});

// Menambah tautan
app.post("/api/links", async (req, res) => {
  const { title, description, url, category, icon, image } = req.body;

  if (
    !title?.trim() ||
    !url?.trim() ||
    !category?.trim() ||
    !allowedIcons.includes(icon)
  ) {
    return res.status(400).json({ message: "Data tautan tidak valid" });
  }

  const normalizedUrl = /^https?:\/\//i.test(url.trim())
    ? url.trim()
    : `https://${url.trim()}`;

  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();

    await connection.execute(
      "INSERT IGNORE INTO categories (name) VALUES (?)",
      [category.trim()]
    );

    const [categories] = await connection.execute(
      "SELECT id FROM categories WHERE name = ?",
      [category.trim()]
    );

    const categoryId = categories[0].id;
    const id = randomUUID();

    await connection.execute(
      `INSERT INTO links
        (id, category_id, title, description, url, icon, image)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        id,
        categoryId,
        title.trim(),
        (description || "").trim(),
        normalizedUrl,
        icon,
        image || null,
      ]
    );

    await connection.commit();

    res.status(201).json({
      id,
      title: title.trim(),
      description: (description || "").trim(),
      url: normalizedUrl,
      category: category.trim(),
      icon,
      ...(image ? { image } : {}),
    });
  } catch (error) {
    await connection.rollback();
    console.error(error);
    res.status(500).json({ message: "Gagal menambahkan tautan" });
  } finally {
    connection.release();
  }
});

// Menghapus tautan berdasarkan ID
app.delete("/api/links/:id", async (req, res) => {
  try {
    const [result] = await db.execute(
      "DELETE FROM links WHERE id = ?",
      [req.params.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Tautan tidak ditemukan" });
    }

    res.status(204).end();
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Gagal menghapus tautan" });
  }
});

// Tes koneksi
app.get("/api/health", async (req, res) => {
  try {
    await db.query("SELECT 1");
    res.json({ success: true, message: "MySQL terhubung" });
  } catch (error) {
    res.status(500).json({ success: false });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Backend berjalan di port ${PORT}`);
});