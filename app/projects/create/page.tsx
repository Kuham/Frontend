"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { X, ArrowLeft, ImageIcon } from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"
import axiosInstance from "@/apis/custom-axios"

export default function CreateProjectPage() {
  const router = useRouter()

  const [projectData, setProjectData] = useState({
    title: "",
    domain: "",
    description: "",
    requiredRoles: [] as string[],
    preferredPersonality: [] as string[],
    maxMembers: "4",
    contactMethod: "chat",
    startDate: "",
    endDate: ""
  })


  const [tags, setTags] = useState<string[]>([])
  const [newTag, setNewTag] = useState("")
  const [newRole, setNewRole] = useState("")
  const [newPersonality, setNewPersonality] = useState("")
  const [imageFiles, setImageFiles] = useState<File[]>([])

  const handleProjectChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setProjectData({ ...projectData, [name]: value })
  }

  const handleSelectChange = (name: string, value: string) => {
    setProjectData({ ...projectData, [name]: value })
  }

  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()])
      setNewTag("")
    }
  }

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove))
  }

  const addRole = () => {
    if (newRole.trim() && !projectData.requiredRoles.includes(newRole.trim())) {
      setProjectData({
        ...projectData,
        requiredRoles: [...projectData.requiredRoles, newRole.trim()]
      })
      setNewRole("")
    }
  }

  const removeRole = (roleToRemove: string) => {
    setProjectData({
      ...projectData,
      requiredRoles: projectData.requiredRoles.filter((role) => role !== roleToRemove)
    })
  }

  const addPersonality = () => {
    if (
        newPersonality.trim() &&
        !projectData.preferredPersonality.includes(newPersonality.trim())
    ) {
      setProjectData({
        ...projectData,
        preferredPersonality: [...projectData.preferredPersonality, newPersonality.trim()]
      })
      setNewPersonality("")
    }
  }

  const removePersonality = (personalityToRemove: string) => {
    setProjectData({
      ...projectData,
      preferredPersonality: projectData.preferredPersonality.filter((p) => p !== personalityToRemove)
    })
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return
    const files = Array.from(e.target.files)
    setImageFiles((prev) => [...prev, ...files])
  }

  const removeImage = (index: number) => {
    setImageFiles(imageFiles.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // 3. handleSubmit 내 postPayload에 적용
    const postPayload = {
      title: projectData.title,
      description: projectData.description,
      domain: projectData.domain,
      startDate: projectData.startDate,
      endDate: projectData.endDate,
      maxMember: parseInt(projectData.maxMembers),
      roles: projectData.requiredRoles,
      preferredCharacters: projectData.preferredPersonality,
      stacks: tags
    }


    const formData = new FormData()
    formData.append("post", new Blob([JSON.stringify(postPayload)], { type: "application/json" }))
    imageFiles.forEach((file) => {
      formData.append("images", file)
    })

    try {
      await axiosInstance.post("/post/create", formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      })
      router.push("/projects")
    } catch (err) {
      console.error("등록 실패:", err)
      alert("등록에 실패했습니다.")
    }
  }

  return (
      <div className="container py-8">
        <div className="flex items-center mb-6">
          <Button variant="ghost" size="icon" onClick={() => router.back()} className="mr-2">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold">프로젝트 등록</h1>
        </div>

        <form onSubmit={handleSubmit}>
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>프로젝트 기본 정보</CardTitle>
              <CardDescription>프로젝트에 대한 기본 정보를 입력하세요.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">프로젝트 제목</Label>
                <Input
                    id="title"
                    name="title"
                    placeholder="프로젝트 제목을 입력하세요"
                    value={projectData.title}
                    onChange={handleProjectChange}
                    required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="domain">프로젝트 도메인</Label>
                <Select
                    value={projectData.domain}
                    onValueChange={(value) => handleSelectChange("domain", value)}
                >
                  <SelectTrigger id="domain">
                    <SelectValue placeholder="도메인 선택" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="웹개발">웹개발</SelectItem>
                    <SelectItem value="앱개발">앱개발</SelectItem>
                    <SelectItem value="AI & 머신러닝">AI & 머신러닝</SelectItem>
                    <SelectItem value="디자인">디자인</SelectItem>
                    <SelectItem value="블록체인">블록체인</SelectItem>
                    <SelectItem value="게임개발">게임개발</SelectItem>
                    <SelectItem value="기획">기획</SelectItem>
                    <SelectItem value="연구">연구</SelectItem>
                    <SelectItem value="기타">기타</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>기술 스택 / 키워드</Label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="pl-2 pr-1 py-1 flex items-center gap-1">
                        {tag}
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-5 w-5 rounded-full hover:bg-destructive/20"
                            onClick={() => removeTag(tag)}
                            type="button"
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </Badge>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input
                      placeholder="React, Python 등"
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
                  />
                  <Button type="button" onClick={addTag}>
                    추가
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">상세 설명</Label>
                <Textarea
                    id="description"
                    name="description"
                    placeholder="프로젝트에 대한 상세 내용을 입력하세요"
                    rows={8}
                    value={projectData.description}
                    onChange={handleProjectChange}
                    required
                    className="resize-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startDate">시작 날짜</Label>
                  <Input
                      type="date"
                      id="startDate"
                      name="startDate"
                      value={projectData.startDate}
                      onChange={handleProjectChange}
                      required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="endDate">종료 날짜</Label>
                  <Input
                      type="date"
                      id="endDate"
                      name="endDate"
                      value={projectData.endDate}
                      onChange={handleProjectChange}
                      required
                  />
                </div>
              </div>


              <div className="space-y-2">
                <Label>프로젝트 이미지</Label>
                <div className="space-y-4">
                  {imageFiles.map((file, index) => (
                      <div key={index} className="flex items-center gap-4">
                        <div className="relative w-24 h-24 border rounded-md overflow-hidden flex-shrink-0">
                          <img
                              src={URL.createObjectURL(file)}
                              alt={`업로드된 이미지 ${index + 1}`}
                              className="w-full h-full object-cover"
                          />
                          <Button
                              variant="destructive"
                              size="icon"
                              className="absolute top-1 right-1 h-6 w-6 rounded-full"
                              onClick={() => removeImage(index)}
                              type="button"
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                  ))}
                  <Input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleImageChange}
                      className="w-full"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle>팀 구성 정보</CardTitle>
              <CardDescription>필요한 팀원과 선호하는 성격 특성을 입력하세요.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>필요한 역할</Label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {projectData.requiredRoles.map((role) => (
                      <Badge key={role} variant="outline" className="pl-2 pr-1 py-1 flex items-center gap-1">
                        {role}
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-5 w-5 rounded-full hover:bg-destructive/20"
                            onClick={() => removeRole(role)}
                            type="button"
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </Badge>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input
                      placeholder="프론트엔드 개발자 등"
                      value={newRole}
                      onChange={(e) => setNewRole(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addRole())}
                  />
                  <Button type="button" onClick={addRole}>
                    추가
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label>선호하는 성격</Label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {projectData.preferredPersonality.map((p) => (
                      <Badge key={p} variant="outline" className="pl-2 pr-1 py-1 flex items-center gap-1">
                        {p}
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-5 w-5 rounded-full hover:bg-destructive/20"
                            onClick={() => removePersonality(p)}
                            type="button"
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </Badge>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input
                      placeholder="적극적인 등"
                      value={newPersonality}
                      onChange={(e) => setNewPersonality(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addPersonality())}
                  />
                  <Button type="button" onClick={addPersonality}>
                    추가
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="maxMembers">최대 팀원 수</Label>
                  <Select
                      value={projectData.maxMembers}
                      onValueChange={(value) => handleSelectChange("maxMembers", value)}
                  >
                    <SelectTrigger id="maxMembers">
                      <SelectValue placeholder="최대 팀원 수 선택" />
                    </SelectTrigger>
                    <SelectContent>
                      {[2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                          <SelectItem key={num} value={num.toString()}>
                            {num}명
                          </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contactMethod">연락 방법</Label>
                  <Select
                      value={projectData.contactMethod}
                      onValueChange={(value) => handleSelectChange("contactMethod", value)}
                  >
                    <SelectTrigger id="contactMethod">
                      <SelectValue placeholder="연락 방법 선택" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="chat">쿠함 채팅</SelectItem>
                      <SelectItem value="email">이메일</SelectItem>
                      <SelectItem value="both">둘 다</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end gap-4">
              <Button variant="outline" type="button" onClick={() => router.back()}>
                취소
              </Button>
              <Button type="submit">프로젝트 등록하기</Button>
            </CardFooter>
          </Card>
        </form>
      </div>
)
}