import { useState } from "react"
import { useParams } from "react-router-dom"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, ArrowRight, CheckCircle, Volume2, Globe, BookOpen, Loader2 } from "lucide-react"
import { Link } from "react-router-dom"
import { useToast } from "@/components/ui/use-toast"

interface Exercise {
  type: string
  question: string
  answer: string
  pronunciation?: string
  culturalNote?: string
}

interface LessonData {
  title: string
  description: string
  content: string
  culturalContext?: string
  exercises: Exercise[]
}

const lessonContent: Record<number, LessonData> = {
  1: {
    title: "Introduction to Yoruba",
    description: "Learn the basics of the Yoruba language",
    content: "Yoruba is a language spoken in West Africa, primarily in Nigeria and neighboring countries. It's one of the most widely spoken African languages, with over 40 million speakers worldwide.",
    culturalContext: "Yoruba culture is rich in traditions, including vibrant festivals, music, and art. The language reflects this cultural heritage through its proverbs, greetings, and expressions of respect.",
    exercises: [
      { 
        type: "vocabulary", 
        question: "What is 'hello' in Yoruba?", 
        answer: "Bawo",
        pronunciation: "BAH-woh",
        culturalNote: "Bawo is a casual greeting. For more formal situations, you might use 'E kaaro' (good morning) or 'E kaasan' (good afternoon)."
      },
      { 
        type: "translation", 
        question: "Translate: Good morning", 
        answer: "E kaaro",
        pronunciation: "eh KAH-roh",
        culturalNote: "In Yoruba culture, greetings are very important and show respect. Always greet elders first."
      },
    ],
  },
}

export default function Lesson() {
  const { topicId } = useParams()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [playingAudio, setPlayingAudio] = useState<string | null>(null)
  
  // Convert topicId string to number, or default to 1
  const lessonKey = topicId ? (parseInt(topicId, 10) as keyof typeof lessonContent) : 1
  const lesson = lessonContent[lessonKey] || lessonContent[1]

  const handlePlayPronunciation = (text: string, pronunciation?: string) => {
    setPlayingAudio(text)
    // In a real app, this would call a text-to-speech API
    // For now, we'll use the Web Speech API
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.lang = 'yo-NG' // Yoruba language code
      utterance.rate = 0.8
      utterance.onend = () => setPlayingAudio(null)
      utterance.onerror = () => {
        setPlayingAudio(null)
        toast({
          title: "Audio unavailable",
          description: "Text-to-speech is not available. Pronunciation: " + (pronunciation || text),
          variant: "default",
        })
      }
      speechSynthesis.speak(utterance)
    } else {
      setPlayingAudio(null)
      toast({
        title: "Pronunciation",
        description: pronunciation || text,
        variant: "default",
      })
    }
  }

  const handleMarkComplete = async () => {
    setLoading(true)
    // Simulate API call
    setTimeout(() => {
      setLoading(false)
      toast({
        title: "Lesson completed!",
        description: "Great job! You've completed this lesson.",
      })
    }, 1000)
  }

  return (
    <div className="container mx-auto p-4 sm:p-6 max-w-4xl space-y-6">
      {/* Navigation Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <Button variant="outline" asChild className="h-11 min-w-[44px]">
          <Link to="/course-dashboard/yoruba/beginner">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Course
          </Link>
        </Button>
        <Badge className="text-sm px-3 py-1.5 h-8">Lesson {topicId || 1}</Badge>
      </div>

      {/* Main Lesson Card */}
      <Card className="shadow-lg">
        <CardHeader className="space-y-3">
          <div>
            <CardTitle className="text-2xl sm:text-3xl font-bold text-slate-900 leading-tight">{lesson.title}</CardTitle>
            <CardDescription className="text-base mt-2">{lesson.description}</CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-8">
          {/* Lesson Content */}
          <div className="space-y-4">
            <div className="language-content">
              <p className="text-base sm:text-lg leading-relaxed text-slate-700">{lesson.content}</p>
            </div>
          </div>

          {/* Cultural Context Section */}
          {lesson.culturalContext && (
            <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Globe className="h-5 w-5 text-primary" />
                  Cultural Context
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm sm:text-base leading-relaxed text-slate-700 language-content">
                  {lesson.culturalContext}
                </p>
              </CardContent>
            </Card>
          )}

          {/* Exercises Section */}
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-primary" />
              <h3 className="text-xl sm:text-2xl font-bold text-slate-900">Exercises</h3>
            </div>
            {lesson.exercises.map((exercise, index) => (
              <Card key={index} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <CardTitle className="text-lg sm:text-xl flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
                    Exercise {index + 1}
                    <Badge variant="outline" className="ml-auto capitalize">
                      {exercise.type}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-base sm:text-lg font-medium text-slate-900">{exercise.question}</p>
                  
                  <div className="p-4 sm:p-5 bg-gradient-to-br from-primary/5 to-primary/10 rounded-lg border border-primary/20 space-y-3">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <p className="text-xs sm:text-sm text-slate-600 mb-1.5 font-medium">Answer:</p>
                        <p className="text-lg sm:text-xl font-bold text-slate-900">{exercise.answer}</p>
                      </div>
                      {exercise.pronunciation && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handlePlayPronunciation(exercise.answer, exercise.pronunciation)}
                          className="h-11 w-11 flex-shrink-0"
                          disabled={playingAudio === exercise.answer}
                          aria-label="Play pronunciation"
                        >
                          {playingAudio === exercise.answer ? (
                            <Loader2 className="h-5 w-5 animate-spin text-primary" />
                          ) : (
                            <Volume2 className="h-5 w-5 text-primary" />
                          )}
                        </Button>
                      )}
                    </div>
                    
                    {exercise.pronunciation && (
                      <div className="pt-2 border-t border-primary/20">
                        <p className="text-xs sm:text-sm text-slate-600 mb-1 font-medium">Pronunciation:</p>
                        <p className="text-sm sm:text-base font-semibold text-primary italic">{exercise.pronunciation}</p>
                      </div>
                    )}
                    
                    {exercise.culturalNote && (
                      <div className="pt-2 border-t border-primary/20">
                        <div className="flex items-start gap-2">
                          <Globe className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="text-xs sm:text-sm text-slate-600 mb-1 font-medium">Cultural Note:</p>
                            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">{exercise.culturalNote}</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Navigation Buttons */}
          <div className="flex flex-col sm:flex-row justify-between gap-4 pt-6 border-t">
            <Button 
              variant="outline" 
              className="h-11 min-w-[44px] order-2 sm:order-1"
              disabled
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Previous Lesson
            </Button>
            <Button
              onClick={handleMarkComplete}
              disabled={loading}
              className="h-11 min-w-[44px] order-1 sm:order-2 bg-primary hover:bg-primary/90"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Marking...
                </>
              ) : (
                <>
                  Mark as Complete
                  <CheckCircle className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
            <Button 
              className="h-11 min-w-[44px] order-3"
              disabled
            >
              Next Lesson
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

