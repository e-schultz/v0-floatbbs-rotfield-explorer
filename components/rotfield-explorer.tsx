"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Terminal, Eye, EyeOff, Layers, Book } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { ScrollArea } from "@/components/ui/scroll-area"

// Rotfield locations and their descriptions
const locations = {
  shacks: {
    name: "Conceptual Shacks",
    description: "Half-built structures housing ideas in various states of completion.",
    content:
      "Shacks are semi-permanent structures that house ideas without constraining them. Unlike the perfect architecture of cathedrals, shacks can be expanded, abandoned, rebuilt, and connected in ways their original builders never imagined.",
    necroDetails:
      "Shacks represent adaptable architecture - built from available materials, responsive to immediate needs rather than grand plans. They collapse when necessary and can be rebuilt in new forms.",
    connections: ["boardwalks", "gardens"],
    color: "text-indigo-400",
    bgColor: "bg-indigo-950/30",
    borderColor: "border-indigo-800/50",
  },
  boardwalks: {
    name: "Connecting Boardwalks",
    description: "Rickety paths connecting disparate ideas across the swamp.",
    content:
      "The boardwalks are minimal connections between ideas – not rigid highways, but flexible paths that shift with the landscape. They allow for wandering, for getting lost, for discovering new connections between seemingly unrelated shacks of thought.",
    necroDetails:
      "Boardwalks represent the minimal viable structure needed to move between ideas without getting completely lost in the swamp. They're deliberately imperfect, requiring attention and care from the traveler.",
    connections: ["shacks", "gardens", "bonePiles", "bulletinBoards"],
    color: "text-green-400",
    bgColor: "bg-green-950/30",
    borderColor: "border-green-800/50",
  },
  gardens: {
    name: "Knowledge Gardens",
    description: "Plots of cultivated ideas growing amid the fertile rot.",
    content:
      "Gardens represent areas where knowledge is actively cultivated. They exist in a productive tension between order and chaos, between deliberate growth and wild emergence. Unlike sterile databases, gardens require tending, seasonal shifts, and accept that some plants will die while others unexpectedly thrive.",
    necroDetails:
      "Gardens embrace the organic nature of knowledge - it grows, withers, transforms, and seeds new growth in unexpected places.",
    connections: ["shacks", "boardwalks", "bonePiles"],
    color: "text-emerald-400",
    bgColor: "bg-emerald-950/30",
    borderColor: "border-emerald-800/50",
  },
  bonePiles: {
    name: "Memory Bone Piles",
    description: "Heaps of old notes, abandoned drafts, and conversation fragments.",
    content:
      "Bone piles are the remains of past thinking - chat logs, notes, abandoned drafts, and fragments that didn't become anything formal. But in Rotfield, these aren't considered failures or waste. They're raw material for note necromancy - the art of raising new meaning from what looks like ruin.",
    necroDetails:
      "Bone piles recognize that apparent failure and decay are essential parts of knowledge work. They honor what didn't work while extracting value from its remains.",
    connections: ["boardwalks", "gardens"],
    color: "text-rose-400",
    bgColor: "bg-rose-950/30",
    borderColor: "border-rose-800/50",
  },
  bulletinBoards: {
    name: "Community Bulletin Boards",
    description: "Weather-worn boards covered with notes, questions, and invitations.",
    content:
      "Bulletin boards serve as invitation spaces where questions, reflections, and possibilities can be posted without immediate pressure to develop them. They're spaces of potential connection, where wanderers can leave traces for others to discover.",
    necroDetails:
      "Bulletin boards create low-stakes entry points into complex ideas. They invite participation, question-asking, and tentative connections.",
    connections: ["boardwalks"],
    color: "text-amber-400",
    bgColor: "bg-amber-950/30",
    borderColor: "border-amber-800/50",
  },
}

// Terminal command processor
const processCommand = (
  cmd: string,
  setOutput: (fn: (prev: string[]) => string[]) => void,
  setLocation: (loc: string) => void,
) => {
  const command = cmd.trim().toLowerCase()

  if (command === "help") {
    setOutput((prev) => [
      ...prev,
      "Available commands:",
      "  help - Show this help message",
      "  visit [location] - Navigate to a location (shacks, boardwalks, gardens, bonePiles, bulletinBoards)",
      "  about - About Rotfield",
      "  clear - Clear terminal output",
    ])
  } else if (command === "about") {
    setOutput((prev) => [
      ...prev,
      "Rotfield: Gardens of Shacks",
      "A living swamp of knowledge, ideas, and connections.",
      "Built on the philosophy of 'Shacks, Not Cathedrals'",
      "Version 0.3.4 - FLOAT Memory Engine Active",
    ])
  } else if (command === "clear") {
    setOutput(() => [])
  } else if (command.startsWith("visit ")) {
    const loc = command.split(" ")[1]
    const validLocations = ["shacks", "boardwalks", "gardens", "bonepiles", "bulletinboards"]

    if (validLocations.includes(loc)) {
      const normalizedLoc = loc === "bonepiles" ? "bonePiles" : loc === "bulletinboards" ? "bulletinBoards" : loc
      setLocation(normalizedLoc)
      setOutput((prev) => [...prev, `Navigating to ${locations[normalizedLoc as keyof typeof locations].name}...`])
    } else {
      setOutput((prev) => [
        ...prev,
        `Unknown location: ${loc}. Valid locations are: shacks, boardwalks, gardens, bonePiles, bulletinBoards`,
      ])
    }
  } else {
    setOutput((prev) => [...prev, `Unknown command: ${command}. Type 'help' for available commands.`])
  }
}

// Terminal component
function TerminalPanel() {
  const [input, setInput] = useState("")
  const [output, setOutput] = useState<string[]>([
    "FLOAT.Rotfield v0.3.4 - Terminal Ready",
    "Type 'help' for available commands",
  ])
  const [cursorVisible, setCursorVisible] = useState(true)
  const [currentLocation, setCurrentLocation] = useState("boardwalks")
  const outputRef = useRef<HTMLDivElement>(null)

  // Cursor blink effect
  useEffect(() => {
    const interval = setInterval(() => {
      setCursorVisible((prev) => !prev)
    }, 530)
    return () => clearInterval(interval)
  }, [])

  // Scroll to bottom of output
  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight
    }
  }, [output])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    setOutput((prev) => [...prev, `> ${input}`])
    processCommand(input, setOutput, setCurrentLocation)
    setInput("")
  }

  return (
    <div className="flex flex-col h-full border border-green-900/50 bg-black/80 rounded-md overflow-hidden">
      <div className="bg-green-950/30 px-3 py-1.5 border-b border-green-900/50 text-green-400 text-sm font-mono flex justify-between items-center">
        <div>FLOAT.terminal</div>
        <div className="text-xs text-green-600">v0.3.4</div>
      </div>

      <ScrollArea ref={outputRef} className="flex-grow p-3 font-mono text-sm">
        {output.map((line, i) => (
          <div key={i} className={cn("mb-1", line.startsWith(">") ? "text-blue-400" : "text-green-300")}>
            {line}
          </div>
        ))}
      </ScrollArea>

      <form onSubmit={handleSubmit} className="flex items-center border-t border-green-900/50 p-2">
        <span className="text-green-500 mr-2">{">"}</span>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-grow bg-transparent border-none outline-none text-green-300 font-mono"
          placeholder="Type a command..."
        />
        <span className={cn("w-2 h-4 bg-green-400", cursorVisible ? "opacity-100" : "opacity-0")}></span>
      </form>
    </div>
  )
}

// Map component
function RotfieldMap({
  activeLocation,
  setActiveLocation,
  necroMode,
}: {
  activeLocation: string
  setActiveLocation: (loc: string) => void
  necroMode: boolean
}) {
  return (
    <div className="relative w-full h-full">
      {/* Background texture - swamp */}
      <div
        className="absolute inset-0 opacity-20 pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%23005000' fillOpacity='0.1' fillRule='evenodd'/%3E%3C/svg%3E")`,
          backgroundColor: "#050505",
        }}
      />

      {/* Map elements */}
      <svg viewBox="0 0 800 600" className="w-full h-full">
        {/* Boardwalks */}
        <g opacity="0.9">
          {/* Central boardwalk */}
          <path
            d="M400,600 L400,350 L450,300 L500,200 L400,150"
            fill="none"
            stroke={necroMode ? "#905080" : "#2a1a0a"}
            strokeWidth="15"
            strokeOpacity="0.7"
            className={cn(activeLocation === "boardwalks" ? "stroke-green-500" : "")}
          />
          <path
            d="M400,600 L400,350 L450,300 L500,200 L400,150"
            fill="none"
            stroke={necroMode ? "#503c28" : "#1a0f00"}
            strokeWidth="8"
            strokeDasharray="30,8,5,8"
            className={cn(activeLocation === "boardwalks" ? "stroke-green-300" : "")}
            onClick={() => setActiveLocation("boardwalks")}
            style={{ cursor: "pointer" }}
          />

          {/* Branch to shack */}
          <path
            d="M400,350 L300,250 L250,220"
            fill="none"
            stroke={necroMode ? "#905080" : "#2a1a0a"}
            strokeWidth="12"
            strokeOpacity="0.7"
          />
          <path
            d="M400,350 L300,250 L250,220"
            fill="none"
            stroke={necroMode ? "#503c28" : "#1a0f00"}
            strokeWidth="6"
            strokeDasharray="20,7,3,7"
            onClick={() => setActiveLocation("boardwalks")}
            style={{ cursor: "pointer" }}
          />

          {/* Branch to bone pile */}
          <path
            d="M400,350 L200,450 L120,520"
            fill="none"
            stroke={necroMode ? "#905080" : "#2a1a0a"}
            strokeWidth="12"
            strokeOpacity="0.7"
          />
          <path
            d="M400,350 L200,450 L120,520"
            fill="none"
            stroke={necroMode ? "#503c28" : "#1a0f00"}
            strokeWidth="6"
            strokeDasharray="20,7,3,7"
            onClick={() => setActiveLocation("boardwalks")}
            style={{ cursor: "pointer" }}
          />

          {/* Branch to garden */}
          <path
            d="M450,300 L550,350 L650,480"
            fill="none"
            stroke={necroMode ? "#905080" : "#2a1a0a"}
            strokeWidth="12"
            strokeOpacity="0.7"
          />
          <path
            d="M450,300 L550,350 L650,480"
            fill="none"
            stroke={necroMode ? "#503c28" : "#1a0f00"}
            strokeWidth="6"
            strokeDasharray="20,7,3,7"
            onClick={() => setActiveLocation("boardwalks")}
            style={{ cursor: "pointer" }}
          />

          {/* Branch to bulletin board */}
          <path
            d="M500,200 L600,180 L650,170"
            fill="none"
            stroke={necroMode ? "#905080" : "#2a1a0a"}
            strokeWidth="12"
            strokeOpacity="0.7"
          />
          <path
            d="M500,200 L600,180 L650,170"
            fill="none"
            stroke={necroMode ? "#503c28" : "#1a0f00"}
            strokeWidth="6"
            strokeDasharray="20,7,3,7"
            onClick={() => setActiveLocation("boardwalks")}
            style={{ cursor: "pointer" }}
          />
        </g>

        {/* Shack 1 */}
        <g
          transform="translate(250, 220)"
          onClick={() => setActiveLocation("shacks")}
          style={{ cursor: "pointer" }}
          className={cn(activeLocation === "shacks" ? "opacity-100" : "opacity-80")}
        >
          <path
            d="M-30,-40 L30,-40 L40,-10 L20,30 L-20,25 L-40,-15 Z"
            fill={activeLocation === "shacks" ? "#4338ca" : "#0a0a14"}
            stroke={activeLocation === "shacks" ? "#818cf8" : "#2a2a3a"}
            strokeWidth="2"
          />
          <rect
            x="-15"
            y="-20"
            width="15"
            height="15"
            fill={activeLocation === "shacks" ? "#4338ca" : "#2a2a3a"}
            stroke="#1a1a2a"
          />
          <rect
            x="10"
            y="-15"
            width="10"
            height="25"
            fill={activeLocation === "shacks" ? "#4338ca" : "#2a2a3a"}
            stroke="#1a1a2a"
          />
          <polygon points="30,-40 40,-10 30,-10 20,-40" fill="#1a1a2a" />
          <circle cx="0" cy="0" r="20" fill={necroMode ? "url(#shackGlowNecro)" : "url(#shackGlow)"} opacity="0.5" />
          <text
            x="0"
            y="50"
            fontFamily="monospace"
            fontSize="12"
            fill={activeLocation === "shacks" ? "#818cf8" : "#4a4a6a"}
            textAnchor="middle"
          >
            Shack
          </text>
        </g>

        {/* Shack 2 */}
        <g
          transform="translate(400, 150)"
          onClick={() => setActiveLocation("shacks")}
          style={{ cursor: "pointer" }}
          className={cn(activeLocation === "shacks" ? "opacity-100" : "opacity-80")}
        >
          <path
            d="M-35,-30 L25,-35 L40,-5 L30,25 L-25,30 L-45,0 Z"
            fill={activeLocation === "shacks" ? "#4338ca" : "#0a0a14"}
            stroke={activeLocation === "shacks" ? "#818cf8" : "#2a2a3a"}
            strokeWidth="2"
          />
          <rect
            x="-20"
            y="-10"
            width="12"
            height="15"
            fill={activeLocation === "shacks" ? "#4338ca" : "#2a2a3a"}
            stroke="#1a1a2a"
          />
          <rect
            x="5"
            y="-20"
            width="15"
            height="20"
            fill={activeLocation === "shacks" ? "#4338ca" : "#2a2a3a"}
            stroke="#1a1a2a"
          />
          <polygon points="25,-35 40,-5 30,-5 15,-35" fill="#1a1a2a" />
          <circle cx="0" cy="0" r="25" fill={necroMode ? "url(#shackGlowNecro)" : "url(#shackGlow)"} opacity="0.6" />
          <text
            x="0"
            y="45"
            fontFamily="monospace"
            fontSize="12"
            fill={activeLocation === "shacks" ? "#818cf8" : "#4a4a6a"}
            textAnchor="middle"
          >
            Shack
          </text>
        </g>

        {/* Bone pile */}
        <g
          transform="translate(120, 520)"
          opacity={activeLocation === "bonePiles" ? "1" : "0.8"}
          onClick={() => setActiveLocation("bonePiles")}
          style={{ cursor: "pointer" }}
        >
          <path
            d="M0,0 L15,-45 L25,-40 L40,-70 L50,-65 L60,-85 L80,-75 L85,-40 L100,-30 L70,-10 Z"
            fill={activeLocation === "bonePiles" ? "#9f1239" : "#2a1a28"}
          />
          <path
            d="M10,-20 L20,-60 L30,-55 L35,-75 L45,-70 L55,-80 L65,-60 L75,-50 L90,-40 L60,-5 Z"
            fill={activeLocation === "bonePiles" ? "#881337" : "#1a0f1a"}
          />
          <circle cx="25" cy="-30" r="4" fill={activeLocation === "bonePiles" ? "#fda4af" : "#503445"} />
          <circle cx="50" cy="-50" r="3" fill={activeLocation === "bonePiles" ? "#fda4af" : "#503445"} />
          <circle cx="75" cy="-35" r="5" fill={activeLocation === "bonePiles" ? "#fda4af" : "#503445"} />
          <text
            x="50"
            y="20"
            fontFamily="monospace"
            fontSize="12"
            fill={activeLocation === "bonePiles" ? "#fda4af" : "#905080"}
            textAnchor="middle"
          >
            Bone Pile
          </text>
        </g>

        {/* Garden plot */}
        <g
          transform="translate(650, 480)"
          opacity={activeLocation === "gardens" ? "1" : "0.8"}
          onClick={() => setActiveLocation("gardens")}
          style={{ cursor: "pointer" }}
        >
          <rect
            x="-60"
            y="-40"
            width="120"
            height="80"
            fill={activeLocation === "gardens" ? "#064e3b" : "#0a150a"}
            stroke={activeLocation === "gardens" ? "#10b981" : "#1e3b1e"}
            strokeWidth="1"
          />
          <line
            x1="-60"
            y1="-40"
            x2="60"
            y2="-40"
            stroke={activeLocation === "gardens" ? "#10b981" : "#1e3b1e"}
            strokeWidth="2"
            strokeDasharray="5,3"
          />
          <line
            x1="-60"
            y1="40"
            x2="60"
            y2="40"
            stroke={activeLocation === "gardens" ? "#10b981" : "#1e3b1e"}
            strokeWidth="2"
            strokeDasharray="5,3"
          />
          <line
            x1="-60"
            y1="-40"
            x2="-60"
            y2="40"
            stroke={activeLocation === "gardens" ? "#10b981" : "#1e3b1e"}
            strokeWidth="2"
            strokeDasharray="5,3"
          />
          <line
            x1="60"
            y1="-40"
            x2="60"
            y2="40"
            stroke={activeLocation === "gardens" ? "#10b981" : "#1e3b1e"}
            strokeWidth="2"
            strokeDasharray="5,3"
          />
          <circle cx="-30" cy="-20" r="5" fill={activeLocation === "gardens" ? "#10b981" : "#1e3b1e"} />
          <circle cx="-10" cy="15" r="6" fill={activeLocation === "gardens" ? "#10b981" : "#214021"} />
          <circle cx="20" cy="-10" r="4" fill={activeLocation === "gardens" ? "#10b981" : "#2a502a"} />
          <circle cx="40" cy="25" r="7" fill={activeLocation === "gardens" ? "#10b981" : "#1e3b1e"} />
          <text
            x="0"
            y="60"
            fontFamily="monospace"
            fontSize="12"
            fill={activeLocation === "gardens" ? "#10b981" : "#2a502a"}
            textAnchor="middle"
          >
            Garden Plot
          </text>
        </g>

        {/* Bulletin board */}
        <g
          transform="translate(650, 170)"
          opacity={activeLocation === "bulletinBoards" ? "1" : "0.8"}
          onClick={() => setActiveLocation("bulletinBoards")}
          style={{ cursor: "pointer" }}
        >
          <rect
            x="-50"
            y="-40"
            width="100"
            height="80"
            fill={activeLocation === "bulletinBoards" ? "#78350f" : "#2a1a0a"}
            stroke={activeLocation === "bulletinBoards" ? "#fbbf24" : "#503c28"}
            strokeWidth="2"
          />
          <line
            x1="-40"
            y1="-30"
            x2="40"
            y2="-30"
            stroke={activeLocation === "bulletinBoards" ? "#fbbf24" : "#503c28"}
            strokeWidth="1"
          />
          <line
            x1="-40"
            y1="-15"
            x2="40"
            y2="-15"
            stroke={activeLocation === "bulletinBoards" ? "#fbbf24" : "#503c28"}
            strokeWidth="1"
          />
          <line
            x1="-40"
            y1="0"
            x2="40"
            y2="0"
            stroke={activeLocation === "bulletinBoards" ? "#fbbf24" : "#503c28"}
            strokeWidth="1"
          />
          <line
            x1="-40"
            y1="15"
            x2="40"
            y2="15"
            stroke={activeLocation === "bulletinBoards" ? "#fbbf24" : "#503c28"}
            strokeWidth="1"
          />
          <line
            x1="-40"
            y1="30"
            x2="40"
            y2="30"
            stroke={activeLocation === "bulletinBoards" ? "#fbbf24" : "#503c28"}
            strokeWidth="1"
          />
          <rect
            x="-35"
            y="-25"
            width="10"
            height="5"
            fill={activeLocation === "bulletinBoards" ? "#fbbf24" : "#cc9966"}
            opacity="0.6"
          />
          <rect
            x="10"
            y="-25"
            width="15"
            height="5"
            fill={activeLocation === "bulletinBoards" ? "#fbbf24" : "#cc9966"}
            opacity="0.6"
          />
          <rect
            x="-20"
            y="-10"
            width="25"
            height="5"
            fill={activeLocation === "bulletinBoards" ? "#fbbf24" : "#cc9966"}
            opacity="0.6"
          />
          <rect
            x="15"
            y="5"
            width="20"
            height="5"
            fill={activeLocation === "bulletinBoards" ? "#fbbf24" : "#cc9966"}
            opacity="0.6"
          />
          <rect
            x="-30"
            y="20"
            width="18"
            height="5"
            fill={activeLocation === "bulletinBoards" ? "#fbbf24" : "#cc9966"}
            opacity="0.6"
          />
          <text
            x="0"
            y="60"
            fontFamily="monospace"
            fontSize="12"
            fill={activeLocation === "bulletinBoards" ? "#fbbf24" : "#cc9966"}
            textAnchor="middle"
          >
            Bulletin Board
          </text>
        </g>

        {/* Water ripples */}
        <circle cx="300" cy="400" r="15" fill="none" stroke="#1a3b3b" strokeWidth="1" opacity="0.3" />
        <circle cx="300" cy="400" r="30" fill="none" stroke="#1a3b3b" strokeWidth="1" opacity="0.2" />
        <circle cx="600" cy="300" r="20" fill="none" stroke="#1a3b3b" strokeWidth="1" opacity="0.3" />
        <circle cx="600" cy="300" r="40" fill="none" stroke="#1a3b3b" strokeWidth="1" opacity="0.2" />
        <circle cx="450" cy="500" r="25" fill="none" stroke="#1a3b3b" strokeWidth="1" opacity="0.3" />
        <circle cx="450" cy="500" r="50" fill="none" stroke="#1a3b3b" strokeWidth="1" opacity="0.2" />

        {/* Title */}
        <g transform="translate(400, 50)">
          <text x="0" y="0" fontFamily="monospace" fontSize="28" fill="#3a5a3a" textAnchor="middle" opacity="0.8">
            ROTFIELD
          </text>
          <text x="0" y="25" fontFamily="monospace" fontSize="16" fill="#905080" textAnchor="middle" opacity="0.7">
            Gardens of Shacks
          </text>
        </g>

        {/* Definitions */}
        <defs>
          <radialGradient id="shackGlow" cx="0.5" cy="0.5" r="0.5" fx="0.5" fy="0.5">
            <stop offset="0%" stopColor="#4a4a6a" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#2a2a3a" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="shackGlowNecro" cx="0.5" cy="0.5" r="0.5" fx="0.5" fy="0.5">
            <stop offset="0%" stopColor="#905080" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#503c28" stopOpacity="0" />
          </radialGradient>
        </defs>
      </svg>
    </div>
  )
}

// Location details component
function LocationDetails({ location, necroMode }: { location: string; necroMode: boolean }) {
  const loc = locations[location as keyof typeof locations]

  if (!loc) return null

  return (
    <div className="space-y-4">
      <div className={cn("border rounded-md overflow-hidden", necroMode ? "border-pink-800/50" : loc.borderColor)}>
        <div className="p-4">
          <h2 className={cn("text-2xl font-bold mb-2", necroMode ? "text-pink-400" : loc.color)}>{loc.name}</h2>
          <p className="text-gray-400 mb-4 italic">{loc.description}</p>
          <div className={cn("p-4 rounded-md", necroMode ? "bg-pink-900/10 text-pink-100" : loc.bgColor)}>
            {loc.content}
          </div>
        </div>
      </div>

      {/* Necromantic insights */}
      {necroMode && (
        <div className="border border-pink-800/50 rounded-md p-4">
          <h3 className="text-pink-400 text-lg mb-4 flex items-center">
            <span className="mr-2 text-2xl">⦿</span>
            Necromantic Insights
          </h3>
          <div className="border border-pink-800/30 p-3 rounded-md bg-black/50">
            <p className="text-gray-400">{loc.necroDetails}</p>
          </div>
        </div>
      )}

      {/* Connections */}
      <div className={cn("border rounded-md p-4", necroMode ? "border-pink-800/50" : loc.borderColor)}>
        <h3 className={cn("text-lg mb-3", necroMode ? "text-pink-400" : loc.color)}>Connecting Boardwalks</h3>
        <div className="space-y-2">
          {loc.connections.map((connection) => {
            const connLoc = locations[connection as keyof typeof locations]
            return (
              <div
                key={connection}
                className={cn(
                  "w-full text-left px-3 py-2 rounded-sm mb-2 text-sm border-l-2",
                  necroMode
                    ? "border-pink-700 bg-pink-900/10 text-pink-300 hover:bg-pink-900/20"
                    : `border-${connLoc.color.split("-")[1]}-700 ${connLoc.bgColor} ${connLoc.color} hover:bg-opacity-20`,
                )}
              >
                ↝ {connLoc.name}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

// Float principles component
function FloatPrinciples() {
  return (
    <div className="space-y-4">
      <div className="border border-gray-800 rounded-md p-4 bg-black/30">
        <h3 className="text-xl font-bold mb-3 text-white">FLOAT Principles</h3>

        <div className="space-y-6">
          <div>
            <h4 className="text-lg font-medium text-purple-400 mb-1 flex items-center">
              <span className="mr-2">⊟</span>RITUAL
            </h4>
            <p className="text-cyan-300 text-sm mb-2">STRUCTURE WITHOUT PRESSURE</p>
            <p className="text-gray-400 text-sm">
              Rituals provide structure without rigidity. They're adaptable containers for thought and action that
              reduce cognitive load without imposing constraints.
            </p>
          </div>

          <div>
            <h4 className="text-lg font-medium text-purple-400 mb-1 flex items-center">
              <span className="mr-2">≈</span>RESONANCE
            </h4>
            <p className="text-cyan-300 text-sm mb-2">TRUST THE SIGNAL</p>
            <p className="text-gray-400 text-sm">
              Resonance is the art of recognizing patterns that matter. It's about trusting intuitive connections and
              allowing them to guide exploration.
            </p>
          </div>

          <div>
            <h4 className="text-lg font-medium text-purple-400 mb-1 flex items-center">
              <span className="mr-2">↻</span>RECURSION
            </h4>
            <p className="text-cyan-300 text-sm mb-2">REFINE BY RETURNING</p>
            <p className="text-gray-400 text-sm">
              Recursion embraces the cycle of revisiting and refining. Each return to an idea transforms it, creating
              depth through iteration.
            </p>
          </div>
        </div>
      </div>

      <div className="border border-gray-800 rounded-md p-4 bg-black/30">
        <h3 className="text-xl font-bold mb-3 text-white">Fragments & Bones</h3>
        <div className="text-sm space-y-2">
          <div className="p-2 text-pink-300">"Boundary ≠ Wall"</div>
          <div className="p-2 text-pink-300">"Bone Piles Are Sacred"</div>
          <div className="p-2 text-pink-300">"Living Systems Must Decay"</div>
          <div className="p-2 text-pink-300">"You don't organize knowledge. You compost it."</div>
        </div>
      </div>
    </div>
  )
}

// Main component
export function RotfieldExplorer() {
  const [necroMode, setNecroMode] = useState(false)
  const [activeLocation, setActiveLocation] = useState("boardwalks")
  const [showTerminal, setShowTerminal] = useState(false)
  const [activeTab, setActiveTab] = useState("map")

  return (
    <div className="min-h-screen flex flex-col bg-black text-gray-300">
      {/* Header */}
      <header className="bg-black border-b border-green-900/50 p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center">
            <div className="mr-2 text-pink-500">∞</div>
            <h1 className="text-xl font-bold">
              <span className="text-green-500">FLOAT.</span>
              <span className="text-pink-500">Rotfield</span>
              <span className="text-gray-600 text-sm ml-2">v0.3.4</span>
            </h1>
          </div>
          <div className="flex space-x-3">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setNecroMode(!necroMode)}
                    className={cn(
                      "border-gray-700 text-sm",
                      necroMode && "bg-pink-900/30 text-pink-400 border-pink-700",
                    )}
                  >
                    {necroMode ? <EyeOff size={16} className="mr-2" /> : <Eye size={16} className="mr-2" />}
                    {necroMode ? "NECROMANTIC SIGHT ACTIVE" : "NECROMANTIC SIGHT"}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Toggle necromantic sight to reveal hidden connections</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setShowTerminal(!showTerminal)}
                    className="border-gray-700"
                  >
                    <Terminal size={18} className="text-green-500" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Open terminal</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-grow relative">
        {/* Background texture - swamp */}
        <div
          className="absolute inset-0 opacity-20 pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%23005000' fillOpacity='0.1' fillRule='evenodd'/%3E%3C/svg%3E")`,
            backgroundColor: "#050505",
          }}
        />

        <div className="max-w-7xl mx-auto p-6 relative">
          {/* Navigation - location tabs */}
          <div className="mb-6 overflow-x-auto scrollbar-hide">
            <Tabs value={activeLocation} onValueChange={setActiveLocation}>
              <TabsList className="w-full border-b border-green-900/30 bg-transparent">
                {Object.entries(locations).map(([key, loc]) => (
                  <TabsTrigger
                    key={key}
                    value={key}
                    className={cn(
                      "px-4 py-2 text-sm transition-colors whitespace-nowrap data-[state=active]:shadow-none",
                      activeLocation === key
                        ? necroMode
                          ? "text-pink-400 border-b-2 border-pink-500"
                          : `${loc.color} border-b-2 border-${loc.color.split("-")[1]}-500`
                        : "text-gray-500 hover:text-gray-300 data-[state=active]:bg-transparent",
                    )}
                  >
                    {loc.name}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>

          {/* Main content area */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left panel - Map or Terminal */}
            <div className="lg:col-span-8 space-y-6">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="mb-4">
                  <TabsTrigger value="map" className="flex items-center">
                    <Layers size={16} className="mr-2" />
                    Map View
                  </TabsTrigger>
                  <TabsTrigger value="terminal" className="flex items-center">
                    <Terminal size={16} className="mr-2" />
                    Terminal
                  </TabsTrigger>
                  <TabsTrigger value="about" className="flex items-center">
                    <Book size={16} className="mr-2" />
                    About
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="map" className="h-[500px] border border-gray-800 rounded-md overflow-hidden">
                  <RotfieldMap
                    activeLocation={activeLocation}
                    setActiveLocation={setActiveLocation}
                    necroMode={necroMode}
                  />
                </TabsContent>

                <TabsContent value="terminal" className="h-[500px]">
                  <TerminalPanel />
                </TabsContent>

                <TabsContent value="about" className="h-[500px] overflow-auto border border-gray-800 rounded-md p-4">
                  <h2 className="text-2xl font-bold mb-4">Shacks, Not Cathedrals</h2>
                  <p className="mb-4 text-gray-300">
                    Rotfield grew from burnout. A way to build that embraces imperfection, adaptability, and organic
                    growth.
                  </p>
                  <p className="mb-4 text-gray-300">
                    In this swamp, we learn: don't build cathedrals—perfect, rigid, doomed to crumble. Build
                    shacks—adaptable, alive, forgiving.
                  </p>
                  <p className="mb-4 text-gray-300">
                    Rotfield isn't just a metaphor—it's how we build. Shacks for half-built ideas. Boardwalks linking
                    thoughts, always mending. Gardens for tended knowledge. Bone piles—chat logs, old notes—sacred ruins
                    for note necromancy.
                  </p>
                  <p className="mb-4 text-gray-300">
                    From Rotfield came FLOAT—a ritual, not a product. A system to hold chaos without purity. Small
                    pieces, loosely joined, built for neuroqueer cognition.
                  </p>
                  <blockquote className="border-l-4 border-pink-500 pl-4 my-6 text-gray-400 italic">
                    "This is not a cathedral. This is Rotfield — the living field of the Bloom Keeper."
                  </blockquote>
                </TabsContent>
              </Tabs>

              <LocationDetails location={activeLocation} necroMode={necroMode} />
            </div>

            {/* Right panel - FLOAT principles */}
            <div className="lg:col-span-4 space-y-6">
              <FloatPrinciples />
            </div>
          </div>
        </div>
      </main>

      {/* Terminal overlay */}
      {showTerminal && (
        <div className="fixed bottom-0 right-0 w-full md:w-1/2 h-2/5 bg-black/95 border-t border-l border-green-900 overflow-hidden">
          <TerminalPanel />
        </div>
      )}

      {/* Footer */}
      <footer className="bg-black border-t border-green-900/30 p-3 text-xs text-gray-600">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div>FLOAT.Rotfield © 2025</div>
          <div>necromancy::active • mycelium::thriving • decay::fertile</div>
        </div>
      </footer>
    </div>
  )
}
