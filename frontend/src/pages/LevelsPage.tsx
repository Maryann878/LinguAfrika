// All imports removed - file appears to be unused
import { CourseCard } from "@/components/CourseCard"

const courses = [
  {
    name: "Yoruba",
    flag: "🇳🇬",
    description: "Learn the language of the Yoruba people",
    level: "Beginner",
    students: 1250,
    lessons: 45,
    progress: 60,
  },
  {
    name: "Hausa",
    flag: "🇳🇬",
    description: "Master one of Africa's major languages",
    level: "Beginner",
    students: 980,
    lessons: 42,
    progress: 30,
  },
  {
    name: "Igbo",
    flag: "🇳🇬",
    description: "Explore the rich Igbo culture",
    level: "Intermediate",
    students: 750,
    lessons: 38,
    progress: 0,
  },
]

export default function LevelsPage() {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-4xl font-bold mb-2">All Courses</h1>
        <p className="text-muted-foreground">Browse all available language courses</p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course) => (
          <CourseCard key={course.name} {...course} />
        ))}
      </div>
    </div>
  )
}

