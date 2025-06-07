"use client"

import {useEffect, useState} from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Github, Globe, Instagram, Mail, Plus, ChevronDown, ChevronUp, LogOut, Trash2, Settings } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {clearAllCookies} from "@/utils/clearAllCookies";
import {deleteUser, getActivity, getLicense, getPortfolio, getProject} from "@/apis/user";
import {Activity, GetPortfolioResponse, License, Project} from "@/types/user";

export default function ProfilePage() {
  const router = useRouter()
  const [user, setUser] = useState<GetPortfolioResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [certifications, setCertifications] = useState<License[]>([]);

  // 프로젝트 확장/축소 토글
  const [projects, setProjects] = useState<Project[]>([]);
  const toggleProjectExpand = (id: number) => {
    setProjects(projects.map((project) => (project.id === id ? { ...project, expanded: !project.expanded } : project)))
  }

  // 활동 확장/축소 토글
  const [activities, setActivities] = useState<Activity[]>([]);
  const toggleActivityExpand = (id: number) => {
    setActivities(
        activities.map((activity) => (activity.id === id ? { ...activity, expanded: !activity.expanded } : activity)),
    )
  }

  // 로그아웃 처리
  const handleLogout = () => {
    clearAllCookies();
    router.push("/auth/login")
  }

  // 회원탈퇴 처리
  const handleDeleteAccount = async () => {
    try {
      // 탈퇴 API 호출
      await deleteUser();

      // 쿠키 삭제(로그아웃 처리)
      clearAllCookies();

      // 리다이렉트
      alert("회원탈퇴가 완료되었습니다.");
      router.push("/auth/login");
    } catch (err) {
      console.error("회원탈퇴 실패:", err);
      alert("회원탈퇴 중 오류가 발생했습니다.");
    }
  };

  useEffect(() => {
    async function fetchData() {
      try {
        const [portfolio, rawProjects, rawActivities, licenses] = await Promise.all([
          getPortfolio(),
          getProject(),
          getActivity(),
          getLicense(),
        ]);

        setUser(portfolio);
        // expanded 추가!
        setProjects(rawProjects.map((p) => ({ ...p, expanded: false })));
        setActivities(rawActivities.map((a) => ({ ...a, expanded: false })));
        setCertifications(licenses);
      } catch (error) {
        console.error('데이터 불러오기 실패:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);


  if (loading) return <p>불러오는 중...</p>;
  if (!user) return <p>정보를 불러올 수 없습니다.</p>;


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
                      <AvatarImage src={user.profileUrl || "/placeholder.svg"} alt={user.name} />
                      <AvatarFallback>{user.name}</AvatarFallback>
                    </Avatar>
                    <h1 className="text-2xl font-bold">{user.name}</h1>
                    <div className="mt-2 space-y-1">
                      <Badge variant="outline">{user.major}</Badge>
                      <Badge variant="outline">{user.grade}</Badge>
                      <Badge variant="outline">{user.studentNumber}</Badge>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h2 className="font-medium mb-2">소개</h2>
                      <p className="text-sm text-muted-foreground">{user.introduce}</p>
                    </div>

                    <div>
                      <h2 className="font-medium mb-2">기술 스택</h2>
                      <div className="flex flex-wrap gap-2">
                        {user.stacks?.map((skill) => (
                          <Badge key={skill} variant="secondary">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h2 className="font-medium mb-2">성격</h2>
                      <div className="flex flex-wrap gap-2">
                        {user.characters?.map((trait) => (
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
                        {user.links.map((link, idx) => (
                          <div key={idx} className="flex items-center text-sm">
                            <Globe className="h-4 w-4 mr-2 text-muted-foreground" />
                            <a
                              href={link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="hover:underline break-all"
                            >
                              {link}
                            </a>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
                <div className="px-6 py-4 border-t space-y-2">
                  <Button className="w-full" asChild>
                    <Link href="/profile/edit">
                      <Settings className="h-4 w-4 mr-2" />
                      프로필 수정
                    </Link>
                  </Button>

                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" className="w-full">
                        <LogOut className="h-4 w-4 mr-2" />
                        로그아웃
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>로그아웃</DialogTitle>
                        <DialogDescription>정말로 로그아웃하시겠습니까?</DialogDescription>
                      </DialogHeader>
                      <DialogFooter>
                        <Button variant="outline">취소</Button>
                        <Button onClick={handleLogout}>로그아웃</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>

                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" className="w-full">
                        <Trash2 className="h-4 w-4 mr-2" />
                        회원탈퇴
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>회원탈퇴</AlertDialogTitle>
                        <AlertDialogDescription>
                          정말로 회원탈퇴를 하시겠습니까? 이 작업은 되돌릴 수 없으며, 모든 데이터가 영구적으로 삭제됩니다.
                          <br />
                          <br />
                          탈퇴 시 삭제되는 정보:
                          <br />• 프로필 정보 및 포트폴리오
                          <br />• 작성한 프로젝트 및 댓글
                          <br />• 채팅 기록
                          <br />• 활동 내역
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>취소</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={handleDeleteAccount}
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                          탈퇴하기
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
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
                              <p className="text-sm text-muted-foreground">{item.roles}</p>
                            </div>
                            <Badge variant="outline">{item.startDate} ~ {item.endDate}</Badge>
                          </div>

                          <p className="text-sm">{item.oneLineDescription}</p>

                          <div className="flex flex-wrap gap-2">
                            {item.stacks.map((tag) => (
                                <Badge key={tag} variant="secondary" className="text-xs">
                                  {tag}
                                </Badge>
                            ))}
                          </div>

                          {item.expanded && (
                            <div className="space-y-3 mt-2">
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                {item.images && item.images.length > 0 ? (
                                  item.images.map((img, idx) => (
                                    <div key={idx} className="rounded-md overflow-hidden">
                                      <img
                                        src={img || "/placeholder.svg"}
                                        alt={`${item.title} 이미지 ${idx + 1}`}
                                        className="w-full object-cover h-48"
                                      />
                                    </div>
                                  ))
                                ) : (
                                  <img
                                    src="/placeholder.svg"
                                    alt="placeholder"
                                    className="w-full object-cover h-48 rounded-md"
                                  />
                                )}
                              </div>
                              <p className="text-sm whitespace-pre-line">{item.description}</p>
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
                              <h3 className="text-xl font-bold">{activity.name}</h3>
                              <p className="text-sm text-muted-foreground">{activity.roles}</p>
                            </div>
                            <Badge variant="outline">{activity.startDate} ~ {activity.endDate}</Badge>
                          </div>

                          <p className="text-sm">{activity.oneLineDescription}</p>

                          {activity.expanded && (
                            <div className="space-y-3 mt-2">
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                {activity.images && activity.images.length > 0 ? (
                                  activity.images.map((img, idx) => (
                                    <div key={idx} className="rounded-md overflow-hidden">
                                      <img
                                        src={img || "/placeholder.svg"}
                                        alt={`${activity.name} 이미지 ${idx + 1}`}
                                        className="w-full object-cover h-48"
                                      />
                                    </div>
                                  ))
                                ) : (
                                  <img
                                    src="/placeholder.svg"
                                    alt="placeholder"
                                    className="w-full object-cover h-48 rounded-md"
                                  />
                                )}
                              </div>
                              <p className="text-sm whitespace-pre-line">{activity.description}</p>
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
                            <CardTitle>{cert.licenseName}</CardTitle>
                            <CardDescription>{cert.licenseOrganization}</CardDescription>
                          </div>
                          <Badge variant="outline">{cert.licenseDate}</Badge>
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

