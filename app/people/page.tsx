"use client"

import { useState } from "react"
import Link from "next/link"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search } from "lucide-react"

export default function PeoplePage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [departmentFilter, setDepartmentFilter] = useState("")

  // 샘플 사용자 데이터
  const users = [
    {
      id: "user1",
      name: "김철수",
      image: "/placeholder.svg",
      department: "컴퓨터공학과",
      year: "3학년",
      bio: "프론트엔드 개발자를 꿈꾸는 대학생입니다. React와 TypeScript를 주로 사용합니다.",
      skills: ["React", "TypeScript", "JavaScript", "HTML/CSS"],
    },
    {
      id: "user2",
      name: "이지원",
      image: "/placeholder.svg",
      department: "소프트웨어학과",
      year: "4학년",
      bio: "웹 개발과 UI/UX 디자인에 관심이 많은 개발자입니다. 사용자 경험을 중요시합니다.",
      skills: ["React", "Vue.js", "Figma", "UI/UX"],
    },
    {
      id: "user3",
      name: "박민준",
      image: "/placeholder.svg",
      department: "인공지능학과",
      year: "석사과정",
      bio: "머신러닝과 데이터 사이언스를 공부하고 있는 대학원생입니다. 추천 시스템과 자연어 처리에 관심이 많습니다.",
      skills: ["Python", "TensorFlow", "PyTorch", "NLP", "데이터 분석"],
    },
    {
      id: "user4",
      name: "최서연",
      image: "/placeholder.svg",
      department: "디자인학과",
      year: "3학년",
      bio: "UI/UX 디자이너로 활동 중입니다. 사용자 중심 디자인과 접근성에 관심이 많습니다.",
      skills: ["Figma", "Adobe XD", "Illustrator", "Photoshop", "UI/UX"],
    },
    {
      id: "user5",
      name: "정현우",
      image: "/placeholder.svg",
      department: "경영학과",
      year: "4학년",
      bio: "IT 창업에 관심이 많은 경영학도입니다. 프로젝트 기획과 마케팅을 담당합니다.",
      skills: ["기획", "마케팅", "비즈니스 모델", "프로젝트 관리"],
    },
    {
      id: "user6",
      name: "한소희",
      image: "/placeholder.svg",
      department: "컴퓨터공학과",
      year: "2학년",
      bio: "백엔드 개발에 관심이 많습니다. 서버 개발과 데이터베이스를 공부하고 있어요.",
      skills: ["Java", "Spring", "MySQL", "AWS"],
    },
  ]

  // 필터링된 사용자 목록
  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.bio.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.skills.some((skill) => skill.toLowerCase().includes(searchQuery.toLowerCase()))

    const matchesDepartment = departmentFilter ? user.department === departmentFilter : true

    return matchesSearch && matchesDepartment
  })

  // 학과 목록 (중복 제거)
  const departments = Array.from(new Set(users.map((user) => user.department)))

  return (
    <div className="container py-8">
      <h1 className="text-2xl font-bold mb-6">사람들</h1>

      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="이름, 기술 스택, 소개 등으로 검색"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
          <SelectTrigger className="w-full md:w-[200px]">
            <SelectValue placeholder="학과 선택" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">전체 학과</SelectItem>
            {departments.map((dept) => (
              <SelectItem key={dept} value={dept}>
                {dept}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredUsers.map((user) => (
          <Link href={`/profile/${user.id}`} key={user.id}>
            <Card className="h-full hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={user.image} alt={user.name} />
                    <AvatarFallback>{user.name[0]}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h2 className="text-xl font-semibold">{user.name}</h2>
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="outline">{user.department}</Badge>
                      <Badge variant="outline">{user.year}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{user.bio}</p>
                    <div className="flex flex-wrap gap-1">
                      {user.skills.slice(0, 3).map((skill) => (
                        <Badge key={skill} variant="secondary" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                      {user.skills.length > 3 && (
                        <Badge variant="secondary" className="text-xs">
                          +{user.skills.length - 3}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {filteredUsers.length === 0 && (
        <div className="flex items-center justify-center h-40 text-muted-foreground">검색 결과가 없습니다</div>
      )}
    </div>
  )
}

