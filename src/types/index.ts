export type IconName = "anchor" | "ship" | "compass" | "map" | "radio" | "cloud" | "book" | "users" | "globe" | "box"

export interface LinkItem {
  id: string
  title: string
  description: string
  url: string
  category: string
  icon: IconName
  image?: string
}

export type LinkInput = Omit<LinkItem, "id">
export type LinkUpdate = Partial<LinkInput>
export type PageName = "home" | "manage"
