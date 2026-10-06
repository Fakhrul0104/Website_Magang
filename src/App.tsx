import { ChangeEvent, FormEvent, useEffect, useMemo, useRef, useState } from "react";
import pelindoLogo from "./assets/pelindo-logo.png";

type IconName =
  | "anchor"
  | "ship"
  | "compass"
  | "map"
  | "radio"
  | "cloud"
  | "book"
  | "users"
  | "globe"
  | "box";

type LinkItem = {
  id: string;
  title: string;
  description: string;
  url: string;
  category: string;
  icon: IconName;
  image?: string;
};

const categories = ["Operasional", "Navigasi & Cuaca", "Administrasi"];

const initialLinks: LinkItem[] = [
  {
    id: "1",
    title: "Marine Traffic",
    description: "Pantau posisi kapal secara langsung",
    url: "https://www.marinetraffic.com",
    category: "Operasional",
    icon: "ship",
  },
  {
    id: "2",
    title: "Jadwal Sandar",
    description: "Informasi kedatangan dan keberangkatan",
    url: "https://www.pelindo.co.id",
    category: "Operasional",
    icon: "anchor",
  },
  {
    id: "3",
    title: "Cargo Portal",
    description: "Pelacakan dan status kargo",
    url: "https://www.insw.go.id",
    category: "Operasional",
    icon: "box",
  },
  {
    id: "4",
    title: "Peta Laut",
    description: "Peta perairan dan jalur pelayaran",
    url: "https://www.google.com/maps",
    category: "Navigasi & Cuaca",
    icon: "map",
  },
  {
    id: "5",
    title: "Prakiraan Maritim",
    description: "Cuaca, gelombang, dan arah angin",
    url: "https://maritim.bmkg.go.id",
    category: "Navigasi & Cuaca",
    icon: "cloud",
  },
  {
    id: "6",
    title: "Sistem Radio",
    description: "Frekuensi dan kanal komunikasi",
    url: "https://www.postel.go.id",
    category: "Navigasi & Cuaca",
    icon: "radio",
  },
  {
    id: "7",
    title: "Otoritas Pelabuhan",
    description: "Layanan resmi kepelabuhanan",
    url: "https://hubla.dephub.go.id",
    category: "Administrasi",
    icon: "globe",
  },
  {
    id: "8",
    title: "Dokumen Kapal",
    description: "Arsip dan pengurusan dokumen",
    url: "https://simlala.dephub.go.id",
    category: "Administrasi",
    icon: "book",
  },
  {
    id: "9",
    title: "Direktori Agen",
    description: "Kontak agen dan mitra pelabuhan",
    url: "https://www.inaportnet.com",
    category: "Administrasi",
    icon: "users",
  },
];

const iconPaths: Record<IconName, React.ReactNode> = {
  anchor: (
    <>
      <path d="M12 3v17M8 7h8M5 13a7 7 0 0 0 14 0M5 13l-2 2M19 13l2 2" />
      <circle cx="12" cy="3" r="2" />
    </>
  ),
  ship: (
    <>
      <path d="m4 18 2-8h12l2 8M8 10V6h8v4M12 6V3M3 18c2 0 2 2 4 2s2-2 4-2 2 2 4 2 2-2 4-2 2 2 3 2" />
    </>
  ),
  compass: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="m15.5 8.5-2 5-5 2 2-5 5-2Z" />
    </>
  ),
  map: (
    <>
      <path d="m3 6 6-3 6 3 6-3v15l-6 3-6-3-6 3V6Z" />
      <path d="M9 3v15M15 6v15" />
    </>
  ),
  radio: (
    <>
      <rect x="4" y="8" width="16" height="12" rx="2" />
      <path d="m7 8 10-5M8 13h3M8 16h3" />
      <circle cx="16" cy="15" r="2.5" />
    </>
  ),
  cloud: (
    <>
      <path d="M6 17a4 4 0 1 1 1-7.87A5.5 5.5 0 0 1 17.5 11H18a3 3 0 0 1 0 6H6Z" />
      <path d="M8 21h8" />
    </>
  ),
  book: (
    <>
      <path d="M4 5a3 3 0 0 1 3-2h5v17H7a3 3 0 0 0-3 2V5ZM20 5a3 3 0 0 0-3-2h-5v17h5a3 3 0 0 1 3 2V5Z" />
    </>
  ),
  users: (
    <>
      <circle cx="9" cy="8" r="3" />
      <path d="M3 20a6 6 0 0 1 12 0M16 5a3 3 0 0 1 0 6M17 14a5 5 0 0 1 4 5" />
    </>
  ),
  globe: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18" />
    </>
  ),
  box: (
    <>
      <path d="m4 7 8-4 8 4-8 4-8-4ZM4 7v10l8 4 8-4V7M12 11v10" />
    </>
  ),
};

function Icon({ name, size = 24 }: { name: IconName; size?: number }) {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      height={size}
      viewBox="0 0 24 24"
      width={size}
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.6"
    >
      {iconPaths[name]}
    </svg>
  );
}

function optimizeImage(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("Gambar tidak dapat dibaca"));
    reader.onload = () => {
      const image = new Image();
      image.onerror = () => reject(new Error("Format gambar tidak didukung"));
      image.onload = () => {
        const maxSize = 480;
        const scale = Math.min(1, maxSize / Math.max(image.width, image.height));
        const canvas = document.createElement("canvas");
        canvas.width = Math.round(image.width * scale);
        canvas.height = Math.round(image.height * scale);
        const context = canvas.getContext("2d");
        if (!context) {
          reject(new Error("Gambar tidak dapat diproses"));
          return;
        }
        context.drawImage(image, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL("image/webp", 0.82));
      };
      image.src = String(reader.result);
    };
    reader.readAsDataURL(file);
  });
}

function Header({
  page,
  onNavigate,
}: {
  page: "home" | "manage";
  onNavigate: (page: "home" | "manage") => void;
}) {
  return (
    <header className="site-header">
      <button className="brand" onClick={() => onNavigate("home")} aria-label="Kembali ke beranda">
        <img src={pelindoLogo} alt="Pelindo" />
        <span className="brand-divider" />
        <small>Portal<br />Informasi</small>
      </button>
      <nav aria-label="Navigasi utama">
        <button className={page === "home" ? "active" : ""} onClick={() => onNavigate("home")}>
          Beranda
        </button>
        <button className={page === "manage" ? "active" : ""} onClick={() => onNavigate("manage")}>
          Kelola Tautan
        </button>
      </nav>
    </header>
  );
}

function HomePage({
  links,
  onManage,
}: {
  links: LinkItem[];
  onManage: () => void;
}) {
  const [query, setQuery] = useState("");
  const visibleLinks = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return links;
    return links.filter((link) =>
      `${link.title} ${link.description} ${link.category}`.toLowerCase().includes(normalized),
    );
  }, [links, query]);

  return (
    <main>
      <section className="hero">
        <img
          src="https://images.unsplash.com/photo-1582517339790-63168430ee86?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&q=85&w=1800"
          alt="Mercusuar putih di tepi laut saat matahari terbenam"
        />
        <div className="hero-overlay" />
        <div className="hero-content">
          <div className="eyebrow"><span /> Pusat Akses Pelabuhan <span /></div>
          <h1>Gerbang Informasi<br /><em>Pelabuhan Indonesia</em></h1>
          <p>Satu akses terpadu untuk layanan, operasional, dan informasi maritim Pelindo.</p>
          <label className="search-box">
            <Icon name="compass" size={22} />
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Cari layanan, portal, atau informasi..."
              aria-label="Cari layanan"
            />
            <kbd>⌘ K</kbd>
          </label>
        </div>
        <div className="coordinates">06° 07' S &nbsp;—&nbsp; 106° 53' E</div>
      </section>

      <section className="portal-section">
        <div className="section-heading">
          <div>
            <span className="section-kicker">DIREKTORI DIGITAL</span>
            <h2>Portal Layanan</h2>
          </div>
          <p>Pilih tujuan Anda dan berlayar menuju informasi yang dibutuhkan.</p>
        </div>

        {categories.map((category, index) => {
          const categoryLinks = visibleLinks.filter((link) => link.category === category);
          if (categoryLinks.length === 0) return null;
          return (
            <div className="category-block" key={category}>
              <div className="category-title">
                <span>{String(index + 1).padStart(2, "0")}</span>
                <h3>{category}</h3>
                <div />
              </div>
              <div className="link-grid">
                {categoryLinks.map((link) => (
                  <a className="link-card" href={link.url} target="_blank" rel="noreferrer" key={link.id}>
                    <span className={`icon-frame${link.image ? " has-image" : ""}`}>
                      {link.image ? <img src={link.image} alt="" /> : <Icon name={link.icon} size={28} />}
                    </span>
                    <span className="card-copy">
                      <strong>{link.title}</strong>
                      <small>{link.description}</small>
                    </span>
                    <span className="card-arrow">↗</span>
                  </a>
                ))}
              </div>
            </div>
          );
        })}

        {visibleLinks.length === 0 && (
          <div className="empty-state">
            <Icon name="compass" size={34} />
            <h3>Tidak ada pelabuhan yang ditemukan</h3>
            <p>Coba gunakan kata kunci lain atau tambahkan tautan baru.</p>
          </div>
        )}

        <button className="manage-cta" onClick={onManage}>
          <span><Icon name="anchor" size={22} /></span>
          Kelola direktori tautan
          <b>→</b>
        </button>
      </section>
    </main>
  );
}

function ManagePage({
  links,
  onAdd,
  onDelete,
  onBack,
}: {
  links: LinkItem[];
  onAdd: (link: Omit<LinkItem, "id">) => void;
  onDelete: (id: string) => void;
  onBack: () => void;
}) {
  const [form, setForm] = useState({
    title: "",
    url: "",
    description: "",
    category: categories[0],
    icon: "anchor" as IconName,
    image: "",
  });
  const [imageError, setImageError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function handleImage(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setImageError("File harus berupa gambar.");
      return;
    }
    if (file.size > 8 * 1024 * 1024) {
      setImageError("Ukuran gambar maksimal 8 MB.");
      return;
    }
    try {
      const image = await optimizeImage(file);
      setForm((current) => ({ ...current, image }));
      setImageError("");
    } catch {
      setImageError("Gambar gagal diproses. Silakan pilih gambar lain.");
    }
  }

  function submit(event: FormEvent) {
    event.preventDefault();
    const safeUrl = /^https?:\/\//i.test(form.url) ? form.url : `https://${form.url}`;
    onAdd({ ...form, url: safeUrl });
    setForm({ title: "", url: "", description: "", category: categories[0], icon: "anchor", image: "" });
    setImageError("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  return (
    <main className="manage-page">
      <div className="manage-intro">
        <button className="back-button" onClick={onBack}>← &nbsp; Kembali ke beranda</button>
        <span className="section-kicker">ADMINISTRASI PORTAL</span>
        <h1>Kelola <em>Tautan</em></h1>
        <p>Tambahkan destinasi baru ke direktori atau hapus tautan yang sudah tidak digunakan.</p>
      </div>

      <div className="manage-layout">
        <section className="form-panel">
          <div className="panel-number">01</div>
          <div className="panel-title">
            <h2>Tambahkan Tautan</h2>
            <p>Lengkapi informasi destinasi digital di bawah ini.</p>
          </div>
          <form onSubmit={submit}>
            <label>
              <span>Nama tautan</span>
              <input
                required
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="Contoh: Portal Bea Cukai"
              />
            </label>
            <label>
              <span>Alamat website</span>
              <input
                required
                type="text"
                value={form.url}
                onChange={(e) => setForm({ ...form, url: e.target.value })}
                placeholder="https://website.go.id"
              />
            </label>
            <label>
              <span>Deskripsi singkat</span>
              <input
                required
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Jelaskan fungsi tautan ini"
              />
            </label>
            <div className="form-row">
              <label>
                <span>Kelompok</span>
                <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                  {categories.map((category) => <option key={category}>{category}</option>)}
                </select>
              </label>
              <label>
                <span>Ikon</span>
                <select value={form.icon} onChange={(e) => setForm({ ...form, icon: e.target.value as IconName })}>
                  {Object.keys(iconPaths).map((icon) => (
                    <option value={icon} key={icon}>{icon.charAt(0).toUpperCase() + icon.slice(1)}</option>
                  ))}
                </select>
              </label>
            </div>
            <div className="image-field">
              <span className="field-label">Gambar kustom <em>Opsional</em></span>
              {form.image ? (
                <div className="image-preview">
                  <img src={form.image} alt="Pratinjau gambar tautan" />
                  <div>
                    <strong>Gambar siap digunakan</strong>
                    <small>Gambar ini akan menggantikan ikon pilihan.</small>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setForm({ ...form, image: "" });
                      if (fileInputRef.current) fileInputRef.current.value = "";
                    }}
                  >
                    Hapus
                  </button>
                </div>
              ) : (
                <label className="image-upload">
                  <input ref={fileInputRef} type="file" accept="image/png,image/jpeg,image/webp,image/svg+xml" onChange={handleImage} />
                  <span className="upload-symbol">＋</span>
                  <span>
                    <strong>Pilih gambar</strong>
                    <small>PNG, JPG, WebP, atau SVG · Maks. 8 MB</small>
                  </span>
                </label>
              )}
              {imageError && <p className="image-error">{imageError}</p>}
            </div>
            <button className="primary-button" type="submit">
              Tambahkan ke direktori <span>＋</span>
            </button>
          </form>
        </section>

        <section className="list-panel">
          <div className="panel-number">02</div>
          <div className="panel-title list-heading">
            <div>
              <h2>Daftar Tautan</h2>
              <p>{links.length} destinasi aktif dalam direktori.</p>
            </div>
            <span className="count-badge">{links.length}</span>
          </div>
          <div className="manage-list">
            {links.map((link) => (
              <div className="manage-item" key={link.id}>
                <span className={`item-icon${link.image ? " has-image" : ""}`}>
                  {link.image ? <img src={link.image} alt="" /> : <Icon name={link.icon} size={22} />}
                </span>
                <span className="item-copy">
                  <strong>{link.title}</strong>
                  <small>{link.category} · {link.url.replace(/^https?:\/\//, "").replace(/\/$/, "")}</small>
                </span>
                <button
                  aria-label={`Hapus ${link.title}`}
                  className="delete-button"
                  onClick={() => onDelete(link.id)}
                  title="Hapus tautan"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
                    <path d="M4 7h16M9 7V4h6v3M7 7l1 14h8l1-14M10 11v6M14 11v6" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}

export default function App() {
  const [page, setPage] = useState<"home" | "manage">("home");
  const [notice, setNotice] = useState("");
  const [links, setLinks] = useState<LinkItem[]>(() => {
    try {
      const saved = localStorage.getItem("portal-samudra-links");
      return saved ? JSON.parse(saved) : initialLinks;
    } catch {
      return initialLinks;
    }
  });

  useEffect(() => {
    localStorage.setItem("portal-samudra-links", JSON.stringify(links));
  }, [links]);

  useEffect(() => {
    if (!notice) return;
    const timeout = window.setTimeout(() => setNotice(""), 2600);
    return () => window.clearTimeout(timeout);
  }, [notice]);

  function navigate(destination: "home" | "manage") {
    setPage(destination);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <div className="app-shell">
      <Header page={page} onNavigate={navigate} />
      {page === "home" ? (
        <HomePage links={links} onManage={() => navigate("manage")} />
      ) : (
        <ManagePage
          links={links}
          onBack={() => navigate("home")}
          onAdd={(link) => {
            setLinks((current) => [...current, { ...link, id: crypto.randomUUID() }]);
            setNotice("Tautan baru berhasil ditambahkan");
          }}
          onDelete={(id) => {
            setLinks((current) => current.filter((link) => link.id !== id));
            setNotice("Tautan telah dihapus dari direktori");
          }}
        />
      )}
      {notice && <div className="toast"><span>✓</span>{notice}</div>}
      <footer>
        <div className="footer-brand"><img src={pelindoLogo} alt="Pelindo" /></div>
        <p>Menghubungkan pelabuhan, menyatukan Indonesia.</p>
        <span>© 2025 · Nusantara</span>
      </footer>
    </div>
  );
}
