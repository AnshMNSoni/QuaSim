import { Heart } from "lucide-react"
import { Button } from "@/components/ui/button"

export function Support() {
    return (
        <Button variant="outline" size="icon" asChild className="border-pink-500 rounded-full" aria-label="GitHub Sponsors">
            <a href="https://github.com/sponsors/AnshMNSoni/" target="_blank" rel="noopener noreferrer">
                <Heart className="h-[1.2rem] w-[1.2rem] text-pink-500" />
            </a>
        </Button>
    )
}
