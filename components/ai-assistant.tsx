"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Loader2, X, MessageCircle, Send } from "lucide-react"
import type { QuantumCircuit } from "@/lib/quantum-circuit"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
  highlightedElement?: string
}

interface AIAssistantProps {
  circuit: QuantumCircuit
  activeVisualization: string
  userAction?: string
  onHighlightElement: (elementId: string | null) => void
}

export function AIAssistant({
  circuit,
  activeVisualization,
  userAction = "exploring the simulator",
  onHighlightElement,
}: AIAssistantProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  // Highlight effect with auto scroll to highlighted element
  useEffect(() => {
    const lastMessage = messages[messages.length - 1]
    if (lastMessage?.role === "assistant" && lastMessage.highlightedElement) {
      const element = document.getElementById(lastMessage.highlightedElement)

      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "center" })
      }

      onHighlightElement(lastMessage.highlightedElement)

      const timer = setTimeout(() => onHighlightElement(null), 5000)
      return () => clearTimeout(timer)
    }
  }, [messages, onHighlightElement])

  // Initial greeting
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const greeting: Message = {
        id: "greeting",
        role: "assistant",
        content: `👋 Hi! I'm your Quantum Circuit Assistant. I can help you understand quantum computing, guide you through QuaSim, or answer anything about quantum gates. What would you like to know?`,
        timestamp: new Date(),
      }
      setMessages([greeting])
    }
  }, [isOpen, messages.length])

  // Auto scroll chat
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [messages])

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: "user",
      content: input,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    try {
      const response = await fetch("/api/ai-assist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, userMessage],
          context: {
            numQubits: circuit.numQubits,
            activeVisualization,
            userAction,
          },
        }),
      })

      const data = await response.json()

      if (data.success) {
        const assistantMessage: Message = {
          id: `assistant-${Date.now()}`,
          role: "assistant",
          content: data.response,
          highlightedElement: data.highlightElement || undefined,
          timestamp: new Date(),
        }
        setMessages((prev) => [...prev, assistantMessage])
      } else {
        setMessages((prev) => [
          ...prev,
          {
            id: `error-${Date.now()}`,
            role: "assistant",
            content: "Sorry, something went wrong. Try again.",
            timestamp: new Date(),
          },
        ])
      }
    } catch (error) {
      console.error("[AI Assist Error]:", error)
      setMessages((prev) => [
        ...prev,
        {
          id: `error-${Date.now()}`,
          role: "assistant",
          content: "Connection issue — please try again.",
          timestamp: new Date(),
        },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 z-40 flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-r from-purple-500 to-pink-600 text-white shadow-lg hover:shadow-xl transition-all hover:scale-110"
        aria-label="Open AI Assistant"
      >
        <MessageCircle className="w-6 h-6" />
      </button>
    )
  }

  return (
    <Card
      className="
        fixed bottom-0 right-0 left-0 z-50 
        w-full h-[85vh] rounded-t-2xl flex flex-col shadow-2xl
        md:bottom-4 md:right-4 md:left-auto md:w-96 md:h-[600px] md:rounded-xl
      "
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-t-2xl md:rounded-t-lg">
        <div className="flex items-center gap-2">
          <MessageCircle className="w-5 h-5" />
          <h3 className="font-semibold">QuaSim Assistant</h3>
        </div>
        <button
          onClick={() => {
            setIsOpen(false)
            setMessages([])
            onHighlightElement(null)
          }}
          className="hover:bg-white/20 p-1 rounded transition-colors"
          aria-label="Close AI Assistant"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-3 md:p-4 bg-gray-50 dark:bg-gray-900 overflow-y-auto">
        <div className="space-y-3">
          {messages.map((message) => (
            <div key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[80%] md:max-w-xs px-3 py-2 rounded-lg text-sm ${
                  message.role === "user"
                    ? "bg-purple-500 text-white rounded-br-none"
                    : "bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-bl-none"
                }`}
              >
                {message.content}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-gray-200 dark:bg-gray-700 px-3 py-2 rounded-lg rounded-bl-none">
                <Loader2 className="w-4 h-4 animate-spin text-gray-600 dark:text-gray-400" />
              </div>
            </div>
          )}
          <div ref={scrollRef} />
        </div>
      </ScrollArea>

      {/* Input */}
      <form onSubmit={handleSendMessage} className="border-t p-3 bg-white dark:bg-gray-800 rounded-b-xl">
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask me anything..."
            disabled={isLoading}
            className="text-sm"
          />
          <Button type="submit" disabled={isLoading || !input.trim()} size="sm" className="bg-purple-500 hover:bg-purple-600">
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </form>
    </Card>
  )
}
