import Link from "next/link"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { MessageSquare } from "lucide-react"

interface Project {
  id: number
  title: string
  description: string
  tags: string[]
  author: {
    name: string
    image: string
  }
  commentCount: number
  createdAt: string
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
              {project.tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="font-normal">
                  {tag}
                </Badge>
              ))}
            </div>
            <h3 className="text-xl font-semibold line-clamp-2">{project.title}</h3>
            <p className="text-muted-foreground line-clamp-3">{project.description}</p>
          </div>
        </CardContent>
        <CardFooter className="p-6 pt-0 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src={project.author.image} alt={project.author.name} />
              <AvatarFallback>{project.author.name[0]}</AvatarFallback>
            </Avatar>
            <span className="text-sm font-medium">{project.author.name}</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center text-muted-foreground text-sm">
              <MessageSquare className="h-4 w-4 mr-1" />
              {project.commentCount}
            </div>
            <div className="text-muted-foreground text-sm">{project.createdAt}</div>
          </div>
        </CardFooter>
      </Card>
    </Link>
  )
}

