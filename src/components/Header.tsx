<<<<<<< HEAD
import pelindoLogo from "../assets/pelindo-logo.png";

type Page = "home" | "manage";

type HeaderProps = {
    page: Page;
    onNavigate: (page: Page) => void;
};

export default function Header({
    page,
    onNavigate,
}: HeaderProps) {
    return (
        <header className="site-header">
            <button
                className="brand"
                onClick={() => onNavigate("home")}
                aria-label="Kembali ke beranda"
            >
                <img src={pelindoLogo} alt="Pelindo" />

                <span className="brand-divider" />

                <small>
                    Portal
                    <br />
                    Informasi
                </small>
            </button>

            <nav aria-label="Navigasi utama">
                <button
                    className={page === "home" ? "active" : ""}
                    onClick={() => onNavigate("home")}
                >
                    Beranda
                </button>

                <button
                    className={page === "manage" ? "active" : ""}
                    onClick={() => onNavigate("manage")}
                >
                    Kelola Tautan
                </button>
            </nav>
        </header>
    );
}
=======
import pelindoLogo from "@/assets/pelindo-logo.png"
import type { PageName } from "@/types"

interface HeaderProps {
  page: PageName
  onNavigate: (page: PageName) => void
}

export default function Header({ page, onNavigate }: HeaderProps) {
  return (
    <header className="site-header">
      <button
        className="brand"
        onClick={() => onNavigate("home")}
        aria-label="Kembali ke beranda"
      >
        <img src={pelindoLogo} alt="Pelindo" />
        <span className="brand-divider" />
        <small>
          Portal
          <br />
          Informasi
        </small>
      </button>
      <nav aria-label="Navigasi utama">
        <button
          className={page === "home" ? "active" : ""}
          onClick={() => onNavigate("home")}
        >
          Beranda
        </button>
        <button
          className={page === "manage" ? "active" : ""}
          onClick={() => onNavigate("manage")}
        >
          Kelola Tautan
        </button>
      </nav>
    </header>
  )
}
>>>>>>> 7c7bdb2cd134ad60808723de9375e7876f0cc2f8
