import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Send, Bot, User, Loader2 } from "lucide-react"
import { useState, useEffect, useRef } from "react"
import { getChatHistory, sendChatMessage } from "@/services/chatService"
import { useToast } from "@/components/ui/use-toast"
import { cn } from "@/lib/utils"
import { BackButton } from "@/components/BackButton"
import { LoadingScreen } from "@/components/LoadingScreen"

interface Message {
  _id: string
  message: string
  messageType: "user" | "ai"
  createdAt: string
}

export default function AIChat() {
  const { toast } = useToast()
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const fetchHistory = async () => {
      setLoading(true)
      try {
        const response = await getChatHistory(50)
        if (response?.success) {
          const historyMessages = response.data || []
          setMessages(historyMessages)
          
          // If no messages, add welcome message
          if (historyMessages.length === 0) {
            setMessages([{
              _id: 'welcome',
              message: "Hello! I'm your AI language learning assistant. How can I help you practice today?",
              messageType: "ai",
              createdAt: new Date().toISOString()
            }])
          }
        }
      } catch (error: any) {
        toast({
          title: "Error loading chat",
          description: error.message || "Failed to load chat history",
          variant: "destructive",
        })
        // Add welcome message even on error
        setMessages([{
          _id: 'welcome',
          message: "Hello! I'm your AI language learning assistant. How can I help you practice today?",
          messageType: "ai",
          createdAt: new Date().toISOString()
        }])
      } finally {
        setLoading(false)
      }
    }

    fetchHistory()
  }, [toast])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSend = async () => {
    if (!input.trim() || sending) return

    const userMessageText = input.trim()
    setInput("")
    setSending(true)

    // Add user message optimistically
    const tempUserMessage: Message = {
      _id: `temp-${Date.now()}`,
      message: userMessageText,
      messageType: "user",
      createdAt: new Date().toISOString()
    }
    setMessages((prev) => [...prev, tempUserMessage])

    try {
      const response = await sendChatMessage(userMessageText)
      if (response?.success && response?.data) {
        // Replace temp message with real messages
        setMessages((prev) => {
          const filtered = prev.filter(m => m._id !== tempUserMessage._id)
          return [...filtered, response.data.userMessage, response.data.aiMessage]
        })
      }
    } catch (error: any) {
      toast({
        title: "Error sending message",
        description: error.message || "Failed to send message",
        variant: "destructive",
      })
      // Remove temp message on error
      setMessages((prev) => prev.filter(m => m._id !== tempUserMessage._id))
    } finally {
      setSending(false)
    }
  }

  if (loading) {
    return <LoadingScreen message="Loading chat..." />
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6 sm:py-8 h-[calc(100vh-200px)] flex flex-col max-w-4xl mx-auto">
      <BackButton to="/dashboard" label="Back to Dashboard" className="mb-4" />
      <div className="mb-6">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2 tracking-tight">AI Chat Assistant</h1>
        <p className="text-gray-600 text-base sm:text-lg">Practice your language skills with our AI tutor</p>
      </div>

      <Card className="flex-1 flex flex-col shadow-lg border-gray-200">
        <CardHeader className="border-b border-gray-200">
          <CardTitle className="text-xl">Chat</CardTitle>
          <CardDescription>Ask questions or practice conversations</CardDescription>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col space-y-4 overflow-hidden p-0">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto space-y-4 p-6">
            {messages.map((message) => (
              <div
                key={message._id}
                className={cn(
                  "flex gap-3",
                  message.messageType === "user" ? "justify-end" : "justify-start"
                )}
              >
                {message.messageType === "ai" && (
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Bot className="h-5 w-5 text-primary" />
                  </div>
                )}
                <div
                  className={cn(
                    "max-w-[75%] sm:max-w-[70%] rounded-2xl p-4 shadow-sm",
                    message.messageType === "user"
                      ? "bg-primary text-white"
                      : "bg-gray-100 text-gray-900"
                  )}
                >
                  <p className="text-sm sm:text-base leading-relaxed whitespace-pre-wrap break-words">
                    {message.message}
                  </p>
                  <p
                    className={cn(
                      "text-xs mt-2",
                      message.messageType === "user"
                        ? "text-white/70"
                        : "text-gray-500"
                    )}
                  >
                    {new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
                {message.messageType === "user" && (
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <User className="h-5 w-5 text-primary" />
                  </div>
                )}
              </div>
            ))}
            {sending && (
              <div className="flex gap-3 justify-start">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Bot className="h-5 w-5 text-primary" />
                </div>
                <div className="bg-gray-100 rounded-2xl p-4">
                  <Loader2 className="h-4 w-4 animate-spin text-gray-500" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="flex gap-3 pt-4 pb-6 px-6 border-t border-gray-200 bg-gray-50/50">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault()
                  handleSend()
                }
              }}
              placeholder="Type your message..."
              className="flex-1 h-12 border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20"
              disabled={sending}
            />
            <Button 
              onClick={handleSend} 
              size="icon"
              className="h-12 w-12 !rounded-full shadow-md hover:shadow-lg transition-all"
              disabled={!input.trim() || sending}
            >
              {sending ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <Send className="h-5 w-5" />
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

