"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { X, CameraIcon } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Activity, Award, Clipboard } from "lucide-react"
import Link from "next/link"

export default function ProfileEditPage() {
  const router = useRouter()

  // 기본 프로필 정보
  const [profileData, setProfileData] = useState({
    name: "박민준",
    studentId: "20201234",
    email: "minjun@example.com",
    department: "인공지능학과",
    year: "석사과정",
    bio: "머신러닝과 데이터 사이언스를 공부하고 있는 대학원생입니다. 추천 시스템과 자연어 처리에 관심이 많습니다.",
    profileImage: "/placeholder.svg",
    links: "https://github.com/minjunpark, https://minjunpark.com, https://instagram.com/minjun_park",
  })

  // 기술 스택
  const [skills, setSkills] = useState<string[]>([
    "Python",
    "TensorFlow",
    "PyTorch",
    "NLP",
    "데이터 분석",
    "추천 시스템",
  ])
  const [newSkill, setNewSkill] = useState("")

  // 성격 특성
  const [personality, setPersonality] = useState<string[]>(["분석적인", "성실한", "협력적인", "도전적인"])
  const [newPersonality, setNewPersonality] = useState("")

  // 기술 스택 추가
  const addSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()])
      setNewSkill("")
    }
  }

  // 기술 스택 삭제
  const removeSkill = (skillToRemove: string) => {
    setSkills(skills.filter((skill) => skill !== skillToRemove))
  }

  // 성격 특성 추가
  const addPersonality = () => {
    if (newPersonality.trim() && !personality.includes(newPersonality.trim())) {
      setPersonality([...personality, newPersonality.trim()])
      setNewPersonality("")
    }
  }

  // 성격 특성 삭제
  const removePersonality = (traitToRemove: string) => {
    setPersonality(personality.filter((trait) => trait !== traitToRemove))
  }

  // 프로필 정보 변경
  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setProfileData({
      ...profileData,
      [name]: value,
    })
  }

  // 프로필 저장
  const handleSaveProfile = () => {
    // 여기서 API 호출하여 프로필 저장
    console.log("프로필 저장:", {
      profileData,
      skills,
      personality,
    })

    // 저장 후 프로필 페이지로 이동
    router.push("/profile/me")
  }

  return (
    <div className="container py-8">
      <h1 className="text-2xl font-bold mb-6">프로필 수정</h1>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>기본 정보</CardTitle>
          <CardDescription>프로필에 표시될 기본 정보를 수정하세요.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-col items-center sm:flex-row sm:items-start gap-6">
            <div className="relative group">
              <Avatar className="h-24 w-24">
                <AvatarImage src={profileData.profileImage} alt={profileData.name} />
                <AvatarFallback>{profileData.name[0]}</AvatarFallback>
              </Avatar>
              <div className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity cursor-pointer">
                <CameraIcon className="h-8 w-8 text-white" />
              </div>
              <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" accept="image/*" />
            </div>
            <div className="flex-1 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">이름</Label>
                  <Input id="name" name="name" value={profileData.name} onChange={handleProfileChange} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="studentId">학번</Label>
                  <Input id="studentId" name="studentId" value={profileData.studentId} onChange={handleProfileChange} />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="department">학과</Label>
                  <Input
                    id="department"
                    name="department"
                    value={profileData.department}
                    onChange={handleProfileChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="year">학년</Label>
                  <Select
                    value={profileData.year}
                    onValueChange={(value) => setProfileData({ ...profileData, year: value })}
                  >
                    <SelectTrigger id="year">
                      <SelectValue placeholder="학년 선택" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1학년">1학년</SelectItem>
                      <SelectItem value="2학년">2학년</SelectItem>
                      <SelectItem value="3학년">3학년</SelectItem>
                      <SelectItem value="4학년">4학년</SelectItem>
                      <SelectItem value="석사과정">석사과정</SelectItem>
                      <SelectItem value="박사과정">박사과정</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">이메일</Label>
                <Input id="email" name="email" type="email" value={profileData.email} onChange={handleProfileChange} />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="bio">자기소개</Label>
            <Textarea
              id="bio"
              name="bio"
              rows={4}
              value={profileData.bio}
              onChange={handleProfileChange}
              className="resize-none"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="links">링크</Label>
            <Textarea
              id="links"
              name="links"
              placeholder="깃허브, 웹사이트, SNS 등의 링크를 쉼표(,)로 구분하여 입력하세요"
              value={profileData.links}
              onChange={handleProfileChange}
              className="resize-none"
            />
            <p className="text-xs text-muted-foreground">예: https://github.com/username, https://yourwebsite.com</p>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label>기술 스택</Label>
              <div className="flex flex-wrap gap-2 mb-2">
                {skills.map((skill) => (
                  <Badge key={skill} variant="secondary" className="pl-2 pr-1 py-1 flex items-center gap-1">
                    {skill}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-5 w-5 rounded-full hover:bg-destructive/20"
                      onClick={() => removeSkill(skill)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  placeholder="새 기술 스택 추가"
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addSkill())}
                />
                <Button type="button" onClick={addSkill}>
                  추가
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label>성격</Label>
              <div className="flex flex-wrap gap-2 mb-2">
                {personality.map((trait) => (
                  <Badge
                    key={trait}
                    variant="secondary"
                    className="pl-2 pr-1 py-1 flex items-center gap-1 bg-primary/10"
                  >
                    {trait}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-5 w-5 rounded-full hover:bg-destructive/20"
                      onClick={() => removePersonality(trait)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  placeholder="새 성격 특성 추가"
                  value={newPersonality}
                  onChange={(e) => setNewPersonality(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addPersonality())}
                />
                <Button type="button" onClick={addPersonality}>
                  추가
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end">
          <div className="flex gap-4">
            <Button variant="outline" onClick={() => router.back()}>
              취소
            </Button>
            <Button onClick={handleSaveProfile}>저장하기</Button>
          </div>
        </CardFooter>
      </Card>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
        <Card className="border-dashed">
          <CardContent className="p-6 flex flex-col items-center justify-center text-center h-[200px]">
            <Button asChild variant="ghost" className="flex flex-col h-full w-full">
              <Link href="/profile/edit-projects">
                <div className="flex flex-col items-center justify-center h-full">
                  <div className="rounded-full bg-primary/10 p-4 mb-4">
                    <Clipboard className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-medium">프로젝트 수정</h3>
                  <p className="text-sm text-muted-foreground mt-2">프로젝트 목록을 관리하고 수정하세요</p>
                </div>
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="border-dashed">
          <CardContent className="p-6 flex flex-col items-center justify-center text-center h-[200px]">
            <Button asChild variant="ghost" className="flex flex-col h-full w-full">
              <Link href="/profile/edit-activities">
                <div className="flex flex-col items-center justify-center h-full">
                  <div className="rounded-full bg-primary/10 p-4 mb-4">
                    <Activity className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-medium">활동 수정</h3>
                  <p className="text-sm text-muted-foreground mt-2">활동 내역을 관리하고 수정하세요</p>
                </div>
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="border-dashed">
          <CardContent className="p-6 flex flex-col items-center justify-center text-center h-[200px]">
            <Button asChild variant="ghost" className="flex flex-col h-full w-full">
              <Link href="/profile/edit-certifications">
                <div className="flex flex-col items-center justify-center h-full">
                  <div className="rounded-full bg-primary/10 p-4 mb-4">
                    <Award className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-medium">자격증 수정</h3>
                  <p className="text-sm text-muted-foreground mt-2">자격증 정보를 관리하고 수정하세요</p>
                </div>
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

