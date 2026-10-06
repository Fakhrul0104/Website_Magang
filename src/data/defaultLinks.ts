import type { LinkItem } from "@/types"

export const CATEGORIES = [
  "Operasional",
  "Navigasi & Cuaca",
  "Administrasi",
] as const

export const DEFAULT_LINKS: LinkItem[] = [
  {
    id: "1",
    title: "Marine Traffic",
    description: "Pantau posisi kapal secara langsung",
    url: "https://www.marinetraffic.com",
    category: "Operasional",
    icon: "ship",
  },
  {
    id: "2",
    title: "Jadwal Sandar",
    description: "Informasi kedatangan dan keberangkatan",
    url: "https://www.pelindo.co.id",
    category: "Operasional",
    icon: "anchor",
  },
  {
    id: "3",
    title: "Cargo Portal",
    description: "Pelacakan dan status kargo",
    url: "https://www.insw.go.id",
    category: "Operasional",
    icon: "box",
  },
  {
    id: "4",
    title: "Peta Laut",
    description: "Peta perairan dan jalur pelayaran",
    url: "https://www.google.com/maps",
    category: "Navigasi & Cuaca",
    icon: "map",
  },
  {
    id: "5",
    title: "Prakiraan Maritim",
    description: "Cuaca, gelombang, dan arah angin",
    url: "https://maritim.bmkg.go.id",
    category: "Navigasi & Cuaca",
    icon: "cloud",
  },
  {
    id: "6",
    title: "Sistem Radio",
    description: "Frekuensi dan kanal komunikasi",
    url: "https://www.postel.go.id",
    category: "Navigasi & Cuaca",
    icon: "radio",
  },
  {
    id: "7",
    title: "Otoritas Pelabuhan",
    description: "Layanan resmi kepelabuhanan",
    url: "https://hubla.dephub.go.id",
    category: "Administrasi",
    icon: "globe",
  },
  {
    id: "8",
    title: "Dokumen Kapal",
    description: "Arsip dan pengurusan dokumen",
    url: "https://simlala.dephub.go.id",
    category: "Administrasi",
    icon: "book",
  },
  {
    id: "9",
    title: "Direktori Agen",
    description: "Kontak agen dan mitra pelabuhan",
    url: "https://www.inaportnet.com",
    category: "Administrasi",
    icon: "users",
  },
]
