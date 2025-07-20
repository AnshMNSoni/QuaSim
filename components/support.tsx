import Link from "next/link"
import { Heart } from "lucide-react"

export function Support() {
    return (
        <Link
            href="https://github.com/sponsors/AnshMNSoni"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-sm font-medium text-gray-900 dark:text-gray-200 transition-all border-pink-500 dark:hover:border-pink-900 hover:bg-pink-100 dark:hover:bg-[#020817]">
            <Heart className="w-4 h-4 text-pink-500" />
            Like
        </Link>
    )
}
