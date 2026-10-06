import pelindoLogo from "@/assets/pelindo-logo.png"

export default function Footer() {
  return (
    <footer>
      <div className="footer-brand">
        <img src={pelindoLogo} alt="Pelindo" />
      </div>
      <p>Menghubungkan pelabuhan, menyatukan Indonesia.</p>
      <span>© 2025 · Nusantara</span>
    </footer>
  )
}
