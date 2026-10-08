import {
    ChangeEvent,
    FormEvent,
    useRef,
    useState,
} from "react";

import Icon from "../components/Icon";
import { categories, iconPaths } from "../data/links";
import { optimizeImage } from "../utils/image";
import type { IconName, LinkItem } from "../types/link";

type ManagePageProps = {
    links: LinkItem[];
    onAdd: (link: Omit<LinkItem, "id">) => void;
    onDelete: (id: string) => void;
    onBack: () => void;
};

export default function ManagePage({
    links,
    onAdd,
    onDelete,
    onBack,
}: ManagePageProps) {
    const [form, setForm] = useState({
        title: "",
        url: "",
        description: "",
        category: categories[0],
        icon: "anchor" as IconName,
        image: "",
    });

    const [imageError, setImageError] =
        useState("");

    const fileInputRef =
        useRef<HTMLInputElement>(null);

    async function handleImage(
        event: ChangeEvent<HTMLInputElement>,
    ) {
        const file = event.target.files?.[0];

        if (!file) {
            return;
        }

        if (!file.type.startsWith("image/")) {
            setImageError(
                "File harus berupa gambar.",
            );
            return;
        }

        if (file.size > 8 * 1024 * 1024) {
            setImageError(
                "Ukuran gambar maksimal 8 MB.",
            );
            return;
        }

        try {
            const image = await optimizeImage(file);

            setForm((current) => ({
                ...current,
                image,
            }));

            setImageError("");
        } catch {
            setImageError(
                "Gambar gagal diproses. Silakan pilih gambar lain.",
            );
        }
    }

    function submit(event: FormEvent) {
        event.preventDefault();

        const safeUrl =
            /^https?:\/\//i.test(form.url)
                ? form.url
                : `https://${form.url}`;

        onAdd({
            ...form,
            url: safeUrl,
        });

        setForm({
            title: "",
            url: "",
            description: "",
            category: categories[0],
            icon: "anchor",
            image: "",
        });

        setImageError("");

        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    }

    return (
        <main className="manage-page">
            <div className="manage-intro">
                <span className="section-kicker">
                    ADMINISTRASI PORTAL
                </span>

                <h1>
                    Kelola <em>Tautan</em>
                </h1>

                <p>
                    Tambahkan destinasi baru ke direktori
                    atau hapus tautan yang sudah tidak
                    digunakan.
                </p>
            </div>

            <div className="manage-layout">
                <section className="form-panel">
                    <div className="panel-number">
                        01
                    </div>

                    <div className="panel-title">
                        <h2>Tambahkan Tautan</h2>

                        <p>
                            Lengkapi informasi destinasi digital
                            di bawah ini.
                        </p>
                    </div>

                    <form onSubmit={submit}>
                        <label>
                            <span>Nama tautan</span>

                            <input
                                required
                                value={form.title}
                                onChange={(e) =>
                                    setForm({
                                        ...form,
                                        title: e.target.value,
                                    })
                                }
                                placeholder="Contoh: Portal Bea Cukai"
                            />
                        </label>

                        <label>
                            <span>Alamat website</span>

                            <input
                                required
                                type="text"
                                value={form.url}
                                onChange={(e) =>
                                    setForm({
                                        ...form,
                                        url: e.target.value,
                                    })
                                }
                                placeholder="https://website.go.id"
                            />
                        </label>

                        <label>
                            <span>Deskripsi singkat</span>

                            <input
                                required
                                value={form.description}
                                onChange={(e) =>
                                    setForm({
                                        ...form,
                                        description: e.target.value,
                                    })
                                }
                                placeholder="Jelaskan fungsi tautan ini"
                            />
                        </label>

                        <div className="form-row">
                            <label>
                                <span>Kelompok</span>

                                <select
                                    value={form.category}
                                    onChange={(e) =>
                                        setForm({
                                            ...form,
                                            category: e.target.value,
                                        })
                                    }
                                >
                                    {categories.map((category) => (
                                        <option
                                            key={category}
                                            value={category}
                                        >
                                            {category}
                                        </option>
                                    ))}
                                </select>
                            </label>

                            <label>
                                <span>Ikon</span>

                                <select
                                    value={form.icon}
                                    onChange={(e) =>
                                        setForm({
                                            ...form,
                                            icon: e.target
                                                .value as IconName,
                                        })
                                    }
                                >
                                    {Object.keys(iconPaths).map(
                                        (icon) => (
                                            <option
                                                value={icon}
                                                key={icon}
                                            >
                                                {icon
                                                    .charAt(0)
                                                    .toUpperCase() +
                                                    icon.slice(1)}
                                            </option>
                                        ),
                                    )}
                                </select>
                            </label>
                        </div>

                        <div className="image-field">
                            <span className="field-label">
                                Gambar kustom{" "}
                                <em>Opsional</em>
                            </span>

                            {form.image ? (
                                <div className="image-preview">
                                    <img
                                        src={form.image}
                                        alt="Pratinjau gambar tautan"
                                    />

                                    <div>
                                        <strong>
                                            Gambar siap digunakan
                                        </strong>

                                        <small>
                                            Gambar ini akan menggantikan
                                            ikon pilihan.
                                        </small>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={() => {
                                            setForm({
                                                ...form,
                                                image: "",
                                            });

                                            if (
                                                fileInputRef.current
                                            ) {
                                                fileInputRef.current.value =
                                                    "";
                                            }
                                        }}
                                    >
                                        Hapus
                                    </button>
                                </div>
                            ) : (
                                <label className="image-upload">
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        accept="image/png,image/jpeg,image/webp,image/svg+xml"
                                        onChange={handleImage}
                                    />

                                    <span className="upload-symbol">
                                        ＋
                                    </span>

                                    <span>
                                        <strong>
                                            Pilih gambar
                                        </strong>

                                        <small>
                                            PNG, JPG, WebP, atau SVG ·
                                            Maks. 8 MB
                                        </small>
                                    </span>
                                </label>
                            )}

                            {imageError && (
                                <p className="image-error">
                                    {imageError}
                                </p>
                            )}
                        </div>

                        <button
                            className="primary-button"
                            type="submit"
                        >
                            Tambahkan ke direktori
                            <span>＋</span>
                        </button>
                    </form>
                </section>

                <section className="list-panel">
                    <div className="panel-number">
                        02
                    </div>

                    <div className="panel-title list-heading">
                        <div>
                            <h2>Daftar Tautan</h2>

                            <p>
                                {links.length} destinasi aktif
                                dalam direktori.
                            </p>
                        </div>

                        <span className="count-badge">
                            {links.length}
                        </span>
                    </div>

                    <div className="manage-list">
                        {links.map((link) => (
                            <div
                                className="manage-item"
                                key={link.id}
                            >
                                <span
                                    className={`item-icon${link.image
                                        ? " has-image"
                                        : ""
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
                                            size={22}
                                        />
                                    )}
                                </span>

                                <span className="item-copy">
                                    <strong>
                                        {link.title}
                                    </strong>

                                    <small>
                                        {link.category} ·{" "}
                                        {link.url
                                            .replace(
                                                /^https?:\/\//,
                                                "",
                                            )
                                            .replace(/\/$/, "")}
                                    </small>
                                </span>

                                <button
                                    aria-label={`Hapus ${link.title}`}
                                    className="delete-button"
                                    onClick={() =>
                                        onDelete(link.id)
                                    }
                                    title="Hapus tautan"
                                >
                                    <svg
                                        width="18"
                                        height="18"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="1.7"
                                    >
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
