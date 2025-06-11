"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import ProjectCard from "@/components/project-card"
import { ChevronRight } from "lucide-react"
import axiosInstance from "@/apis/custom-axios"

export default function Home() {
  const [projects, setProjects] = useState([])

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await axiosInstance.get("/post/all-posts")
        setProjects(res.data)
        console.log("불러오기 성공")
        console.log(res.data)
      } catch (err) {
        console.error("공고 불러오기 실패:", err)
      }
    }

    fetchProjects()
  }, [])

  return (
      <div className="container py-8">
        <section className="py-12 md:py-20">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
              대학생 프로젝트 팀원을 <br className="hidden sm:inline" />
              <span className="text-primary">쿠함</span>에서 찾아보세요
            </h1>
            <p className="text-xl text-muted-foreground">
              아이디어는 있지만 함께할 팀원이 필요하신가요?
              <br />
              나의 역량을 발휘할 프로젝트를 찾고 계신가요?
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button size="lg" asChild>
                <Link href="/projects/create">프로젝트 등록하기</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/projects">프로젝트 둘러보기</Link>
              </Button>
            </div>
          </div>
        </section>

        <section className="py-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">인기 프로젝트</h2>
            <Button variant="ghost" asChild className="group">
              <Link href="/projects" className="flex items-center">
                더 많은 프로젝트 보기
                <ChevronRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </div>

          <Tabs defaultValue="all" className="mb-8">
            <TabsList>
              <TabsTrigger value="all">전체</TabsTrigger>
              <TabsTrigger value="development">개발</TabsTrigger>
              <TabsTrigger value="design">디자인</TabsTrigger>
              <TabsTrigger value="planning">기획</TabsTrigger>
              <TabsTrigger value="marketing">마케팅</TabsTrigger>
            </TabsList>
            <TabsContent value="all" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects.map((project: any) => (
                    <ProjectCard key={project.id} project={project} />
                ))}
              </div>
            </TabsContent>
            <TabsContent value="development" className="mt-6">
              <div className="flex justify-center text-muted-foreground">분류된 프로젝트 없음</div>
            </TabsContent>
            <TabsContent value="design" className="mt-6">
              <div className="flex justify-center text-muted-foreground">분류된 프로젝트 없음</div>
            </TabsContent>
            <TabsContent value="planning" className="mt-6">
              <div className="flex items-center justify-center h-40 text-muted-foreground">프로젝트가 없습니다</div>
            </TabsContent>
            <TabsContent value="marketing" className="mt-6">
              <div className="flex items-center justify-center h-40 text-muted-foreground">프로젝트가 없습니다</div>
            </TabsContent>
          </Tabs>
        </section>

        {/* 사용 방법 섹션 */}
        <section className="py-12 bg-muted/50 rounded-2xl p-8">
          <h2 className="text-2xl font-bold mb-8 text-center">쿠함 이용 방법</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="border-none bg-background shadow-sm">
              <CardContent className="pt-6">
                <div className="rounded-full bg-primary/10 w-12 h-12 flex items-center justify-center mb-4">
                  <span className="text-primary font-bold text-lg">1</span>
                </div>
                <h3 className="text-lg font-semibold mb-2">프로젝트 등록하기</h3>
                <p className="text-muted-foreground">
                  진행하고 싶은 프로젝트를 등록하고 필요한 역할과 기술을 명시하세요.
                </p>
              </CardContent>
            </Card>
            <Card className="border-none bg-background shadow-sm">
              <CardContent className="pt-6">
                <div className="rounded-full bg-primary/10 w-12 h-12 flex items-center justify-center mb-4">
                  <span className="text-primary font-bold text-lg">2</span>
                </div>
                <h3 className="text-lg font-semibold mb-2">팀원 찾기</h3>
                <p className="text-muted-foreground">
                  댓글을 통해 지원자들의 프로필과 포트폴리오를 확인하고 적합한 팀원을 선택하세요.
                </p>
              </CardContent>
            </Card>
            <Card className="border-none bg-background shadow-sm">
              <CardContent className="pt-6">
                <div className="rounded-full bg-primary/10 w-12 h-12 flex items-center justify-center mb-4">
                  <span className="text-primary font-bold text-lg">3</span>
                </div>
                <h3 className="text-lg font-semibold mb-2">채팅으로 소통하기</h3>
                <p className="text-muted-foreground">
                  내장된 채팅 기능을 통해 팀원들과 원활하게 소통하고 프로젝트를 성공적으로 진행하세요.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>
      </div>
  )
}
