
import {
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
} from "react";

import Icon from "../components/Icon";
import LinkVisual from "../components/LinkVisual";
import type { LinkItem } from "../types/link";
import Pelabuhan from "../assets/dji.webp";
import { exportLinksToExcel } from "../utils/exportLinksToExcel";
import { categories } from "../data/links";

type HomePageProps = {
  links: LinkItem[];
  onManage: () => void;
};

type LinkCardProps = {
  link: LinkItem;
  showCategory: boolean;
};

type SearchInputProps = {
  value: string;
  sticky?: boolean;
  onChange: (value: string) => void;
  inputRef?: React.RefObject<HTMLInputElement | null>;
};

const HEADER_HEIGHT = 82;
const STICKY_TRIGGER_OFFSET = 10;
const SCROLL_MARGIN_TOP = 50;

// Input pencarian digunakan pada hero dan sticky bar.
const SearchInput = memo(function SearchInput({
  value,
  sticky = false,
  onChange,
  inputRef,
}: SearchInputProps) {
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    onChange(event.target.value);
  };

  return (
    <label className="search-pill">
      <Icon name="compass" size={sticky ? 18 : 20} />

      <input
        ref={inputRef}
        type="search"
        value={value}
        onChange={handleChange}
        placeholder="Cari layanan, portal, atau informasi..."
        aria-label="Cari layanan"
      />
    </label>
  );
});

// Kartu tidak perlu dirender ulang jika props tidak berubah.
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

  // State filter kategori harus berada di dalam komponen.
  const [selectedCategory, setSelectedCategory] =
    useState("Semua");

  const anchorRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const stickyInputRef = useRef<HTMLInputElement>(null);
  const wasSearchingRef = useRef(false);

  const normalizedQuery = query.trim().toLowerCase();
  const isSearching = normalizedQuery.length > 0;

  // Pencarian dan filter kategori berjalan bersamaan.
  const visibleLinks = useMemo(() => {
    return links.filter((link) => {
      const matchesCategory =
        selectedCategory === "Semua" ||
        link.category === selectedCategory;

      const matchesSearch =
        `${link.title} ${link.description} ${link.category}`
          .toLowerCase()
          .includes(normalizedQuery);

      return matchesCategory && matchesSearch;
    });
  }, [links, selectedCategory, normalizedQuery]);

  const handleSearchChange = useCallback((value: string) => {
    setQuery(value);
  }, []);

  // Pengelompokan hanya digunakan saat pencarian kosong.
  // Filter kategori tetap diterapkan.
  const groupedLinks = useMemo(() => {
    if (isSearching) {
      return [];
    }

    const groups = new Map<string, LinkItem[]>();

    for (const link of visibleLinks) {
      const existing = groups.get(link.category);

      if (existing) {
        existing.push(link);
      } else {
        groups.set(link.category, [link]);
      }
    }

    return Array.from(groups.entries());
  }, [visibleLinks, isSearching]);

  // Mengatur kemunculan sticky search bar.
  useEffect(() => {
    let frameId = 0;

    const updateSticky = () => {
      frameId = 0;

      const anchor = anchorRef.current;
      if (!anchor) return;

      const shouldBeSticky =
        anchor.getBoundingClientRect().top <
        HEADER_HEIGHT - STICKY_TRIGGER_OFFSET;

      setIsSticky((previous) =>
        previous === shouldBeSticky ? previous : shouldBeSticky
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

  // Scroll menuju judul direktori hanya saat pencarian mulai aktif.
  useEffect(() => {
    const hasStartedSearching =
      isSearching && !wasSearchingRef.current;

    wasSearchingRef.current = isSearching;

    if (!hasStartedSearching) return;

    const frameId = window.requestAnimationFrame(() => {
      headingRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    });

    return () => window.cancelAnimationFrame(frameId);
  }, [isSearching]);

  return (
    <main>
      {/* Sticky search bar */}
      <div
        className={`search-sticky-wrap${isSticky ? " search-sticky-wrap--visible" : ""
          }`}
        aria-hidden={!isSticky}
      >
        <SearchInput
          value={query}
          sticky
          onChange={handleSearchChange}
          inputRef={stickyInputRef}
        />
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

        {/* Pencarian utama */}
        <div className="hero-search-anchor" ref={anchorRef}>
          <div
            className={`hero-search${isSticky ? " hero-search--lifting" : ""
              }`}
          >
            <SearchInput
              value={query}
              onChange={handleSearchChange}
            />
          </div>
        </div>

        <div className="coordinates">
          06° 07' S &nbsp;—&nbsp; 106° 53' E
        </div>
      </section>

      {/* Daftar portal */}
      <section className="portal-section">
        <div
          className="section-heading"
          ref={headingRef}
          style={{ scrollMarginTop: `${SCROLL_MARGIN_TOP}px` }}
        >
          <div className="directory-heading">
            <div className="directory-title">
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

            <button
              className="export-excel-button"
              onClick={() => exportLinksToExcel(links)}
              type="button"
              disabled={links.length === 0}
            >
              <Icon name="file-spreadsheet" size={18} />
              Unduh Direktori ke Excel
            </button>
          </div>
        </div>
        {/* Filter kategori */}
        <div className="category-filter">
          <button
            type="button"
            className={`category-filter-button ${selectedCategory === "Semua" ? "active" : ""
              }`}
            onClick={() => setSelectedCategory("Semua")}
            aria-pressed={selectedCategory === "Semua"}
          >
            Semua
          </button>

          {categories.map((category) => (
            <button
              key={category}
              type="button"
              className={`category-filter-button ${selectedCategory === category ? "active" : ""
                }`}
              onClick={() => setSelectedCategory(category)}
              aria-pressed={selectedCategory === category}
            >
              {category}
            </button>
          ))}
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

            <h3>
              {isSearching
                ? "Tidak ada tautan yang ditemukan"
                : "Belum ada tautan dalam kategori ini"}
            </h3>

            <p>
              Coba gunakan kata kunci atau kategori lain.
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
