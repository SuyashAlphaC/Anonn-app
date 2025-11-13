import {
  Edit3,
  BarChart3,
  Circle,
  Triangle,
  FileText,
  LogIn,
  Loader2,
  ArrowRight,
  Eye,
  User,
  Settings,
  Share,
  Share2,
  BarChartHorizontalBig,
  BarChartBigIcon,
  Camera,


} from "lucide-react";
import type { Bowl, Organization } from "@shared/schema";
import { useAuth } from "@/hooks/useAuth";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import { useWallet } from "@solana/wallet-adapter-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,


} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { navigate } from "wouter/use-browser-location";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";


import { z } from "zod";

interface RightSidebarProps {
  bowls?: Bowl[];
  organizations?: Organization[];
  onCreatePost: () => void;
}

// Add the profile schema (same as backend)
const profileSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters").max(50, "Username must be less than 50 characters").optional(),
  bio: z.string().max(500, "Bio must be less than 500 characters").optional(),
});

type ProfileData = z.infer<typeof profileSchema>;



export default function RightSidebar({
  bowls,
  organizations,
  onCreatePost,
}: RightSidebarProps) {
  const {
    isAuthenticated,
    user,
    login,


    getAccessToken,
    setDbProfile,


    isLoading: authLoading,
  } = useAuth();
  const { setVisible } = useWalletModal();
  const { connected, publicKey, connecting } = useWallet();
  const { toast } = useToast();
  const [location] = useLocation();



  const [profileDialogOpen, setProfileDialogOpen] = useState(false);
  const [editUsernameDialogOpen, setEditUsernameDialogOpen] = useState(false);

  const [editImageDialogOpen, setEditImageDialogOpen] = useState(false); // Add image edit dialog
  const [bio, setBio] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [newUsername, setNewUsername] = useState("");
  const [imageUrl, setImageUrl] = useState(""); // For image URL input

  // Check if we're on the profile page
  const isProfilePage = location === "/profile" || location === "/settings";
  const isBowlsPage = location === "/bowls";
  const isOrganizationsPage = location === "/organizations";
  
  // React Hook Form for profile editing
  const profileForm = useForm<ProfileData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      username: user?.username || "",
      bio: user?.bio || "",
    },
  });

  // Update form when user data changes
  useEffect(() => {
    if (user) {
      profileForm.reset({
        username: user.username || "",
        bio: user.bio || "",
      });
    }
  }, [user, profileForm]);

  // Function to update profile
  const updateProfile = async (data: ProfileData) => {
    if (isSubmitting) return;

    setIsSubmitting(true);
    try {
      const token = await getAccessToken();
      if (!token) {
        throw new Error("Authentication token not available. Please log in again.");
      }

      const response = await fetch("/api/users/me", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || `Failed to update profile: ${response.status}`);
      }

      const updatedUser = await response.json();
      setDbProfile(updatedUser);

      toast({
        title: "Profile updated!",
        description: "Your profile has been updated successfully.",
      });

      setEditUsernameDialogOpen(false);
      setEditImageDialogOpen(false);
    } catch (error) {
      console.error("[profile] Profile update error:", error);
      toast({
        title: "Profile update failed",
        description: error instanceof Error ? error.message : "Unable to update profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle username edit specifically
  const handleUsernameEdit = () => {
    setNewUsername(user?.username || "");
    setEditUsernameDialogOpen(true);
  };

  const submitUsernameEdit = async () => {
    if (!newUsername.trim()) return;
    
    await updateProfile({ username: newUsername.trim() });
  };

  // Handle profile image edit
  const handleImageEdit = () => {
    setImageUrl(user?.profileImageUrl || "");
    setEditImageDialogOpen(true);
  };

  const submitImageEdit = async () => {
    if (!imageUrl.trim()) {
      toast({
        title: "Image URL required",
        description: "Please enter a valid image URL",
        variant: "destructive",
      });
      return;
    }

    // Validate URL format
    try {
      new URL(imageUrl);
    } catch (error) {
      toast({
        title: "Invalid URL",
        description: "Please enter a valid image URL",
        variant: "destructive",
      });
      return;
    }

    await updateProfile({ 
      // Note: You'll need to add profileImageUrl to your backend schema
      // For now, this will only work if your backend supports profileImageUrl
      ...profileForm.getValues(),
      // profileImageUrl: imageUrl.trim() 
    });

  };

  // Handle wallet connection and authentication flow
  useEffect(() => {
    // If wallet is connected but not authenticated, try to login
    if (connected && publicKey && !isAuthenticated && !authLoading) {
      console.log("Wallet connected, attempting authentication...");
      handleAuthentication();
    }

    // If authenticated and user data is loaded, check profile completion
    if (isAuthenticated && user) {
      console.log("User authenticated, checking profile...");
      // Check if profile needs completion (only bio required)
      const hasBio = Boolean(user.bio?.trim());


      if (!hasBio) {
        // Show profile completion dialog
        setBio(user.bio || "");
        setProfileDialogOpen(true);
      }
    }
  }, [connected, publicKey, isAuthenticated, user, authLoading]);

  // Handle connecting state
  useEffect(() => {
    setIsConnecting(connecting);
  }, [connecting]);

  const handleAuthentication = async () => {
    try {
      console.log("Authenticating with backend...");
      if (!publicKey) {
        throw new Error("No public key available");
      }

      // Call login to authenticate with the backend
      await login();


      toast({
        title: "Wallet connected!",
        description: "Successfully authenticated with Anonn.",
      });
    } catch (error) {
      console.error("Authentication error:", error);
      toast({
        title: "Authentication failed",
        description:

        "Failed to authenticate with the server. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleConnectWallet = () => {
    console.log("Opening wallet modal...");
    setVisible(true);
  };

  const handleEditProfile = () => {
    navigate("/settings");
  };


  async function submitProfile() {
    if (isSubmitting) return;


    setIsSubmitting(true);
    try {
      const token = await getAccessToken();
      if (!token) {
        throw new Error(
          "Authentication token not available. Please try logging in again."

        );
      }

      const payload = {
        bio: bio.trim() || undefined,
      };

      const response = await fetch("/api/users/me", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",


          Authorization: `Bearer ${token}`,
        },

        credentials: "include",
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          errorText || `Failed to update profile: ${response.status}`

        );
      }

      const updatedUser = await response.json();
      setDbProfile(updatedUser);


      toast({
        title: "Profile completed!",
        description: "Your profile has been set up successfully.",
      });

      setProfileDialogOpen(false);
    } catch (error) {

      console.error("[auth] Profile submission error:", error);
      toast({
        title: "Profile update failed",
        description:
          error instanceof Error
            ? error.message

            : "Unable to complete your profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  // Company logo colors - matching the image
  const getCompanyLogoStyle = (index: number) => {
    const styles = [
      { bg: "bg-emerald-400", text: "text-white" }, // Abstract - green
      { bg: "bg-purple-600", text: "text-white" }, // Memed - purple
      { bg: "bg-blue-600", text: "text-white" }, // FantasyLog - blue
      {
        bg: "bg-gradient-to-br from-purple-500 to-pink-500",
        text: "text-white",

      }, // Somnia - gradient
      { bg: "bg-yellow-400", text: "text-gray-900" }, // Bigcoin - yellow
    ];
    return styles[index % styles.length];
  };

  return (
    <aside className="hidden md:block w-80 flex-shrink-0">
      {/* Conditional Section based on Authentication */}
      {isAuthenticated ? (
        /* CREATE Section - Show when authenticated */
        <div className="my-4 border border-gray-700 bg-black overflow-hidden">
          <div
            onClick={onCreatePost}
            className="bg-gradient-to-br cursor-pointer from-[#a8d5e2] to-[#b3d9e6] p-8 h-32 flex items-center justify-center"


>
            <button
              onClick={onCreatePost}
              className="flex items-center gap-2 text-gray-900 hover:text-gray-700 hover:scale-105 font-medium text-base"
            >
              <Edit3 className="w-5 h-5" />
              CREATE
            </button>
          </div>
          <div className="grid grid-cols-2 border-t border-gray-700">
            <button
              onClick={onCreatePost}
              className="flex items-center text-white justify-center gap-2 py-3 bg-black hover:bg-gray-900 text-sm font-medium transition-colors border-r border-gray-700"
            >
              <BarChart3 className="w-4 h-4" />
              POLL
            </button>
            <button
              onClick={onCreatePost}
              className="flex items-center text-white justify-center gap-2 py-3 bg-black hover:bg-gray-900 text-sm font-medium transition-colors"
            >
              <FileText className="w-4 h-4" />
              POST
            </button>
          </div>
        </div>
      ) : (
        /* CONNECT WALLET Section - Show when not authenticated */
        <div className="mb-4 border border-gray-700 bg-black overflow-hidden">
          <div className="bg-gradient-to-br from-[#a8d5e2] to-[#b3d9e6] p-8 h-32 flex items-center justify-center">




            <div className="text-center">
              <Button
                onClick={handleConnectWallet}
                disabled={isConnecting}
                className="flex items-center gap-2 text-gray-700 text-xl hover:text-gray-900 hover:scale-105 font-medium px-4 py-2 rounded-md transition-colors disabled:opacity-50"
              >
                {isConnecting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Connecting...
                  </>
                ) : (
                  <>
                    <LogIn className="w-4 h-4" />
                    Connect Wallet
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* COMMUNITIES Section */}
      {!isProfilePage && !isBowlsPage && isAuthenticated && ( 
        <div className="bg-black border border-gray-700 p-4 mb-4">
          <div className="flex items-center gap-2 mb-4">
            <Circle className="h-3 w-3 text-white fill-white" />
            <h3 className="font-semibold text-white uppercase text-xs tracking-wide">
              COMMUNITIES
            </h3>
          </div>
          <div className="space-y-2">
            {bowls?.slice(0, 4).map((bowl) => (
              <div key={bowl.id}>
                <a
                  href={`/bowls/${encodeURIComponent(bowl.name)}`}
                  className="text-gray-400 hover:text-white transition-colors text-sm block"
                >
                  {bowl.name?.toLowerCase().replace(/\s+/g, "")}
                </a>
              </div>
            ))}
          </div>

        </div>

)}


      {/* COMPANIES Section */}
      {isAuthenticated && !isProfilePage && !isOrganizationsPage && (
        <div className="bg-black border border-gray-700 p-4">
          <h3 className="text-xs text-white font-semibold mb-4 flex items-center gap-2 uppercase tracking-wide">
            <Triangle className="w-3 h-3 fill-white text-white" />
            COMPANIES
          </h3>
          <div className="space-y-3">
            {organizations?.slice(0, 5).map((org, index) => {
              const logoStyle = getCompanyLogoStyle(index);
              return (
                <div key={org.id} className="flex items-center gap-3">
                  <div
                    className={`w-9 h-9 ${logoStyle.bg} rounded flex items-center justify-center flex-shrink-0`}
                  >
                    <span className={`text-lg font-bold ${logoStyle.text}`}>
                      {org.name?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <span className="flex-1 text-sm text-gray-300 truncate">
                    {org.name}
                  </span>
                  <div className="flex items-center flex-shrink-0">
                    <div className="px-2 py-2 bg-emerald-300 text-gray-900  text-xs font-bold min-w-[32px] text-center">
                      {Math.floor(Math.random() * 40) + 60}
                    </div>
                    <div className="px-2 py-2 bg-red-300 text-red-900  text-xs font-bold min-w-[32px] text-center">
                      {Math.floor(Math.random() * 40) + 30}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Profile Edit Section - Only show on profile page when authenticated */}
      {isAuthenticated && isProfilePage && (
        <div className="mt-4 bg-black border border-gray-700 overflow-hidden">
          {/* Profile Image Section */}
          <div className="relative p-4">
            <div className="relative w-56 h-60 mx-auto">
              <Avatar className="w-full h-full rounded-none">
                <AvatarImage
                  src={user?.profileImageUrl || "https://res.cloudinary.com/backend969/image/upload/v1762989309/c3c53349d65202c7653c4f4e2bdfae8ef9a43aa0_bzwk87.png"}
                  className="object-cover"
                />
                <AvatarFallback className="bg-gray-800 text-white font-bold text-4xl rounded-none">
                  {user?.username?.charAt(0).toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>
              {/* Edit Icon on Image - Fixed to open image edit dialog */}
              <button
                onClick={handleImageEdit}
                className="absolute bottom-4 right-4 w-10 h-10 bg-black/80 hover:bg-black flex items-center justify-center transition-colors"
              >
                <Camera className="w-4 h-4 text-white" />
              </button>
            </div>
          </div>

          {/* Username Section */}
          <div className="p-4">
            <div className="relative border px-5 border-gray-700 p">
              <div className="absolute -top-4 px-2 py-1 bg-black text-xs inline-block text-gray-500 border border-gray-700 uppercase tracking-wider">
                USERNAME
              </div>
              <div className="flex items-center justify-between pt-8 py-4">
                <span className="text-gray-300 underline text-lg font-medium">
                  {user?.username || "user1234"}
                </span>
                <button
                  onClick={handleUsernameEdit}
                  className="w-8 h-8 flex items-center justify-center hover:bg-gray-800 transition-colors"
                >
                  <Edit3 className="w-4 h-4 text-gray-400" />
                </button>
              </div>
            </div>

            {/* Stats Section */}
            <div className="grid grid-cols-3 border border-gray-700">
              <div className="flex items-center bg-gray-100 justify-center">
                <Share2 className="w-6 h-6 "/>
              </div>
              <div className="p-3 flex border items-center justify-center text-gray-400 gap-2 border-gray-700">
                <BarChartHorizontalBig className="w-4 h-4"/>
                <div className="text-md">
                  {user?.karma || 40}
                </div>
              </div>
              <div className="p-3 flex items-center justify-center gap-2 text-center text-gray-400">
                <BarChartBigIcon className="w-4 h-4 "/>
                <div className="text-md">25</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Username Edit Dialog */}
      <Dialog open={editUsernameDialogOpen} onOpenChange={setEditUsernameDialogOpen}>
        <DialogContent className="sm:max-w-md border-0 shadow-2xl bg-black border-gray-700">
          <DialogHeader className="text-center pb-4">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-[#a8d5e2] to-[#b3d9e6] rounded-2xl mb-4">
              <Edit3 className="h-8 w-8 text-gray-900" />
            </div>
            <DialogTitle className="text-2xl font-bold text-white">
              Edit Username
            </DialogTitle>
            <p className="text-sm text-gray-400 mt-2">
              Choose a new username for your profile
            </p>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">
                Username
              </label>
              <Input
                placeholder="Enter new username..."
                value={newUsername}
                onChange={(e) => setNewUsername(e.target.value)}
                className="rounded-xl border-gray-600 bg-gray-900 text-white focus:border-[#a8d5e2] focus:ring-[#a8d5e2]/20 h-12"
              />
            </div>
          </div>
          <DialogFooter className="pt-6">
            <Button
              disabled={isSubmitting || !newUsername.trim()}
              onClick={submitUsernameEdit}
              className="w-full h-12 bg-gradient-to-r from-[#a8d5e2] to-[#b3d9e6] text-gray-900 font-bold rounded-xl disabled:opacity-50 shadow-lg hover:from-[#9bc8d5] hover:to-[#a6ccd9]"
            >
              {isSubmitting ? (
                <span className="flex items-center gap-3">
                  <div className="w-5 h-5 border-2 border-gray-900/30 border-t-gray-900 rounded-full animate-spin"></div>
                  Updating...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  Update Username
                  <ArrowRight className="h-4 w-4" />
                </span>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Profile Image Edit Dialog */}
      <Dialog open={editImageDialogOpen} onOpenChange={setEditImageDialogOpen}>
        <DialogContent className="sm:max-w-md border-0 shadow-2xl bg-black border-gray-700">
          <DialogHeader className="text-center pb-4">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-[#a8d5e2] to-[#b3d9e6] rounded-2xl mb-4">
              <Camera className="h-8 w-8 text-gray-900" />
            </div>
            <DialogTitle className="text-2xl font-bold text-white">
              Update Profile Image
            </DialogTitle>
            <p className="text-sm text-gray-400 mt-2">
              Enter a URL for your new profile image
            </p>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">
                Image URL
              </label>
              <Input
                placeholder="https://example.com/image.jpg"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                className="rounded-xl border-gray-600 bg-gray-900 text-white focus:border-[#a8d5e2] focus:ring-[#a8d5e2]/20 h-12"
              />
              <p className="text-xs text-gray-500">
                Enter a direct link to your profile image
              </p>
            </div>
            {imageUrl && (
              <div className="flex justify-center">
                <div className="w-20 h-20 border border-gray-600 rounded overflow-hidden">
                  <img 
                    src={imageUrl} 
                    alt="Preview" 
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                </div>
              </div>
            )}
          </div>
          <DialogFooter className="pt-6">
            <Button
              disabled={isSubmitting || !imageUrl.trim()}
              onClick={submitImageEdit}
              className="w-full h-12 bg-gradient-to-r from-[#a8d5e2] to-[#b3d9e6] text-gray-900 font-bold rounded-xl disabled:opacity-50 shadow-lg hover:from-[#9bc8d5] hover:to-[#a6ccd9]"
            >
              {isSubmitting ? (
                <span className="flex items-center gap-3">
                  <div className="w-5 h-5 border-2 border-gray-900/30 border-t-gray-900 rounded-full animate-spin"></div>
                  Updating Image...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  Update Image
                  <ArrowRight className="h-4 w-4" />
                </span>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>


      </Dialog>

      {/* Profile Completion Dialog */}
      <Dialog open={profileDialogOpen} onOpenChange={setProfileDialogOpen}>
        <DialogContent className="sm:max-w-md border-0 shadow-2xl bg-black border-gray-700">
          <DialogHeader className="text-center pb-4">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-[#a8d5e2] to-[#b3d9e6] rounded-2xl mb-4">
              <Edit3 className="h-8 w-8 text-gray-900" />
            </div>
            <DialogTitle className="text-2xl font-bold text-white">
              Complete your profile


            </DialogTitle>
            <p className="text-sm text-gray-400 mt-2">
              Help us personalize your experience
            </p>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">
                Bio (Optional)
              </label>
              <Input
                placeholder="Tell us about yourself..."


                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="rounded-xl border-gray-600 bg-gray-900 text-white focus:border-[#a8d5e2] focus:ring-[#a8d5e2]/20 h-12"
              />
            </div>
          </div>
          <DialogFooter className="pt-6">
            <Button
              disabled={isSubmitting}


              onClick={submitProfile}
              className="w-full h-12 bg-gradient-to-r from-[#a8d5e2] to-[#b3d9e6] text-gray-900 font-bold rounded-xl disabled:opacity-50 shadow-lg hover:from-[#9bc8d5] hover:to-[#a6ccd9]"
            >
              {isSubmitting ? (
                <span className="flex items-center gap-3">
                  <div className="w-5 h-5 border-2 border-gray-900/30 border-t-gray-900 rounded-full animate-spin"></div>
                  Completing Profile...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  Complete Profile
                  <ArrowRight className="h-4 w-4" />
                </span>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </aside>
  );
}