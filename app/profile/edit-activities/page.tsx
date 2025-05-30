"use client"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { PencilIcon, ArrowLeft, Trash2, Plus, Upload } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { toast } from "sonner"

interface Activity {
  id: number;
  title: string;
  role: string;
  period: string;
  description: string;
  longDescription: string;
  image: string;
}

export default function EditActivitiesPage() {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)

  // 샘플 활동 데이터
  const [activities, setActivities] = useState<Activity[]>([
    {
      id: 1,
      title: "대학 캠퍼스 내비게이션 앱",
      role: "머신러닝 엔지니어",
      period: "2023년 9월 ~ 2023년 12월",
      description: "캠퍼스 내 최적 경로 추천 알고리즘 개발",
      longDescription:
          "교내 창업 동아리에서 개발한 캠퍼스 내비게이션 앱 프로젝트의 머신러닝 엔지니어로 참여했습니다. 사용자의 이동 패턴과 시간대별 혼잡도를 분석하여 최적의 경로를 추천하는 알고리즘을 개발했습니다.",
      image: "/placeholder.svg?height=300&width=500",
    },
    {
      id: 2,
      title: "학생 학습 패턴 분석 연구",
      role: "데이터 분석가",
      period: "2023년 3월 ~ 2023년 8월",
      description: "온라인 학습 플랫폼의 사용자 데이터를 분석하여 학습 패턴 연구",
      longDescription:
          "교내 교육공학 연구소에서 진행한 학생들의 온라인 학습 패턴 분석 프로젝트에 데이터 분석가로 참여했습니다.",
      image: "/placeholder.svg?height=300&width=500",
    },
    {
      id: 3,
      title: "산학협력 AI 프로젝트",
      role: "개발 리더",
      period: "2022년 6월 ~ 2022년 12월",
      description: "자동차 부품 결함 탐지를 위한 이미지 인식 시스템 개발",
      longDescription:
          "지역 자동차 부품 제조 기업과의 산학협력 프로젝트에서 개발 리더를 맡아 AI 기반 결함 탐지 시스템을 개발했습니다.",
      image: "/placeholder.svg?height=300&width=500",
    },
  ])

  // 활동 수정 상태
  const [editingActivity, setEditingActivity] = useState<Activity | null>(null)

  // 활동 수정 창 열기
  const openEditDialog = (activity: Activity) => {
    setEditingActivity({ ...activity })
  }

  // 활동 업데이트
  const updateActivity = () => {
    if (!editingActivity) return

    setActivities(activities.map((activity) => (activity.id === editingActivity.id ? editingActivity : activity)))

    setEditingActivity(null)
  }

  // 활동 삭제
  const deleteActivity = (id: number) => {
    setActivities(activities.filter((activity) => activity.id !== id))
  }

  // 새 활동 생성
  const [showNewActivityForm, setShowNewActivityForm] = useState(false)
  const [newActivity, setNewActivity] = useState({
    title: "",
    role: "",
    period: "",
    description: "",
    longDescription: "",
    image: "/placeholder.svg?height=300&width=500",
  })

  // 활동 추가
  const addActivity = () => {
    const activityToAdd = {
      id: Date.now(),
      ...newActivity,
    }

    setActivities([...activities, activityToAdd])
    setNewActivity({
      title: "",
      role: "",
      period: "",
      description: "",
      longDescription: "",
      image: "/placeholder.svg?height=300&width=500",
    })
    setShowNewActivityForm(false)
  }

  // 이미지 업로드 처리
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, isNewActivity: boolean = false) => {
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
      if (isNewActivity) {
        setNewActivity({
          ...newActivity,
          image: reader.result as string
        })
      } else if (editingActivity) {
        setEditingActivity({
          ...editingActivity,
          image: reader.result as string
        })
      }
    }
    reader.readAsDataURL(file)
  }

  // 이미지 삭제 처리
  const handleImageDelete = (isNewActivity: boolean = false) => {
    if (isNewActivity) {
      setNewActivity({
        ...newActivity,
        image: "/placeholder.svg?height=300&width=500"
      })
    } else if (editingActivity) {
      setEditingActivity({
        ...editingActivity,
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
          <h1 className="text-2xl font-bold">활동 관리</h1>
        </div>

        <div className="flex justify-end mb-6">
          <Button onClick={() => setShowNewActivityForm(true)}>
            <Plus className="mr-2 h-4 w-4" />새 활동 추가
          </Button>
        </div>

        <div className="space-y-6">
          {activities.map((activity) => (
              <Card key={activity.id}>
                <CardContent className="p-4">
                  <div className="flex justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold">{activity.title}</h3>
                      <p className="text-sm text-muted-foreground mb-2">
                        {activity.role} | {activity.period}
                      </p>
                      <p className="text-sm mb-2">{activity.description}</p>
                    </div>
                    <div className="flex flex-col items-center gap-4">
                      <div className="relative w-32 h-32 rounded-lg overflow-hidden">
                        <Image
                            src={activity.image}
                            alt={activity.title}
                            fill
                            className="object-cover"
                        />
                      </div>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="icon" onClick={() => openEditDialog(activity)}>
                          <PencilIcon className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="text-destructive"
                            onClick={() => deleteActivity(activity.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
          ))}

          {activities.length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground">등록된 활동이 없습니다. 새 활동을 추가해보세요.</p>
              </div>
          )}
        </div>

        {/* 활동 편집 다이얼로그 */}
        {editingActivity && (
            <Dialog open={!!editingActivity} onOpenChange={(open) => !open && setEditingActivity(null)}>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>활동 수정</DialogTitle>
                  <DialogDescription>활동 정보를 수정하세요.</DialogDescription>
                </DialogHeader>

                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="activity-image">활동 이미지</Label>
                    <div className="flex items-center gap-4">
                      <div className="relative w-40 h-40 rounded-lg overflow-hidden border">
                        <Image
                            src={editingActivity.image}
                            alt={editingActivity.title}
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
                      <Label htmlFor="title">활동 제목</Label>
                      <Input
                          id="title"
                          value={editingActivity.title}
                          onChange={(e) => setEditingActivity({ ...editingActivity, title: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="role">역할</Label>
                      <Input
                          id="role"
                          value={editingActivity.role}
                          onChange={(e) => setEditingActivity({ ...editingActivity, role: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="period">기간</Label>
                    <Input
                        id="period"
                        value={editingActivity.period}
                        onChange={(e) => setEditingActivity({ ...editingActivity, period: e.target.value })}
                        placeholder="2023년 9월 ~ 2023년 12월"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">간단한 설명</Label>
                    <Textarea
                        id="description"
                        value={editingActivity.description}
                        onChange={(e) => setEditingActivity({ ...editingActivity, description: e.target.value })}
                        rows={2}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="longDescription">상세 설명</Label>
                    <Textarea
                        id="longDescription"
                        value={editingActivity.longDescription}
                        onChange={(e) => setEditingActivity({ ...editingActivity, longDescription: e.target.value })}
                        rows={4}
                    />
                  </div>
                </div>

                <DialogFooter>
                  <Button variant="outline" onClick={() => setEditingActivity(null)}>
                    취소
                  </Button>
                  <Button onClick={updateActivity}>저장</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
        )}

        {/* 새 활동 추가 다이얼로그 */}
        <Dialog open={showNewActivityForm} onOpenChange={setShowNewActivityForm}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>새 활동 추가</DialogTitle>
              <DialogDescription>새 활동 정보를 입력하세요.</DialogDescription>
            </DialogHeader>

            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="new-activity-image">활동 이미지</Label>
                <div className="flex items-center gap-4">
                  <div className="relative w-40 h-40 rounded-lg overflow-hidden border">
                    <Image
                        src={newActivity.image}
                        alt="새 활동 이미지"
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
                  <Label htmlFor="newTitle">활동 제목</Label>
                  <Input
                      id="newTitle"
                      value={newActivity.title}
                      onChange={(e) => setNewActivity({ ...newActivity, title: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="newRole">역할</Label>
                  <Input
                      id="newRole"
                      value={newActivity.role}
                      onChange={(e) => setNewActivity({ ...newActivity, role: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="newPeriod">기간</Label>
                <Input
                    id="newPeriod"
                    value={newActivity.period}
                    onChange={(e) => setNewActivity({ ...newActivity, period: e.target.value })}
                    placeholder="2023년 9월 ~ 2023년 12월"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="newDescription">간단한 설명</Label>
                <Textarea
                    id="newDescription"
                    value={newActivity.description}
                    onChange={(e) => setNewActivity({ ...newActivity, description: e.target.value })}
                    rows={2}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="newLongDescription">상세 설명</Label>
                <Textarea
                    id="newLongDescription"
                    value={newActivity.longDescription}
                    onChange={(e) => setNewActivity({ ...newActivity, longDescription: e.target.value })}
                    rows={4}
                />
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setShowNewActivityForm(false)}>
                취소
              </Button>
              <Button onClick={addActivity}>추가</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
  )
}

