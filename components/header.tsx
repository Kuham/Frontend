"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import Cookies from "js-cookie"
import { Search, Bell, MessageSquare, Menu } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useMobile } from "@/hooks/use-mobile"
import { cn } from "@/lib/utils"

export default function Header() {
  const pathname = usePathname()
  const isMobile = useMobile()

  const [notificationCount, setNotificationCount] = useState(3)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [profileUrl, setProfileUrl] = useState("")

  useEffect(() => {
    const token = Cookies.get("token")
    const profile = Cookies.get("profileUrl")
    setIsLoggedIn(!!token)
    setProfileUrl(profile || "")
  }, [])

  return (
      <header className="fixed top-0 left-0 right-0 h-16 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-50">
        <div className="container h-full flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/" className="font-bold text-xl text-primary">
              kuham
            </Link>

            <nav className="hidden md:flex items-center space-x-1">
              <Link
                  href="/"
                  className={cn(
                      "px-3 py-2 rounded-md text-sm font-medium transition-colors",
                      pathname === "/"
                          ? "bg-primary/10 text-primary"
                          : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                  )}
              >
                홈
              </Link>
              <Link
                  href="/projects"
                  className={cn(
                      "px-3 py-2 rounded-md text-sm font-medium transition-colors",
                      pathname.startsWith("/projects")
                          ? "bg-primary/10 text-primary"
                          : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                  )}
              >
                프로젝트
              </Link>
              <Link
                  href="/people"
                  className={cn(
                      "px-3 py-2 rounded-md text-sm font-medium transition-colors",
                      pathname.startsWith("/people")
                          ? "bg-primary/10 text-primary"
                          : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                  )}
              >
                사람들
              </Link>
            </nav>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative hidden md:flex items-center">
              <Search className="absolute left-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                  type="search"
                  placeholder="프로젝트 검색..."
                  className="w-[200px] lg:w-[300px] pl-8 rounded-full bg-muted"
              />
            </div>

            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" className="relative" asChild>
                <Link href="/notifications">
                  <Bell className="h-5 w-5" />
                  {notificationCount > 0 && (
                      <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs">
                        {notificationCount}
                      </Badge>
                  )}
                </Link>
              </Button>
              <Button variant="ghost" size="icon" asChild>
                <Link href="/chat">
                  <MessageSquare className="h-5 w-5" />
                </Link>
              </Button>

              {isLoggedIn ? (
                  <Avatar className="h-8 w-8 cursor-pointer" asChild>
                    <Link href="/profile/me">
                      <AvatarImage src={profileUrl} alt="프로필" />
                      <AvatarFallback>사용자</AvatarFallback>
                    </Link>
                  </Avatar>
              ) : (
                  <Button asChild variant="outline" className="h-8 px-4 text-sm">
                    <Link href="/auth/login">로그인</Link>
                  </Button>
              )}

              {isMobile && (
                  <Sheet>
                    <SheetTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <Menu className="h-5 w-5" />
                      </Button>
                    </SheetTrigger>
                    <SheetContent side="right" className="w-[250px] sm:w-[300px] flex flex-col justify-between">
                      <div className="py-4 space-y-4">
                        <Link
                            href="/"
                            className={cn(
                                "block px-3 py-2 rounded-md text-sm font-medium transition-colors",
                                pathname === "/"
                                    ? "bg-primary/10 text-primary"
                                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                            )}
                        >
                          홈
                        </Link>
                        <Link
                            href="/projects"
                            className={cn(
                                "block px-3 py-2 rounded-md text-sm font-medium transition-colors",
                                pathname.startsWith("/projects")
                                    ? "bg-primary/10 text-primary"
                                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                            )}
                        >
                          프로젝트
                        </Link>
                        <Link
                            href="/people"
                            className={cn(
                                "block px-3 py-2 rounded-md text-sm font-medium transition-colors",
                                pathname.startsWith("/people")
                                    ? "bg-primary/10 text-primary"
                                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                            )}
                        >
                          사람들
                        </Link>
                        {isLoggedIn ? (
                            <>
                              <Link
                                  href="/profile/me"
                                  className={cn(
                                      "block px-3 py-2 rounded-md text-sm font-medium transition-colors",
                                      pathname.startsWith("/profile/me")
                                          ? "bg-primary/10 text-primary"
                                          : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                                  )}
                              >
                                내 프로필
                              </Link>
                              <Link
                                  href="/profile/edit"
                                  className={cn(
                                      "block px-3 py-2 rounded-md text-sm font-medium transition-colors",
                                      pathname.startsWith("/profile/edit")
                                          ? "bg-primary/10 text-primary"
                                          : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                                  )}
                              >
                                프로필 수정
                              </Link>
                              <Link
                                  href="/logout"
                                  className={cn(
                                      "block px-3 py-2 rounded-md text-sm font-medium transition-colors",
                                      "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                                  )}
                              >
                                로그아웃
                              </Link>
                            </>
                        ) : (
                            <Link
                                href="/login"
                                className={cn(
                                    "block px-3 py-2 rounded-md text-sm font-medium transition-colors",
                                    "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                                )}
                            >
                              로그인
                            </Link>
                        )}
                      </div>
                    </SheetContent>
                  </Sheet>
              )}
            </div>
          </div>
        </div>
      </header>
  )
}
