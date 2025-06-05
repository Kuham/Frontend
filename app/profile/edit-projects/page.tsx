"use client"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { PencilIcon, X, Plus, ArrowLeft, Trash2, Upload, ImageIcon } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { toast } from "sonner"

interface Project {
  id: number;
  title: string;
  domain: string;
  description: string;
  longDescription: string;
  image: string;
  tags: string[];
  period: string;
}

export default function EditProjectsPage() {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)

  // 샘플 프로젝트 데이터
  const [projects, setProjects] = useState<Project[]>([
    {
      id: 1,
      title: "영화 추천 시스템",
      domain: "AI & 머신러닝",
      description: "협업 필터링과 콘텐츠 기반 필터링을 결합한 하이브리드 영화 추천 시스템",
      longDescription:
          "이 프로젝트는 사용자의 시청 기록과 선호도를 분석하여 개인화된 영화 추천을 제공합니다. 협업 필터링 알고리즘을 사용하여 비슷한 취향을 가진 사용자들의 패턴을 파악하고, 콘텐츠 기반 필터링을 통해 사용자가 좋아했던 영화와 유사한 특성을 가진 영화를 추천합니다.",
      image: "/placeholder.svg?height=300&width=500",
      tags: ["Python", "TensorFlow", "추천 시스템"],
      period: "2023년 1월 ~ 2023년 6월",
    },
    {
      id: 2,
      title: "감성 분석 모델",
      domain: "자연어처리",
      description: "SNS 데이터를 활용한 한국어 감성 분석 모델 개발",
      longDescription:
          "소셜 미디어 텍스트 데이터에서 감정을 분석하는 딥러닝 모델을 개발했습니다. BERT 기반 모델을 미세 조정하여 한국어 텍스트의 감정(긍정, 부정, 중립)을 분류합니다.",
      image: "/placeholder.svg?height=300&width=500",
      tags: ["NLP", "PyTorch", "BERT"],
      period: "2022년 7월 ~ 2022년 12월",
    },
    {
      id: 3,
      title: "학습 데이터 시각화 도구",
      domain: "데이터 시각화",
      description: "교육 데이터를 시각화하여 학습 패턴을 분석하는 웹 애플리케이션",
      longDescription:
          "이 프로젝트는 온라인 교육 플랫폼에서 수집된 학습 데이터를 시각화하는 웹 애플리케이션입니다. React와 D3.js를 사용하여 사용자 친화적인 인터페이스를 구현했습니다.",
      image: "/placeholder.svg?height=300&width=500",
      tags: ["React", "D3.js", "데이터 시각화"],
      period: "2022년 3월 ~ 2022년 6월",
    },
  ])

  // 프로젝트 수정 상태
  const [editingProject, setEditingProject] = useState<Project | null>(null)

  // 프로젝트 태그 처리
  const [newTag, setNewTag] = useState("")

  // 프로젝트 수정 창 열기
  const openEditDialog = (project: Project) => {
    setEditingProject({ ...project })
  }

  // 태그 추가
  const addTag = () => {
    if (newTag.trim() && editingProject && !editingProject.tags.includes(newTag.trim())) {
      setEditingProject({
        ...editingProject,
        tags: [...editingProject.tags, newTag.trim()],
      })
      setNewTag("")
    }
  }

  // 태그 삭제
  const removeTag = (tagToRemove: string) => {
    if (editingProject) {
      setEditingProject({
        ...editingProject,
        tags: editingProject.tags.filter((tag: string) => tag !== tagToRemove),
      })
    }
  }

  // 프로젝트 업데이트
  const updateProject = () => {
    if (!editingProject) return

    setProjects(projects.map((project) => (project.id === editingProject.id ? editingProject : project)))

    setEditingProject(null)
  }

  // 프로젝트 삭제
  const deleteProject = (id: number) => {
    setProjects(projects.filter((project) => project.id !== id))
  }

  // 새 프로젝트 생성
  const [showNewProjectForm, setShowNewProjectForm] = useState(false)
  const [newProject, setNewProject] = useState<Omit<Project, 'id'>>({
    title: "",
    domain: "",
    description: "",
    longDescription: "",
    image: "/placeholder.svg?height=300&width=500",
    tags: [],
    period: "",
  })

  // 프로젝트 추가
  const addProject = () => {
    const projectToAdd = {
      id: Date.now(),
      ...newProject,
    }

    setProjects([...projects, projectToAdd])
    setNewProject({
      title: "",
      domain: "",
      description: "",
      longDescription: "",
      image: "/placeholder.svg?height=300&width=500",
      tags: [],
      period: "",
    })
    setShowNewProjectForm(false)
  }

  // 이미지 업로드 처리
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, isNewProject: boolean = false) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > 5 * 1024 * 1024) { // 5MB 제한
      toast.error("파일 크기는 5MB를 초과할 수 없습니다.")
      return
    }

    if (!file.type.startsWith("image/")) {
      toast.error("이미지 파일만 업로드할 수 있습니다.")
      return
    }

    const reader = new FileReader()
    reader.onloadend = () => {
      if (isNewProject) {
        setNewProject({
          ...newProject,
          image: reader.result as string
        })
      } else if (editingProject) {
        setEditingProject({
          ...editingProject,
          image: reader.result as string
        })
      }
    }
    reader.readAsDataURL(file)
  }

  // 이미지 삭제 처리
  const handleImageDelete = (isNewProject: boolean = false) => {
    if (isNewProject) {
      setNewProject({
        ...newProject,
        image: "/placeholder.svg?height=300&width=500"
      })
    } else if (editingProject) {
      setEditingProject({
        ...editingProject,
        image: "/placeholder.svg?height=300&width=500"
      })
    }
  }

  return (
      <div className="container py-8">
        <div className="flex items-center mb-6">
          <Button variant="ghost" size="icon" onClick={() => router.back()} className="mr-2">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold">프로젝트 관리</h1>
        </div>

        <div className="flex justify-end mb-6">
          <Button onClick={() => setShowNewProjectForm(true)}>
            <Plus className="mr-2 h-4 w-4" />새 프로젝트 추가
          </Button>
        </div>

        <div className="space-y-6">
          {projects.map((project) => (
              <Card key={project.id}>
                <CardContent className="p-4">
                  <div className="flex justify-between gap-4">
                    <div className="relative w-32 h-32 rounded-lg overflow-hidden">
                      <Image
                        src={project.image}
                        alt={project.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold">{project.title}</h3>
                      <p className="text-sm text-muted-foreground mb-2">
                        {project.domain} | {project.period}
                      </p>
                      <p className="text-sm mb-2">{project.description}</p>
                      <div className="flex flex-wrap gap-2">
                        {project.tags.map((tag) => (
                            <Badge key={tag} variant="secondary">
                              {tag}
                            </Badge>
                        ))}
                      </div>
                    </div>
                    <div className="flex flex-col items-center gap-4">
                      <div className="flex gap-2">
                        <Button variant="ghost" size="icon" onClick={() => openEditDialog(project)}>
                          <PencilIcon className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="text-destructive"
                            onClick={() => deleteProject(project.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
          ))}

          {projects.length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground">등록된 프로젝트가 없습니다. 새 프로젝트를 추가해보세요.</p>
              </div>
          )}
        </div>

        {/* 프로젝트 편집 다이얼로그 */}
        {editingProject && (
            <Dialog open={!!editingProject} onOpenChange={(open) => !open && setEditingProject(null)}>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>프로젝트 수정</DialogTitle>
                  <DialogDescription>프로젝트 정보를 수정하세요.</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="project-image">프로젝트 이미지</Label>
                    <div className="flex items-center gap-4">
                      <div className="relative w-40 h-40 rounded-lg overflow-hidden border">
                        <Image
                            src={editingProject.image}
                            alt={editingProject.title}
                            fill
                            className="object-cover"
                        />
                      </div>
                      <div className="flex flex-col gap-2">
                        <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            ref={fileInputRef}
                            onChange={(e) => handleImageUpload(e)}
                        />
                        <Button
                            variant="outline"
                            onClick={() => fileInputRef.current?.click()}
                        >
                          <Upload className="h-4 w-4 mr-2" />
                          이미지 업로드
                        </Button>
                        <Button
                            variant="outline"
                            onClick={() => handleImageDelete()}
                            className="text-destructive"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          이미지 삭제
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="title">프로젝트 제목</Label>
                      <Input
                          id="title"
                          value={editingProject.title}
                          onChange={(e) => setEditingProject({ ...editingProject, title: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="domain">프로젝트 도메인</Label>
                      <Input
                          id="domain"
                          value={editingProject.domain}
                          onChange={(e) => setEditingProject({ ...editingProject, domain: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="period">기간</Label>
                    <Input
                        id="period"
                        value={editingProject.period}
                        onChange={(e) => setEditingProject({ ...editingProject, period: e.target.value })}
                        placeholder="2023년 1월 ~ 2023년 6월"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">간단한 설명</Label>
                    <Textarea
                        id="description"
                        value={editingProject.description}
                        onChange={(e) => setEditingProject({ ...editingProject, description: e.target.value })}
                        rows={2}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="longDescription">상세 설명</Label>
                    <Textarea
                        id="longDescription"
                        value={editingProject.longDescription}
                        onChange={(e) => setEditingProject({ ...editingProject, longDescription: e.target.value })}
                        rows={4}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>태그</Label>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {editingProject.tags.map((tag: string) => (
                          <Badge key={tag} variant="secondary" className="pl-2 pr-1 py-1 flex items-center gap-1">
                            {tag}
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-5 w-5 rounded-full hover:bg-destructive/20"
                                onClick={() => removeTag(tag)}
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </Badge>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <Input
                          placeholder="새 태그 추가"
                          value={newTag}
                          onChange={(e) => setNewTag(e.target.value)}
                          onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
                      />
                      <Button type="button" onClick={addTag}>
                        추가
                      </Button>
                    </div>
                  </div>
                </div>

                <DialogFooter>
                  <Button variant="outline" onClick={() => setEditingProject(null)}>
                    취소
                  </Button>
                  <Button onClick={updateProject}>저장</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
        )}

        {/* 새 프로젝트 추가 다이얼로그 */}
        <Dialog open={showNewProjectForm} onOpenChange={setShowNewProjectForm}>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>새 프로젝트 추가</DialogTitle>
              <DialogDescription>새로운 프로젝트 정보를 입력하세요.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="new-project-image">프로젝트 이미지</Label>
                <div className="flex items-center gap-4">
                  <div className="relative w-40 h-40 rounded-lg overflow-hidden border">
                    <Image
                        src={newProject.image}
                        alt="새 프로젝트 이미지"
                        fill
                        className="object-cover"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        ref={fileInputRef}
                        onChange={(e) => handleImageUpload(e, true)}
                    />
                    <Button
                        variant="outline"
                        onClick={() => fileInputRef.current?.click()}
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      이미지 업로드
                    </Button>
                    <Button
                        variant="outline"
                        onClick={() => handleImageDelete(true)}
                        className="text-destructive"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      이미지 삭제
                    </Button>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="newTitle">프로젝트 제목</Label>
                  <Input
                      id="newTitle"
                      value={newProject.title}
                      onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="newDomain">프로젝트 도메인</Label>
                  <Input
                      id="newDomain"
                      value={newProject.domain}
                      onChange={(e) => setNewProject({ ...newProject, domain: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="newPeriod">기간</Label>
                <Input
                    id="newPeriod"
                    value={newProject.period}
                    onChange={(e) => setNewProject({ ...newProject, period: e.target.value })}
                    placeholder="2023년 1월 ~ 2023년 6월"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="newDescription">간단한 설명</Label>
                <Textarea
                    id="newDescription"
                    value={newProject.description}
                    onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                    rows={2}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="newLongDescription">상세 설명</Label>
                <Textarea
                    id="newLongDescription"
                    value={newProject.longDescription}
                    onChange={(e) => setNewProject({ ...newProject, longDescription: e.target.value })}
                    rows={4}
                />
              </div>

              <div className="space-y-2">
                <Label>태그</Label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {newProject.tags.map((tag: string) => (
                      <Badge key={tag} variant="secondary" className="pl-2 pr-1 py-1 flex items-center gap-1">
                        {tag}
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-5 w-5 rounded-full hover:bg-destructive/20"
                            onClick={() =>
                                setNewProject({
                                  ...newProject,
                                  tags: newProject.tags.filter((t) => t !== tag),
                                })
                            }
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </Badge>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input
                      placeholder="새 태그 추가"
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault()
                          if (newTag.trim() && !newProject.tags.includes(newTag.trim())) {
                            setNewProject({
                              ...newProject,
                              tags: [...newProject.tags, newTag.trim()],
                            })
                            setNewTag("")
                          }
                        }
                      }}
                  />
                  <Button
                      type="button"
                      onClick={() => {
                        if (newTag.trim() && !newProject.tags.includes(newTag.trim())) {
                          setNewProject({
                            ...newProject,
                            tags: [...newProject.tags, newTag.trim()],
                          })
                          setNewTag("")
                        }
                      }}
                  >
                    추가
                  </Button>
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setShowNewProjectForm(false)}>
                취소
              </Button>
              <Button onClick={addProject}>추가</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
  )
}

