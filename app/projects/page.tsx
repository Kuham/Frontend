"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
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
import axiosInstance from "@/apis/custom-axios"

export default function ProjectsPage() {
  const isMobile = useMobile()
  const [searchQuery, setSearchQuery] = useState("")
  const [domainFilter, setDomainFilter] = useState("")
  const [sortOption, setSortOption] = useState("latest")
  const [projects, setProjects] = useState([])

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await axiosInstance.get("/post/all-posts")
        setProjects(res.data)
      } catch (err) {
        console.error("공고 불러오기 실패:", err)
      }
    }
    fetchProjects()
  }, [])

  const filteredProjects = projects
      .filter((project: any) => {
        const matchesSearch =
            project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            project.description.toLowerCase().includes(searchQuery.toLowerCase())

        const matchesDomain = domainFilter && domainFilter !== "all"
            ? project.domain === domainFilter
            : true

        return matchesSearch && matchesDomain
      })
      .sort((a: any, b: any) => {
        if (sortOption === "latest") {
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        } else {
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        }
      })

  const domains = Array.from(new Set(projects.map((p: any) => p.domain)))

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
                      <Filter className="mr-2 h-4 w-4" /> 필터
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
          <TabsList className="mb-6 bg-muted p-1 rounded-lg">
            {["전체", "개발", "디자인", "기획", "마케팅"].map((label) => (
                <TabsTrigger
                    key={label}
                    value={label === "전체" ? "all" : label}
                    className="data-[state=active]:bg-white data-[state=active]:text-black data-[state=inactive]:text-muted-foreground px-3 py-1 rounded-md text-sm font-medium transition-colors"
                >
                  {label}
                </TabsTrigger>
            ))}
          </TabsList>


          <TabsContent value="all" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProjects.map((project: any) => (
                  <Link href={`/projects/${project.id}`} key={project.id}>
                    <Card className="h-full overflow-hidden hover:shadow-md transition-shadow">
                      <CardContent className="p-6">
                        <div className="space-y-4">
                          <div className="flex flex-wrap gap-2">
                            <Badge variant="outline">{project.domain}</Badge>
                          </div>
                          <h3 className="text-xl font-semibold line-clamp-2">{project.title}</h3>
                          <p className="text-muted-foreground line-clamp-3">{project.description}</p>
                          <div className="flex items-center justify-between pt-2">
                            <div className="flex items-center gap-2">
                              <Avatar className="h-8 w-8">
                                <AvatarFallback>{project.userName[0]}</AvatarFallback>
                              </Avatar>
                              <div>
                                <span className="text-sm font-medium">{project.userName}</span>
                                <p className="text-xs text-muted-foreground">{project.userMajor}</p>
                              </div>
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {project.createdAt.slice(0, 10)}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
              ))}
            </div>

            {filteredProjects.length === 0 && (
                <div className="flex items-center justify-center h-40 text-muted-foreground">
                  검색 결과가 없습니다
                </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
  )
}
