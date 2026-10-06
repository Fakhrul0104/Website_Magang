import { useMemo, useState } from "react";

import Icon from "../components/Icon";
import { categories } from "../data/links";
import type { LinkItem } from "../types/link";

type HomePageProps = {
    links: LinkItem[];
    onManage: () => void;
};

export default function HomePage({
    links,
    onManage,
}: HomePageProps) {
    const [query, setQuery] = useState("");

    const visibleLinks = useMemo(() => {
        const normalized = query.trim().toLowerCase();

        if (!normalized) {
            return links;
        }

        return links.filter((link) =>
            `${link.title} ${link.description} ${link.category}`
                .toLowerCase()
                .includes(normalized),
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
                        Satu akses terpadu untuk layanan,
                        operasional, dan informasi maritim Pelindo.
                    </p>

                    <label className="search-box">
                        <Icon name="compass" size={22} />

                        <input
                            type="search"
                            value={query}
                            onChange={(event) =>
                                setQuery(event.target.value)
                            }
                            placeholder="Cari layanan, portal, atau informasi..."
                            aria-label="Cari layanan"
                        />

                        <kbd>⌘ K</kbd>
                    </label>
                </div>

                <div className="coordinates">
                    06° 07' S &nbsp;—&nbsp; 106° 53' E
                </div>
            </section>

            <section className="portal-section">
                <div className="section-heading">
                    <div>
                        <span className="section-kicker">
                            DIREKTORI DIGITAL
                        </span>

                        <h2>Portal Layanan</h2>
                    </div>
                </div>

                {categories.map((category, index) => {
                    const categoryLinks = visibleLinks.filter(
                        (link) => link.category === category,
                    );

                    if (categoryLinks.length === 0) {
                        return null;
                    }

                    return (
                        <div
                            className="category-block"
                            key={category}
                        >
                            <div className="category-title">
                                <span>
                                    {String(index + 1).padStart(2, "0")}
                                </span>

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
                                            {link.image ? (
                                                <img
                                                    src={link.image}
                                                    alt=""
                                                />
                                            ) : (
                                                <Icon
                                                    name={link.icon}
                                                    size={28}
                                                />
                                            )}
                                        </span>

                                        <span className="card-copy">
                                            <strong>{link.title}</strong>

                                            <small>
                                                {link.description}
                                            </small>
                                        </span>

                                        <span className="card-arrow">
                                            ↗
                                        </span>
                                    </a>
                                ))}
                            </div>
                        </div>
                    );
                })}

                {visibleLinks.length === 0 && (
                    <div className="empty-state">
                        <Icon name="compass" size={34} />

                        <h3>
                            Tidak ada pelabuhan yang ditemukan
                        </h3>

                        <p>
                            Coba gunakan kata kunci lain atau
                            tambahkan tautan baru.
                        </p>
                    </div>
                )}

                <button
                    className="manage-cta"
                    onClick={onManage}
                >
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