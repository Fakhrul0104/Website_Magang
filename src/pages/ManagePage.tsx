import {
    ChangeEvent,
    FormEvent,
    useRef,
    useState,
} from "react";

import Icon from "../components/Icon";
import { categories } from "../data/links";
import { optimizeImage } from "../utils/image";
import type { IconName, LinkItem } from "../types/link";
import Pelabuhan from "../assets/dji.png";

type LinkForm = Omit<LinkItem, "id">;

type ManagePageProps = {
    links: LinkItem[];
    onAdd: (link: LinkForm) => Promise<void>;
    onUpdate: (id: string, link: LinkForm) => Promise<void>;
    onDelete: (id: string) => Promise<void>;
    onBack: () => void;
};

export default function ManagePage({
    links,
    onAdd,
    onUpdate,
    onDelete,
}: ManagePageProps) {
    const initialForm: LinkForm = {
        title: "",
        url: "",
        description: "",
        category: categories[0],
        icon: "anchor" as IconName,
        image: "",
    };

    const [form, setForm] = useState<LinkForm>({
        ...initialForm,
    });

    const [imageError, setImageError] = useState("");
    const [editingId, setEditingId] = useState<string | null>(null);
    const [saving, setSaving] = useState(false);

    const fileInputRef = useRef<HTMLInputElement>(null);
    const formPanelRef = useRef<HTMLElement>(null);

    async function handleImage(
        event: ChangeEvent<HTMLInputElement>,
    ) {
        const file = event.target.files?.[0];

        if (!file) {
            return;
        }

        if (!file.type.startsWith("image/")) {
            setImageError("File harus berupa gambar.");
            event.target.value = "";
            return;
        }

        if (file.size > 8 * 1024 * 1024) {
            setImageError("Ukuran gambar maksimal 8 MB.");
            event.target.value = "";
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

    function resetForm() {
        setForm({ ...initialForm });
        setEditingId(null);
        setImageError("");

        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    }

    function handleEdit(link: LinkItem) {
        setForm({
            title: link.title,
            url: link.url,
            description: link.description,
            category: link.category,
            icon: link.icon,
            image: link.image ?? "",
        });

        setEditingId(link.id);
        setImageError("");

        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }

        requestAnimationFrame(() => {
            formPanelRef.current?.scrollIntoView({
                behavior: "smooth",
                block: "start",
            });
        });
    }

    async function submit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        if (saving) {
            return;
        }

        const trimmedUrl = form.url.trim();

        const safeUrl = /^https?:\/\//i.test(trimmedUrl)
            ? trimmedUrl
            : `https://${trimmedUrl}`;

        const payload: LinkForm = {
            ...form,
            title: form.title.trim(),
            url: safeUrl,
            description: form.description.trim(),
        };

        setSaving(true);

        try {
            if (editingId !== null) {
                await onUpdate(editingId, payload);
            } else {
                await onAdd(payload);
            }

            resetForm();
        } catch (error) {
            alert(
                error instanceof Error
                    ? error.message
                    : editingId !== null
                        ? "Tautan gagal diperbarui."
                        : "Tautan gagal disimpan.",
            );
        } finally {
            setSaving(false);
        }
    }

    return (
        <main className="manage-page">
            <div
                className="manage-intro"
                style={{
                    backgroundImage: `
                        linear-gradient(
                            rgba(8, 24, 35, 0.65),
                            rgba(8, 24, 35, 0.75)
                        ),
                        url(${Pelabuhan})
                    `,
                }}
            >
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
                <section
                    className="form-panel"
                    ref={formPanelRef}
                >
                    <div className="panel-number">
                        01
                    </div>

                    <div className="panel-title">
                        <h2>
                            {editingId !== null
                                ? "Edit Tautan"
                                : "Tambahkan Tautan"}
                        </h2>

                        <p>
                            {editingId !== null
                                ? "Perbarui informasi destinasi digital di bawah ini."
                                : "Lengkapi informasi destinasi digital di bawah ini."}
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

                                    {/* Mempertahankan kategori lama
                                        jika tidak ada dalam daftar. */}
                                    {!categories.includes(form.category) && (
                                        <option value={form.category}>
                                            {form.category}
                                        </option>
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

                                            if (fileInputRef.current) {
                                                fileInputRef.current.value = "";
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
                            disabled={saving}
                        >
                            {saving
                                ? "Menyimpan..."
                                : editingId !== null
                                    ? "Simpan Perubahan"
                                    : "Tambahkan ke direktori"}

                            <span>
                                {editingId !== null ? "✓" : "＋"}
                            </span>
                        </button>

                        {editingId !== null && (
                            <button
                                className="primary-button"
                                type="button"
                                disabled={saving}
                                onClick={resetForm}
                            >
                                Batal Edit
                            </button>
                        )}
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
                                className={`manage-item${
                                    editingId === link.id
                                        ? " is-editing"
                                        : ""
                                }`}
                                key={link.id}
                            >
                                <span
                                    className={`item-icon${
                                        link.image
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
                                    type="button"
                                    aria-label={`Edit ${link.title}`}
                                    className="edit-button"
                                    onClick={() => handleEdit(link)}
                                    disabled={saving}
                                    title="Edit tautan"
                                >
                                    <svg
                                        width="22"
                                        height="22"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="1.7"
                                    >
                                        <path d="M12 20h9" />
                                        <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L8 18l-4 1 1-4Z" />
                                    </svg>
                                </button>

                                <button
                                    type="button"
                                    aria-label={`Hapus ${link.title}`}
                                    className="delete-button"
                                    onClick={async () => {
                                        try {
                                            await onDelete(link.id);

                                            if (editingId === link.id) {
                                                resetForm();
                                            }
                                        } catch (error) {
                                            alert(
                                                error instanceof Error
                                                    ? error.message
                                                    : "Tautan gagal dihapus.",
                                            );
                                        }
                                    }}
                                    title="Hapus tautan"
                                    disabled={saving}
                                >
                                    <svg
                                        width="22"
                                        height="22"
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