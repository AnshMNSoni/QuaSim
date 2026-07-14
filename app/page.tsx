import { redirect } from "next/navigation"
import { getSession } from "@/lib/auth"
import QuantumSimulator from "@/components/quantum-simulator"

export default async function Home() {
  const user = await getSession()

  if (!user) {
    redirect("/auth/login")
  }

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white">
      <QuantumSimulator />
    </main>
  )
}
