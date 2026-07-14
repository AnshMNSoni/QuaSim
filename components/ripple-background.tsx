"use client"

import React, { useEffect, useState } from "react"

interface CellProps {
  r: number
  c: number
  clickedCell: { r: number; c: number; t: number } | null
}

const Cell = ({ r, c, clickedCell }: CellProps) => {
  const [animate, setAnimate] = useState(false)
  const [delay, setDelay] = useState(0)

  useEffect(() => {
    if (!clickedCell) return
    
    // Calculate Euclidean distance from clicked cell
    const dist = Math.sqrt(Math.pow(r - clickedCell.r, 2) + Math.pow(c - clickedCell.c, 2))
    
    // Set animation delay based on distance
    setDelay(dist * 0.045) // speed of propagation
    setAnimate(true)
    
    // Reset animation state after it completes
    const timer = setTimeout(() => {
      setAnimate(false)
    }, 1000 + dist * 45)

    return () => clearTimeout(timer)
  }, [clickedCell, r, c])

  return (
    <div
      className={`border-r border-b border-neutral-900 transition-all duration-300 ${
        animate ? "animate-cell-ripple" : ""
      }`}
      style={{
        animationDelay: animate ? `${delay}s` : undefined,
      }}
    />
  )
}

export default function RippleBackground() {
  const [grid, setGrid] = useState({ rows: 0, cols: 0 })
  const [clickedCell, setClickedCell] = useState<{ r: number; c: number; t: number } | null>(null)
  const cellSize = 60 // Slightly larger cells for better grid aesthetics

  useEffect(() => {
    const calculateGrid = () => {
      const cols = Math.ceil(window.innerWidth / cellSize)
      const rows = Math.ceil(window.innerHeight / cellSize)
      setGrid({ rows, cols })
    }

    calculateGrid()
    window.addEventListener("resize", calculateGrid)
    return () => window.removeEventListener("resize", calculateGrid)
  }, [])

  // Auto-trigger an initial ripple from the center of the screen
  useEffect(() => {
    if (grid.rows > 0 && grid.cols > 0 && !clickedCell) {
      const timer = setTimeout(() => {
        setClickedCell({
          r: Math.floor(grid.rows / 2),
          c: Math.floor(grid.cols / 2),
          t: Date.now(),
        })
      }, 500)
      return () => clearTimeout(timer)
    }
  }, [grid, clickedCell])

  const cells = []
  for (let r = 0; r < grid.rows; r++) {
    for (let c = 0; c < grid.cols; c++) {
      cells.push(
        <Cell
          key={`${r}-${c}`}
          r={r}
          c={c}
          clickedCell={clickedCell}
        />
      )
    }
  }

  return (
    <div
      className="absolute inset-0 -z-10 w-full h-full overflow-hidden bg-neutral-950 cursor-pointer select-none"
      onClick={(e) => {
        const rect = e.currentTarget.getBoundingClientRect()
        const x = e.clientX - rect.left
        const y = e.clientY - rect.top
        const c = Math.floor(x / cellSize)
        const r = Math.floor(y / cellSize)
        setClickedCell({ r, c, t: Date.now() })
      }}
    >
      <style>{`
        @keyframes cell-ripple {
          0% {
            background-color: transparent;
          }
          15% {
            background-color: rgba(168, 85, 247, 0.25); /* Purple/Indigo ripple */
            box-shadow: inset 0 0 12px rgba(168, 85, 247, 0.15);
          }
          100% {
            background-color: transparent;
          }
        }
        .animate-cell-ripple {
          animation: cell-ripple 0.9s cubic-bezier(0.1, 0.8, 0.3, 1) forwards;
        }
      `}</style>
      <div
        className="grid w-full h-full border-t border-l border-neutral-900"
        style={{
          gridTemplateColumns: `repeat(${grid.cols}, 1fr)`,
          gridTemplateRows: `repeat(${grid.rows}, 1fr)`,
        }}
      >
        {cells}
      </div>
    </div>
  )
}
