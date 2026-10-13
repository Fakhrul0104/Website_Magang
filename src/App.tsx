
import { useEffect, useState } from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import HomePage from "./pages/HomePage";
import ManagePage from "./pages/ManagePage";
import type { LinkItem } from "./types/link";

type Page = "home" | "manage";

const API_URL = "http://localhost:3000/api/links";

export default function App() {
  const [page, setPage] = useState<Page>("home");
  const [notice, setNotice] = useState("");
  const [links, setLinks] = useState<LinkItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadLinks() {
      try {
        const response = await fetch(API_URL);

        if (!response.ok) {
          throw new Error("Gagal mengambil data tautan.");
        }

        const data: LinkItem[] = await response.json();
        setLinks(data);
      } catch (error) {
        console.error(error);
        setNotice(
          "Data gagal dimuat. Pastikan backend dan MySQL aktif."
        );
      } finally {
        setLoading(false);
      }
    }

    void loadLinks();
  }, []);

  useEffect(() => {
    if (!notice) return;

    const timeout = window.setTimeout(() => setNotice(""), 4000);
    return () => window.clearTimeout(timeout);
  }, [notice]);

  function navigate(destination: Page) {
    setPage(destination);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function addLink(link: Omit<LinkItem, "id">): Promise<void> {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(link),
    });

    const result = await response.json().catch(() => null);

    if (!response.ok) {
      throw new Error(result?.message || "Gagal menambahkan tautan.");
    }

    // Muat ulang data agar sesuai dengan isi database.
    const refreshed = await fetch(API_URL);

    if (!refreshed.ok) {
      throw new Error("Tautan tersimpan, tetapi daftar gagal diperbarui.");
    }

    const data: LinkItem[] = await refreshed.json();
    setLinks(data);
    setNotice("Tautan baru berhasil ditambahkan.");
  }

  async function deleteLink(id: string): Promise<void> {
    const response = await fetch(
      `${API_URL}/${encodeURIComponent(id)}`,
      { method: "DELETE" }
    );

    if (!response.ok) {
      const result = await response.json().catch(() => null);
      throw new Error(result?.message || "Gagal menghapus tautan.");
    }

    setLinks((current) => current.filter((link) => link.id !== id));
    setNotice("Tautan berhasil dihapus.");
  }

  return (
    <div className="app-shell">
      <Header page={page} onNavigate={navigate} />

      {loading ? (
        <main className="manage-page">
          <p>Memuat data dari database...</p>
        </main>
      ) : page === "home" ? (
        <HomePage
          links={links}
          onManage={() => navigate("manage")}
        />
      ) : (
        <ManagePage
          links={links}
          onBack={() => navigate("home")}
          onAdd={addLink}
          onDelete={deleteLink}
        />
      )}

      {notice && <div className="toast">{notice}</div>}

      <Footer />
    </div>
  );
}