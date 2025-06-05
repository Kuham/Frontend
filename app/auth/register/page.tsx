"use client"

import React, {useEffect} from "react"

import Link from "next/link"
import { useState } from "react"
import { useSearchParams, useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { X, Upload, Camera } from "lucide-react"
import {RegisterUserPayload} from "@/types/user";
import { registerUser } from "@/apis/register";

export default function RegisterPage() {
  const router = useRouter()
  const searchParams = useSearchParams();
  const profileUrl = searchParams.get('profileUrl');

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    studentId: "",
    department: "",
    position: "",
    bio: "",
  })

  useEffect(() => {
    const name = searchParams.get('name');
    const email = searchParams.get('email');

    setFormData((prev) => ({
      ...prev,
      name: name ?? prev.name,
      email: email ?? prev.email,
    }));
  }, [searchParams]);


  // 프로필 이미지 관리
  const [profileImage, setProfileImage] = useState<File | null>(null)
  const [profileImagePreview, setProfileImagePreview] = useState<string>(profileUrl ?? '')

  // 기술 스택 관리
  const [techStack, setTechStack] = useState<string[]>([])
  const [newTech, setNewTech] = useState("")

  // 관련 링크 관리
  const [links, setLinks] = useState<string[]>([])
  const [newLink, setNewLink] = useState("")

  // 성격 관리
  const [personality, setPersonality] = useState<string[]>([])
  const [newPersonality, setNewPersonality] = useState("")

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  // 프로필 이미지 처리
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setProfileImage(file)

      // 이미지 미리보기 생성
      const reader = new FileReader()
      reader.onload = (e) => {
        setProfileImagePreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  // 이미지 제거
  const removeImage = () => {
    setProfileImage(null)
    setProfileImagePreview("")
  }

  // 기술 스택 추가
  const addTechStack = () => {
    if (newTech.trim() && !techStack.includes(newTech.trim())) {
      setTechStack([...techStack, newTech.trim()])
      setNewTech("")
    }
  }

  // 기술 스택 삭제
  const removeTechStack = (techToRemove: string) => {
    setTechStack(techStack.filter((tech) => tech !== techToRemove))
  }

  // 링크 추가
  const addLink = () => {
    if (newLink.trim() && !links.includes(newLink.trim())) {
      setLinks([...links, newLink.trim()])
      setNewLink("")
    }
  }

  // 링크 삭제
  const removeLink = (linkToRemove: string) => {
    setLinks(links.filter((link) => link !== linkToRemove))
  }

  // 성격 추가
  const addPersonalityTrait = () => {
    if (newPersonality.trim() && !personality.includes(newPersonality.trim())) {
      setPersonality([...personality, newPersonality.trim()])
      setNewPersonality("")
    }
  }

  // 성격 삭제
  const removePersonalityTrait = (traitToRemove: string) => {
    setPersonality(personality.filter((trait) => trait !== traitToRemove))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload: RegisterUserPayload = {
      name: formData.name,
      email: formData.email,
      studentNum: formData.studentId,
      grade: formData.position,
      major: formData.department,
      profileUrl: profileImagePreview,
      stacks: techStack,
      links,
      charaters: personality,
      introduce: formData.bio,
    };

    try {
      const response = await registerUser(payload);
      console.log('가입된 사용자 정보:', response);
      alert(`환영합니다, ${response.name}님!`);
      router.push("/auth/login");
    } catch {
      alert('회원가입 실패 😢');
    }
  };

  return (
    <div className="container flex items-center justify-center min-h-[calc(100vh-4rem)] py-12">
      <Card className="w-full max-w-2xl">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold">회원가입</CardTitle>
          <CardDescription>계정을 만들고 프로젝트를 시작하세요</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* 프로필 사진 */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">프로필 사진</h3>
              <div className="flex flex-col items-center gap-4">
                <div className="relative">
                  <Avatar className="h-24 w-24">
                    <AvatarImage src={profileImagePreview || "/placeholder.svg"} alt="프로필 미리보기" />
                    <AvatarFallback>
                      <Camera className="h-8 w-8 text-muted-foreground" />
                    </AvatarFallback>
                  </Avatar>
                  {profileImagePreview && (
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute -top-2 -right-2 h-6 w-6 rounded-full"
                      onClick={removeImage}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  )}
                </div>
                <div className="flex flex-col items-center gap-2">
                  <Label htmlFor="profileImage" className="cursor-pointer">
                    <div className="flex items-center gap-2 px-4 py-2 bg-muted rounded-md hover:bg-muted/80 transition-colors">
                      <Upload className="h-4 w-4" />
                      <span className="text-sm">사진 업로드</span>
                    </div>
                  </Label>
                  <Input
                    id="profileImage"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                  <p className="text-xs text-muted-foreground text-center">JPG, PNG 파일을 업로드하세요 (최대 5MB)</p>
                </div>
              </div>
            </div>

            {/* 기본 정보 */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">기본 정보</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">이름</Label>
                  <Input
                    id="name"
                    name="name"
                    placeholder="홍길동"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">이메일</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="name@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    readOnly
                    className="bg-muted cursor-not-allowed"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="studentId">학번</Label>
                  <Input
                    id="studentId"
                    name="studentId"
                    placeholder="20201234"
                    value={formData.studentId}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="department">학과</Label>
                  <Input
                    id="department"
                    name="department"
                    placeholder="소프트웨어학부"
                    value={formData.department}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="position">직위</Label>
                <Select onValueChange={(value) => handleSelectChange("position", value)}>
                  <SelectTrigger id="position">
                    <SelectValue placeholder="직위 선택" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1학년">1학년</SelectItem>
                    <SelectItem value="2학년">2학년</SelectItem>
                    <SelectItem value="3학년">3학년</SelectItem>
                    <SelectItem value="4학년">4학년</SelectItem>
                    <SelectItem value="석사과정">석사과정</SelectItem>
                    <SelectItem value="박사과정">박사과정</SelectItem>
                    <SelectItem value="졸업생">졸업생</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* 기술 스택 */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">기술 스택</h3>
              <div className="flex flex-wrap gap-2 mb-2">
                {techStack.map((tech) => (
                  <Badge key={tech} variant="secondary" className="pl-2 pr-1 py-1 flex items-center gap-1">
                    {tech}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-5 w-5 rounded-full hover:bg-destructive/20"
                      onClick={() => removeTechStack(tech)}
                      type="button"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  placeholder="React, Python, Figma 등"
                  value={newTech}
                  onChange={(e) => setNewTech(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addTechStack())}
                />
                <Button type="button" onClick={addTechStack}>
                  추가
                </Button>
              </div>
            </div>

            {/* 관련 링크 */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">관련 링크</h3>
              <div className="flex flex-wrap gap-2 mb-2">
                {links.map((link) => (
                  <Badge key={link} variant="outline" className="pl-2 pr-1 py-1 flex items-center gap-1">
                    {link}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-5 w-5 rounded-full hover:bg-destructive/20"
                      onClick={() => removeLink(link)}
                      type="button"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  placeholder="GitHub, 포트폴리오 사이트 등"
                  value={newLink}
                  onChange={(e) => setNewLink(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addLink())}
                />
                <Button type="button" onClick={addLink}>
                  추가
                </Button>
              </div>
            </div>

            {/* 성격 */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">성격</h3>
              <div className="flex flex-wrap gap-2 mb-2">
                {personality.map((trait) => (
                  <Badge key={trait} variant="outline" className="pl-2 pr-1 py-1 flex items-center gap-1 bg-primary/10">
                    {trait}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-5 w-5 rounded-full hover:bg-destructive/20"
                      onClick={() => removePersonalityTrait(trait)}
                      type="button"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  placeholder="적극적인, 창의적인, 꼼꼼한 등"
                  value={newPersonality}
                  onChange={(e) => setNewPersonality(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addPersonalityTrait())}
                />
                <Button type="button" onClick={addPersonalityTrait}>
                  추가
                </Button>
              </div>
            </div>

            {/* 자기 소개 */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">자기 소개</h3>
              <Textarea
                name="bio"
                placeholder="자신에 대해 간단히 소개해주세요"
                rows={4}
                value={formData.bio}
                onChange={handleChange}
                className="resize-none"
              />
            </div>

            <Button type="submit" className="w-full">
              회원가입
            </Button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">또는</span>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-center">
          <div className="text-sm text-muted-foreground">
            이미 계정이 있으신가요?{" "}
            <Link href="/auth/login" className="text-primary hover:underline">
              로그인
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
