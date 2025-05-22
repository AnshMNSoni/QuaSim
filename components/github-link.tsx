import { Github } from "lucide-react"
import { Button } from "@/components/ui/button"

export function GitHubLink() {
  return (
    <Button variant="outline" size="icon" asChild className="rounded-full" aria-label="View source on GitHub">
      <a href="https://github.com/AnshMNSoni/QuaSim.git" target="_blank" rel="noopener noreferrer">
        <Github className="h-[1.2rem] w-[1.2rem]" />
      </a>
    </Button>
  )
}
