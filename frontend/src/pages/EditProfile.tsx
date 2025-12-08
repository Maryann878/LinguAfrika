import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { Upload, User, Mail, Phone, MapPin, Loader2, ArrowLeft } from "lucide-react"
import { getCurrentUser } from "@/services/auth"
import { updateProfile, uploadProfileImage } from "@/services/userService"

interface User {
  _id: string
  username: string
  email: string
  mobile: string
  firstName?: string
  lastName?: string
  profileImage?: string
  country?: string
  location?: string
  bio?: string
}

export default function EditProfile() {
  const navigate = useNavigate()
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    mobile: "",
    location: "",
    bio: "",
    profileImage: "",
  })

  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true)
      try {
        // Try to get from localStorage first
        const userStr = localStorage.getItem("user")
        if (userStr) {
          try {
            const userData: User = JSON.parse(userStr)
            setFormData({
              firstName: userData.firstName || "",
              lastName: userData.lastName || "",
              email: userData.email || "",
              mobile: userData.mobile || "",
              location: userData.location || userData.country || "",
              bio: userData.bio || "",
              profileImage: userData.profileImage || "",
            })
            setLoading(false)
            // Also fetch fresh data from backend
            try {
              const userResponse = await getCurrentUser()
              if (userResponse?.data) {
                const user = userResponse.data
                setFormData({
                  firstName: user.firstName || "",
                  lastName: user.lastName || "",
                  email: user.email || "",
                  mobile: user.mobile || "",
                  location: user.location || user.country || "",
                  bio: user.bio || "",
                  profileImage: user.profileImage || "",
                })
                localStorage.setItem("user", JSON.stringify(user))
              }
            } catch (e) {
              // If API fails, use localStorage data
            }
            return
          } catch (e) {
            // Invalid JSON, fetch from API
          }
        }

        // Fetch from API
        const userResponse = await getCurrentUser()
        if (userResponse?.data) {
          const user = userResponse.data
          setFormData({
            firstName: user.firstName || "",
            lastName: user.lastName || "",
            email: user.email || "",
            mobile: user.mobile || "",
            location: user.location || user.country || "",
            bio: user.bio || "",
            profileImage: user.profileImage || "",
          })
          localStorage.setItem("user", JSON.stringify(user))
        }
      } catch (error: any) {
        console.error("Failed to fetch user:", error)
        toast({
          title: "Error loading profile",
          description: error.message || "Failed to load your profile data",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchUserData()
  }, [toast])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      const response = await updateProfile({
        firstName: formData.firstName,
        lastName: formData.lastName,
        mobile: formData.mobile,
        location: formData.location,
        bio: formData.bio,
        profileImage: formData.profileImage,
      })

      if (response?.success) {
        // Update localStorage
        const userStr = localStorage.getItem("user")
        if (userStr) {
          const user = JSON.parse(userStr)
          const updatedUser = { ...user, ...response.data }
          localStorage.setItem("user", JSON.stringify(updatedUser))
        }

        toast({
          title: "Profile updated!",
          description: "Your changes have been saved successfully",
        })
        setTimeout(() => navigate("/profile-page"), 1000)
      }
    } catch (error: any) {
      toast({
        title: "Failed to update profile",
        description: error.message || "An error occurred while updating your profile",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  const getUserInitials = () => {
    if (formData.firstName && formData.lastName) {
      return `${formData.firstName[0]}${formData.lastName[0]}`.toUpperCase()
    }
    if (formData.firstName) {
      return formData.firstName[0].toUpperCase()
    }
    return "U"
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" />
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6 sm:py-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <Button
          variant="ghost"
          onClick={() => navigate("/profile-page")}
          className="mb-4 -ml-2"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Profile
        </Button>
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2 tracking-tight">Edit Profile</h1>
          <p className="text-gray-600 text-base sm:text-lg">Update your profile information and preferences</p>
        </div>
      </div>

      <Card className="shadow-lg border-gray-200">
        <CardHeader className="pb-6">
          <CardTitle className="text-2xl">Profile Information</CardTitle>
          <CardDescription>Make changes to your profile here. Click save when you're done.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
            {/* Profile Image */}
            <div className="flex justify-center">
              <div className="relative group">
                <div className="w-32 h-32 sm:w-36 sm:h-36 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center border-4 border-white shadow-lg overflow-hidden">
                  {formData.profileImage ? (
                    <img
                      src={formData.profileImage}
                      alt="Profile"
                      className="w-full h-full rounded-full object-cover"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none'
                        const parent = e.currentTarget.parentElement
                        if (parent) {
                          parent.innerHTML = `<span class="text-primary font-bold text-3xl sm:text-4xl">${getUserInitials()}</span>`
                        }
                      }}
                    />
                  ) : (
                    <span className="text-primary font-bold text-3xl sm:text-4xl">{getUserInitials()}</span>
                  )}
                </div>
                <label htmlFor="profile-image-upload" className="cursor-pointer">
                  <Button
                    type="button"
                    size="icon"
                    variant="outline"
                    className="absolute bottom-0 right-0 rounded-full bg-white shadow-lg hover:shadow-xl border-2 border-primary hover:bg-primary hover:text-white transition-all"
                    asChild
                  >
                    <span>
                      <Upload className="h-4 w-4" />
                    </span>
                  </Button>
                  <input
                    id="profile-image-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={async (e) => {
                      const file = e.target.files?.[0]
                      if (!file) return

                      // Validate file size (5MB max)
                      if (file.size > 5 * 1024 * 1024) {
                        toast({
                          title: "File too large",
                          description: "Please select an image smaller than 5MB",
                          variant: "destructive",
                        })
                        return
                      }

                      // Validate file type
                      if (!file.type.startsWith('image/')) {
                        toast({
                          title: "Invalid file type",
                          description: "Please select an image file",
                          variant: "destructive",
                        })
                        return
                      }

                      try {
                        setSaving(true)
                        const response = await uploadProfileImage(file)

                        if (response.success) {
                          // Update form data with new image URL (already includes full URL from service)
                          const imageUrl = response.data.profileImage
                          setFormData(prev => ({ ...prev, profileImage: imageUrl }))
                          
                          // Update localStorage
                          const userStr = localStorage.getItem('user')
                          if (userStr) {
                            const user = JSON.parse(userStr)
                            user.profileImage = imageUrl
                            localStorage.setItem('user', JSON.stringify(user))
                            
                            // Dispatch custom event to notify TopBar and other components
                            window.dispatchEvent(new Event('userUpdated'))
                          }

                          toast({
                            title: "Profile image updated!",
                            description: "Your profile picture has been uploaded successfully",
                          })
                        }
                      } catch (error: any) {
                        toast({
                          title: "Upload failed",
                          description: error.message || "Failed to upload profile image",
                          variant: "destructive",
                        })
                      } finally {
                        setSaving(false)
                        // Reset input
                        e.target.value = ''
                      }
                    }}
                  />
                </label>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-5 sm:gap-6">
              <div className="space-y-2">
                <Label htmlFor="firstName" className="text-sm font-semibold text-gray-700">First Name</Label>
                <Input
                  id="firstName"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  className="h-11 text-base sm:text-sm border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20"
                  placeholder="Enter your first name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName" className="text-sm font-semibold text-gray-700">Last Name</Label>
                <Input
                  id="lastName"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  className="h-11 text-base sm:text-sm border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20"
                  placeholder="Enter your last name"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-semibold text-gray-700">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  disabled
                  className="pl-11 h-11 text-base sm:text-sm border-gray-300 bg-gray-50 text-gray-600 cursor-not-allowed"
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="mobile" className="text-sm font-semibold text-gray-700">Mobile Number</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  id="mobile"
                  type="tel"
                  value={formData.mobile}
                  onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                  className="pl-11 h-11 text-base sm:text-sm border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20"
                  placeholder="+234 123 456 7890"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="location" className="text-sm font-semibold text-gray-700">Location</Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="pl-11 h-11 text-base sm:text-sm border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20"
                  placeholder="City, Country"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio" className="text-sm font-semibold text-gray-700">Bio</Label>
              <textarea
                id="bio"
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                className="flex min-h-[120px] w-full rounded-md border border-gray-300 bg-background px-4 py-3 text-base sm:text-sm ring-offset-background placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:border-primary resize-none"
                placeholder="Tell us about yourself... (e.g., your interests, goals, or what you're learning)"
                maxLength={500}
              />
              <p className="text-xs text-gray-500 mt-1">
                {formData.bio.length}/500 characters
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4 border-t border-gray-200">
              <Button 
                type="submit" 
                size="lg" 
                className="!rounded-full h-12 sm:h-11 font-semibold shadow-md hover:shadow-lg transition-all flex-1 sm:flex-initial"
                disabled={saving}
              >
                {saving ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save Changes"
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                size="lg"
                onClick={() => navigate("/profile-page")}
                className="!rounded-full h-12 sm:h-11 font-semibold flex-1 sm:flex-initial"
                disabled={saving}
              >
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

