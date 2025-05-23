"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { PencilIcon, ArrowLeft, Trash2, Plus, Calendar } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { format } from "date-fns"
import { ko } from "date-fns/locale"

interface Certification {
  id: number
  name: string
  date: Date | string
  organization: string
  description?: string
}

export default function EditCertificationsPage() {
  const router = useRouter()

  // 샘플 자격증 데이터
  const [certifications, setCertifications] = useState<Certification[]>([
    {
      id: 1,
      name: "정보처리기사",
      date: new Date("2022-05-20"),
      organization: "한국산업인력공단",
      description: "컴퓨터 시스템의 분석, 설계, 구현, 유지보수 등의 업무를 수행하는 기술자격",
    },
    {
      id: 2,
      name: "SQLD",
      date: new Date("2021-11-15"),
      organization: "한국데이터산업진흥원",
      description: "데이터베이스 개발 및 관리 능력을 검증하는 자격증",
    },
    {
      id: 3,
      name: "TensorFlow Developer Certificate",
      date: new Date("2023-03-08"),
      organization: "Google",
      description: "TensorFlow를 활용한 머신러닝 모델 개발 능력을 인증하는 자격증",
    },
    {
      id: 4,
      name: "AWS Certified Solutions Architect",
      date: new Date("2022-08-25"),
      organization: "Amazon Web Services",
      description: "AWS 클라우드 아키텍처 설계 및 구현 능력을 검증하는 자격증",
    },
  ])

  // 자격증 수정 상태
  const [editingCertification, setEditingCertification] = useState<Certification | null>(null)
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined)

  // 자격증 수정 창 열기
  const openEditDialog = (certification: Certification) => {
    setEditingCertification({ ...certification })
    setSelectedDate(certification.date instanceof Date ? certification.date : new Date(certification.date))
  }

  // 자격증 업데이트
  const updateCertification = () => {
    if (!editingCertification) return

    const updatedCertification = {
      ...editingCertification,
      date: selectedDate || new Date(),
    }

    setCertifications(certifications.map((cert) => (cert.id === updatedCertification.id ? updatedCertification : cert)))

    setEditingCertification(null)
    setSelectedDate(undefined)
  }

  // 자격증 삭제
  const deleteCertification = (id: number) => {
    setCertifications(certifications.filter((cert) => cert.id !== id))
  }

  // 새 자격증 생성
  const [showNewCertificationForm, setShowNewCertificationForm] = useState(false)
  const [newCertification, setNewCertification] = useState<Omit<Certification, "id">>({
    name: "",
    date: new Date(),
    organization: "",
    description: "",
  })
  const [newCertDate, setNewCertDate] = useState<Date>(new Date())

  // 자격증 추가
  const addCertification = () => {
    const certificationToAdd = {
      id: Date.now(),
      ...newCertification,
      date: newCertDate,
    }

    setCertifications([...certifications, certificationToAdd])
    setNewCertification({
      name: "",
      date: new Date(),
      organization: "",
      description: "",
    })
    setNewCertDate(new Date())
    setShowNewCertificationForm(false)
  }

  // 날짜 포맷 함수
  const formatDate = (date: Date | string) => {
    if (date instanceof Date) {
      return format(date, "yyyy년 MM월 dd일", { locale: ko })
    }
    return date
  }

  return (
    <div className="container py-8">
      <div className="flex items-center mb-6">
        <Button variant="ghost" size="icon" onClick={() => router.back()} className="mr-2">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-2xl font-bold">자격증 관리</h1>
      </div>

      <div className="flex justify-end mb-6">
        <Button onClick={() => setShowNewCertificationForm(true)}>
          <Plus className="mr-2 h-4 w-4" />새 자격증 추가
        </Button>
      </div>

      <div className="space-y-6">
        {certifications.map((certification) => (
          <Card key={certification.id}>
            <CardContent className="p-4">
              <div className="flex justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-xl font-bold">{certification.name}</h3>
                    <Badge variant="outline">{certification.organization}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">{formatDate(certification.date)}</p>
                  {certification.description && <p className="text-sm">{certification.description}</p>}
                </div>
                <div className="flex flex-col gap-2">
                  <Button variant="ghost" size="icon" onClick={() => openEditDialog(certification)}>
                    <PencilIcon className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-destructive"
                    onClick={() => deleteCertification(certification.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {certifications.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">등록된 자격증이 없습니다. 새 자격증을 추가해보세요.</p>
          </div>
        )}
      </div>

      {/* 자격증 편집 다이얼로그 */}
      {editingCertification && (
        <Dialog open={!!editingCertification} onOpenChange={(open) => !open && setEditingCertification(null)}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>자격증 수정</DialogTitle>
              <DialogDescription>자격증 정보를 수정하고 저장하세요.</DialogDescription>
            </DialogHeader>

            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">자격증 이름</Label>
                <Input
                  id="name"
                  value={editingCertification.name}
                  onChange={(e) => setEditingCertification({ ...editingCertification, name: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="organization">발급 기관</Label>
                <Input
                  id="organization"
                  value={editingCertification.organization}
                  onChange={(e) => setEditingCertification({ ...editingCertification, organization: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="date">취득일</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-left font-normal" id="date">
                      <Calendar className="mr-2 h-4 w-4" />
                      {selectedDate ? formatDate(selectedDate) : "날짜 선택"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <CalendarComponent mode="single" selected={selectedDate} onSelect={setSelectedDate} initialFocus />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">설명 (선택사항)</Label>
                <Input
                  id="description"
                  value={editingCertification.description || ""}
                  onChange={(e) => setEditingCertification({ ...editingCertification, description: e.target.value })}
                  placeholder="자격증에 대한 간단한 설명"
                />
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setEditingCertification(null)}>
                취소
              </Button>
              <Button onClick={updateCertification}>저장하기</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* 새 자격증 추가 다이얼로그 */}
      <Dialog open={showNewCertificationForm} onOpenChange={setShowNewCertificationForm}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>새 자격증 추가</DialogTitle>
            <DialogDescription>새 자격증 정보를 입력하세요.</DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="newName">자격증 이름</Label>
              <Input
                id="newName"
                value={newCertification.name}
                onChange={(e) => setNewCertification({ ...newCertification, name: e.target.value })}
                placeholder="예: 정보처리기사"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="newOrganization">발급 기관</Label>
              <Input
                id="newOrganization"
                value={newCertification.organization}
                onChange={(e) => setNewCertification({ ...newCertification, organization: e.target.value })}
                placeholder="예: 한국산업인력공단"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="newDate">취득일</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left font-normal" id="newDate">
                    <Calendar className="mr-2 h-4 w-4" />
                    {newCertDate ? formatDate(newCertDate) : "날짜 선택"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <CalendarComponent
                    mode="single"
                    selected={newCertDate}
                    onSelect={(date) => date && setNewCertDate(date)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label htmlFor="newDescription">설명 (선택사항)</Label>
              <Input
                id="newDescription"
                value={newCertification.description || ""}
                onChange={(e) => setNewCertification({ ...newCertification, description: e.target.value })}
                placeholder="자격증에 대한 간단한 설명"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowNewCertificationForm(false)}>
              취소
            </Button>
            <Button onClick={addCertification} disabled={!newCertification.name || !newCertification.organization}>
              자격증 추가
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

