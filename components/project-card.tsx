import Link from "next/link"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { MessageSquare } from "lucide-react"

interface Project {
  id: number
  title: string
  description: string
  domain: string
  createdAt: string
  userName: string
  userMajor: string
  profileUrl: string[]
}

interface ProjectCardProps {
  project: Project
}

export default function ProjectCard({ project }: ProjectCardProps) {
  return (
      <Link href={`/projects/${project.id}`}>
        <Card className="h-full overflow-hidden hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary" className="font-normal">
                  {project.domain}
                </Badge>
              </div>
              <h3 className="text-xl font-semibold line-clamp-2">{project.title}</h3>
              <p className="text-muted-foreground line-clamp-3">{project.description}</p>
            </div>
          </CardContent>

          <CardFooter className="p-6 pt-0 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Avatar className="h-8 w-8">
                <AvatarFallback>{project.userName[0]}</AvatarFallback>
              </Avatar>
              <div className="text-sm">
                <div className="font-medium">{project.userName}</div>
                <div className="text-xs text-muted-foreground">{project.userMajor}</div>
              </div>
            </div>
            <div className="text-muted-foreground text-sm">{project.createdAt.slice(0, 10)}</div>
          </CardFooter>
        </Card>
      </Link>
  )
}
