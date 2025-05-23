"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft, MessageSquare, Clipboard, Check, Bookmark } from "lucide-react"
import { useMobile } from "@/hooks/use-mobile"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { toast } from "@/hooks/use-toast"

export default function ProjectPage({ params }: { params: { id: string } }) {
  const isMobile = useMobile()
  const [copied, setCopied] = useState(false)
  const [isSaved, setIsSaved] = useState(false)

  // 샘플 프로젝트 데이터
  const project = {
    id: params.id,
    title: "AI 기반 학습 플랫폼 개발",
    description: `머신러닝을 활용한 맞춤형 학습 콘텐츠 추천 시스템을 개발하는 프로젝트입니다. 
    
    현재 백엔드 개발자 1명, 기획자 1명이 함께하고 있으며, 프론트엔드 개발자와 머신러닝 엔지니어를 찾고 있습니다.
    
    주요 기능:
    - 사용자 학습 패턴 분석
    - 맞춤형 콘텐츠 추천
    - 학습 진도 관리 및 통계
    
    기간: 2024년 4월 ~ 8월 (약 4개월)
    
    함께하실 분들은 연락주세요!`,
    domain: "AI & 머신러닝",
    tags: ["React", "Python", "TensorFlow", "AI", "웹개발"],
    author: {
      id: "user1",
      name: "김철수",
      image: "/placeholder.svg",
      department: "컴퓨터공학과",
      year: "3학년",
    },
    createdAt: "2024년 3월 29일",
    requiredRoles: ["프론트엔드 개발자", "AI 엔지니어"],
    preferredPersonality: ["적극적인", "협력적인"],
    maxMembers: 4,
    contactMethod: "chat",
    images: ["/placeholder.svg?height=400&width=600", "/placeholder.svg?height=400&width=600"],
  }

  // 공유하기
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: project.title,
        text: `쿠함에서 프로젝트를 확인해보세요: ${project.title}`,
        url: window.location.href,
      })
    } else {
      // 클립보드에 복사
      navigator.clipboard.writeText(window.location.href)
      setCopied(true)
      toast({
        title: "링크가 복사되었습니다",
        description: "프로젝트 링크가 클립보드에 복사되었습니다.",
      })

      setTimeout(() => setCopied(false), 2000)
    }
  }

  // 저장하기 토글
  const toggleSave = () => {
    setIsSaved(!isSaved)

    toast({
      title: isSaved ? "저장 취소됨" : "저장됨",
      description: isSaved ? "프로젝트가 저장 목록에서 제거되었습니다." : "프로젝트가 저장 목록에 추가되었습니다.",
    })
  }

  return (
    <div className="container py-8">
      <div className="mb-6">
        <Button variant="ghost" size="sm" asChild className="mb-4">
          <Link href="/projects">
            <ArrowLeft className="h-4 w-4 mr-2" />
            프로젝트 목록으로
          </Link>
        </Button>

        <div className="flex flex-wrap gap-2 mb-4">
          <Badge variant="outline">{project.domain}</Badge>
          {project.tags.map((tag) => (
            <Badge key={tag} variant="secondary">
              {tag}
            </Badge>
          ))}
        </div>

        <h1 className="text-3xl font-bold mb-4">{project.title}</h1>

        <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 gap-2">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={project.author.image} alt={project.author.name} />
              <AvatarFallback>{project.author.name[0]}</AvatarFallback>
            </Avatar>
            <div>
              <div className="font-medium">{project.author.name}</div>
              <div className="text-sm text-muted-foreground">
                {project.author.department} · {project.author.year}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <Button variant="outline" size={isMobile ? "sm" : "default"} onClick={handleShare}>
              {copied ? (
                <>
                  <Check className="h-4 w-4 mr-2" />
                  복사됨
                </>
              ) : (
                <>
                  <Clipboard className="h-4 w-4 mr-2" />
                  공유하기
                </>
              )}
            </Button>
            <Button variant={isSaved ? "default" : "outline"} size={isMobile ? "sm" : "default"} onClick={toggleSave}>
              <Bookmark className={`h-4 w-4 mr-2 ${isSaved ? "fill-current" : ""}`} />
              {isSaved ? "저장됨" : "저장하기"}
            </Button>
            <Dialog>
              <DialogTrigger asChild>
                <Button size={isMobile ? "sm" : "default"}>
                  <MessageSquare className="h-4 w-4 mr-2" />
                  채팅하기
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>채팅 시작하기</DialogTitle>
                  <DialogDescription>{project.author.name}님과 채팅을 시작하시겠습니까?</DialogDescription>
                </DialogHeader>
                <div className="flex justify-end gap-2 mt-4">
                  <Button variant="outline">취소</Button>
                  <Button asChild>
                    <Link
                      href={`/chat?user=${project.author.id}&projectId=${project.id}&projectTitle=${encodeURIComponent(project.title)}&projectDomain=${encodeURIComponent(project.domain)}&projectImage=${encodeURIComponent(project.images[0])}`}
                    >
                      채팅 시작
                    </Link>
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <div className="text-sm text-muted-foreground mb-4">작성일: {project.createdAt}</div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
        <div className="md:col-span-2">
          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="whitespace-pre-line">{project.description}</div>
            </CardContent>
          </Card>

          {project.images.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold">프로젝트 이미지</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {project.images.map((image, index) => (
                  <div key={index} className="rounded-md overflow-hidden border">
                    <img
                      src={image || "/placeholder.svg"}
                      alt={`${project.title} 이미지 ${index + 1}`}
                      className="w-full h-auto object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div>
          <Card>
            <CardContent className="p-6 space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-2">모집 정보</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">모집 인원</span>
                    <span>최대 {project.maxMembers}명</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">프로젝트 기간</span>
                    <span>2024년 4월 ~ 8월</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">연락 방법</span>
                    <span>
                      {project.contactMethod === "chat" && "쿠함 채팅"}
                      {project.contactMethod === "email" && "이메일"}
                      {project.contactMethod === "both" && "쿠함 채팅, 이메일"}
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-2">필요한 역할</h3>
                <div className="flex flex-wrap gap-2">
                  {project.requiredRoles.map((role) => (
                    <Badge key={role} variant="outline">
                      {role}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-2">선호하는 성격</h3>
                <div className="flex flex-wrap gap-2">
                  {project.preferredPersonality.map((personality) => (
                    <Badge key={personality} variant="outline" className="bg-primary/10">
                      {personality}
                    </Badge>
                  ))}
                </div>
              </div>

              <Button className="w-full" asChild>
                <Link
                  href={`/chat?user=${project.author.id}&projectId=${project.id}&projectTitle=${encodeURIComponent(project.title)}&projectDomain=${encodeURIComponent(project.domain)}&projectImage=${encodeURIComponent(project.images[0])}`}
                >
                  <MessageSquare className="h-4 w-4 mr-2" />
                  채팅으로 문의하기
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

