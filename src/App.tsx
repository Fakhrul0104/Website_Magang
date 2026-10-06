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
