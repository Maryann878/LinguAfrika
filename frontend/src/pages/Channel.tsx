import { useParams, useNavigate } from "react-router-dom"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Send, User, UserPlus, Loader2, Heart, MessageCircle } from "lucide-react"
import { useState, useEffect } from "react"
import { getChannelByName, getChannelPosts, createPost, joinChannel, checkChannelMembership } from "@/services/communityService"
import { useToast } from "@/components/ui/use-toast"
import { getProfileImageUrl } from "@/utils/imageUtils"
import { BackButton } from "@/components/BackButton"
import { LoadingScreen } from "@/components/LoadingScreen"

interface Channel {
  _id: string
  name: string
  description: string
  members: any[]
  posts: number
}

interface Post {
  _id: string
  content: string
  userId: {
    _id: string
    username: string
    profileImage?: string
  }
  createdAt: string
  likes: any[]
  replies: any[]
}

export default function Channel() {
  const { channelName } = useParams()
  const navigate = useNavigate()
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [channel, setChannel] = useState<Channel | null>(null)
  const [posts, setPosts] = useState<Post[]>([])
  const [message, setMessage] = useState("")
  const [isMember, setIsMember] = useState(false)
  const [sending, setSending] = useState(false)
  const [joining, setJoining] = useState(false)

  useEffect(() => {
    const fetchChannelData = async () => {
      if (!channelName) {
        navigate("/community")
        return
      }

      setLoading(true)
      try {
        const normalizedName = channelName.replace(/-/g, ' ')
        const channelResponse = await getChannelByName(normalizedName)
        
        if (!channelResponse?.success || !channelResponse.data) {
          throw new Error("Channel not found")
        }

        const channelData = channelResponse.data
        setChannel(channelData)

        // Check membership
        const membershipResponse = await checkChannelMembership(channelData._id)
        const memberStatus = membershipResponse?.isMember || false
        setIsMember(memberStatus)

        // Only fetch posts if user is a member
        if (memberStatus) {
          const postsResponse = await getChannelPosts(channelData._id, 1, 50)
          if (postsResponse?.success) {
            setPosts(postsResponse.data || [])
          }
        }
      } catch (error: any) {
        toast({
          title: "Error loading channel",
          description: error.message || "Failed to load channel",
          variant: "destructive",
        })
        navigate("/community")
      } finally {
        setLoading(false)
      }
    }

    fetchChannelData()
  }, [channelName, navigate, toast])

  const handleJoin = async () => {
    if (!channel) return

    setJoining(true)
    try {
      await joinChannel(channel._id)
      setIsMember(true)
      
      // Fetch posts after joining
      const postsResponse = await getChannelPosts(channel._id, 1, 50)
      if (postsResponse?.success) {
        setPosts(postsResponse.data || [])
      }

      toast({
        title: "Success!",
        description: "You've joined the channel",
      })
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to join channel",
        variant: "destructive",
      })
    } finally {
      setJoining(false)
    }
  }

  const handleSendMessage = async () => {
    if (!message.trim() || !channel || !isMember) return

    setSending(true)
    try {
      await createPost(channel._id, message)
      setMessage("")
      
      // Refresh posts
      const postsResponse = await getChannelPosts(channel._id, 1, 50)
      if (postsResponse?.success) {
        setPosts(postsResponse.data || [])
      }

      toast({
        title: "Success!",
        description: "Your message has been posted",
      })
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to post message",
        variant: "destructive",
      })
    } finally {
      setSending(false)
    }
  }

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

    if (diffInSeconds < 60) return "just now"
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`
    return date.toLocaleDateString()
  }

  if (loading) {
    return <LoadingScreen message="Loading channel..." />
  }

  if (!channel) {
    return null
  }

  const memberCount = Array.isArray(channel.members) ? channel.members.length : channel.members || 0

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6 sm:py-8 pb-24 lg:pb-8 space-y-6 max-w-7xl mx-auto overflow-x-hidden">
      <BackButton to="/community" label="Back to Community" className="mb-4" />
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 capitalize">
              {channel.name}
            </h1>
            <p className="text-sm text-slate-600">{memberCount} members • {channel.posts || 0} posts</p>
          </div>
        </div>
        {!isMember && (
          <Button
            onClick={handleJoin}
            disabled={joining}
            className="!rounded-full"
          >
            {joining ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Joining...
              </>
            ) : (
              <>
                <UserPlus className="h-4 w-4 mr-2" />
                Join Community
              </>
            )}
          </Button>
        )}
      </div>

      {!isMember ? (
        <Card className="border-2 border-dashed border-slate-200">
          <CardContent className="p-12 text-center">
            <UserPlus className="h-16 w-16 text-slate-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-slate-900 mb-2">Join to View Discussions</h3>
            <p className="text-slate-600 mb-6 max-w-md mx-auto">
              Join this community to see discussions, share your thoughts, and connect with other language learners.
            </p>
            <Button
              onClick={handleJoin}
              disabled={joining}
              size="lg"
              className="!rounded-full"
            >
              {joining ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Joining...
                </>
              ) : (
                <>
                  <UserPlus className="h-4 w-4 mr-2" />
                  Join Community
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg sm:text-xl">Discussions</CardTitle>
              <CardDescription className="text-sm">Join the conversation</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {posts.length === 0 ? (
                <div className="text-center py-12">
                  <MessageCircle className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">No discussions yet</h3>
                  <p className="text-slate-600 text-sm">Be the first to start a conversation!</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {posts.map((post) => (
                    <div key={post._id} className="space-y-4 pb-6 border-b border-slate-200 last:border-0 last:pb-0">
                      <div className="flex gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 overflow-hidden">
                          {post.userId?.profileImage ? (
                            <img
                              src={getProfileImageUrl(post.userId.profileImage) || undefined}
                              alt={post.userId.username}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <User className="h-5 w-5 text-primary" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="font-semibold text-slate-900">{post.userId?.username || "Anonymous"}</span>
                            <span className="text-xs text-slate-500">•</span>
                            <span className="text-xs text-slate-500">{formatTimeAgo(post.createdAt)}</span>
                          </div>
                          <p className="text-sm sm:text-base text-slate-700 leading-relaxed whitespace-pre-wrap">{post.content}</p>
                          <div className="flex items-center gap-6 mt-4 pt-3 border-t border-slate-100">
                            <button className="flex items-center gap-1.5 text-xs sm:text-sm text-slate-600 hover:text-primary transition-colors font-medium">
                              <Heart className="h-4 w-4" />
                              <span>{post.likes?.length || 0} {post.likes?.length === 1 ? 'like' : 'likes'}</span>
                            </button>
                            <button className="flex items-center gap-1.5 text-xs sm:text-sm text-slate-600 hover:text-primary transition-colors font-medium">
                              <MessageCircle className="h-4 w-4" />
                              <span>{post.replies?.length || 0} {post.replies?.length === 1 ? 'comment' : 'comments'}</span>
                            </button>
                          </div>
                          
                          {/* Show replies if any */}
                          {post.replies && post.replies.length > 0 && (
                            <div className="mt-4 ml-4 pl-4 border-l-2 border-slate-200 space-y-4">
                              {post.replies.slice(0, 3).map((reply: any) => (
                                <div key={reply._id || reply} className="flex gap-3">
                                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 overflow-hidden">
                                    {reply.userId?.profileImage ? (
                                      <img
                                        src={getProfileImageUrl(reply.userId.profileImage) || undefined}
                                        alt={reply.userId.username}
                                        className="w-full h-full object-cover"
                                      />
                                    ) : (
                                      <User className="h-4 w-4 text-primary" />
                                    )}
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                      <span className="font-semibold text-xs sm:text-sm text-slate-900">{reply.userId?.username || "Anonymous"}</span>
                                      <span className="text-xs text-slate-500">•</span>
                                      <span className="text-xs text-slate-500">{formatTimeAgo(reply.createdAt)}</span>
                                    </div>
                                    <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">{reply.content}</p>
                                    <div className="flex items-center gap-4 mt-2">
                                      <button className="flex items-center gap-1 text-xs text-slate-500 hover:text-primary transition-colors">
                                        <Heart className="h-3 w-3" />
                                        <span>{reply.likes?.length || 0}</span>
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              ))}
                              {post.replies.length > 3 && (
                                <button className="text-xs text-primary hover:underline font-medium">
                                  View {post.replies.length - 3} more {post.replies.length - 3 === 1 ? 'comment' : 'comments'}
                                </button>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {isMember && (
            <Card>
              <CardContent className="p-4">
                <div className="flex gap-2">
                  <Input
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleSendMessage()}
                    placeholder="Share your thoughts... (You can mix language and English!)"
                    className="flex-1 text-base sm:text-sm"
                    disabled={sending}
                  />
                  <Button
                    onClick={handleSendMessage}
                    disabled={!message.trim() || sending}
                    size="icon"
                    className="!rounded-full"
                  >
                    {sending ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Send className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  )
}


