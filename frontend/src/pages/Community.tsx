import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, MessageSquare, Users, TrendingUp, Loader2, Hash, UserPlus, LogOut } from "lucide-react"
import { Link } from "react-router-dom"
import { getAllChannels, getChannelPosts, joinChannel, leaveChannel, checkChannelMembership } from "@/services/communityService"
import { useToast } from "@/components/ui/use-toast"
import { cn } from "@/lib/utils"
import { getErrorMessage, getErrorVariant } from "@/utils/errorHandler"
import { LoadingScreen } from "@/components/LoadingScreen"

interface Channel {
  _id: string
  name: string
  description: string
  members: any[] | number
  posts: number
  isActive: boolean
}

interface Post {
  _id: string
  content: string
  userId: {
    username: string
    profileImage?: string
  }
  createdAt: string
  likes: number
}

export default function Community() {
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [channels, setChannels] = useState<Channel[]>([])
  const [recentPosts, setRecentPosts] = useState<Post[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [filteredChannels, setFilteredChannels] = useState<Channel[]>([])
  const [channelMemberships, setChannelMemberships] = useState<Record<string, boolean>>({})
  const [joiningChannel, setJoiningChannel] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        const channelsResponse = await getAllChannels()
        if (channelsResponse?.success) {
          const channelsData = channelsResponse.data || []
          setChannels(channelsData)
          setFilteredChannels(channelsData)

          // Check membership for each channel
          const membershipChecks = await Promise.allSettled(
            channelsData.map(async (channel: Channel) => {
              try {
                const membershipResponse = await checkChannelMembership(channel._id)
                return { channelId: channel._id, isMember: membershipResponse?.isMember || false }
              } catch {
                return { channelId: channel._id, isMember: false }
              }
            })
          )

          const memberships: Record<string, boolean> = {}
          membershipChecks.forEach((result) => {
            if (result.status === 'fulfilled') {
              memberships[result.value.channelId] = result.value.isMember
            }
          })
          setChannelMemberships(memberships)

          // Fetch recent posts from first joined channel if available
          const joinedChannels = channelsData.filter((ch: Channel) => memberships[ch._id])
          if (joinedChannels.length > 0) {
            try {
              const postsResponse = await getChannelPosts(joinedChannels[0]._id, 1, 5)
              if (postsResponse?.success) {
                setRecentPosts(postsResponse.data || [])
              }
            } catch (e) {
              // If posts fail, continue without them
            }
          }
        }
      } catch (error: any) {
        toast({
          title: "Error loading community",
          description: getErrorMessage(error),
          variant: getErrorVariant(error),
        })
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [toast])

  const handleJoinChannel = async (channelId: string, e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    setJoiningChannel(channelId)
    try {
      await joinChannel(channelId)
      setChannelMemberships(prev => ({ ...prev, [channelId]: true }))
      
      // Refresh channels to update member count
      const channelsResponse = await getAllChannels()
      if (channelsResponse?.success) {
        setChannels(channelsResponse.data || [])
        setFilteredChannels(channelsResponse.data || [])
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
      setJoiningChannel(null)
    }
  }

  const handleLeaveChannel = async (channelId: string, e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    setJoiningChannel(channelId)
    try {
      await leaveChannel(channelId)
      setChannelMemberships(prev => ({ ...prev, [channelId]: false }))
      
      // Refresh channels to update member count
      const channelsResponse = await getAllChannels()
      if (channelsResponse?.success) {
        setChannels(channelsResponse.data || [])
        setFilteredChannels(channelsResponse.data || [])
      }

      toast({
        title: "Success!",
        description: "You've left the channel",
      })
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to leave channel",
        variant: "destructive",
      })
    } finally {
      setJoiningChannel(null)
    }
  }

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredChannels(channels)
    } else {
      const filtered = channels.filter(
        (channel) =>
          channel.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          channel.description?.toLowerCase().includes(searchQuery.toLowerCase())
      )
      setFilteredChannels(filtered)
    }
  }, [searchQuery, channels])

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
    return <LoadingScreen message="Loading your community..." />
  }

  return (
    <div className="py-6 sm:py-8 space-y-6 sm:space-y-8 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2 tracking-tight">LinguAfrika Community</h1>
        <p className="text-slate-600 text-sm sm:text-base">Connect with fellow language learners and share your journey</p>
      </div>

      {/* Search */}
      <div className="relative max-w-2xl">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
        <Input 
          placeholder="Search channels..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-11 h-12 border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20"
        />
      </div>

      <div className="grid lg:grid-cols-3 gap-6 sm:gap-8">
        {/* Channels */}
        <div className="lg:col-span-2 space-y-5 sm:space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">Channels</h2>
            <p className="text-sm text-slate-600">{filteredChannels.length} {filteredChannels.length === 1 ? 'channel' : 'channels'}</p>
          </div>
          
          {filteredChannels.length === 0 ? (
            <Card className="shadow-modern modern-card">
              <CardContent className="p-12 text-center">
                <Hash className="h-12 w-12 text-slate-subtle mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-slate-refined mb-2">No channels found</h3>
                <p className="text-slate-subtle mb-4">Try adjusting your search terms.</p>
                <Button
                  variant="outline"
                  onClick={() => setSearchQuery("")}
                  className="!rounded-full"
                >
                  Clear Search
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 sm:gap-5">
              {filteredChannels.map((channel) => {
                const isMember = channelMemberships[channel._id] || false
                const memberCount = Array.isArray(channel.members) ? channel.members.length : channel.members || 0
                
                return (
                  <Card 
                    key={channel._id} 
                    className={cn(
                      "modern-card hover-lift hover-glow group",
                      isMember && "ring-2 ring-primary/20 shadow-modern"
                    )}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2">
                            <Hash className="h-5 w-5 text-primary flex-shrink-0" />
                            <CardTitle className="text-lg sm:text-xl group-hover:text-primary transition-colors">{channel.name}</CardTitle>
                            {isMember && (
                              <Badge className="bg-green-100 text-green-700 border-green-200 text-xs">
                                Joined
                              </Badge>
                            )}
                          </div>
                          <CardDescription className="text-sm">{channel.description || "Join the conversation"}</CardDescription>
                        </div>
                        <Badge className="bg-primary/10 text-primary border-primary/20 flex-shrink-0">
                          {memberCount} members
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-6 text-xs sm:text-sm text-slate-600">
                          <div className="flex items-center gap-2">
                            <Users className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-slate-500" />
                            <span>{memberCount.toLocaleString()} members</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <MessageSquare className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-slate-500" />
                            <span>{(channel.posts || 0).toLocaleString()} posts</span>
                          </div>
                        </div>
                        {isMember ? (
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={(e) => handleLeaveChannel(channel._id, e)}
                              disabled={joiningChannel === channel._id}
                              className="!rounded-full text-xs"
                            >
                              <LogOut className="h-3 w-3 mr-1.5" />
                              Leave
                            </Button>
                            <Button
                              size="sm"
                              asChild
                              className="!rounded-full text-xs"
                            >
                              <Link to={`/community/${channel.name.toLowerCase().replace(/\s+/g, '-')}`}>
                                View Channel
                                <MessageSquare className="h-3 w-3 ml-1.5" />
                              </Link>
                            </Button>
                          </div>
                        ) : (
                          <Button
                            size="sm"
                            onClick={(e) => handleJoinChannel(channel._id, e)}
                            disabled={joiningChannel === channel._id}
                            className="!rounded-full text-xs"
                          >
                            {joiningChannel === channel._id ? (
                              <>
                                <Loader2 className="h-3 w-3 mr-1.5 animate-spin" />
                                Joining...
                              </>
                            ) : (
                              <>
                                <UserPlus className="h-3 w-3 mr-1.5" />
                                Join Community
                              </>
                            )}
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-5 sm:space-y-6">
          <Card className="shadow-modern-lg modern-card">
            <CardHeader>
              <CardTitle className="text-xl">Recent Posts</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentPosts.length === 0 ? (
                <div className="text-center py-8">
                  <MessageSquare className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-sm text-gray-600">No recent posts</p>
                </div>
              ) : (
                recentPosts.map((post) => (
                  <div key={post._id} className="space-y-2 pb-4 border-b border-gray-100 last:border-0 last:pb-0">
                    <Link to="#" className="font-semibold text-gray-900 hover:text-primary transition-colors line-clamp-2">
                      {post.content.length > 100 ? `${post.content.substring(0, 100)}...` : post.content}
                    </Link>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <span className="font-medium">{post.userId?.username || "Anonymous"}</span>
                      <span>•</span>
                      <span>{formatTimeAgo(post.createdAt)}</span>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          <Card className="shadow-modern-lg modern-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <TrendingUp className="h-5 w-5 text-primary" />
                Trending Topics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {channels.slice(0, 4).map((channel) => (
                  <Badge 
                    key={channel._id}
                    variant="outline" 
                    className="px-3 py-1.5 text-sm hover:bg-primary/10 hover:border-primary/50 transition-colors cursor-pointer"
                  >
                    #{channel.name.split(' ')[0]}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

