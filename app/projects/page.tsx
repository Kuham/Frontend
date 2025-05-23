"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Search, Plus, Filter } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet"
import { useMobile } from "@/hooks/use-mobile"

export default function ProjectsPage() {
  const isMobile = useMobile()
  const [searchQuery, setSearchQuery] = useState("")
  const [domainFilter, setDomainFilter] = useState("")
  const [sortOption, setSortOption] = useState("latest")

  // 샘플 프로젝트 데이터
  const projects = [
    {
      id: 1,
      title: "AI 기반 학습 플랫폼 개발",
      description: "머신러닝을 활용한 맞춤형 학습 콘텐츠 추천 시스템을 개발하는 프로젝트입니다.",
      domain: "AI & 머신러닝",
      tags: ["React", "Python", "TensorFlow", "AI", "웹개발"],
      author: {
        id: "user1",
        name: "김철수",
        image: "/placeholder.svg",
        department: "컴퓨터공학과",
      },
      createdAt: "2024년 3월 29일",
    },
    {
      id: 2,
      title: "대학생 중고거래 앱 UI/UX 디자인",
      description: "대학생들을 위한 중고거래 앱의 UI/UX 디자인을 담당해주실 디자이너를 찾습니다.",
      domain: "디자인",
      tags: ["UI/UX", "Figma", "디자인", "앱개발"],
      author: {
        id: "user2",
        name: "이영희",
        image: "/placeholder.svg",
        department: "디자인학과",
      },
      createdAt: "2024년 3월 28일",
    },
    {
      id: 3,
      title: "블록체인 기반 학생증 시스템",
      description: "블록체인 기술을 활용한 디지털 학생증 시스템 개발 프로젝트입니다.",
      domain: "블록체인",
      tags: ["Blockchain", "Solidity", "React", "웹개발"],
      author: {
        id: "user3",
        name: "박지민",
        image: "/placeholder.svg",
        department: "소프트웨어학과",
      },
      createdAt: "2024년 3월 25일",
    },
    {
      id: 4,
      title: "캠퍼스 내비게이션 앱 개발",
      description: "대학 캠퍼스 내 최적 경로를 안내하는 모바일 앱 개발 프로젝트입니다.",
      domain: "앱개발",
      tags: ["Flutter", "Firebase", "Google Maps API", "앱개발"],
      author: {
        id: "user4",
        name: "최서연",
        image: "/placeholder.svg",
        department: "컴퓨터공학과",
      },
      createdAt: "2024년 3월 23일",
    },
    {
      id: 5,
      title: "대학생 멘탈 케어 서비스 기획",
      description: "대학생들의 정신 건강을 위한 상담 및 커뮤니티 서비스 기획 프로젝트입니다.",
      domain: "기획",
      tags: ["서비스기획", "UX리서치", "심리학", "헬스케어"],
      author: {
        id: "user5",
        name: "정현우",
        image: "/placeholder.svg",
        department: "심리학과",
      },
      createdAt: "2024년 3월 20일",
    },
    {
      id: 6,
      title: "학과별 맞춤 스터디 매칭 플랫폼",
      description: "같은 학과 학생들끼리 스터디를 쉽게 구성할 수 있는 웹 서비스 개발 프로젝트입니다.",
      domain: "웹개발",
      tags: ["React", "Node.js", "MongoDB", "웹개발"],
      author: {
        id: "user6",
        name: "한소희",
        image: "/placeholder.svg",
        department: "경영학과",
      },
      createdAt: "2024년 3월 18일",
    },
  ]

  // 도메인 목록 (중복 제거)
  const domains = Array.from(new Set(projects.map((project) => project.domain)))

  // 필터링 및 정렬된 프로젝트 목록
  const filteredProjects = projects
    .filter((project) => {
      const matchesSearch =
        project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))

      const matchesDomain = domainFilter ? project.domain === domainFilter : true

      return matchesSearch && matchesDomain
    })
    .sort((a, b) => {
      if (sortOption === "latest") {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      } else if (sortOption === "oldest") {
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      }
      return 0
    })

  return (
    <div className="container py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <h1 className="text-2xl font-bold">프로젝트</h1>
        <Button asChild>
          <Link href="/projects/create">
            <Plus className="mr-2 h-4 w-4" />
            프로젝트 등록
          </Link>
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="프로젝트 검색..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex gap-2">
          {isMobile ? (
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" className="w-full md:w-auto">
                  <Filter className="mr-2 h-4 w-4" />
                  필터
                </Button>
              </SheetTrigger>
              <SheetContent side="right">
                <SheetHeader>
                  <SheetTitle>필터 옵션</SheetTitle>
                  <SheetDescription>프로젝트를 필터링하고 정렬하세요.</SheetDescription>
                </SheetHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">도메인</label>
                    <Select value={domainFilter} onValueChange={setDomainFilter}>
                      <SelectTrigger>
                        <SelectValue placeholder="모든 도메인" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">모든 도메인</SelectItem>
                        {domains.map((domain) => (
                          <SelectItem key={domain} value={domain}>
                            {domain}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">정렬</label>
                    <Select value={sortOption} onValueChange={setSortOption}>
                      <SelectTrigger>
                        <SelectValue placeholder="최신순" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="latest">최신순</SelectItem>
                        <SelectItem value="oldest">오래된순</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="mt-4">
                  <SheetClose asChild>
                    <Button className="w-full">적용하기</Button>
                  </SheetClose>
                </div>
              </SheetContent>
            </Sheet>
          ) : (
            <>
              <Select value={domainFilter} onValueChange={setDomainFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="모든 도메인" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">모든 도메인</SelectItem>
                  {domains.map((domain) => (
                    <SelectItem key={domain} value={domain}>
                      {domain}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={sortOption} onValueChange={setSortOption}>
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="최신순" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="latest">최신순</SelectItem>
                  <SelectItem value="oldest">오래된순</SelectItem>
                </SelectContent>
              </Select>
            </>
          )}
        </div>
      </div>

      <Tabs defaultValue="all" className="mb-8">
        <TabsList className="mb-6">
          <TabsTrigger value="all">전체</TabsTrigger>
          <TabsTrigger value="development">개발</TabsTrigger>
          <TabsTrigger value="design">디자인</TabsTrigger>
          <TabsTrigger value="planning">기획</TabsTrigger>
          <TabsTrigger value="research">연구</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project) => (
              <Link href={`/projects/${project.id}`} key={project.id}>
                <Card className="h-full overflow-hidden hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="outline">{project.domain}</Badge>
                        {project.tags.slice(0, 2).map((tag) => (
                          <Badge key={tag} variant="secondary" className="font-normal">
                            {tag}
                          </Badge>
                        ))}
                        {project.tags.length > 2 && (
                          <Badge variant="secondary" className="font-normal">
                            +{project.tags.length - 2}
                          </Badge>
                        )}
                      </div>
                      <h3 className="text-xl font-semibold line-clamp-2">{project.title}</h3>
                      <p className="text-muted-foreground line-clamp-3">{project.description}</p>
                      <div className="flex items-center justify-between pt-2">
                        <div className="flex items-center gap-2">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={project.author.image} alt={project.author.name} />
                            <AvatarFallback>{project.author.name[0]}</AvatarFallback>
                          </Avatar>
                          <div>
                            <span className="text-sm font-medium">{project.author.name}</span>
                            <p className="text-xs text-muted-foreground">{project.author.department}</p>
                          </div>
                        </div>
                        <div className="text-sm text-muted-foreground">{project.createdAt}</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>

          {filteredProjects.length === 0 && (
            <div className="flex items-center justify-center h-40 text-muted-foreground">검색 결과가 없습니다</div>
          )}
        </TabsContent>

        {/* 다른 탭 콘텐츠는 필요에 따라 구현 */}
        <TabsContent value="development" className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects
              .filter((project) =>
                project.tags.some((tag) =>
                  ["웹개발", "앱개발", "React", "Flutter", "Node.js", "Python", "Java", "개발"].includes(tag),
                ),
              )
              .map((project) => (
                <Link href={`/projects/${project.id}`} key={project.id}>
                  <Card className="h-full overflow-hidden hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="space-y-4">
                        <div className="flex flex-wrap gap-2">
                          <Badge variant="outline">{project.domain}</Badge>
                          {project.tags.slice(0, 2).map((tag) => (
                            <Badge key={tag} variant="secondary" className="font-normal">
                              {tag}
                            </Badge>
                          ))}
                          {project.tags.length > 2 && (
                            <Badge variant="secondary" className="font-normal">
                              +{project.tags.length - 2}
                            </Badge>
                          )}
                        </div>
                        <h3 className="text-xl font-semibold line-clamp-2">{project.title}</h3>
                        <p className="text-muted-foreground line-clamp-3">{project.description}</p>
                        <div className="flex items-center justify-between pt-2">
                          <div className="flex items-center gap-2">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={project.author.image} alt={project.author.name} />
                              <AvatarFallback>{project.author.name[0]}</AvatarFallback>
                            </Avatar>
                            <div>
                              <span className="text-sm font-medium">{project.author.name}</span>
                              <p className="text-xs text-muted-foreground">{project.author.department}</p>
                            </div>
                          </div>
                          <div className="text-sm text-muted-foreground">{project.createdAt}</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
          </div>
        </TabsContent>

        <TabsContent value="design" className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects
              .filter((project) =>
                project.tags.some((tag) => ["디자인", "UI/UX", "Figma", "그래픽디자인", "UX리서치"].includes(tag)),
              )
              .map((project) => (
                <Link href={`/projects/${project.id}`} key={project.id}>
                  <Card className="h-full overflow-hidden hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="space-y-4">
                        <div className="flex flex-wrap gap-2">
                          <Badge variant="outline">{project.domain}</Badge>
                          {project.tags.slice(0, 2).map((tag) => (
                            <Badge key={tag} variant="secondary" className="font-normal">
                              {tag}
                            </Badge>
                          ))}
                          {project.tags.length > 2 && (
                            <Badge variant="secondary" className="font-normal">
                              +{project.tags.length - 2}
                            </Badge>
                          )}
                        </div>
                        <h3 className="text-xl font-semibold line-clamp-2">{project.title}</h3>
                        <p className="text-muted-foreground line-clamp-3">{project.description}</p>
                        <div className="flex items-center justify-between pt-2">
                          <div className="flex items-center gap-2">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={project.author.image} alt={project.author.name} />
                              <AvatarFallback>{project.author.name[0]}</AvatarFallback>
                            </Avatar>
                            <div>
                              <span className="text-sm font-medium">{project.author.name}</span>
                              <p className="text-xs text-muted-foreground">{project.author.department}</p>
                            </div>
                          </div>
                          <div className="text-sm text-muted-foreground">{project.createdAt}</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

