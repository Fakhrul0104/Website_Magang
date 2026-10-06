import { DEFAULT_LINKS } from "@/data/defaultLinks"
import type { LinkInput, LinkItem, LinkUpdate } from "@/types"

const STORAGE_KEY = "portal-samudra-links"

function persistLinks(links: LinkItem[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(links))
}

function normalizeUrl(url: string): string {
  const trimmedUrl = url.trim()
  return /^https?:\/\//i.test(trimmedUrl) ? trimmedUrl : `https://${trimmedUrl}`
}

function createId(): string {
  return typeof crypto.randomUUID === "function"
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(16).slice(2)}`
}

export function readLinks(): LinkItem[] {
  try {
    const savedLinks = localStorage.getItem(STORAGE_KEY)
    if (!savedLinks) {
      persistLinks(DEFAULT_LINKS)
      return [...DEFAULT_LINKS]
    }
    return JSON.parse(savedLinks) as LinkItem[]
  } catch {
    return [...DEFAULT_LINKS]
  }
}

export function createLink(input: LinkInput): LinkItem {
  const newLink: LinkItem = {
    ...input,
    id: createId(),
    title: input.title.trim(),
    description: input.description.trim(),
    url: normalizeUrl(input.url),
  }
  persistLinks([...readLinks(), newLink])
  return newLink
}

export function updateLink(id: string, update: LinkUpdate): LinkItem | null {
  let updatedLink: LinkItem | null = null
  const links = readLinks().map((link) => {
    if (link.id !== id) return link
    updatedLink = {
      ...link,
      ...update,
      url: update.url ? normalizeUrl(update.url) : link.url,
    }
    return updatedLink
  })
  persistLinks(links)
  return updatedLink
}

export function deleteLink(id: string): void {
  persistLinks(readLinks().filter((link) => link.id !== id))
}
