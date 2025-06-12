/*  app/projects/[id]/page.tsx  */
"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import {
  ArrowLeft,
  Bookmark,
  Check,
  Clipboard,
  MessageSquare,
  Trash2,
} from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useMobile } from "@/hooks/use-mobile"
import { toast } from "@/hooks/use-toast"
import axiosInstance from "@/apis/custom-axios"

/* ---------- helpers ---------- */
const InfoRow = ({ label, value }: { label: string; value: string | number }) => (
    <div className="flex justify-between">
      <span className="text-muted-foreground">{label}</span>
      <span>{value}</span>
    </div>
)

const BadgeList = ({
                     items,
                     outlined = false,
                   }: {
  items?: string[]
  outlined?: boolean
}) =>
    items?.length ? (
        <div className="flex flex-wrap gap-2">
          {items.map((item) => (
              <Badge key={item} variant={outlined ? "outline" : "secondary"}>
                {item}
              </Badge>
          ))}
        </div>
    ) : null

/* ---------- page ---------- */
export default function ProjectPage() {
  const { id } = useParams() as { id: string }
  const isMobile = useMobile()

  const [project, setProject] = useState<any | null>(null)
  const [copied, setCopied] = useState(false)
  const [isSaved, setIsSaved] = useState(false)

  /* ① GET /post/{id} */
  useEffect(() => {
    ;(async () => {
      try {
        const { data } = await axiosInstance.get(`/post/${id}`)
        console.log("response:", data)

        setProject({
          /* 기본 정보 */
          id:            data.id,
          title:         data.title,
          description:   data.description,
          domain:        data.domain,
          createdAt:     data.createdAt?.slice(0, 10),

          /* 기간 */
          period:
              data.startDate && data.endDate
                  ? `${data.startDate} ~ ${data.endDate}`
                  : "-",

          /* 배열 필드 */
          images:                data.postImageUrl ?? [],
          tags:                  [],                   // API 에 없음
          requiredRoles:         data.roles ?? [],
          preferredPersonality:  data.preferredCharacters ?? [],

          maxMembers:    data.maxMember ?? "-",
          contactMethod: "chat",

          author: {
            id:         "-", // 없음
            name:       data.userName ?? "작성자",
            image:      data.profileImage || "/placeholder.svg",
            department: data.userMajor ?? "",
            year:       "",
          },
        })
      } catch (err) {
        console.error(err)
        toast({ title: "프로젝트 불러오기 실패", description: "잠시 후 다시 시도해 주세요." })
      }
    })()
  }, [id])

  /* 로딩 중엔 렌더 X */
  if (!project) return null

  /* ---------- 공유 / 저장 ---------- */
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({ title: project.title, url: location.href })
    } else {
      navigator.clipboard.writeText(location.href)
      setCopied(true)
      toast({ title: "링크가 복사되었습니다" })
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const toggleSave = () => {
    setIsSaved((s) => !s)
    toast({
      title: !isSaved ? "저장됨" : "저장 취소됨",
      description: !isSaved
          ? "프로젝트가 저장 목록에 추가되었습니다."
          : "프로젝트가 저장 목록에서 제거되었습니다.",
    })
  }

  /* ---------- 삭제 ---------- */
  const handleDelete = async () => {
    try {
      await axiosInstance.delete(`/post/delete/${project.id}`)
      toast({ title: "삭제 완료", description: "프로젝트가 삭제되었습니다." })
      location.replace("/projects")
    } catch (err) {
      console.error(err)
      toast({ title: "삭제 실패", description: "권한 또는 네트워크를 확인하세요." })
    }
  }

  /* ---------- UI ---------- */
  return (
      <div className="container py-8">
        {/* 뒤로가기 */}
        <Button variant="ghost" size="sm" asChild className="mb-6">
          <Link href="/projects">
            <ArrowLeft className="h-4 w-4 mr-2" />
            프로젝트 목록으로
          </Link>
        </Button>

        {/* 도메인 + 태그(스택) */}
        <div className="flex flex-wrap gap-2 mb-4">
          <Badge variant="outline">{project.domain}</Badge>
          {project.tags.map((tag: string) => (
              <Badge key={tag} variant="secondary">
                {tag}
              </Badge>
          ))}
        </div>
        <h1 className="text-3xl font-bold mb-4">{project.title}</h1>

        {/* 작성자 + 버튼 모음 */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 gap-2">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={project.author.image} alt={project.author.name} />
              <AvatarFallback>{project.author.name[0]}</AvatarFallback>
            </Avatar>
            <div>
              <div className="font-medium">{project.author.name}</div>
              <div className="text-sm text-muted-foreground">
                {project.author.department}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <Button variant="outline" size={isMobile ? "sm" : "default"} onClick={handleShare}>
              {copied ? (
                  <>
                    <Check className="h-4 w-4 mr-2" /> 복사됨
                  </>
              ) : (
                  <>
                    <Clipboard className="h-4 w-4 mr-2" /> 공유하기
                  </>
              )}
            </Button>

            <Button
                variant={isSaved ? "default" : "outline"}
                size={isMobile ? "sm" : "default"}
                onClick={toggleSave}
            >
              <Bookmark className={`h-4 w-4 mr-2 ${isSaved ? "fill-current" : ""}`} />
              {isSaved ? "저장됨" : "저장하기"}
            </Button>

            {/* 삭제 버튼 */}
            <Dialog>
              <DialogTrigger asChild>
                <Button size={isMobile ? "sm" : "default"} variant="destructive">
                  <Trash2 className="h-4 w-4 mr-2" />
                  삭제
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>정말 삭제할까요?</DialogTitle>
                  <DialogDescription>
                    삭제된 글은 복구할 수 없습니다.
                  </DialogDescription>
                </DialogHeader>
                <div className="flex justify-end gap-2">
                  <Button onClick={handleDelete} variant="destructive">
                    삭제
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <div className="text-sm text-muted-foreground mb-6">
          작성일: {project.createdAt}
        </div>

        {/* 본문 + 사이드 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* 본문 */}
          <div className="md:col-span-2">
            <Card className="mb-6">
              <CardContent className="p-6 whitespace-pre-line">{project.description}</CardContent>
            </Card>

            {project.images.length > 0 && (
                <div className="space-y-4">
                  <h2 className="text-xl font-bold">프로젝트 이미지</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {project.images.map((url: string, i: number) => (
                        <div key={i} className="rounded-md overflow-hidden border">
                          <img
                              src={url || "/placeholder.svg"}
                              alt={`${project.title} 이미지 ${i + 1}`}
                              className="w-full h-auto object-cover"
                          />
                        </div>
                    ))}
                  </div>
                </div>
            )}
          </div>

          {/* 사이드 카드 */}
          <div>
            <Card>
              <CardContent className="p-6 space-y-6">
                <section>
                  <h3 className="text-lg font-medium mb-2">모집 정보</h3>
                  <InfoRow label="모집 인원" value={`최대 ${project.maxMembers}명`} />
                  <InfoRow label="프로젝트 기간" value={project.period} />
                  <InfoRow label="연락 방법" value="쿠함 채팅" />
                </section>

                <section>
                  <h3 className="text-lg font-medium mb-2">필요한 역할</h3>
                  <BadgeList items={project.requiredRoles} />
                </section>

                <section>
                  <h3 className="text-lg font-medium mb-2">선호하는 성격</h3>
                  <BadgeList items={project.preferredPersonality} outlined />
                </section>

                {/* 채팅 버튼 (변경 없음) */}
                <Dialog>
                  <DialogTrigger asChild>
                    <Button size={isMobile ? "sm" : "default"} className="w-full">
                      <MessageSquare className="h-4 w-4 mr-2" />
                      채팅으로 문의하기
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>채팅하기</DialogTitle>
                      <DialogDescription>
                        {project.author.name}님과 채팅을 시작하시겠습니까?
                      </DialogDescription>
                    </DialogHeader>
                    <div className="flex justify-end gap-2 mt-4">
                      <Button asChild>
                        <Link
                            href={`/chat?user=${project.author.id}&projectId=${project.id}&projectTitle=${encodeURIComponent(
                                project.title,
                            )}&projectDomain=${encodeURIComponent(project.domain)}&projectImage=${encodeURIComponent(
                                project.images[0] || "",
                            )}`}
                        >
                          채팅 시작
                        </Link>
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
  )
}
