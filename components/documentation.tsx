"use client"

import type React from "react"

import { useState } from "react"
import { X, ChevronDown, ChevronRight, Sparkles, Zap, Cpu, Eye, BookOpen } from "lucide-react"
import { Button } from "@/components/ui/button"

interface DocumentationProps {
  isOpen: boolean
  onClose: () => void
}

export function Documentation({ isOpen, onClose }: DocumentationProps) {
  const [expandedSections, setExpandedSections] = useState<string[]>(["getting-started"])

  const toggleSection = (sectionId: string) => {
    setExpandedSections((prev) =>
      prev.includes(sectionId) ? prev.filter((id) => id !== sectionId) : [...prev, sectionId],
    )
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-gray-900 dark:to-gray-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center">
              <BookOpen className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">QuaSim Documentation</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">Your guide to quantum circuit simulation</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            aria-label="Close documentation"
            className="rounded-full hover:bg-white/50 dark:hover:bg-gray-700"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {/* Getting Started */}
          <Section
            id="getting-started"
            title="Getting Started"
            icon={<Sparkles className="h-5 w-5" />}
            isExpanded={expandedSections.includes("getting-started")}
            onToggle={() => toggleSection("getting-started")}
          >
            <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
              QuaSim is a web-based quantum circuit simulator that allows you to build, visualize, and simulate quantum
              circuits interactively. Perfect for students, researchers, and quantum enthusiasts.
            </p>
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg p-4 space-y-2">
              <h4 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <Zap className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                Quick Start
              </h4>
              <ol className="space-y-2 text-sm text-gray-700 dark:text-gray-300 list-decimal list-inside ml-2">
                <li>Add qubits using the "Add Qubit" button</li>
                <li>Select quantum gates from the left panel (desktop) or gate list (mobile)</li>
                <li>Place gates by dragging and dropping (desktop) or tapping (mobile)</li>
                <li>Click "Simulate" to run your circuit and view results</li>
              </ol>
            </div>
          </Section>

          {/* Gate Placement */}
          <Section
            id="gate-placement"
            title="Gate Placement"
            icon={<Cpu className="h-5 w-5" />}
            isExpanded={expandedSections.includes("gate-placement")}
            onToggle={() => toggleSection("gate-placement")}
          >
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Desktop</h4>
                <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                  Drag gates from the left panel and drop them onto the circuit grid. Gates automatically align to
                  available positions on qubit lines.
                </p>
              </div>
              <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Mobile</h4>
                <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                  Tap a gate to select it (it will be highlighted), then tap on the circuit grid where you want to place
                  it. For multi-qubit gates, tap on the control qubit first.
                </p>
              </div>
            </div>
          </Section>

          {/* Simulation Flow */}
          <Section
            id="simulation-flow"
            title="Simulation Flow"
            icon={<Zap className="h-5 w-5" />}
            isExpanded={expandedSections.includes("simulation-flow")}
            onToggle={() => toggleSection("simulation-flow")}
          >
            <div className="space-y-3">
              {[
                "Build your quantum circuit by adding gates and operations",
                "Click the 'Simulate' button to execute the circuit",
                "View results in different visualization modes: Circuit, Bloch Sphere, Histogram, State Vector, or Truth Table",
                "Analyze the quantum state and measurement probabilities",
              ].map((step, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-gradient-to-br from-purple-500 to-pink-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                    {index + 1}
                  </div>
                  <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed pt-0.5">{step}</p>
                </div>
              ))}
            </div>
          </Section>

          {/* Quantum Gates */}
          <Section
            id="quantum-gates"
            title="Quantum Gates"
            icon={<Cpu className="h-5 w-5" />}
            isExpanded={expandedSections.includes("quantum-gates")}
            onToggle={() => toggleSection("quantum-gates")}
          >
            <div className="space-y-4">
              <GateCategory
                title="Single-Qubit Gates"
                description="Operations on individual qubits"
                gates={[
                  { name: "H", desc: "Hadamard - Creates superposition" },
                  { name: "X, Y, Z", desc: "Pauli gates - Bit and phase flips" },
                  { name: "S, T", desc: "Phase gates" },
                  { name: "RX, RY, RZ", desc: "Rotation gates" },
                  { name: "U, U3", desc: "Universal single-qubit gates" },
                  { name: "SX", desc: "Square root of X gate" },
                ]}
              />

              <GateCategory
                title="Multi-Qubit Gates"
                description="Operations involving multiple qubits"
                gates={[
                  { name: "CNOT (CX)", desc: "Controlled-X gate" },
                  { name: "CY, CZ", desc: "Controlled Y and Z" },
                  { name: "CCX (Toffoli)", desc: "Controlled-controlled-X" },
                  { name: "SWAP", desc: "Swaps two qubits" },
                  { name: "iSWAP", desc: "Interaction SWAP" },
                  { name: "RXX, RYY, RZZ", desc: "Two-qubit rotations" },
                ]}
              />

              <GateCategory
                title="Special Operations"
                description="Measurement and utility operations"
                gates={[
                  { name: "M", desc: "Measure qubit in Z basis" },
                  { name: "Barrier", desc: "Visual/compilation barrier" },
                  { name: "Reset", desc: "Reset qubit to |0⟩" },
                ]}
              />
            </div>
          </Section>

          {/* Visualizations */}
          <Section
            id="visualizations"
            title="Visualizations"
            icon={<Eye className="h-5 w-5" />}
            isExpanded={expandedSections.includes("visualizations")}
            onToggle={() => toggleSection("visualizations")}
          >
            <div className="grid gap-3">
              {[
                {
                  name: "Bloch Sphere",
                  desc: "3D representation of single-qubit states showing position on the quantum sphere",
                  color: "from-blue-500 to-cyan-500",
                },
                {
                  name: "Histogram",
                  desc: "Bar chart showing probability distribution of measurement outcomes",
                  color: "from-green-500 to-emerald-500",
                },
                {
                  name: "State Vector",
                  desc: "Complex amplitudes and phases for each basis state in the superposition",
                  color: "from-purple-500 to-pink-500",
                },
                {
                  name: "Truth Table",
                  desc: "Complete listing of all quantum states with probabilities, amplitudes, and phases",
                  color: "from-orange-500 to-red-500",
                },
              ].map((viz) => (
                <div
                  key={viz.name}
                  className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 border border-gray-200 dark:border-gray-700"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${viz.color}`} />
                    <h4 className="font-semibold text-gray-900 dark:text-white">{viz.name}</h4>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{viz.desc}</p>
                </div>
              ))}
            </div>
          </Section>

          {/* Tips and Tricks */}
          <Section
            id="tips"
            title="Tips & Tricks"
            icon={<Sparkles className="h-5 w-5" />}
            isExpanded={expandedSections.includes("tips")}
            onToggle={() => toggleSection("tips")}
          >
            <div className="space-y-2">
              {[
                "Use 'Clear Circuit' to start fresh with a clean canvas",
                "Export simulation visualizations as PNG to share results",
                "Multi-qubit gates show control (●) and target (⊕) connections",
                "The Bloch sphere visualization appears after running simulation",
                "Check the truth table for detailed measurement probabilities",
                "Use auto-simulate in Settings to see results update in real-time",
                "Adjust decimal precision in Settings for cleaner number displays",
              ].map((tip, index) => (
                <div key={index} className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300">
                  <div className="w-1.5 h-1.5 bg-purple-500 rounded-full mt-1.5 flex-shrink-0" />
                  <p className="leading-relaxed">{tip}</p>
                </div>
              ))}
            </div>
          </Section>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 dark:border-gray-700 p-4 bg-gray-50 dark:bg-gray-900">
          <p className="text-xs text-center text-gray-500 dark:text-gray-400">
            Need more help? Open the AI Assistant (bottom-right corner) to ask questions about quantum computing!
          </p>
        </div>
      </div>
    </div>
  )
}

function Section({
  id,
  title,
  icon,
  isExpanded,
  onToggle,
  children,
}: {
  id: string
  title: string
  icon: React.ReactNode
  isExpanded: boolean
  onToggle: () => void
  children: React.ReactNode
}) {
  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-shadow">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="text-purple-600 dark:text-purple-400">{icon}</div>
          <h3 className="font-semibold text-lg text-gray-900 dark:text-white">{title}</h3>
        </div>
        {isExpanded ? (
          <ChevronDown className="h-5 w-5 text-gray-500" />
        ) : (
          <ChevronRight className="h-5 w-5 text-gray-500" />
        )}
      </button>
      {isExpanded && <div className="p-4 pt-0 space-y-3">{children}</div>}
    </div>
  )
}

function GateCategory({
  title,
  description,
  gates,
}: {
  title: string
  description: string
  gates: Array<{ name: string; desc: string }>
}) {
  return (
    <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
      <h4 className="font-semibold text-gray-900 dark:text-white mb-1">{title}</h4>
      <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">{description}</p>
      <div className="grid sm:grid-cols-2 gap-2">
        {gates.map((gate, index) => (
          <div key={index} className="text-xs">
            <span className="font-medium text-purple-600 dark:text-purple-400">{gate.name}</span>
            <span className="text-gray-600 dark:text-gray-400"> - {gate.desc}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
