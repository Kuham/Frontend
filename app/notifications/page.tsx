"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { MessageSquare, Bell, Check } from "lucide-react"

interface Notification {
  id: number
  type: "POST_COMMENT" | "COMMENT_REPLY"
  isRead: boolean
  createdAt: string
  sender: {
    id: string
    name: string
    image: string
  }
  post?: {
    id: number
    title: string
  }
  comment?: {
    id: number
    content: string
  }
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: 1,
      type: "POST_COMMENT",
      isRead: false,
      createdAt: "10분 전",
      sender: {
        id: "user2",
        name: "이지원",
        image: "/placeholder.svg",
      },
      post: {
        id: 1,
        title: "AI 기반 학습 플랫폼 개발",
      },
      comment: {
        id: 1,
        content:
            "프론트엔드 개발자로 참여하고 싶습니다. React와 TypeScript 경험이 있고, 머신러닝 관련 프로젝트에 관심이 많습니다.",
      },
    },
    {
      id: 2,
      type: "COMMENT_REPLY",
      isRead: false,
      createdAt: "1시간 전",
      sender: {
        id: "user1",
        name: "김철수",
        image: "/placeholder.svg",
      },
      post: {
        id: 1,
        title: "AI 기반 학습 플랫폼 개발",
      },
      comment: {
        id: 2,
        content: "네, 프론트엔드 개발자를 찾고 있습니다. 포트폴리오 확인 후 연락드리겠습니다.",
      },
    },
    {
      id: 3,
      type: "POST_COMMENT",
      isRead: true,
      createdAt: "1일 전",
      sender: {
        id: "user3",
        name: "박민준",
        image: "/placeholder.svg",
      },
      post: {
        id: 2,
        title: "대학생 중고거래 앱 UI/UX 디자인",
      },
      comment: {
        id: 3,
        content: "UI/UX 디자인에 관심이 있습니다. 포트폴리오 확인 부탁드립니다.",
      },
    },
  ])

  const markAsRead = (id: number) => {
    setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    )
  }

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })))
  }

  const unreadCount = notifications.filter((n) => !n.isRead).length

  return (
      <div className="container py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">알림</h1>
          {unreadCount > 0 && (
              <Button variant="outline" size="sm" onClick={markAllAsRead}>
                <Check className="h-4 w-4 mr-2" />
                모두 읽음 표시
              </Button>
          )}
        </div>

        <div className="space-y-4">
          {notifications.length > 0 ? (
              notifications.map((n) => (
                  <Card
                      key={n.id}
                      className={`transition-colors ${n.isRead ? "bg-background" : "bg-muted/30"}`}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start gap-4">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={n.sender.image} alt={n.sender.name} />
                          <AvatarFallback>{n.sender.name[0]}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <Link href={`/profile/${n.sender.id}`} className="font-medium hover:underline">
                                {n.sender.name}
                              </Link>
                              {n.type === "POST_COMMENT" ? (
                                  <span className="text-muted-foreground">
                            님이 회원님의 프로젝트{" "}
                                    <Link href={`/projects/${n.post?.id}`} className="font-medium hover:underline">
                              {n.post?.title}
                            </Link>
                            에 댓글을 남겼습니다.
                          </span>
                              ) : (
                                  <span className="text-muted-foreground">
                            님이 회원님의 댓글에 답글을 남겼습니다.
                          </span>
                              )}
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-muted-foreground whitespace-nowrap">{n.createdAt}</span>
                              {!n.isRead && (
                                  <Button
                                      variant="ghost"
                                      size="icon"
                                      className="h-6 w-6"
                                      onClick={() => markAsRead(n.id)}
                                  >
                                    <Check className="h-3 w-3" />
                                  </Button>
                              )}
                            </div>
                          </div>
                          <div className="mt-2 text-sm p-3 bg-muted rounded-md">{n.comment?.content}</div>
                          <div className="mt-3 flex justify-end gap-2">
                            <Button variant="outline" size="sm" asChild>
                              <Link href={`/projects/${n.post?.id}`}>
                                <MessageSquare className="h-4 w-4 mr-2" />
                                댓글 보기
                              </Link>
                            </Button>
                            <Button size="sm" asChild>
                              <Link href={`/chat?user=${n.sender.id}`}>채팅하기</Link>
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
              ))
          ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Bell className="h-12 w-12 text-muted-foreground mb-4" />
                <h2 className="text-xl font-medium mb-2">알림이 없습니다</h2>
                <p className="text-muted-foreground">새로운 알림이 오면 이곳에 표시됩니다.</p>
              </div>
          )}
        </div>
      </div>
  )
}
