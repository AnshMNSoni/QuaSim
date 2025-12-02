import { generateText } from "ai"
import { google } from "@ai-sdk/google"

const queryToElementMap: Record<string, string> = {
  "add qubit": "control-panel",
  "remove qubit": "control-panel",
  "add gate": "gate-selector",
  "select gate": "gate-selector",
  simulate: "control-panel",
  "run simulation": "control-panel",
  bloch: "viz-bloch",
  "bloch sphere": "viz-bloch",
  histogram: "viz-histogram",
  "state vector": "viz-statevector",
  "truth table": "viz-truthtable",
  circuit: "circuit-builder",
  "clear circuit": "control-panel",
  export: "control-panel",
  import: "control-panel",
}

export async function POST(request: Request) {
  try {
    if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
      return Response.json(
        {
          error:
            "Gemini API key not configured. Please add GOOGLE_GENERATIVE_AI_API_KEY to your environment variables.",
          success: false,
        },
        { status: 500 },
      )
    }

    const { messages, context } = await request.json()

    const systemPrompt = `You are a helpful quantum computing assistant for a quantum circuit simulator called QuaSim. 
Your role is to help beginners understand quantum computing concepts and guide them through using the simulator.

Current Context:
- User has ${context.numQubits} qubit(s) in their circuit
- Active visualization: ${context.activeVisualization}
- User is trying to: ${context.userAction}

Guidelines:
1. Keep explanations simple and beginner-friendly
2. Use analogies to explain quantum concepts
3. Provide step-by-step instructions when guiding through features
4. Be encouraging and supportive
5. If the user is confused, offer to show them tutorials
6. Explain what quantum gates do in simple terms
7. Keep responses concise but informative (2-3 sentences max for quick tips)

Common tasks you can help with:
- Adding/removing qubits
- Understanding quantum gates (Hadamard, CNOT, Pauli gates, etc.)
- Reading measurement outcomes
- Understanding the Bloch sphere
- Interpreting state vectors and amplitudes
- Understanding truth tables for quantum circuits`

    const { text } = await generateText({
      model: google("gemini-2.0-flash"),
      messages: [
        {
          role: "user",
          content: messages[messages.length - 1].content,
        },
      ],
      system: systemPrompt,
      temperature: 0.7,
      maxOutputTokens: 300,
    })

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
    console.error("[AI Assist Error]:", error)
    return Response.json(
      {
        error: "Failed to generate response",
        success: false,
      },
      { status: 500 },
    )
  }
}
