import type { Complex } from "./complex"

export interface SimulationResult {
  stateVector: Complex[]
  probabilities: Record<string, number>
}
