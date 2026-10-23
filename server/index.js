
import express from "express";
import cors from "cors";
import compression from "compression";
import dotenv from "dotenv";
import { randomUUID } from "node:crypto";
import db from "./db.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Konfigurasi
const allowedOrigins = [
  "http://localhost:8443",
  "http://127.0.0.1:8443",
  "http://10.101.25.50:8443",
  "http://10.101.26.108:8443",
];

const allowedIcons = new Set(["anchor", "ship", "compass"]);

// Cache data tautan di memori server
const CACHE_TTL = 5000;
let linksCache = null;
let linksCacheTime = 0;

function invalidateLinksCache() {
  linksCache = null;
  linksCacheTime = 0;
}

function normalizeUrl(value) {
  const input = value.trim();
  const normalized = /^https?:\/\//i.test(input)
    ? input
    : `https://${input}`;

  try {
    const parsed = new URL(normalized);

    if (
      !["http:", "https:"].includes(parsed.protocol) ||
      !parsed.hostname
    ) {
      return null;
    }

    return normalized;
  } catch {
    return null;
  }
}

function validateLink(data) {
  const {
    title,
    url,
    category,
    icon,
  } = data;

  if (
    typeof title !== "string" ||
    !title.trim() ||
    typeof url !== "string" ||
    !url.trim() ||
    typeof category !== "string" ||
    !category.trim() ||
    typeof icon !== "string" ||
    !allowedIcons.has(icon)
  ) {
    return {
      error: "Nama, URL, kategori, atau ikon tidak valid.",
    };
  }

  const normalizedUrl = normalizeUrl(url);

  if (!normalizedUrl) {
    return { error: "Format URL tidak valid." };
  }

  return { normalizedUrl };
}

// Middleware
app.use(compression());

app.use(
  cors({
    origin(origin, callback) {
      // Memungkinkan request tanpa Origin, misalnya health check
      // dari alat lokal. Akses tanpa Origin bukan autentikasi.
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Origin tidak diizinkan oleh CORS"));
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type"],
  })
);

// Tetap 10 MB karena frontend mungkin mengirim gambar Base64.
// Lebih baik simpan gambar sebagai file dan kirim URL-nya.
app.use(express.json({ limit: "10mb" }));

// Mengambil semua tautan aktif
app.get("/api/links", async (req, res) => {
  try {
    const now = Date.now();

    if (
      linksCache &&
      now - linksCacheTime < CACHE_TTL
    ) {
      res.set("Cache-Control", "no-store");
      return res.json(linksCache);
    }

    const [rows] = await db.execute(`
      SELECT
        l.id,
        l.title,
        l.description,
        l.url,
        c.name AS category,
        l.icon,
        l.image
      FROM links AS l
      INNER JOIN categories AS c
        ON c.id = l.category_id
      WHERE l.is_active = TRUE
      ORDER BY c.name, l.sort_order, l.title
    `);

    linksCache = rows;
    linksCacheTime = Date.now();

    // Hindari cache browser yang menyajikan data lama.
    // Cache singkat dikelola di backend.
    res.set("Cache-Control", "no-store");
    return res.json(rows);
  } catch (error) {
    console.error("Gagal mengambil tautan:", error);
    return res.status(500).json({
      message: "Gagal mengambil tautan.",
    });
  }
});

// Menambah tautan
app.post("/api/links", async (req, res) => {
  const {
    title,
    description,
    url,
    category,
    icon,
    image,
  } = req.body;

  const validation = validateLink(req.body);

  if (validation.error) {
    return res.status(400).json({
      message: validation.error,
    });
  }

  if (
    description != null &&
    typeof description !== "string"
  ) {
    return res.status(400).json({
      message: "Deskripsi tidak valid.",
    });
  }

  if (
    image != null &&
    typeof image !== "string"
  ) {
    return res.status(400).json({
      message: "Format gambar tidak valid.",
    });
  }

  let connection;

  try {
    connection = await db.getConnection();
    await connection.beginTransaction();

    await connection.execute(
      "INSERT IGNORE INTO categories (name) VALUES (?)",
      [category.trim()]
    );

    const [categories] = await connection.execute(
      "SELECT id FROM categories WHERE name = ? LIMIT 1",
      [category.trim()]
    );

    if (categories.length === 0) {
      throw new Error("Kategori tidak ditemukan.");
    }

    const id = randomUUID();
    const cleanDescription = description?.trim() ?? "";

    await connection.execute(
      `INSERT INTO links
        (id, category_id, title, description, url, icon, image)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        id,
        categories[0].id,
        title.trim(),
        cleanDescription,
        validation.normalizedUrl,
        icon,
        image || null,
      ]
    );

    await connection.commit();
    invalidateLinksCache();

    return res.status(201).json({
      id,
      title: title.trim(),
      description: cleanDescription,
      url: validation.normalizedUrl,
      category: category.trim(),
      icon,
      image: image || null,
    });
  } catch (error) {
    if (connection) {
      try {
        await connection.rollback();
      } catch (rollbackError) {
        console.error("Rollback gagal:", rollbackError);
      }
    }

    console.error("Gagal menambahkan tautan:", error);

    return res.status(500).json({
      message: "Gagal menambahkan tautan.",
    });
  } finally {
    connection?.release();
  }
});

// Memperbarui tautan
app.put("/api/links/:id", async (req, res) => {
  const {
    title,
    description,
    url,
    category,
    icon,
    image,
  } = req.body;

  const validation = validateLink(req.body);

  if (validation.error) {
    return res.status(400).json({
      message: validation.error,
    });
  }

  if (
    (description != null && typeof description !== "string") ||
    (image != null && typeof image !== "string")
  ) {
    return res.status(400).json({
      message: "Deskripsi atau gambar tidak valid.",
    });
  }

  let connection;

  try {
    connection = await db.getConnection();
    await connection.beginTransaction();

    await connection.execute(
      "INSERT IGNORE INTO categories (name) VALUES (?)",
      [category.trim()]
    );

    const [categories] = await connection.execute(
      "SELECT id FROM categories WHERE name = ? LIMIT 1",
      [category.trim()]
    );

    if (categories.length === 0) {
      throw new Error("Kategori tidak ditemukan.");
    }

    const [result] = await connection.execute(
      `UPDATE links
       SET category_id = ?,
           title = ?,
           description = ?,
           url = ?,
           icon = ?,
           image = ?
       WHERE id = ?`,
      [
        categories[0].id,
        title.trim(),
        description?.trim() ?? "",
        validation.normalizedUrl,
        icon,
        image || null,
        req.params.id,
      ]
    );

    if (result.affectedRows === 0) {
      // MySQL dapat melaporkan 0 jika data tidak berubah.
      const [existing] = await connection.execute(
        "SELECT id FROM links WHERE id = ? LIMIT 1",
        [req.params.id]
      );

      if (existing.length === 0) {
        await connection.rollback();

        return res.status(404).json({
          message: "Tautan tidak ditemukan.",
        });
      }
    }

    await connection.commit();
    invalidateLinksCache();

    return res.json({
      id: req.params.id,
      title: title.trim(),
      description: description?.trim() ?? "",
      url: validation.normalizedUrl,
      category: category.trim(),
      icon,
      image: image || null,
    });
  } catch (error) {
    if (connection) {
      try {
        await connection.rollback();
      } catch (rollbackError) {
        console.error("Rollback gagal:", rollbackError);
      }
    }

    console.error("Gagal memperbarui tautan:", error);

    return res.status(500).json({
      message: "Gagal memperbarui tautan.",
    });
  } finally {
    connection?.release();
  }
});

// Menghapus tautan
app.delete("/api/links/:id", async (req, res) => {
  try {
    const [result] = await db.execute(
      "DELETE FROM links WHERE id = ?",
      [req.params.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: "Tautan tidak ditemukan.",
      });
    }

    invalidateLinksCache();

    return res.status(204).end();
  } catch (error) {
    console.error("Gagal menghapus tautan:", error);

    return res.status(500).json({
      message: "Gagal menghapus tautan.",
    });
  }
});

// Health check
app.get("/api/health", async (req, res) => {
  try {
    await db.query("SELECT 1");
    return res.json({
      success: true,
      message: "MySQL terhubung",
    });
  } catch (error) {
    console.error("Health check gagal:", error);

    return res.status(503).json({
      success: false,
      message: "Database tidak tersedia",
    });
  }
});

// Daftarkan seluruh route sebelum menjalankan server.
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Backend berjalan di port ${PORT}`);
});
