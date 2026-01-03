import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import QuantumSimulator from "@/components/quantum-simulator"

export default async function Home() {
  const supabase = await createClient()
  
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white">
      <QuantumSimulator />
    </main>
  )
}
