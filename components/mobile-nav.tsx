"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Home, Search, PlusCircle, MessageSquare, User } from "lucide-react"
import { useMobile } from "@/hooks/use-mobile"

export default function MobileNav() {
  const pathname = usePathname()
  const isMobile = useMobile()

  if (!isMobile) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 h-16 bg-background border-t z-50 md:hidden">
      <div className="grid grid-cols-5 h-full">
        <Link
          href="/"
          className={cn(
            "flex flex-col items-center justify-center",
            pathname === "/" ? "text-primary" : "text-muted-foreground",
          )}
        >
          <Home className="h-5 w-5" />
          <span className="text-xs mt-1">홈</span>
        </Link>
        <Link
          href="/projects"
          className={cn(
            "flex flex-col items-center justify-center",
            pathname.startsWith("/projects") ? "text-primary" : "text-muted-foreground",
          )}
        >
          <Search className="h-5 w-5" />
          <span className="text-xs mt-1">프로젝트</span>
        </Link>
        <Link href="/projects/create" className="flex flex-col items-center justify-center text-primary">
          <PlusCircle className="h-6 w-6" />
          <span className="text-xs mt-1">등록</span>
        </Link>
        <Link
          href="/chat"
          className={cn(
            "flex flex-col items-center justify-center",
            pathname.startsWith("/chat") ? "text-primary" : "text-muted-foreground",
          )}
        >
          <MessageSquare className="h-5 w-5" />
          <span className="text-xs mt-1">채팅</span>
        </Link>
        <Link
          href="/profile/me"
          className={cn(
            "flex flex-col items-center justify-center",
            pathname.startsWith("/profile") ? "text-primary" : "text-muted-foreground",
          )}
        >
          <User className="h-5 w-5" />
          <span className="text-xs mt-1">프로필</span>
        </Link>
      </div>
    </div>
  )
}

