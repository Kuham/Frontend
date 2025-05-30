"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Github, Globe, Instagram, Mail, MessageSquare, Plus, ChevronDown, ChevronUp } from "lucide-react"

export default function ProfilePage() {
  // 샘플 사용자 데이터
  const user = {
    id: "me",
    name: "박민준",
    username: "minjun_park",
    image: "/placeholder.svg",
    department: "인공지능학과",
    year: "석사과정",
    studentId: "20201234",
    bio: "머신러닝과 데이터 사이언스를 공부하고 있는 대학원생입니다. 추천 시스템과 자연어 처리에 관심이 많습니다.",
    skills: ["Python", "TensorFlow", "PyTorch", "NLP", "데이터 분석", "추천 시스템"],
    personality: ["분석적인", "성실한", "협력적인", "도전적인"],
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
      domain: "AI & 머신러닝",
      description: "협업 필터링과 콘텐츠 기반 필터링을 결합한 하이브리드 영화 추천 시스템",
      longDescription:
          "이 프로젝트는 사용자의 시청 기록과 선호도를 분석하여 개인화된 영화 추천을 제공합니다. 협업 필터링 알고리즘을 사용하여 비슷한 취향을 가진 사용자들의 패턴을 파악하고, 콘텐츠 기반 필터링을 통해 사용자가 좋아했던 영화와 유사한 특성을 가진 영화를 추천합니다. Python과 TensorFlow를 사용하여 구현했으며, 10,000명 이상의 사용자 데이터로 모델을 학습시켰습니다.",
      image: "/placeholder.svg?height=300&width=500",
      tags: ["Python", "TensorFlow", "추천 시스템"],
      period: "2023년 1월 ~ 2023년 6월",
      link: "#",
      expanded: false,
    },
    {
      id: 2,
      title: "감성 분석 모델",
      domain: "자연어처리",
      description: "SNS 데이터를 활용한 한국어 감성 분석 모델 개발",
      longDescription:
          "소셜 미디어 텍스트 데이터에서 감정을 분석하는 딥러닝 모델을 개발했습니다. BERT 기반 모델을 미세 조정하여 한국어 텍스트의 감정(긍정, 부정, 중립)을 분류합니다. 약 50만 건의 트위터와 인스타그램 게시물을 수집하여 학습 데이터로 사용했으며, 85% 이상의 정확도를 달성했습니다. 기업들이 자사 제품에 대한 소비자 반응을 실시간으로 모니터링할 수 있는 웹 대시보드도 함께 개발했습니다.",
      image: "/placeholder.svg?height=300&width=500",
      tags: ["NLP", "PyTorch", "BERT"],
      period: "2022년 7월 ~ 2022년 12월",
      link: "#",
      expanded: false,
    },
    {
      id: 3,
      title: "학습 데이터 시각화 도구",
      domain: "데이터 시각화",
      description: "교육 데이터를 시각화하여 학습 패턴을 분석하는 웹 애플리케이션",
      longDescription:
          "이 프로젝트는 온라인 교육 플랫폼에서 수집된 학습 데이터를 시각화하는 웹 애플리케이션입니다. React와 D3.js를 사용하여 사용자 친화적인 인터페이스를 구현했으며, 학생들의 학습 시간, 진도율, 퀴즈 성적 등 다양한 지표를 그래프와 차트로 표현합니다. 교육자들이 학생들의 학습 패턴을 쉽게 파악하고, 맞춤형 피드백을 제공할 수 있도록 도와주는 도구입니다. 현재 3개 대학의 온라인 강의에서 시범적으로 사용 중입니다.",
      image: "/placeholder.svg?height=300&width=500",
      tags: ["React", "D3.js", "데이터 시각화"],
      period: "2022년 3월 ~ 2022년 6월",
      link: "#",
      expanded: false,
    },
  ]

  // 샘플 프로젝트 참여 이력
  const activityHistory = [
    {
      id: 1,
      title: "대학 캠퍼스 내비게이션 앱",
      role: "머신러닝 엔지니어",
      period: "2023년 9월 ~ 2023년 12월",
      description: "캠퍼스 내 최적 경로 추천 알고리즘 개발",
      longDescription:
          "교내 창업 동아리에서 개발한 캠퍼스 내비게이션 앱 프로젝트의 머신러닝 엔지니어로 참여했습니다. 사용자의 이동 패턴과 시간대별 혼잡도를 분석하여 최적의 경로를 추천하는 알고리즘을 개발했습니다. 기존 최단 경로 알고리즘에 실시간 혼잡도와 날씨 정보를 결합하여 보다 실용적인 경로를 제공하는 시스템을 구현했습니다. 이 프로젝트는 교내 창업 경진대회에서 우수상을 수상했습니다.",
      image: "/placeholder.svg?height=300&width=500",
      expanded: false,
    },
    {
      id: 2,
      title: "학생 학습 패턴 분석 연구",
      role: "데이터 분석가",
      period: "2023년 3월 ~ 2023년 8월",
      description: "온라인 학습 플랫폼의 사용자 데이터를 분석하여 학습 패턴 연구",
      longDescription:
          "교내 교육공학 연구소에서 진행한 학생들의 온라인 학습 패턴 분석 프로젝트에 데이터 분석가로 참여했습니다. 약 5,000명의 학생들이 6개월간 온라인 플랫폼에서 학습한 데이터를 수집하고 분석했습니다. 학습 시간대, 콘텐츠 소비 패턴, 퀴즈 응시 행동 등을 통계적으로 분석하여 효과적인 학습 전략을 도출했습니다. 이 연구 결과는 국내 교육공학 학술지에 게재되었으며, 학교의 온라인 학습 시스템 개선에 활용되었습니다.",
      image: "/placeholder.svg?height=300&width=500",
      expanded: false,
    },
    {
      id: 3,
      title: "산학협력 AI 프로젝트",
      role: "개발 리더",
      period: "2022년 6월 ~ 2022년 12월",
      description: "자동차 부품 결함 탐지를 위한 이미지 인식 시스템 개발",
      longDescription:
          "지역 자동차 부품 제조 기업과의 산학협력 프로젝트에서 개발 리더를 맡아 AI 기반 결함 탐지 시스템을 개발했습니다. 컨베이어 벨트에서 이동하는 자동차 부품의 이미지를 실시간으로 캡처하여 딥러닝 모델로 분석하고, 결함이 있는 제품을 자동으로 식별하는 시스템입니다. 기존 육안 검사 방식보다 정확도가 15% 향상되었고, 검사 시간을 70% 단축시켰습니다. 현재 해당 기업의 생산라인에 도입되어 활용되고 있습니다.",
      image: "/placeholder.svg?height=300&width=500",
      expanded: false,
    },
  ]

  // 샘플 자격증 데이터
  const certifications = [
    {
      id: 1,
      name: "정보처리기사",
      date: "2022년 5월 20일",
      organization: "한국산업인력공단",
    },
    {
      id: 2,
      name: "SQLD",
      date: "2021년 11월 15일",
      organization: "한국데이터산업진흥원",
    },
    {
      id: 3,
      name: "TensorFlow Developer Certificate",
      date: "2023년 3월 8일",
      organization: "Google",
    },
    {
      id: 4,
      name: "AWS Certified Solutions Architect",
      date: "2022년 8월 25일",
      organization: "Amazon Web Services",
    },
  ]

  // 프로젝트 확장/축소 토글
  const [projects, setProjects] = useState(portfolioItems)
  const toggleProjectExpand = (id: number) => {
    setProjects(projects.map((project) => (project.id === id ? { ...project, expanded: !project.expanded } : project)))
  }

  // 활동 확장/축소 토글
  const [activities, setActivities] = useState(activityHistory)
  const toggleActivityExpand = (id: number) => {
    setActivities(
        activities.map((activity) => (activity.id === id ? { ...activity, expanded: !activity.expanded } : activity)),
    )
  }

  return (
      <div className="container py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* 프로필 정보 - 스티키 적용 */}
          <div className="md:col-span-1">
            <div className="sticky top-20">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center text-center mb-6">
                    <Avatar className="h-24 w-24 mb-4">
                      <AvatarImage src={user.image} alt={user.name} />
                      <AvatarFallback>{user.name[0]}</AvatarFallback>
                    </Avatar>
                    <h1 className="text-2xl font-bold">{user.name}</h1>
                    <p className="text-muted-foreground">@{user.username}</p>
                    <div className="mt-2 space-y-1">
                      <Badge variant="outline">{user.department}</Badge>
                      <Badge variant="outline">{user.year}</Badge>
                      <Badge variant="outline">{user.studentId}</Badge>
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
                      <h2 className="font-medium mb-2">성격</h2>
                      <div className="flex flex-wrap gap-2">
                        {user.personality.map((trait) => (
                            <Badge key={trait} variant="outline" className="bg-primary/10">
                              {trait}
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
                  <Button asChild className="w-full">
                    <Link href="/chat" className="flex items-center justify-center">
                      <MessageSquare className="h-4 w-4 mr-2" />
                      메시지 보내기
                    </Link>
                  </Button>
                </div>
              </Card>
            </div>
          </div>

          {/* 포트폴리오 및 프로젝트 이력 */}
          <div className="md:col-span-2">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">포트폴리오</h2>
            </div>

            <Tabs defaultValue="projects" className="mb-8">
              <TabsList className="mb-4">
                <TabsTrigger value="projects">프로젝트</TabsTrigger>
                <TabsTrigger value="activities">활동</TabsTrigger>
                <TabsTrigger value="certifications">자격증</TabsTrigger>
              </TabsList>

              <TabsContent value="projects" className="space-y-6">
                {projects.map((item) => (
                    <Card key={item.id} className="overflow-hidden">
                      <CardContent className="p-4">
                        <div className="flex flex-col space-y-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="text-xl font-bold">{item.title}</h3>
                              <p className="text-sm text-muted-foreground">{item.domain}</p>
                            </div>
                            <Badge variant="outline">{item.period}</Badge>
                          </div>

                          <p className="text-sm">{item.description}</p>

                          <div className="flex flex-wrap gap-2">
                            {item.tags.map((tag) => (
                                <Badge key={tag} variant="secondary" className="text-xs">
                                  {tag}
                                </Badge>
                            ))}
                          </div>

                          {item.expanded && (
                              <div className="space-y-3 mt-2">
                                <div className="rounded-md overflow-hidden">
                                  <img
                                      src={item.image || "/placeholder.svg"}
                                      alt={item.title}
                                      className="w-full object-cover h-48"
                                  />
                                </div>
                                <p className="text-sm whitespace-pre-line">{item.longDescription}</p>
                              </div>
                          )}

                          <div className="flex justify-end">
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => toggleProjectExpand(item.id)}
                                className="text-primary"
                            >
                              {item.expanded ? (
                                  <>
                                    접기 <ChevronUp className="ml-1 h-4 w-4" />
                                  </>
                              ) : (
                                  <>
                                    자세히 보기 <ChevronDown className="ml-1 h-4 w-4" />
                                  </>
                              )}
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                ))}
              </TabsContent>

              <TabsContent value="activities" className="space-y-6">
                {activities.map((activity) => (
                    <Card key={activity.id}>
                      <CardContent className="p-4">
                        <div className="flex flex-col space-y-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="text-xl font-bold">{activity.title}</h3>
                              <p className="text-sm text-muted-foreground">{activity.role}</p>
                            </div>
                            <Badge variant="outline">{activity.period}</Badge>
                          </div>

                          <p className="text-sm">{activity.description}</p>

                          {activity.expanded && (
                              <div className="space-y-3 mt-2">
                                <div className="rounded-md overflow-hidden">
                                  <img
                                      src={activity.image || "/placeholder.svg"}
                                      alt={activity.title}
                                      className="w-full object-cover h-48"
                                  />
                                </div>
                                <p className="text-sm whitespace-pre-line">{activity.longDescription}</p>
                              </div>
                          )}

                          <div className="flex justify-end">
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => toggleActivityExpand(activity.id)}
                                className="text-primary"
                            >
                              {activity.expanded ? (
                                  <>
                                    접기 <ChevronUp className="ml-1 h-4 w-4" />
                                  </>
                              ) : (
                                  <>
                                    자세히 보기 <ChevronDown className="ml-1 h-4 w-4" />
                                  </>
                              )}
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                ))}
              </TabsContent>

              <TabsContent value="certifications" className="space-y-6">
                {certifications.map((cert) => (
                    <Card key={cert.id}>
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle>{cert.name}</CardTitle>
                            <CardDescription>{cert.organization}</CardDescription>
                          </div>
                          <Badge variant="outline">{cert.date}</Badge>
                        </div>
                      </CardHeader>
                    </Card>
                ))}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
  )
}

