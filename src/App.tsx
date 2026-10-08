<<<<<<< HEAD
import { useEffect, useState } from "react";

import Header from "./components/Header";
import Footer from "./components/Footer";
import HomePage from "./pages/HomePage";
import ManagePage from "./pages/ManagePage";
import { initialLinks } from "./data/links";
import type { LinkItem } from "./types/link";

type Page = "home" | "manage";

export default function App() {
  const [page, setPage] =
    useState<Page>("home");

  const [notice, setNotice] =
    useState("");

  const [links, setLinks] =
    useState<LinkItem[]>(() => {
      try {
        const saved = localStorage.getItem(
          "portal-samudra-links",
        );

        return saved
          ? JSON.parse(saved)
          : initialLinks;
      } catch {
        return initialLinks;
      }
    });

  useEffect(() => {
    localStorage.setItem(
      "portal-samudra-links",
      JSON.stringify(links),
    );
  }, [links]);

  useEffect(() => {
    if (!notice) {
      return;
    }

    const timeout = window.setTimeout(
      () => setNotice(""),
      2600,
    );

    return () =>
      window.clearTimeout(timeout);
  }, [notice]);

  function navigate(destination: Page) {
    setPage(destination);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  function addLink(
    link: Omit<LinkItem, "id">,
  ) {
    setLinks((current) => [
      ...current,
      {
        ...link,
        id: crypto.randomUUID(),
      },
    ]);

    setNotice(
      "Tautan baru berhasil ditambahkan",
    );
  }

  function deleteLink(id: string) {
    setLinks((current) =>
      current.filter(
        (link) => link.id !== id,
      ),
    );

    setNotice(
      "Tautan telah dihapus dari direktori",
    );
=======
import { useEffect, useState } from "react"

import Footer from "@/components/Footer"
import Header from "@/components/Header"
import Toast from "@/components/Toast"
import { useLinks } from "@/hooks/useLinks"
import HomePage from "@/pages/HomePage"
import ManagePage from "@/pages/ManagePage"
import type { PageName } from "@/types"

export default function App() {
  const [page, setPage] = useState<PageName>("home")
  const [notice, setNotice] = useState("")
  const { links, addLink, removeLink } = useLinks()

  useEffect(() => {
    if (!notice) return
    const timeout = window.setTimeout(() => setNotice(""), 2600)
    return () => window.clearTimeout(timeout)
  }, [notice])

  function navigate(destination: PageName) {
    setPage(destination)
    window.scrollTo({ top: 0, behavior: "smooth" })
>>>>>>> 7c7bdb2cd134ad60808723de9375e7876f0cc2f8
  }

  return (
    <div className="app-shell">
      <Header
        page={page}
        onNavigate={navigate}
      />

      {page === "home" ? (
        <HomePage
          links={links}
          onManage={() =>
            navigate("manage")
          }
        />
      ) : (
        <ManagePage
          links={links}
<<<<<<< HEAD
          onBack={() =>
            navigate("home")
          }
          onAdd={addLink}
          onDelete={deleteLink}
        />
      )}

      {notice && (
        <div className="toast">
          <span>✓</span>
          {notice}
        </div>
      )}

      <Footer />
    </div>
  );
}
=======
          onBack={() => navigate("home")}
          onAdd={(link) => {
            addLink(link)
            setNotice("Tautan baru berhasil ditambahkan")
          }}
          onDelete={(id) => {
            removeLink(id)
            setNotice("Tautan telah dihapus dari direktori")
          }}
        />
      )}
      <Toast message={notice} />
      <Footer />
    </div>
  )
}
>>>>>>> 7c7bdb2cd134ad60808723de9375e7876f0cc2f8
