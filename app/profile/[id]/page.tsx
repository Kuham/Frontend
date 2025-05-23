import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Github, Globe, Instagram, Mail, MessageSquare } from "lucide-react"

export default function ProfilePage({ params }: { params: { id: string } }) {
  // 샘플 사용자 데이터
  const user = {
    id: params.id,
    name: "박민준",
    username: "minjun_park",
    image: "/placeholder.svg",
    department: "인공지능학과",
    year: "석사과정",
    bio: "머신러닝과 데이터 사이언스를 공부하고 있는 대학원생입니다. 추천 시스템과 자연어 처리에 관심이 많습니다.",
    skills: ["Python", "TensorFlow", "PyTorch", "NLP", "데이터 분석", "추천 시스템"],
    links: {
      website: "https://minjunpark.com",
      github: "https://github.com/minjunpark",
      instagram: "https://instagram.com/minjun_park",
    },
    email: "minjun@example.com",
  }

  // 샘플 포트폴리오 데이터
  const portfolioItems = [
    {
      id: 1,
      title: "영화 추천 시스템",
      description: "협업 필터링과 콘텐츠 기반 필터링을 결합한 하이브리드 영화 추천 시스템",
      image: "/placeholder.svg?height=200&width=400",
      tags: ["Python", "TensorFlow", "추천 시스템"],
      link: "#",
    },
    {
      id: 2,
      title: "감성 분석 모델",
      description: "SNS 데이터를 활용한 한국어 감성 분석 모델 개발",
      image: "/placeholder.svg?height=200&width=400",
      tags: ["NLP", "PyTorch", "BERT"],
      link: "#",
    },
    {
      id: 3,
      title: "학습 데이터 시각화 도구",
      description: "교육 데이터를 시각화하여 학습 패턴을 분석하는 웹 애플리케이션",
      image: "/placeholder.svg?height=200&width=400",
      tags: ["React", "D3.js", "데이터 시각화"],
      link: "#",
    },
  ]

  // 샘플 프로젝트 참여 이력
  const projectHistory = [
    {
      id: 1,
      title: "대학 캠퍼스 내비게이션 앱",
      role: "머신러닝 엔지니어",
      period: "2023.09 ~ 2023.12",
      description: "캠퍼스 내 최적 경로 추천 알고리즘 개발",
    },
    {
      id: 2,
      title: "학생 학습 패턴 분석 연구",
      role: "데이터 분석가",
      period: "2023.03 ~ 2023.08",
      description: "온라인 학습 플랫폼의 사용자 데이터를 분석하여 학습 패턴 연구",
    },
  ]

  return (
    <div className="container py-8">
      <Button variant="ghost" size="sm" asChild className="mb-6">
        <Link href="/projects">
          <ArrowLeft className="h-4 w-4 mr-2" />
          돌아가기
        </Link>
      </Button>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* 프로필 정보 */}
        <div className="md:col-span-1">
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center mb-6">
                <Avatar className="h-24 w-24 mb-4">
                  <AvatarImage src={user.image} alt={user.name} />
                  <AvatarFallback>{user.name[0]}</AvatarFallback>
                </Avatar>
                <h1 className="text-2xl font-bold">{user.name}</h1>
                <p className="text-muted-foreground">@{user.username}</p>
                <div className="mt-2">
                  <Badge variant="outline">{user.department}</Badge>
                  <Badge variant="outline" className="ml-2">
                    {user.year}
                  </Badge>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h2 className="font-medium mb-2">소개</h2>
                  <p className="text-sm text-muted-foreground">{user.bio}</p>
                </div>

                <div>
                  <h2 className="font-medium mb-2">기술 스택</h2>
                  <div className="flex flex-wrap gap-2">
                    {user.skills.map((skill) => (
                      <Badge key={skill} variant="secondary">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <h2 className="font-medium mb-2">연락처</h2>
                  <div className="space-y-2">
                    <div className="flex items-center text-sm">
                      <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>{user.email}</span>
                    </div>
                    {user.links.website && (
                      <div className="flex items-center text-sm">
                        <Globe className="h-4 w-4 mr-2 text-muted-foreground" />
                        <a
                          href={user.links.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:underline"
                        >
                          웹사이트
                        </a>
                      </div>
                    )}
                    {user.links.github && (
                      <div className="flex items-center text-sm">
                        <Github className="h-4 w-4 mr-2 text-muted-foreground" />
                        <a
                          href={user.links.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:underline"
                        >
                          GitHub
                        </a>
                      </div>
                    )}
                    {user.links.instagram && (
                      <div className="flex items-center text-sm">
                        <Instagram className="h-4 w-4 mr-2 text-muted-foreground" />
                        <a
                          href={user.links.instagram}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:underline"
                        >
                          Instagram
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
            <div className="px-6 py-4 border-t">
              <Button className="w-full">
                <MessageSquare className="h-4 w-4 mr-2" />
                메시지 보내기
              </Button>
            </div>
          </Card>
        </div>

        {/* 포트폴리오 및 프로젝트 이력 */}
        <div className="md:col-span-2">
          <Tabs defaultValue="portfolio">
            <TabsList className="mb-4">
              <TabsTrigger value="portfolio">포트폴리오</TabsTrigger>
              <TabsTrigger value="projects">프로젝트 이력</TabsTrigger>
            </TabsList>

            <TabsContent value="portfolio" className="space-y-6">
              {portfolioItems.map((item) => (
                <Card key={item.id}>
                  <div className="md:flex">
                    <div className="md:w-1/3">
                      <img
                        src={item.image || "/placeholder.svg"}
                        alt={item.title}
                        className="h-48 w-full object-cover md:h-full"
                      />
                    </div>
                    <div className="p-6 md:w-2/3">
                      <CardTitle className="mb-2">{item.title}</CardTitle>
                      <CardDescription className="mb-4">{item.description}</CardDescription>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {item.tags.map((tag) => (
                          <Badge key={tag} variant="outline">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      <Button variant="outline" size="sm" asChild>
                        <a href={item.link} target="_blank" rel="noopener noreferrer">
                          자세히 보기
                        </a>
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="projects" className="space-y-6">
              {projectHistory.map((project) => (
                <Card key={project.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle>{project.title}</CardTitle>
                        <CardDescription>{project.role}</CardDescription>
                      </div>
                      <Badge variant="outline">{project.period}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p>{project.description}</p>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}

