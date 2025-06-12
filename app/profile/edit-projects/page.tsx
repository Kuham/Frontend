"use client"

import {useState, useRef, useEffect} from "react"
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
import {Project} from "@/types/user";
import {getProject} from "@/apis/user";
import {addProjectAPI, updateProjectAPI} from "@/apis/project";

export default function EditProjectsPage() {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)

  // 프로젝트
  const [projects, setProjects] = useState<Project[]>([])

  // 프로젝트 수정 상태
  const [editingProject, setEditingProject] = useState<(Project & { images: (string | File)[] }) | null>(null);


  // 프로젝트 태그 처리
  const [newTag, setNewTag] = useState("")

  // 프로젝트 수정 창 열기
  const openEditDialog = (project: Project) => {
    setEditingProject({
      ...project,
      images: [...project.images], // string[] → (string | File)[]
    });
  };


  // 태그 추가
  const addTag = () => {
    if (newTag.trim() && editingProject && !editingProject.stacks.includes(newTag.trim())) {
      setEditingProject({
        ...editingProject,
        stacks: [...editingProject.stacks, newTag.trim()],
      })
      setNewTag("")
    }
  }

  // 태그 삭제
  const removeTag = (tagToRemove: string) => {
    if (editingProject) {
      setEditingProject({
        ...editingProject,
        stacks: editingProject.stacks.filter((tag: string) => tag !== tagToRemove),
      })
    }
  }

  // 프로젝트 업데이트
  const updateProject = async () => {
    if (!editingProject) return;

    const formData = new FormData();

    const projectPayload = {
      projectName: editingProject.title,
      stacks: editingProject.stacks,
      description: editingProject.description,
      oneLineDescription: editingProject.oneLineDescription,
      startDate: editingProject.startDate,
      endDate: editingProject.endDate,
      inProgress: editingProject.inProgress,
      roles: editingProject.roles,
    };

    formData.append(
      "project",
      new Blob([JSON.stringify(projectPayload)], { type: "application/json" })
    );

    const isFile = (value: unknown): value is File => value instanceof File;

    editingProject.images.forEach((img) => {
      if (isFile(img)) {
        formData.append("images", img);
      }
    });

    try {
      await updateProjectAPI(editingProject.id, formData);
      toast.success("프로젝트가 성공적으로 수정되었습니다.");
      setProjects(projects.map((p) => (p.id === editingProject.id ? editingProject : p)));
    } catch (error) {
      console.error(error);
      toast.error("프로젝트 수정에 실패했습니다.");
    }

    setEditingProject(null);
  };

  // 프로젝트 삭제
  const deleteProject = (id: number) => {
    setProjects(projects.filter((project) => project.id !== id))
  }

  // 새 프로젝트 생성
  const [showNewProjectForm, setShowNewProjectForm] = useState(false)

  type NewProject = Omit<Project, 'id'> & {
    images: (File | string)[];
  };


  const [newProject, setNewProject] = useState<NewProject>({
    title: "",
    roles: [],
    description: "",
    oneLineDescription: "",
    images: [],
    stacks: [],
    startDate: "",
    endDate: "",
    inProgress: false,
  });



  // 프로젝트 추가
  const addProject = async () => {
    const formData = new FormData();

    const projectPayload = {
      projectName: newProject.title,
      stacks: newProject.stacks,
      description: newProject.description,
      oneLineDescription: newProject.oneLineDescription,
      startDate: newProject.startDate,
      endDate: newProject.endDate,
      inProgress: newProject.inProgress,
      roles: newProject.roles,
    };

    formData.append(
      "project",
      new Blob([JSON.stringify(projectPayload)], { type: "application/json" })
    );

    // 다수 이미지 처리 가능하도록 반복문 사용
    const isFile = (value: unknown): value is File => {
      return value instanceof File;
    };

    newProject.images.forEach((img) => {
      if (isFile(img)) {
        formData.append("images", img);
      }
    });

    try {
      await addProjectAPI(formData);
      toast.success("프로젝트가 성공적으로 추가되었습니다.");
      setProjects([
        ...projects,
        {
          id: Date.now(),
          ...newProject,
          images: newProject.images.map((img) =>
            typeof img === "string" ? img : URL.createObjectURL(img)
          ),
        },
      ]);

    } catch (error) {
      console.error(error);
      toast.error("프로젝트 추가에 실패했습니다.");
    }

    setNewProject({
      title: "",
      roles: [],
      description: "",
      oneLineDescription: "",
      images: [],
      stacks: [],
      startDate: "",
      endDate: "",
      inProgress: false,
    });
    setShowNewProjectForm(false);
  };


  // 이미지 업로드 처리
  const handleImageUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    isNewProject: boolean = false
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error("파일 크기는 5MB를 초과할 수 없습니다.");
      return;
    }

    if (!file.type.startsWith("image/")) {
      toast.error("이미지 파일만 업로드할 수 있습니다.");
      return;
    }

    // File 객체 그대로 상태에 저장
    if (isNewProject) {
      setNewProject({
        ...newProject,
        images: [file],
      });
    } else if (editingProject) {
      setEditingProject({
        ...editingProject,
        images: [file],
      });
    }
  };


  // 이미지 삭제 처리
  const handleImageDelete = (isNewProject: boolean = false) => {
    if (isNewProject) {
      setNewProject({
        ...newProject,
        images: ["/placeholder.svg?height=300&width=500"]
      })
    } else if (editingProject) {
      setEditingProject({
        ...editingProject,
        images: ["/placeholder.svg?height=300&width=500"]
      })
    }
  }

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const data = await getProject();
        setProjects(data);
      } catch (error) {
        console.error("프로젝트 데이터를 불러오는 데 실패했습니다:", error);
      }
    };

    fetchProjects();
  }, []);

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
                        src={
                          typeof project.images[0] === "string"
                            ? project.images[0]
                            : project.images[0]
                              ? URL.createObjectURL(project.images[0])
                              : "/placeholder.svg?height=300&width=500"
                        }
                        alt={project.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold">{project.title}</h3>
                      <p className="text-sm text-muted-foreground mb-2">
                        {project.roles} | {project.startDate} ~ {project.endDate}
                      </p>
                      <p className="text-sm mb-2">{project.oneLineDescription}</p>
                      <p className="text-sm mb-2">{project.description}</p>
                      <div className="flex flex-wrap gap-2">
                        {project.stacks.map((tag) => (
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
                          src={
                            editingProject.images[0]
                              ? typeof editingProject.images[0] === "string"
                                ? editingProject.images[0]
                                : URL.createObjectURL(editingProject.images[0])
                              : "/placeholder.svg?height=300&width=500"
                          }
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
                      <Label htmlFor="domain">맡은 역할</Label>
                      <Input
                          id="domain"
                          value={editingProject.roles}
                          onChange={(e) => setEditingProject({ ...editingProject, roles: [e.target.value] })}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="period">기간</Label>
                    <div className="grid grid-cols-2 gap-4">
                      <Input
                        type="date"
                        value={editingProject?.startDate || ""}
                        onChange={(e) => editingProject && setEditingProject({ ...editingProject, startDate: e.target.value })}
                      />
                      <Input
                        type="date"
                        value={editingProject?.endDate || ""}
                        onChange={(e) => editingProject && setEditingProject({ ...editingProject, endDate: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">한 줄 설명</Label>
                    <Textarea
                      id="description"
                      value={editingProject.oneLineDescription}
                      onChange={(e) => setEditingProject({ ...editingProject, oneLineDescription: e.target.value })}
                      rows={4}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="longDescription">상세 설명</Label>
                    <Textarea
                        id="longDescription"
                        value={editingProject.description}
                        onChange={(e) => setEditingProject({ ...editingProject, description: e.target.value })}
                        rows={4}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>태그</Label>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {editingProject.stacks.map((tag: string) => (
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
                      src={
                        newProject.images[0]
                          ? typeof newProject.images[0] === "string"
                            ? newProject.images[0] // 기존 이미지 URL
                            : URL.createObjectURL(newProject.images[0]) // 새로 업로드한 File 객체
                          : "/placeholder.svg?height=300&width=500"
                      }
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
                  <Label htmlFor="newDomain">맡은 역할</Label>
                  <Input
                      id="newDomain"
                      value={newProject.roles}
                      onChange={(e) => setNewProject({ ...newProject, roles: [e.target.value] })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="newPeriod">기간</Label>
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    type="date"
                    value={newProject.startDate}
                    onChange={(e) => setNewProject({ ...newProject, startDate: e.target.value })}
                  />
                  <Input
                    type="date"
                    value={newProject.endDate}
                    onChange={(e) => setNewProject({ ...newProject, endDate: e.target.value })}
                  />
                </div>

              </div>

              <div className="space-y-2">
                <Label htmlFor="newDescription">한 줄 설명</Label>
                <Textarea
                    id="newDescription"
                    value={newProject.oneLineDescription}
                    onChange={(e) => setNewProject({ ...newProject, oneLineDescription: e.target.value })}
                    rows={2}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="newLongDescription">상세 설명</Label>
                <Textarea
                    id="newLongDescription"
                    value={newProject.description}
                    onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                    rows={4}
                />
              </div>

              <div className="space-y-2">
                <Label>태그</Label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {newProject.stacks.map((tag: string) => (
                      <Badge key={tag} variant="secondary" className="pl-2 pr-1 py-1 flex items-center gap-1">
                        {tag}
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-5 w-5 rounded-full hover:bg-destructive/20"
                            onClick={() =>
                                setNewProject({
                                  ...newProject,
                                  stacks: newProject.stacks.filter((t) => t !== tag),
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
                          if (newTag.trim() && !newProject.stacks.includes(newTag.trim())) {
                            setNewProject({
                              ...newProject,
                              stacks: [...newProject.stacks, newTag.trim()],
                            })
                            setNewTag("")
                          }
                        }
                      }}
                  />
                  <Button
                      type="button"
                      onClick={() => {
                        if (newTag.trim() && !newProject.stacks.includes(newTag.trim())) {
                          setNewProject({
                            ...newProject,
                            stacks: [...newProject.stacks, newTag.trim()],
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

