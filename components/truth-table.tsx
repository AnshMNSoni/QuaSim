"use client"
import type { SimulationResult } from "@/lib/types"
import type { QuantumCircuit } from "@/lib/quantum-circuit"

interface TruthTableProps {
  result: SimulationResult
  circuit: QuantumCircuit
}

export default function TruthTable({ result, circuit }: TruthTableProps) {
  const numQubits = circuit.numQubits
  const numStates = Math.pow(2, numQubits)

  // Generate all possible input states
  const generateInputStates = () => {
    const states = []
    for (let i = 0; i < numStates; i++) {
      const binary = i.toString(2).padStart(numQubits, "0")
      states.push({
        decimal: i,
        binary: binary,
        ket: `|${binary}⟩`,
      })
    }
    return states
  }

  const inputStates = generateInputStates()

  // Get probability for each state from simulation result
  const getProbability = (stateIndex: number) => {
    if (!result.stateVector || stateIndex >= result.stateVector.length) {
      return 0
    }
    const amplitude = result.stateVector[stateIndex]
    return Math.pow(Math.abs(amplitude), 2)
  }

  // Format probability as percentage
  const formatProbability = (prob: number) => {
    return (prob * 100).toFixed(2) + "%"
  }

  // Get amplitude information
  const getAmplitude = (stateIndex: number) => {
    if (!result.stateVector || stateIndex >= result.stateVector.length) {
      return { real: 0, imag: 0, magnitude: 0, phase: 0 }
    }
    const amplitude = result.stateVector[stateIndex]
    const real = amplitude.real || 0
    const imag = amplitude.imag || 0
    const magnitude = Math.sqrt(real * real + imag * imag)
    const phase = Math.atan2(imag, real)
    return { real, imag, magnitude, phase }
  }

  return (
    <div className="w-full">
      <div className="mb-4">
        <h3 className="text-lg font-semibold mb-2">Quantum State Truth Table</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Showing probabilities and amplitudes for all {numStates} possible quantum states
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-300 dark:border-gray-600 text-sm">
          <thead>
            <tr className="bg-gray-100 dark:bg-gray-700">
              <th className="border border-gray-300 dark:border-gray-600 px-3 py-2 text-left">State</th>
              <th className="border border-gray-300 dark:border-gray-600 px-3 py-2 text-left">Binary</th>
              <th className="border border-gray-300 dark:border-gray-600 px-3 py-2 text-left">Probability</th>
              <th className="border border-gray-300 dark:border-gray-600 px-3 py-2 text-left">Amplitude</th>
              <th className="border border-gray-300 dark:border-gray-600 px-3 py-2 text-left">Phase (rad)</th>
            </tr>
          </thead>
          <tbody>
            {inputStates.map((state) => {
              const probability = getProbability(state.decimal)
              const amplitude = getAmplitude(state.decimal)
              const isSignificant = probability > 0.001 // Highlight significant probabilities

              return (
                <tr
                  key={state.decimal}
                  className={`${
                    isSignificant
                      ? "bg-blue-50 dark:bg-blue-900/20 font-medium"
                      : "hover:bg-gray-50 dark:hover:bg-gray-800"
                  }`}
                >
                  <td className="border border-gray-300 dark:border-gray-600 px-3 py-2 font-mono">{state.ket}</td>
                  <td className="border border-gray-300 dark:border-gray-600 px-3 py-2 font-mono">{state.binary}</td>
                  <td className="border border-gray-300 dark:border-gray-600 px-3 py-2">
                    <div className="flex items-center gap-2">
                      <span className={isSignificant ? "text-blue-600 dark:text-blue-400" : ""}>
                        {formatProbability(probability)}
                      </span>
                      {isSignificant && (
                        <div
                          className="h-2 bg-blue-500 rounded"
                          style={{ width: `${Math.max(probability * 100, 2)}px` }}
                        />
                      )}
                    </div>
                  </td>
                  <td className="border border-gray-300 dark:border-gray-600 px-3 py-2 font-mono text-xs">
                    {amplitude.real.toFixed(3)} + {amplitude.imag.toFixed(3)}i
                  </td>
                  <td className="border border-gray-300 dark:border-gray-600 px-3 py-2 font-mono text-xs">
                    {amplitude.phase.toFixed(3)}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      <div className="mt-4 text-xs text-gray-500 dark:text-gray-400">
        <p>• States with probability &gt; 0.1% are highlighted in blue</p>
        <p>• Amplitudes are shown as complex numbers (real + imaginary×i)</p>
        <p>• Phase is shown in radians</p>
      </div>
    </div>
  )
}
