"use client"

import { createContext, useContext } from "react"

interface HighlightContextType {
  highlightedElement: string | null
  highlightElement: (elementId: string | null) => void
}

export const HighlightContext = createContext<HighlightContextType>({
  highlightedElement: null,
  highlightElement: () => {},
})

export const useHighlight = () => useContext(HighlightContext)
