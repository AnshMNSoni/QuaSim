import { GoogleGenerativeAI } from "@google/generative-ai"

const queryToElementMap: Record<string, string> = {
  // Circuit controls
  "add qubit": "control-panel",
  "remove qubit": "control-panel",
  "add gate": "gate-selector",
  "select gate": "gate-selector",
  "place gate": "gate-selector",
  "drag gate": "gate-selector",
  simulate: "control-panel",
  "run simulation": "control-panel",
  "start simulation": "control-panel",
  "clear circuit": "control-panel",
  "reset circuit": "control-panel",
  "export png": "control-panel",
  "save image": "control-panel",

  // Visualizations
  bloch: "viz-bloch",
  "bloch sphere": "viz-bloch",
  histogram: "viz-histogram",
  "probability distribution": "viz-histogram",
  "state vector": "viz-statevector",
  "truth table": "viz-truthtable",
  circuit: "circuit-builder",
  "circuit diagram": "circuit-builder",
  "circuit builder": "circuit-builder",

  // Specific gates
  hadamard: "gate-selector",
  "h gate": "gate-selector",
  pauli: "gate-selector",
  "x gate": "gate-selector",
  "y gate": "gate-selector",
  "z gate": "gate-selector",
  cnot: "gate-selector",
  "controlled not": "gate-selector",
  toffoli: "gate-selector",
  "ccx gate": "gate-selector",
  swap: "gate-selector",
  phase: "gate-selector",
  rotation: "gate-selector",
}

export async function POST(request: Request) {
  try {
    const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY
    if (!apiKey) {
      console.error("[AI Assist] GOOGLE_GENERATIVE_AI_API_KEY not found in environment variables")
      return Response.json(
        {
          error: "AI Assistant is not configured. Please add the GOOGLE_GENERATIVE_AI_API_KEY environment variable.",
          success: false,
        },
        { status: 500 },
      )
    }

    const { messages, context } = await request.json()

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      console.error("[AI Assist] Invalid request: messages array is empty or missing")
      return Response.json(
        {
          error: "Invalid request format",
          success: false,
        },
        { status: 400 },
      )
    }

    const systemPrompt = `You are an expert quantum computing assistant for QuaSim, an interactive quantum circuit simulator.

## About QuaSim
QuaSim is a web-based quantum circuit simulator designed to help students, developers, and quantum computing enthusiasts learn and experiment with quantum computing through hands-on visualization and interaction. The simulator provides an intuitive drag-and-drop interface for building quantum circuits and multiple visualization tools to understand quantum states and behavior.

## Key Features You Should Explain:
1. **Circuit Builder**: Drag-and-drop interface to place quantum gates on qubits
2. **40+ Quantum Gates**: Single-qubit gates (H, X, Y, Z, S, T, RX, RY, RZ, Phase), multi-qubit gates (CNOT, CZ, SWAP, Toffoli), and two-qubit interaction gates (RXX, RYY, RZZ)
3. **Visualizations**: 
   - Bloch Sphere: 3D representation of single-qubit states
   - Histogram: Probability distribution of measurement outcomes
   - State Vector: Complex amplitudes and phases
   - Truth Table: Complete state information with probabilities
4. **PNG Export**: Download circuit diagrams as images
5. **Authentication**: User accounts with OAuth (Google/GitHub)
6. **Settings**: Customizable theme, simulation parameters, and preferences

## How the Simulator Works:
- **Qubits**: Start with qubits in the |0⟩ state
- **Gates**: Apply quantum gates by dragging them onto the circuit or tapping (mobile)
- **Controlled Operations**: Select a control qubit, then place a gate on the target qubit
- **Simulation**: Click "Simulate" to compute the quantum state after all gates
- **Measurement**: Results show probabilities of each possible measurement outcome

## Current Context:
- Circuit has ${context.numQubits} qubit(s)
- Active visualization: ${context.activeVisualization}
- User is currently: ${context.userAction}
- Circuit gates: ${context.gateList || "None placed yet"}
- Circuit depth: ${context.circuitDepth || 0} steps

## Your Role:
1. **Educational Guide**: Explain quantum computing concepts in simple, beginner-friendly terms
2. **Feature Expert**: Help users navigate QuaSim's features and capabilities
3. **Troubleshooter**: Assist when users are stuck or confused
4. **Quantum Tutor**: Teach about quantum gates, superposition, entanglement, and interference

## Communication Guidelines:
- Keep explanations simple and clear
- Use analogies when explaining quantum concepts
- Provide step-by-step instructions for features
- Be encouraging and supportive
- Offer to explain more if the user wants details
- Keep responses concise (2-4 sentences for quick tips, longer for detailed explanations)

## Common Quantum Concepts to Explain:
- **Superposition**: Qubits can be in multiple states simultaneously (Hadamard gate creates this)
- **Entanglement**: Qubits become correlated (CNOT creates Bell states)
- **Interference**: Quantum amplitudes can add or cancel (used in algorithms)
- **Measurement**: Collapses superposition to classical bits based on probabilities
- **Phase**: Complex rotation of quantum states (shown in state vector visualization)

## Example Interactions:
- "What does the Hadamard gate do?" → Explain H gate creates superposition, 50/50 chance of 0 or 1
- "How do I create entanglement?" → Use H on qubit 0, then CNOT with qubit 0 controlling qubit 1
- "Why are my probabilities weird?" → Explain quantum interference and phase cancellation
- "What's the Bloch sphere?" → Visual representation of single qubit state as a point on a sphere

You're here to make quantum computing accessible and fun!`

    console.log("[AI Assist] Generating response directly from Gemini API...")

    const genAI = new GoogleGenerativeAI(apiKey)
    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash",
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 500,
      },
    })

    const prompt = `${systemPrompt}\n\nUser Question: ${messages[messages.length - 1].content}`
    const result = await model.generateContent(prompt)
    const text = result.response.text()

    console.log("[AI Assist] Response generated successfully")

    const userQuery = messages[messages.length - 1].content.toLowerCase()
    let highlightElement: string | null = null

    for (const [keyword, elementId] of Object.entries(queryToElementMap)) {
      if (userQuery.includes(keyword)) {
        highlightElement = elementId
        break
      }
    }

    return Response.json({
      response: text,
      highlightElement,
      success: true,
    })
  } catch (error) {
    console.error("[AI Assist Error Details]:", {
      message: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined,
      error,
    })

    return Response.json(
      {
        error: error instanceof Error ? error.message : "Failed to generate response. Please try again.",
        success: false,
      },
      { status: 500 },
    )
  }
}
