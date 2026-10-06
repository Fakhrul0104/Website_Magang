import { useCallback, useState } from "react"

import * as linkService from "@/services/linkService"
import type { LinkInput, LinkItem, LinkUpdate } from "@/types"

export function useLinks() {
  const [links, setLinks] = useState<LinkItem[]>(() => linkService.readLinks())

  const addLink = useCallback((input: LinkInput) => {
    const createdLink = linkService.createLink(input)
    setLinks((currentLinks) => [...currentLinks, createdLink])
    return createdLink
  }, [])

  const editLink = useCallback((id: string, update: LinkUpdate) => {
    const updatedLink = linkService.updateLink(id, update)
    if (updatedLink) {
      setLinks((currentLinks) =>
        currentLinks.map((link) => (link.id === id ? updatedLink : link)),
      )
    }
    return updatedLink
  }, [])

  const removeLink = useCallback((id: string) => {
    linkService.deleteLink(id)
    setLinks((currentLinks) => currentLinks.filter((link) => link.id !== id))
  }, [])

  return { links, addLink, editLink, removeLink }
}
