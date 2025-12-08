import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Mail, MessageSquare, Book, HelpCircle } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

const faqs = [
  {
    question: "How do I start learning a language?",
    answer: "Simply navigate to the Languages page, select a language, and choose your level to begin.",
  },
  {
    question: "Can I learn multiple languages at once?",
    answer: "Yes! You can enroll in multiple courses and switch between them at any time.",
  },
  {
    question: "How do I track my progress?",
    answer: "Visit the Learning Progress page to see your statistics, completed lessons, and achievements.",
  },
  {
    question: "Is there a mobile app?",
    answer: "Currently, LinguAfrika is web-based and works great on mobile browsers. A native app is coming soon!",
  },
]

export default function HelpSupport() {
  const { toast } = useToast()

  const handleContact = (e: React.FormEvent) => {
    e.preventDefault()
    toast({
      title: "Message sent!",
      description: "We'll get back to you soon",
      variant: "success",
    })
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-4xl font-bold mb-2">Help & Support</h1>
        <p className="text-muted-foreground">Find answers or get in touch with us</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <Book className="h-10 w-10 text-primary mb-4" />
            <CardTitle>Documentation</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Browse our comprehensive guides and tutorials
            </p>
            <Button variant="outline">View Docs</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <HelpCircle className="h-10 w-10 text-primary mb-4" />
            <CardTitle>FAQ</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Find answers to common questions
            </p>
            <Button variant="outline">View FAQ</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <MessageSquare className="h-10 w-10 text-primary mb-4" />
            <CardTitle>Live Chat</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Chat with our support team
            </p>
            <Button variant="outline">Start Chat</Button>
          </CardContent>
        </Card>
      </div>

      {/* FAQ Section */}
      <Card>
        <CardHeader>
          <CardTitle>Frequently Asked Questions</CardTitle>
          <CardDescription>Quick answers to common questions</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className="border-b last:border-b-0 pb-4 last:pb-0">
              <h3 className="font-semibold mb-2">{faq.question}</h3>
              <p className="text-muted-foreground">{faq.answer}</p>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Contact Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Contact Us
          </CardTitle>
          <CardDescription>Send us a message and we'll respond as soon as possible</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleContact} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="contact-name">Name</Label>
              <Input id="contact-name" placeholder="Your name" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contact-email">Email</Label>
              <Input id="contact-email" type="email" placeholder="your.email@example.com" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contact-message">Message</Label>
              <textarea
                id="contact-message"
                className="flex min-h-[150px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                placeholder="How can we help you?"
                required
              />
            </div>
            <Button type="submit" className="w-full" size="lg">
              Send Message
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}


