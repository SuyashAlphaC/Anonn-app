// components/OrganizationContent.tsx
import { useEffect, useState, useCallback } from "react";
import { useParams, useLocation } from "wouter";
import { useQuery as useRQ } from "@tanstack/react-query";
import PostCard from "@/components/PostCard";
import { Button } from "@/components/ui/button";
import { Building, Users, MessageSquare, BarChart3, PenSquare, Share2, Settings, Bookmark, ThumbsUp, ThumbsDown } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import type { OrganizationWithStats, PostWithDetails } from "@shared/schema";

type TabType = "about" | "posts" | "polls" | "comments";

export default function OrganizationContent() {
  const emptyUpdateCallback = useCallback(() => {}, []);
  const params = useParams();
  const [, setLocation] = useLocation();
  const idParam = (params.id as string) || "";
  const { toast } = useToast();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [activeTab, setActiveTab] = useState<TabType>("about");


  // Fetch organization by ID or name
  const { data: organization, isLoading: orgLoading, error: orgError } = useRQ<OrganizationWithStats>({
    queryKey: ["/api/organizations", idParam],
    queryFn: async () => {
      // First try to fetch by ID if it's a number
      if (!isNaN(parseInt(idParam))) {
        const response = await fetch(`/api/organizations/${idParam}`, {
          credentials: "include",
        });
        if (response.ok) {
          return response.json();
        }
      }
      
      // If ID fetch fails or it's not a number, try searching by name
      const searchResponse = await fetch(`/api/organizations/search?q=${encodeURIComponent(idParam)}`, {
        credentials: "include",
      });
      if (!searchResponse.ok) {
        throw new Error(`Organization not found: ${searchResponse.status}`);
      }
      
      const organizations = await searchResponse.json();
      const exactMatch = organizations.find((org: any) => 
        org.name.toLowerCase() === idParam.toLowerCase()
      );
      
      if (!exactMatch) {
        throw new Error("Organization not found");
      }
      return exactMatch;
    },
    enabled: !!idParam,
    retry: (failureCount, error) => {
      if (isUnauthorizedError(error)) {
        window.location.href = "/auth";
        return false;
      }
      return failureCount < 3;
    },
  });

  console.log("org", organization)

  // Fetch posts for this organization
  const { data: allPosts = [], isLoading: postsLoading } = useRQ<PostWithDetails[]>({
    queryKey: ["/api/posts", { organizationId: organization?.id }],
    queryFn: async () => {
      if (!organization?.id) throw new Error("Organization not loaded");
      const response = await fetch(`/api/posts?organizationId=${organization.id}`, {
        credentials: "include",
      });
      if (!response.ok) {
        throw new Error(`${response.status}: ${response.statusText}`);
      }
      return response.json();
    },
    enabled: !!organization?.id,
    retry: (failureCount, error) => {
      if (isUnauthorizedError(error)) {
        window.location.href = "/auth";
        return false;
      }
      return failureCount < 3;
    },
  });
  console.log("orgPost", allPosts)

  // Fetch polls for this organization
  const { data: polls = [], isLoading: pollsLoading } = useRQ<any[]>({
    queryKey: ["/api/polls", { organizationId: organization?.id }],
    queryFn: async () => {
      if (!organization?.id) throw new Error("Organization not loaded");
      const response = await fetch(`/api/polls?organizationId=${organization.id}`, {
        credentials: "include",
      });
      if (!response.ok) {
        throw new Error(`${response.status}: ${response.statusText}`);
      }
      return response.json();
    },
    enabled: !!organization?.id,
    retry: (failureCount, error) => {
      if (isUnauthorizedError(error)) {
        window.location.href = "/auth";
        return false;
      }
      return failureCount < 3;
    },
  });

  // Get reviews from posts (since there's no separate /api/reviews endpoint)
  const reviews = allPosts.filter(post => post.type === 'review');

  const posts = allPosts.filter(post => post.type !== 'poll' && post.type !== 'review');

  // Get trust percentages
  const getTrustPercentage = () => {
    if (organization?.trustData?.trustPercentage !== undefined) {
      return {
        trust: organization.trustData.trustPercentage,
        distrust: 100 - organization.trustData.trustPercentage
      };
    }
    return { trust: 80, distrust: 20 };
  };

  // Handle organization not found
  if (orgError && !orgLoading) {
    return (
      <div className="w-full min-h-screen bg-black text-white px-4 pt-6 pb-6 flex items-center justify-center">
        <div className="text-center">
          <h3 className="text-2xl font-bold mb-3">Organization not found</h3>
          <p className="text-gray-400 mb-6">The organization "{idParam}" doesn't exist or you don't have access.</p>
          <Button onClick={() => setLocation("/organizations")} className="bg-green-500 hover:bg-green-600">
            Back to Organizations
          </Button>
        </div>
      </div>
    );
  }

  if (authLoading || orgLoading) {
    return (
      <div className="w-full min-h-screen bg-black text-white px-4 pt-6 pb-6">
        <div className="max-w-4xl mx-auto">
          <div className="h-10 w-32 bg-gray-800 rounded animate-pulse mb-6"></div>
          <div className="h-64 bg-gray-800 rounded animate-pulse"></div>
        </div>
      </div>
    );
  }

  if (!organization) {
    return (
      <div className="w-full min-h-screen bg-black text-white px-4 pt-6 pb-6 flex items-center justify-center">
        <div className="text-center">
          <h3 className="text-2xl font-bold mb-3">Organization not found</h3>
          <Button onClick={() => setLocation("/organizations")} className="bg-green-500 hover:bg-green-600">
            Back to Organizations
          </Button>
        </div>
      </div>
    );
  }

  const trustScores = getTrustPercentage();

  return (
    <div className="w-full min-h-screen bg-black text-white px-4 pt-6 pb-6">
      <div className="max-w-4xl mx-auto">
        {/* Tabs */}
        <div className="flex items-center gap-3 mb-8">
          <button
            onClick={() => setActiveTab("about")}
            className={`px-6 py-2 rounded-full font-medium text-sm transition-all ${
              activeTab === "about"
                ? "bg-white text-black"
                : "bg-transparent text-gray-500 hover:text-gray-300"
            }`}
          >
            ABOUT
          </button>
          <button
            onClick={() => setActiveTab("posts")}
            className={`px-6 py-2 rounded-full font-medium text-sm transition-all ${
              activeTab === "posts"
                ? "bg-white text-black"
                : "bg-transparent text-gray-500 hover:text-gray-300"
            }`}
          >
            POSTS
          </button>
          <button
            onClick={() => setActiveTab("polls")}
            className={`px-6 py-2 rounded-full font-medium text-sm transition-all ${
              activeTab === "polls"
                ? "bg-white text-black"
                : "bg-transparent text-gray-500 hover:text-gray-300"
            }`}
          >
            POLLS
          </button>
          <button
            onClick={() => setActiveTab("comments")}
            className={`px-6 py-2 rounded-full font-medium text-sm transition-all ${
              activeTab === "comments"
                ? "bg-white text-black"
                : "bg-transparent text-gray-500 hover:text-gray-300"
            }`}
          >
            COMMENTS
          </button>
        </div>

        {/* Content */}
        {activeTab === "about" && (
          <div className="space-y-6">
            {/* Organization Header */}
            <div className="bg-[#1a1a1a] p-6">
              <div className="flex items-center justify-between mb-6">
                {/* Left: Logo and Name */}
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-[#22c55e] rounded flex items-center justify-center flex-shrink-0">
                    <Building className="w-6 h-6 text-white" />
                  </div>
                  <h2 className="text-white text-2xl font-normal">{organization.name}</h2>
                </div>

                {/* Right: Action Icons */}
                <div className="flex items-center gap-3">
                  <button className="text-gray-400 hover:text-white transition-colors p-2">
                    <Users className="w-5 h-5" />
                  </button>
                  <button className="text-gray-400 hover:text-white transition-colors p-2">
                    <Share2 className="w-5 h-5" />
                  </button>
                  <button className="text-gray-400 hover:text-white transition-colors p-2">
                    <Settings className="w-5 h-5" />
                  </button>
                  <button className="text-gray-400 hover:text-white transition-colors p-2">
                    <Bookmark className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Trust/Distrust Progress Bars */}
              <div className="flex gap-2 mb-6">
                <div
                  className="bg-[#7dd3fc] h-12 flex items-center justify-center rounded"
                  style={{ width: `${trustScores.trust}%` }}
                >
                  <span className="text-black font-semibold text-sm">
                    {Math.round((trustScores.trust / 100) * 1520)} ({trustScores.trust}%)
                  </span>
                </div>
                <div
                  className="bg-[#fb7185] h-12 flex items-center justify-center rounded"
                  style={{ width: `${trustScores.distrust}%` }}
                >
                  <span className="text-black font-semibold text-sm">
                    {Math.round((trustScores.distrust / 100) * 1520)} ({trustScores.distrust}%)
                  </span>
                </div>
              </div>

              {/* Description */}
              <p className="text-gray-400 text-sm leading-relaxed mb-8">
                {organization.description || "Welcome to the Web3 Privacy Collective, a community focused on privacy in the decentralized web. We unite enthusiasts and developers who believe privacy is a fundamental right. Join us for discussions, workshops, and events that empower individuals to secure their online presence."}
              </p>

              {/* INSIDERS Section */}
              <div className="mb-8">
                <h3 className="text-white text-sm font-semibold mb-4 uppercase">INSIDERS</h3>
                <div className="flex gap-6">
                  {[1, 2].map((i) => (
                    <div key={i} className="flex flex-col items-center">
                      <div className="w-16 h-16 bg-[#fb923c] rounded mb-2"></div>
                      <span className="text-gray-400 text-xs">tery_jang</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* TOP REVIEWS Section */}
              <div>
                <h3 className="text-white text-sm font-semibold mb-4 uppercase">TOP REVIEWS</h3>
                {reviews.length > 0 ? (
                  <div className="space-y-4">
                    {reviews.slice(0, 3).map((review: any) => (
                      <div key={review.id} className="bg-[#2a2a2a] p-4 rounded">
                        <div className="flex items-start gap-3 mb-4">
                          <div className={`flex items-center gap-2 px-3 py-1 rounded text-xs font-semibold ${
                            (review.upvotes || 0) >= (review.downvotes || 0) ? 'bg-[#7dd3fc] text-black' : 'bg-[#fb7185] text-black'
                          }`}>
                            {(review.upvotes || 0) >= (review.downvotes || 0) ? <ThumbsUp className="w-3 h-3" /> : <ThumbsDown className="w-3 h-3" />}
                            <span>{review.author?.username || 'Anonymous'}</span>
                          </div>
                          <div className="w-8 h-8 bg-[#22c55e] rounded flex items-center justify-center">
                            <Building className="w-4 h-4 text-white" />
                          </div>
                          <span className="text-gray-500 text-xs ml-auto">
                            {new Date(review.createdAt).toLocaleDateString()}
                          </span>
                        </div>

                        <h4 className="text-white font-medium mb-3">{review.title || 'Review'}</h4>
                        <p className="text-gray-400 text-sm leading-relaxed mb-3">
                          {review.content?.length > 200
                            ? `${review.content.substring(0, 200)}...`
                            : review.content}
                        </p>
                        {review.content?.length > 200 && (
                          <button
                            onClick={() => setLocation(`/posts/${review.id}`)}
                            className="text-gray-500 text-xs hover:text-gray-400 mb-4"
                          >
                            Read more...
                          </button>
                        )}

                        <div className="flex items-center gap-6 text-gray-400 text-sm">
                          <button className="flex items-center gap-2 hover:text-white transition-colors">
                            <ThumbsUp className="w-4 h-4" />
                            <span>{review.upvotes || 0}</span>
                          </button>
                          <button className="flex items-center gap-2 hover:text-white transition-colors">
                            <ThumbsDown className="w-4 h-4" />
                            <span>{review.downvotes || 0}</span>
                          </button>
                          <button className="flex items-center gap-2 hover:text-white transition-colors">
                            <MessageSquare className="w-4 h-4" />
                            <span>{review.commentCount || 0}</span>
                          </button>
                          <button className="hover:text-white transition-colors ml-auto">
                            <Bookmark className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-[#2a2a2a] p-4 rounded">
                    <div className="flex items-start gap-3 mb-4">
                      <div className="flex items-center gap-2 bg-[#7dd3fc] px-3 py-1 rounded text-black text-xs font-semibold">
                        <ThumbsUp className="w-3 h-3" />
                        <span className="text-black">user1234</span>
                      </div>
                      <div className="w-8 h-8 bg-[#22c55e] rounded flex items-center justify-center">
                        <Building className="w-4 h-4 text-white" />
                      </div>
                      <span className="text-gray-500 text-xs ml-auto">45 min ago</span>
                    </div>

                    <h4 className="text-white font-medium mb-3">The consumer chain</h4>
                    <p className="text-gray-400 text-sm leading-relaxed mb-3">
                      Most fun i ever had using a chain before TGE. honest truth, it's fill with games and doesn't fill like a meme coin ecosystem here is strong as well. There are a lot of gambling related apps but I think this really caters to consumers. Con...
                    </p>
                    <button className="text-gray-500 text-xs hover:text-gray-400 mb-4">
                      Read more...
                    </button>

                    <div className="flex items-center gap-6 text-gray-400 text-sm">
                      <button className="flex items-center gap-2 hover:text-white transition-colors">
                        <ThumbsUp className="w-4 h-4" />
                        <span>57</span>
                      </button>
                      <button className="flex items-center gap-2 hover:text-white transition-colors">
                        <ThumbsDown className="w-4 h-4" />
                        <span>57</span>
                      </button>
                      <button className="flex items-center gap-2 hover:text-white transition-colors">
                        <MessageSquare className="w-4 h-4" />
                        <span>23</span>
                      </button>
                      <button className="hover:text-white transition-colors ml-auto">
                        <Bookmark className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === "posts" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-white">Posts</h3>
              <Button
                onClick={() => setLocation(`/create-post?organizationId=${organization.id}`)}
                className="bg-green-500 hover:bg-green-600 text-white"
              >
                <PenSquare className="h-4 w-4 mr-2" />
                Create Post
              </Button>
            </div>

            {postsLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-32 bg-gray-800 rounded animate-pulse"></div>
                ))}
              </div>
            ) : posts.length > 0 ? (
              <div className="space-y-6">
                {posts.map((post: PostWithDetails) => (
                  <div key={post.id} className="bg-[#1a1a1a] border border-gray-800">
                    <PostCard post={post} onUpdate={emptyUpdateCallback} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-[#1a1a1a]">
                <MessageSquare className="h-12 w-12 text-gray-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">No posts yet</h3>
                <p className="text-gray-500 mb-6">Be the first to create a post!</p>
                <Button
                  onClick={() => setLocation(`/create-post?organizationId=${organization.id}`)}
                  className="bg-green-500 hover:bg-green-600 text-white"
                >
                  <PenSquare className="h-4 w-4 mr-2" />
                  Create First Post
                </Button>
              </div>
            )}
          </div>
        )}

        {activeTab === "polls" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-white">Polls</h3>
              <Button
                onClick={() => setLocation(`/create-post?organizationId=${organization.id}&type=poll`)}
                className="bg-green-500 hover:bg-green-600 text-white"
              >
                <BarChart3 className="h-4 w-4 mr-2" />
                Create Poll
              </Button>
            </div>

            {pollsLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-48 bg-gray-800 rounded animate-pulse"></div>
                ))}
              </div>
            ) : polls.length > 0 ? (
              <div className="space-y-6">
                {polls.map((poll: any) => (
                  <div key={poll.id} className="bg-[#1a1a1a] p-6">
                    <h3 className="text-lg font-semibold text-white mb-2">{poll.title}</h3>
                    <p className="text-gray-400 mb-4 text-sm">{poll.description}</p>
                    <div className="space-y-2">
                      {poll.options?.map((option: any, index: number) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-3 bg-[#2a2a2a] rounded"
                        >
                          <span className="text-sm text-gray-400">{option.text}</span>
                          <span className="text-sm text-gray-500">{option.votes || 0} votes</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-[#1a1a1a]">
                <BarChart3 className="h-12 w-12 text-gray-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">No polls yet</h3>
                <p className="text-gray-500 mb-6">Be the first to create a poll!</p>
                <Button
                  onClick={() => setLocation(`/create-post?organizationId=${organization.id}&type=poll`)}
                  className="bg-green-500 hover:bg-green-600 text-white"
                >
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Create First Poll
                </Button>
              </div>
            )}
          </div>
        )}

        {activeTab === "comments" && (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-white mb-4">Comments</h3>
            <div className="text-center py-12 bg-[#1a1a1a]">
              <MessageSquare className="h-12 w-12 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-500">Comments feature coming soon</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}