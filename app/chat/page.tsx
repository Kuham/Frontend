"use client"

import { useState, useEffect, useRef } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Send, ArrowLeft, Info, LogOut } from "lucide-react"
import { useMobile } from "@/hooks/use-mobile"
import Link from "next/link"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface Message {
  id: number
  sender: {
    id: string
    name: string
    image: string
  }
  content: string
  timestamp: string
  isMe: boolean
}

interface Chat {
  id: number
  user: {
    id: string
    name: string
    image: string
    status: "online" | "offline"
    lastSeen?: string
    department: string
    year: string
  }
  lastMessage: {
    content: string
    timestamp: string
  }
  unread: number
}

export default function ChatPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const userId = searchParams.get("user")
  const projectId = searchParams.get("projectId")
  const projectTitle = searchParams.get("projectTitle")
  const projectDomain = searchParams.get("projectDomain")
  const projectImage = searchParams.get("projectImage")
  const isMobile = useMobile()
  const [showChatList, setShowChatList] = useState(!isMobile || !userId)
  const [activeChat, setActiveChat] = useState<number | null>(null)
  const [messageInput, setMessageInput] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // 샘플 채팅 목록
  const chats: Chat[] = [
    {
      id: 1,
      user: {
        id: "user1",
        name: "김철수",
        image: "/placeholder.svg",
        status: "online",
        department: "컴퓨터공학과",
        year: "3학년",
      },
      lastMessage: {
        content: "프로젝트에 관심이 있으신가요?",
        timestamp: "오후 2:30",
      },
      unread: 2,
    },
    {
      id: 2,
      user: {
        id: "user2",
        name: "이지원",
        image: "/placeholder.svg",
        status: "offline",
        lastSeen: "1시간 전",
        department: "소프트웨어학과",
        year: "4학년",
      },
      lastMessage: {
        content: "포트폴리오 확인해보셨나요?",
        timestamp: "오전 11:15",
      },
      unread: 0,
    },
    {
      id: 3,
      user: {
        id: "user3",
        name: "박민준",
        image: "/placeholder.svg",
        status: "online",
        department: "인공지능학과",
        year: "석사과정",
      },
      lastMessage: {
        content: "네, 내일 회의 시간에 논의해보겠습니다.",
        timestamp: "어제",
      },
      unread: 0,
    },
  ]

  // 샘플 메시지 데이터
  const [messages, setMessages] = useState<Record<number, Message[]>>({
    1: [
      {
        id: 1,
        sender: {
          id: "user1",
          name: "김철수",
          image: "/placeholder.svg",
        },
        content: "안녕하세요! AI 기반 학습 플랫폼 개발 프로젝트에 관심이 있으신가요?",
        timestamp: "오후 2:25",
        isMe: false,
      },
      {
        id: 2,
        sender: {
          id: "me",
          name: "나",
          image: "/placeholder.svg",
        },
        content: "네, 관심이 있습니다. 프로젝트에 대해 더 자세히 알고 싶어요.",
        timestamp: "오후 2:27",
        isMe: true,
      },
      {
        id: 3,
        sender: {
          id: "user1",
          name: "김철수",
          image: "/placeholder.svg",
        },
        content: "프로젝트에 관심이 있으신가요? 프론트엔드 개발자를 찾고 있어요.",
        timestamp: "오후 2:30",
        isMe: false,
      },
    ],
    2: [
      {
        id: 1,
        sender: {
          id: "me",
          name: "나",
          image: "/placeholder.svg",
        },
        content: "안녕하세요, 포트폴리오 잘 봤습니다. React 경험이 많으신 것 같아요.",
        timestamp: "오전 11:10",
        isMe: true,
      },
      {
        id: 2,
        sender: {
          id: "user2",
          name: "이지원",
          image: "/placeholder.svg",
        },
        content: "네, 감사합니다. 주로 React와 TypeScript를 사용해서 개발하고 있어요.",
        timestamp: "오전 11:12",
        isMe: false,
      },
      {
        id: 3,
        sender: {
          id: "user2",
          name: "이지원",
          image: "/placeholder.svg",
        },
        content: "포트폴리오 확인해보셨나요?",
        timestamp: "오전 11:15",
        isMe: false,
      },
    ],
    3: [
      {
        id: 1,
        sender: {
          id: "me",
          name: "나",
          image: "/placeholder.svg",
        },
        content: "안녕하세요, 머신러닝 엔지니어로 지원하신다고 들었습니다.",
        timestamp: "어제",
        isMe: true,
      },
      {
        id: 2,
        sender: {
          id: "user3",
          name: "박민준",
          image: "/placeholder.svg",
        },
        content: "네, 맞습니다. TensorFlow와 PyTorch 경험이 있으며, 추천 시스템 관련 연구를 진행 중입니다.",
        timestamp: "어제",
        isMe: false,
      },
      {
        id: 3,
        sender: {
          id: "me",
          name: "나",
          image: "/placeholder.svg",
        },
        content: "좋습니다. 내일 회의에서 자세히 이야기해보고 싶습니다. 시간 괜찮으신가요?",
        timestamp: "어제",
        isMe: true,
      },
      {
        id: 4,
        sender: {
          id: "user3",
          name: "박민준",
          image: "/placeholder.svg",
        },
        content: "네, 내일 회의 시간에 논의해보겠습니다.",
        timestamp: "어제",
        isMe: false,
      },
    ],
  })

  // URL 파라미터로 전달된 사용자 ID가 있으면 해당 채팅방 활성화
  useEffect(() => {
    if (userId) {
      const chat = chats.find((chat) => chat.user.id === userId)
      if (chat) {
        setActiveChat(chat.id)
        setShowChatList(false)
      }
    }
  }, [userId])

  // 메시지 전송 시 스크롤 맨 아래로 이동
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [activeChat, messages])

  const handleSendMessage = () => {
    if (!messageInput.trim() || !activeChat) return

    const newMessage = {
      id: Date.now(),
      sender: {
        id: "me",
        name: "나",
        image: "/placeholder.svg",
      },
      content: messageInput,
      timestamp: "방금 전",
      isMe: true,
    }

    setMessages((prev) => ({
      ...prev,
      [activeChat]: [...(prev[activeChat] || []), newMessage],
    }))

    // 입력창 초기화
    setMessageInput("")
  }

  const handleChatSelect = (chatId: number) => {
    setActiveChat(chatId)
    if (isMobile) {
      setShowChatList(false)
    }
  }

  const handleBackToList = () => {
    setShowChatList(true)
  }

  return (
    <div className={`container py-8 ${isMobile ? "px-0" : ""}`}>
      <div
        className={`grid grid-cols-1 md:grid-cols-3 gap-4 h-[calc(100vh-8rem)] ${isMobile && !showChatList ? "border-0" : ""}`}
      >
        {/* 채팅 목록 */}
        {(!isMobile || showChatList) && (
          <div className="md:col-span-1 border rounded-lg overflow-hidden">
            <div className="p-4 border-b bg-muted/50">
              <h2 className="font-semibold">메시지</h2>
            </div>
            <ScrollArea className="h-[calc(100%-57px)]">
              <div className="divide-y">
                {chats.map((chat) => (
                  <div
                    key={chat.id}
                    className={`p-4 cursor-pointer hover:bg-muted/50 transition-colors ${
                      activeChat === chat.id ? "bg-muted/50" : ""
                    }`}
                    onClick={() => handleChatSelect(chat.id)}
                  >
                    <div className="flex items-start gap-3">
                      <div className="relative">
                        <Avatar>
                          <AvatarImage src={chat.user.image} alt={chat.user.name} />
                          <AvatarFallback>{chat.user.name[0]}</AvatarFallback>
                        </Avatar>
                        {chat.user.status === "online" && (
                          <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-background rounded-full" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h3 className="font-medium truncate">{chat.user.name}</h3>
                          <span className="text-xs text-muted-foreground">{chat.lastMessage.timestamp}</span>
                        </div>
                        <p className="text-xs text-muted-foreground">{chat.user.department}</p>
                        <p className="text-sm text-muted-foreground truncate">{chat.lastMessage.content}</p>
                      </div>
                      {chat.unread > 0 && (
                        <div className="flex-shrink-0 w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                          <span className="text-xs text-primary-foreground">{chat.unread}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
        )}

        {/* 채팅 내용 */}
        {(!isMobile || !showChatList) && (
          <div className={`md:col-span-2 ${isMobile ? "" : "border"} rounded-lg overflow-hidden flex flex-col`}>
            {activeChat ? (
              <>
                <>
                  <div className="p-4 border-b bg-muted/50 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {isMobile && (
                        <Button variant="ghost" size="icon" onClick={handleBackToList} className="mr-1">
                          <ArrowLeft className="h-5 w-5" />
                        </Button>
                      )}
                      <Avatar>
                        <AvatarImage
                          src={chats.find((c) => c.id === activeChat)?.user.image}
                          alt={chats.find((c) => c.id === activeChat)?.user.name}
                        />
                        <AvatarFallback>{chats.find((c) => c.id === activeChat)?.user.name[0]}</AvatarFallback>
                      </Avatar>
                      <div>
                        <h2 className="font-semibold">{chats.find((c) => c.id === activeChat)?.user.name}</h2>
                        <p className="text-xs text-muted-foreground">
                          {chats.find((c) => c.id === activeChat)?.user.department} ·{" "}
                          {chats.find((c) => c.id === activeChat)?.user.year}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <Info className="h-5 w-5" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            className="text-destructive"
                            onClick={() => {
                              setActiveChat(null)
                              if (isMobile) setShowChatList(true)
                              router.push("/chat")
                            }}
                          >
                            <LogOut className="h-4 w-4 mr-2" />
                            채팅 나가기
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>

                  {projectId && projectTitle && projectDomain && projectImage && (
                    <div className="p-3 border-b bg-muted/20">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-md overflow-hidden flex-shrink-0">
                          <img
                            src={projectImage || "/placeholder.svg"}
                            alt={projectTitle}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <h3 className="font-medium text-sm">{projectTitle}</h3>
                          <p className="text-xs text-muted-foreground">{projectDomain}</p>
                        </div>
                        <Button variant="ghost" size="sm" asChild className="ml-auto">
                          <Link href={`/projects/${projectId}`}>보기</Link>
                        </Button>
                      </div>
                    </div>
                  )}
                </>

                <ScrollArea className="flex-1 p-4">
                  <div className="space-y-4">
                    {messages[activeChat]?.map((message) => (
                      <div key={message.id} className={`flex ${message.isMe ? "justify-end" : "justify-start"}`}>
                        <div className={`flex gap-2 max-w-[80%] ${message.isMe ? "flex-row-reverse" : ""}`}>
                          {!message.isMe && (
                            <Avatar className="h-8 w-8 flex-shrink-0">
                              <AvatarImage src={message.sender.image} alt={message.sender.name} />
                              <AvatarFallback>{message.sender.name[0]}</AvatarFallback>
                            </Avatar>
                          )}
                          <div>
                            <div
                              className={`rounded-lg p-3 ${
                                message.isMe ? "bg-primary text-primary-foreground" : "bg-muted"
                              }`}
                            >
                              <p className="break-words">{message.content}</p>
                            </div>
                            <p className={`text-xs text-muted-foreground mt-1 ${message.isMe ? "text-right" : ""}`}>
                              {message.timestamp}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                  </div>
                </ScrollArea>

                <div className="p-4 border-t">
                  <form
                    onSubmit={(e) => {
                      e.preventDefault()
                      handleSendMessage()
                    }}
                    className="flex gap-2"
                  >
                    <Input
                      placeholder="메시지를 입력하세요..."
                      value={messageInput}
                      onChange={(e) => setMessageInput(e.target.value)}
                      className="flex-1"
                    />
                    <Button type="submit" size="icon" disabled={!messageInput.trim()}>
                      <Send className="h-4 w-4" />
                    </Button>
                  </form>
                </div>
              </>
            ) : (
              <div className="flex items-center justify-center h-full text-muted-foreground">
                {isMobile ? (
                  <Button variant="outline" onClick={handleBackToList}>
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    채팅 목록으로
                  </Button>
                ) : (
                  "채팅을 선택해주세요"
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

