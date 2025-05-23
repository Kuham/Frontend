"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

interface AuthCheckProps {
  children: React.ReactNode
}

export default function AuthCheck({ children }: AuthCheckProps) {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null)
  const router = useRouter()

  useEffect(() => {
    // 실제 구현에서는 서버에서 세션/쿠키 확인
    const loggedIn = localStorage.getItem("isLoggedIn") === "true"
    setIsLoggedIn(loggedIn)
  }, [])

  // 로딩 중
  if (isLoggedIn === null) {
    return <div className="container py-8 flex justify-center">로딩 중...</div>
  }

  // 로그인되지 않은 경우
  if (!isLoggedIn) {
    return (
      <div className="container py-8 flex justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>로그인이 필요합니다</CardTitle>
            <CardDescription>이 페이지를 이용하려면 로그인이 필요합니다.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">로그인하여 쿠함의 모든 기능을 이용해보세요.</p>
          </CardContent>
          <CardFooter className="flex gap-4">
            <Button variant="outline" onClick={() => router.back()}>
              뒤로 가기
            </Button>
            <Button asChild>
              <Link href="/auth/login">로그인하기</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    )
  }

  // 로그인된 경우 자식 컴포넌트 렌더링
  return <>{children}</>
}

