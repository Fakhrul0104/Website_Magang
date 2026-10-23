
import {
  memo,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import Icon from "../components/Icon";
import LinkVisual from "../components/LinkVisual";
import type { LinkItem } from "../types/link";
import Pelabuhan from "../assets/dji.webp";

type HomePageProps = {
  links: LinkItem[];
  onManage: () => void;
};

type LinkCardProps = {
  link: LinkItem;
  showCategory: boolean;
};

// Pisahkan kartu agar perubahan state pencarian tidak
// memaksa kartu yang propertinya tetap berubah untuk dirender ulang.
const LinkCard = memo(function LinkCard({
  link,
  showCategory,
}: LinkCardProps) {
  return (
    <a
      className="link-card"
      href={link.url}
      target="_blank"
      rel="noopener noreferrer"
    >
      <span
        className={`icon-frame${link.image ? " has-image" : ""}`}
      >
        <LinkVisual link={link} />
      </span>

      <span className="card-copy">
        <strong>{link.title}</strong>
        <small>{link.description}</small>

        {showCategory && (
          <span className="category-badge">
            {link.category}
          </span>
        )}
      </span>

      <span className="card-arrow" aria-hidden="true">
        ↗
      </span>
    </a>
  );
});

export default function HomePage({
  links,
  onManage,
}: HomePageProps) {
  const [query, setQuery] = useState("");
  const [isSticky, setIsSticky] = useState(false);

  const anchorRef = useRef<HTMLDivElement>(null);

  // Normalisasi query hanya sekali untuk setiap perubahan query.
  const normalizedQuery = query.trim().toLowerCase();
  const isSearching = normalizedQuery.length > 0;

  // Filter daftar tautan.
  const visibleLinks = useMemo(() => {
    if (!normalizedQuery) {
      return links;
    }

    return links.filter((link) =>
      `${link.title} ${link.description} ${link.category}`
        .toLowerCase()
        .includes(normalizedQuery),
    );
  }, [links, normalizedQuery]);

  // Kelompokkan kategori hanya ketika data tautan berubah.
  // Urutan kategori mengikuti urutan pertama pada data.
  const groupedLinks = useMemo(() => {
    const groups = new Map<string, LinkItem[]>();

    for (const link of visibleLinks) {
      const category = link.category;
      const existing = groups.get(category);

      if (existing) {
        existing.push(link);
      } else {
        groups.set(category, [link]);
      }
    }

    return Array.from(groups.entries());
  }, [visibleLinks]);

  // Sticky search bar: batasi pemeriksaan scroll
  // maksimal satu kali dalam satu frame browser.
  useEffect(() => {
    const HEADER_HEIGHT = 82;
    const TRIGGER_OFFSET = 10;

    let frameId = 0;

    const updateSticky = () => {
      frameId = 0;

      const anchor = anchorRef.current;

      if (!anchor) return;

      const shouldBeSticky =
        anchor.getBoundingClientRect().top <
        HEADER_HEIGHT - TRIGGER_OFFSET;

      setIsSticky((previous) =>
        previous === shouldBeSticky
          ? previous
          : shouldBeSticky,
      );
    };

    const handleScroll = () => {
      if (frameId !== 0) return;

      frameId = window.requestAnimationFrame(updateSticky);
    };

    updateSticky();

    window.addEventListener("scroll", handleScroll, {
      passive: true,
    });

    window.addEventListener("resize", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);

      if (frameId !== 0) {
        window.cancelAnimationFrame(frameId);
      }
    };
  }, []);

  const handleSearchChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setQuery(event.target.value);
  };

  return (
    <main>
      {/* Sticky search bar */}
      <div
        className={`search-sticky-wrap${isSticky ? " search-sticky-wrap--visible" : ""
          }`}
        aria-hidden={!isSticky}
      >
        <label className="search-pill">
          <Icon name="compass" size={18} />

          <input
            type="search"
            value={query}
            onChange={handleSearchChange}
            placeholder="Cari layanan, portal, atau informasi..."
            aria-label="Cari layanan"
            tabIndex={isSticky ? 0 : -1}
          />
        </label>
      </div>

      {/* Hero */}
      <section className="hero">
        <img
          src={Pelabuhan}
          alt="Pelabuhan Teluk Bayur"
          fetchPriority="high"
          loading="eager"
          decoding="async"
        />

        <div className="hero-overlay" />

        <div className="hero-content">
          <div className="eyebrow">
            <span />
            Pusat Akses Pelabuhan
            <span />
          </div>

          <h1>
            Gerbang Informasi
            <br />
            <em>Pelabuhan Indonesia</em>
          </h1>

          <p>
            Satu akses terpadu untuk layanan, operasional,
            dan informasi maritim Pelindo.
          </p>
        </div>

        {/* Search utama */}
        <div className="hero-search-anchor" ref={anchorRef}>
          <label
            className={`search-pill hero-search${isSticky ? " hero-search--lifting" : ""
              }`}
          >
            <Icon name="compass" size={20} />

            <input
              type="search"
              value={query}
              onChange={handleSearchChange}
              placeholder="Cari layanan, portal, atau informasi..."
              aria-label="Cari layanan"
              tabIndex={isSticky ? -1 : 0}
            />
          </label>
        </div>

        <div className="coordinates">
          06° 07' S &nbsp;—&nbsp; 106° 53' E
        </div>
      </section>

      {/* Daftar portal */}
      <section className="portal-section">
        <div className="section-heading">
          <div>
            <span className="section-kicker">
              {isSearching
                ? "HASIL PENCARIAN"
                : "DIREKTORI DIGITAL"}
            </span>

            <h2>
              {isSearching
                ? `Menampilkan ${visibleLinks.length} Hasil`
                : "Portal Layanan"}
            </h2>
          </div>
        </div>

        {/* Hasil pencarian */}
        {isSearching && visibleLinks.length > 0 && (
          <div className="search-results-block">
            <div className="link-grid">
              {visibleLinks.map((link) => (
                <LinkCard
                  key={link.id}
                  link={link}
                  showCategory
                />
              ))}
            </div>
          </div>
        )}

        {/* Daftar kategori */}
        {!isSearching &&
          groupedLinks.map(([category, categoryLinks], index) => (
            <div className="category-block" key={category}>
              <div className="category-title">
                <span>
                  {String(index + 1).padStart(2, "0")}
                </span>

                <h3>{category}</h3>

                <div />
              </div>

              <div className="link-grid">
                {categoryLinks.map((link) => (
                  <LinkCard
                    key={link.id}
                    link={link}
                    showCategory={false}
                  />
                ))}
              </div>
            </div>
          ))}

        {/* Hasil kosong */}
        {visibleLinks.length === 0 && (
          <div className="empty-state">
            <Icon name="compass" size={34} />

            <h3>Tidak ada tautan yang ditemukan</h3>

            <p>
              Coba gunakan kata kunci lain atau tambahkan
              tautan baru.
            </p>
          </div>
        )}

        <button
          className="manage-cta"
          onClick={onManage}
          type="button"
        >
          <span>
            <Icon name="anchor" size={22} />
          </span>

          Kelola direktori tautan

          <b aria-hidden="true">→</b>
        </button>
      </section>
    </main>
  );
}
