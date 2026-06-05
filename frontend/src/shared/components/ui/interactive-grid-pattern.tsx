"use client"

import React, { useEffect, useState } from "react"

import { cn } from "@/shared/lib/utils"

interface InteractiveGridPatternProps extends React.SVGProps<SVGSVGElement> {
  width?: number
  height?: number
  squares?: [number, number]
  className?: string
  squaresClassName?: string
  activeClassName?: string
  loop?: boolean
  loopInterval?: number
}

export function InteractiveGridPattern({
  width = 40,
  height = 40,
  squares = [24, 24],
  className,
  squaresClassName,
  activeClassName,
  loop = false,
  loopInterval = 60,
  ...props
}: InteractiveGridPatternProps) {
  const [horizontal, vertical] = squares
  const [hoveredSquare, setHoveredSquare] = useState<number | null>(null)
  const [activeSquares, setActiveSquares] = useState<Set<number>>(new Set())

  useEffect(() => {
    if (!loop) return

    const total = horizontal * vertical
    let wave = 0

    const interval = setInterval(() => {
      const next = new Set<number>()
      for (let col = 0; col < horizontal; col++) {
        for (let row = 0; row < vertical; row++) {
          const diag = col + row
          const phase = diag % 18
          if (phase === wave % 18 || phase === (wave + 1) % 18) {
            next.add(row * horizontal + col)
          }
        }
      }
      setActiveSquares(next)
      wave = (wave + 1) % 18
    }, loopInterval)

    return () => clearInterval(interval)
  }, [loop, horizontal, vertical, loopInterval])

  return (
    <svg
      width={width * horizontal}
      height={height * vertical}
      className={cn(
        "absolute inset-0 h-full w-full border border-gray-400/30",
        className
      )}
      {...props}
    >
      {Array.from({ length: horizontal * vertical }).map((_, index) => {
        const x = (index % horizontal) * width
        const y = Math.floor(index / horizontal) * height
        const isActive = loop ? activeSquares.has(index) : hoveredSquare === index
        return (
          <rect
            key={index}
            x={x}
            y={y}
            width={width}
            height={height}
            className={cn(
              "stroke-gray-400/30 transition-all duration-300 ease-in-out",
              isActive
                ? (activeClassName ?? "fill-gray-300/30")
                : "fill-transparent",
              squaresClassName
            )}
            onMouseEnter={() => !loop && setHoveredSquare(index)}
            onMouseLeave={() => !loop && setHoveredSquare(null)}
          />
        )
      })}
    </svg>
  )
}
