import { useEffect, useMemo, useRef, useState } from "react";

import Icon from "../components/Icon";
import LinkVisual from "../components/LinkVisual";
import type { LinkItem } from "../types/link";
import Pelabuhan from "../assets/dji.png";

type HomePageProps = {
  links: LinkItem[];
  onManage: () => void;
};

export default function HomePage({ links, onManage }: HomePageProps) {
  const [query, setQuery] = useState("");
  const [isSticky, setIsSticky] = useState(false);

  const resultsRef = useRef<HTMLElement>(null);
  const anchorRef = useRef<HTMLDivElement>(null);
  const floatingInputRef = useRef<HTMLInputElement>(null);

  const visibleLinks = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return links;
    return links.filter((link) =>
      `${link.title} ${link.description} ${link.category}`
        .toLowerCase()
        .includes(normalized),
    );
  }, [links, query]);

  // Cek apakah pencarian sedang aktif
  const isSearching = query.trim().length > 0;

  // Auto-scroll ke hasil saat mengetik
  useEffect(() => {
    if (!query.trim()) return;
    resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [query]);

  // Scroll listener untuk transisi sticky bar dengan performa tinggi
  useEffect(() => {
    const HEADER_H = 82;
    const TRIGGER_OFFSET = 10;
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          if (anchorRef.current) {
            const rect = anchorRef.current.getBoundingClientRect();
            setIsSticky(rect.top < HEADER_H - TRIGGER_OFFSET);
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Fokus floating input saat muncul
  useEffect(() => {
    if (isSticky && query) {
      floatingInputRef.current?.focus();
    }
  }, [isSticky, query]);

  return (
    <main>
      {/* Floating pill sticky bar */}
      <div
        className={`search-sticky-wrap${isSticky ? " search-sticky-wrap--visible" : ""
          }`}
      >
        <label className="search-pill">
          <Icon name="compass" size={18} />
          <input
            ref={floatingInputRef}
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Cari layanan, portal, atau informasi..."
            aria-label="Cari layanan"
          />
        </label>
      </div>

      <section className="hero">
        <img src={Pelabuhan} alt="Pelabuhan Teluk Bayur" />
        <div className="hero-overlay" />

        <div className="hero-content">
          <div className="eyebrow">
            <span /> Pusat Akses Pelabuhan <span />
          </div>

          <h1>
            Gerbang Informasi
            <br />
            <em>Pelabuhan Indonesia</em>
          </h1>

          <p>
            Satu akses terpadu untuk layanan, operasional, dan informasi maritim
            Pelindo.
          </p>
        </div>

        {/* Anchor search di hero */}
        <div className="hero-search-anchor" ref={anchorRef}>
          <label
            className={`search-pill hero-search${isSticky ? " hero-search--lifting" : ""
              }`}
          >
            <Icon name="compass" size={20} />
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Cari layanan, portal, atau informasi..."
              aria-label="Cari layanan"
            />
            {query && (
              <button
                className="search-pill-clear"
                onClick={() => setQuery("")}
                aria-label="Hapus pencarian"
              >
                ✕
              </button>
            )}
          </label>
        </div>

        <div className="coordinates">
          06° 07' S &nbsp;—&nbsp; 106° 53' E
        </div>
      </section>

      <section className="portal-section" ref={resultsRef}>
        <div className="section-heading">
          <div>
            <span className="section-kicker">
              {isSearching ? "HASIL PENCARIAN" : "DIREKTORI DIGITAL"}
            </span>
            <h2>
              {isSearching
                ? `Menampilkan ${visibleLinks.length} Hasil`
                : "Portal Layanan"}
            </h2>
          </div>
        </div>

        {/* MODE 1: Saat Mencari (Tampilan Flat List terlepas dari kategori) */}
        {isSearching && visibleLinks.length > 0 && (
          <div className="search-results-block">
            <div className="link-grid">
              {visibleLinks.map((link) => (
                <a
                  className="link-card"
                  href={link.url}
                  target="_blank"
                  rel="noreferrer"
                  key={link.id}
                >
                  <span
                    className={`icon-frame${link.image ? " has-image" : ""
                      }`}
                  >
                    <LinkVisual link={link} />
                  </span>

                  <span className="card-copy">
                    <strong>{link.title}</strong>
                    <small>{link.description}</small>
                    <span className="category-badge">{link.category}</span>
                  </span>

                  <span className="card-arrow">↗</span>
                </a>
              ))}
            </div>
          </div>
        )}

        {/* MODE 2: Saat Default (Dikelompokkan per Kategori) */}
        {!isSearching &&
          Array.from(new Set(visibleLinks.map((l) => l.category))).map(
            (category, index) => {
              const categoryLinks = visibleLinks.filter(
                (link) => link.category === category,
              );

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
                      <a
                        className="link-card"
                        href={link.url}
                        target="_blank"
                        rel="noreferrer"
                        key={link.id}
                      >
                        <span
                          className={`icon-frame${link.image ? " has-image" : ""
                            }`}
                        >
                          <LinkVisual link={link} />
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
            },
          )}

        {/* State saat tidak ada data yang cocok */}
        {visibleLinks.length === 0 && (
          <div className="empty-state">
            <Icon name="compass" size={34} />
            <h3>Tidak ada pelabuhan yang ditemukan</h3>
            <p>
              Coba gunakan kata kunci lain atau tambahkan tautan baru.
            </p>
          </div>
        )}

        <button className="manage-cta" onClick={onManage}>
          <span>
            <Icon name="anchor" size={22} />
          </span>
          Kelola direktori tautan
          <b>→</b>
        </button>
      </section>
    </main>
  );
}