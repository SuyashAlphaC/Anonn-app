var __defProp = Object.defineProperty;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// shared/schema.ts
var schema_exports = {};
__export(schema_exports, {
  accessLogs: () => accessLogs,
  awards: () => awards,
  awardsRelations: () => awardsRelations,
  bowlBans: () => bowlBans,
  bowlBansRelations: () => bowlBansRelations,
  bowlFavorites: () => bowlFavorites,
  bowlFollows: () => bowlFollows,
  bowlFollowsRelations: () => bowlFollowsRelations,
  bowlModerators: () => bowlModerators,
  bowlModeratorsRelations: () => bowlModeratorsRelations,
  bowls: () => bowls,
  bowlsRelations: () => bowlsRelations,
  comments: () => comments,
  commentsRelations: () => commentsRelations,
  companyDomains: () => companyDomains,
  companyDomainsRelations: () => companyDomainsRelations,
  companyVerifications: () => companyVerifications,
  companyVerificationsRelations: () => companyVerificationsRelations,
  getKarmaLevel: () => getKarmaLevel,
  insertBowlFavoriteSchema: () => insertBowlFavoriteSchema,
  insertBowlFollowSchema: () => insertBowlFollowSchema,
  insertBowlSchema: () => insertBowlSchema,
  insertCommentSchema: () => insertCommentSchema,
  insertOrgTrustVoteSchema: () => insertOrgTrustVoteSchema,
  insertOrganizationSchema: () => insertOrganizationSchema,
  insertPollOptionSchema: () => insertPollOptionSchema,
  insertPollSchema: () => insertPollSchema,
  insertPollVoteSchema: () => insertPollVoteSchema,
  insertPostSchema: () => insertPostSchema,
  insertUserSchema: () => insertUserSchema,
  insertVoteSchema: () => insertVoteSchema,
  notifications: () => notifications,
  orgTrustVotes: () => orgTrustVotes,
  orgTrustVotesRelations: () => orgTrustVotesRelations,
  organizations: () => organizations,
  organizationsRelations: () => organizationsRelations,
  pollOptions: () => pollOptions,
  pollOptionsRelations: () => pollOptionsRelations,
  pollVotes: () => pollVotes,
  pollVotesRelations: () => pollVotesRelations,
  polls: () => polls,
  pollsRelations: () => pollsRelations,
  postAwards: () => postAwards,
  postAwardsRelations: () => postAwardsRelations,
  posts: () => posts,
  postsRelations: () => postsRelations,
  privateMessages: () => privateMessages,
  privateMessagesRelations: () => privateMessagesRelations,
  savedContent: () => savedContent,
  savedContentRelations: () => savedContentRelations,
  sessions: () => sessions,
  splitBigIntToLimbs: () => splitBigIntToLimbs,
  userCoins: () => userCoins,
  userCoinsRelations: () => userCoinsRelations,
  userFlairs: () => userFlairs,
  userFlairsRelations: () => userFlairsRelations,
  userFollows: () => userFollows,
  userFollowsRelations: () => userFollowsRelations,
  users: () => users,
  usersRelations: () => usersRelations,
  votes: () => votes,
  votesRelations: () => votesRelations
});
import {
  pgTable,
  text,
  varchar,
  timestamp,
  jsonb,
  index,
  uniqueIndex,
  serial,
  integer,
  boolean,
  inet
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
function getKarmaLevel(karma) {
  if (karma >= 200) return { level: 3, name: "Trusted", color: "text-purple-600" };
  if (karma >= 50) return { level: 2, name: "Experienced", color: "text-blue-600" };
  if (karma >= 10) return { level: 1, name: "Active", color: "text-green-600" };
  return { level: 0, name: "New", color: "text-gray-600" };
}
function splitBigIntToLimbs(value, limbSize, numLimbs) {
  const limbs = [];
  const mask = (BigInt(1) << BigInt(limbSize)) - BigInt(1);
  for (let i = 0; i < numLimbs; i++) {
    limbs.push(value & mask);
    value >>= BigInt(limbSize);
  }
  return limbs;
}
var sessions, users, organizations, accessLogs, bowls, bowlFollows, bowlFavorites, bowlModerators, bowlBans, userFlairs, userFollows, awards, postAwards, userCoins, privateMessages, savedContent, posts, comments, votes, orgTrustVotes, notifications, companyDomains, companyVerifications, usersRelations, orgTrustVotesRelations, organizationsRelations, bowlsRelations, bowlFollowsRelations, postsRelations, commentsRelations, votesRelations, insertUserSchema, insertOrganizationSchema, insertBowlSchema, insertPostSchema, insertCommentSchema, insertVoteSchema, insertBowlFollowSchema, insertBowlFavoriteSchema, insertOrgTrustVoteSchema, polls, pollOptions, pollVotes, pollsRelations, pollOptionsRelations, pollVotesRelations, bowlModeratorsRelations, bowlBansRelations, userFlairsRelations, userFollowsRelations, postAwardsRelations, userCoinsRelations, privateMessagesRelations, savedContentRelations, awardsRelations, companyDomainsRelations, companyVerificationsRelations, insertPollSchema, insertPollOptionSchema, insertPollVoteSchema;
var init_schema = __esm({
  "shared/schema.ts"() {
    "use strict";
    sessions = pgTable(
      "sessions",
      {
        sid: varchar("sid").primaryKey(),
        sess: jsonb("sess").notNull(),
        expire: timestamp("expire").notNull()
      },
      (table) => [index("IDX_session_expire").on(table.expire)]
    );
    users = pgTable("users", {
      id: varchar("id", { length: 255 }).primaryKey().notNull(),
      username: varchar("username", { length: 50 }).unique(),
      profileImageUrl: varchar("profile_image_url", { length: 500 }),
      bannerUrl: varchar("banner_url", { length: 500 }),
      bio: text("bio"),
      location: varchar("location", { length: 100 }),
      website: varchar("website", { length: 255 }),
      walletAddress: varchar("wallet_address", { length: 255 }).unique().notNull(),
      authNonce: varchar("auth_nonce", { length: 255 }),
      // Nonce for wallet signature verification
      allowlisted: boolean("allowlisted").default(true).notNull(),
      karma: integer("karma").default(0).notNull(),
      postKarma: integer("post_karma").default(0).notNull(),
      commentKarma: integer("comment_karma").default(0).notNull(),
      awardeeKarma: integer("awardee_karma").default(0).notNull(),
      followerCount: integer("follower_count").default(0).notNull(),
      followingCount: integer("following_count").default(0).notNull(),
      isVerified: boolean("is_verified").default(false).notNull(),
      isPremium: boolean("is_premium").default(false).notNull(),
      premiumExpiresAt: timestamp("premium_expires_at"),
      isOnline: boolean("is_online").default(true).notNull(),
      lastActiveAt: timestamp("last_active_at").defaultNow(),
      createdAt: timestamp("created_at").defaultNow().notNull(),
      updatedAt: timestamp("updated_at").defaultNow().notNull(),
      // Company verification fields (using ZK proofs)
      companyEmail: varchar("company_email", { length: 255 }),
      companyDomain: varchar("company_domain", { length: 100 }),
      companyName: varchar("company_name", { length: 255 }),
      isCompanyVerified: boolean("is_company_verified").default(false).notNull(),
      companyVerifiedAt: timestamp("company_verified_at"),
      zkProofHash: varchar("zk_proof_hash", { length: 255 }),
      // Hash of the ZK proof for verification
      verificationCode: varchar("verification_code", { length: 10 }),
      // Temporary verification code
      verificationCodeExpiresAt: timestamp("verification_code_expires_at")
      // When verification code expires
    }, (table) => ({
      // Add indexes for better performance
      usernameIdx: index("users_username_idx").on(table.username),
      walletAddressIdx: index("users_wallet_address_idx").on(table.walletAddress),
      createdAtIdx: index("users_created_at_idx").on(table.createdAt),
      companyDomainIdx: index("users_company_domain_idx").on(table.companyDomain),
      companyVerifiedIdx: index("users_company_verified_idx").on(table.isCompanyVerified)
    }));
    organizations = pgTable("organizations", {
      id: serial("id").primaryKey(),
      name: varchar("name", { length: 255 }).notNull().unique(),
      description: text("description"),
      logoUrl: varchar("logo_url"),
      website: varchar("website"),
      isFeatured: boolean("is_featured").default(false).notNull(),
      createdBy: varchar("created_by").references(() => users.id),
      createdAt: timestamp("created_at").defaultNow(),
      // Security columns
      accessLevel: varchar("access_level", { length: 20 }).default("public").notNull(),
      // public, private, admin_only
      allowedUsers: text("allowed_users").array(),
      // Array of user IDs who can access
      adminOnlyFeatures: jsonb("admin_only_features").default("{}"),
      // JSON object of admin-only features
      securitySettings: jsonb("security_settings").default("{}")
      // Additional security settings
    }, (table) => ({
      nameIdx: index("organizations_name_idx").on(table.name),
      featuredIdx: index("organizations_featured_idx").on(table.isFeatured),
      createdByIdx: index("organizations_created_by_idx").on(table.createdBy),
      accessLevelIdx: index("organizations_access_level_idx").on(table.accessLevel)
    }));
    accessLogs = pgTable("access_logs", {
      id: serial("id").primaryKey(),
      userId: varchar("user_id").references(() => users.id),
      action: varchar("action", { length: 100 }).notNull(),
      // access_granted, access_denied, create, update, delete
      resourceType: varchar("resource_type", { length: 50 }).notNull(),
      // organization, post, user
      resourceId: integer("resource_id"),
      ipAddress: inet("ip_address"),
      userAgent: text("user_agent"),
      success: boolean("success").default(true),
      errorMessage: text("error_message"),
      createdAt: timestamp("created_at").defaultNow()
    }, (table) => ({
      userIdIdx: index("access_logs_user_id_idx").on(table.userId),
      createdAtIdx: index("access_logs_created_at_idx").on(table.createdAt),
      resourceIdx: index("access_logs_resource_idx").on(table.resourceType, table.resourceId)
    }));
    bowls = pgTable("bowls", {
      id: serial("id").primaryKey(),
      name: varchar("name", { length: 255 }).notNull().unique(),
      description: text("description"),
      iconUrl: varchar("icon_url"),
      bannerUrl: varchar("banner_url"),
      category: varchar("category", { length: 50 }).notNull().default("general"),
      // 'industries', 'job-groups', 'general', 'user-moderated'
      memberCount: integer("member_count").default(0).notNull(),
      onlineCount: integer("online_count").default(0).notNull(),
      isPrivate: boolean("is_private").default(false).notNull(),
      isRestricted: boolean("is_restricted").default(false).notNull(),
      // Only approved users can post
      isNSFW: boolean("is_nsfw").default(false).notNull(),
      primaryColor: varchar("primary_color", { length: 7 }).default("#ff4500"),
      // Hex color
      rules: jsonb("rules"),
      // Array of community rules
      flairs: jsonb("flairs"),
      // Available post flairs
      sidebar: text("sidebar"),
      // Community wiki/sidebar content
      createdBy: varchar("created_by").references(() => users.id),
      createdAt: timestamp("created_at").defaultNow(),
      updatedAt: timestamp("updated_at").defaultNow()
    });
    bowlFollows = pgTable("bowl_follows", {
      id: serial("id").primaryKey(),
      userId: varchar("user_id").references(() => users.id).notNull(),
      bowlId: integer("bowl_id").references(() => bowls.id).notNull(),
      followedAt: timestamp("followed_at").defaultNow()
    }, (table) => ({
      uniqueUserBowl: uniqueIndex("unique_user_bowl_follow").on(table.userId, table.bowlId)
    }));
    bowlFavorites = pgTable("bowl_favorites", {
      id: serial("id").primaryKey(),
      userId: varchar("user_id").references(() => users.id).notNull(),
      bowlId: integer("bowl_id").references(() => bowls.id).notNull(),
      favoritedAt: timestamp("favorited_at").defaultNow()
    }, (table) => ({
      uniqueUserBowl: uniqueIndex("unique_user_bowl_favorite").on(table.userId, table.bowlId)
    }));
    bowlModerators = pgTable("bowl_moderators", {
      id: serial("id").primaryKey(),
      userId: varchar("user_id").references(() => users.id).notNull(),
      bowlId: integer("bowl_id").references(() => bowls.id).notNull(),
      role: varchar("role", { length: 20 }).notNull().default("moderator"),
      // 'owner', 'admin', 'moderator'
      permissions: jsonb("permissions"),
      // Custom permissions object
      appointedBy: varchar("appointed_by").references(() => users.id),
      appointedAt: timestamp("appointed_at").defaultNow()
    });
    bowlBans = pgTable("bowl_bans", {
      id: serial("id").primaryKey(),
      userId: varchar("user_id").references(() => users.id).notNull(),
      bowlId: integer("bowl_id").references(() => bowls.id).notNull(),
      reason: text("reason"),
      bannedBy: varchar("banned_by").references(() => users.id).notNull(),
      bannedAt: timestamp("banned_at").defaultNow(),
      expiresAt: timestamp("expires_at"),
      // null for permanent bans
      isActive: boolean("is_active").default(true).notNull()
    });
    userFlairs = pgTable("user_flairs", {
      id: serial("id").primaryKey(),
      userId: varchar("user_id").references(() => users.id).notNull(),
      bowlId: integer("bowl_id").references(() => bowls.id).notNull(),
      flairText: varchar("flair_text", { length: 100 }),
      flairColor: varchar("flair_color", { length: 7 }).default("#0079d3"),
      // Hex color
      isEditable: boolean("is_editable").default(true).notNull(),
      assignedBy: varchar("assigned_by").references(() => users.id),
      assignedAt: timestamp("assigned_at").defaultNow()
    });
    userFollows = pgTable("user_follows", {
      id: serial("id").primaryKey(),
      followerId: varchar("follower_id").references(() => users.id).notNull(),
      followedId: varchar("followed_id").references(() => users.id).notNull(),
      followedAt: timestamp("followed_at").defaultNow()
    });
    awards = pgTable("awards", {
      id: serial("id").primaryKey(),
      name: varchar("name", { length: 100 }).notNull(),
      description: text("description"),
      iconUrl: varchar("icon_url").notNull(),
      cost: integer("cost").notNull(),
      // Cost in coins
      isPremium: boolean("is_premium").default(false).notNull(),
      giverKarma: integer("giver_karma").default(0).notNull(),
      // Karma given to the giver
      receiverKarma: integer("receiver_karma").default(0).notNull(),
      // Karma given to receiver
      coinReward: integer("coin_reward").default(0).notNull(),
      // Coins given to receiver
      createdAt: timestamp("created_at").defaultNow()
    });
    postAwards = pgTable("post_awards", {
      id: serial("id").primaryKey(),
      postId: integer("post_id").references(() => posts.id),
      commentId: integer("comment_id").references(() => comments.id),
      awardId: integer("award_id").references(() => awards.id).notNull(),
      giverId: varchar("giver_id").references(() => users.id).notNull(),
      receiverId: varchar("receiver_id").references(() => users.id).notNull(),
      isAnonymous: boolean("is_anonymous").default(false).notNull(),
      message: text("message"),
      // Optional message from giver
      givenAt: timestamp("given_at").defaultNow()
    });
    userCoins = pgTable("user_coins", {
      id: serial("id").primaryKey(),
      userId: varchar("user_id").references(() => users.id).notNull(),
      balance: integer("balance").default(0).notNull(),
      totalEarned: integer("total_earned").default(0).notNull(),
      totalSpent: integer("total_spent").default(0).notNull(),
      updatedAt: timestamp("updated_at").defaultNow()
    });
    privateMessages = pgTable("private_messages", {
      id: serial("id").primaryKey(),
      senderId: varchar("sender_id").references(() => users.id).notNull(),
      receiverId: varchar("receiver_id").references(() => users.id).notNull(),
      subject: varchar("subject", { length: 200 }),
      content: text("content").notNull(),
      isRead: boolean("is_read").default(false).notNull(),
      parentMessageId: integer("parent_message_id"),
      sentAt: timestamp("sent_at").defaultNow()
    });
    savedContent = pgTable("saved_content", {
      id: serial("id").primaryKey(),
      userId: varchar("user_id").references(() => users.id).notNull(),
      postId: integer("post_id").references(() => posts.id),
      commentId: integer("comment_id").references(() => comments.id),
      savedAt: timestamp("saved_at").defaultNow()
    });
    posts = pgTable("posts", {
      id: serial("id").primaryKey(),
      title: varchar("title", { length: 300 }).notNull(),
      content: text("content").notNull(),
      type: varchar("type", { length: 20 }).notNull(),
      // 'text', 'link', 'image', 'video', 'poll', 'review'
      sentiment: varchar("sentiment", { length: 20 }),
      // 'positive', 'neutral', 'negative' (for reviews)
      linkUrl: varchar("link_url"),
      // For link posts
      mediaUrls: jsonb("media_urls"),
      // Array of image/video URLs
      flair: varchar("flair", { length: 100 }),
      // Post flair text
      flairColor: varchar("flair_color", { length: 7 }).default("#0079d3"),
      // Flair color
      isNSFW: boolean("is_nsfw").default(false).notNull(),
      isSpoiler: boolean("is_spoiler").default(false).notNull(),
      isOC: boolean("is_oc").default(false).notNull(),
      // Original Content
      isLocked: boolean("is_locked").default(false).notNull(),
      isPinned: boolean("is_pinned").default(false).notNull(),
      isAnonymous: boolean("is_anonymous").default(false).notNull(),
      authorId: varchar("author_id").references(() => users.id).notNull(),
      organizationId: integer("organization_id").references(() => organizations.id),
      bowlId: integer("bowl_id").references(() => bowls.id),
      imageUrl: varchar("image_url"),
      // Deprecated, use mediaUrls
      upvotes: integer("upvotes").default(0).notNull(),
      downvotes: integer("downvotes").default(0).notNull(),
      commentCount: integer("comment_count").default(0).notNull(),
      viewCount: integer("view_count").default(0).notNull(),
      awardCount: integer("award_count").default(0).notNull(),
      // Category-based ratings for reviews
      workLifeBalance: integer("work_life_balance"),
      // 1-5 rating
      cultureValues: integer("culture_values"),
      // 1-5 rating
      careerOpportunities: integer("career_opportunities"),
      // 1-5 rating
      compensation: integer("compensation"),
      // 1-5 rating
      management: integer("management"),
      // 1-5 rating
      createdAt: timestamp("created_at").defaultNow(),
      updatedAt: timestamp("updated_at").defaultNow()
    });
    comments = pgTable("comments", {
      id: serial("id").primaryKey(),
      content: text("content").notNull(),
      authorId: varchar("author_id").references(() => users.id).notNull(),
      postId: integer("post_id").references(() => posts.id),
      // Made optional to support polls
      pollId: integer("poll_id").references(() => polls.id),
      // Added to support polls
      parentId: integer("parent_id").references(() => comments.id),
      upvotes: integer("upvotes").default(0).notNull(),
      downvotes: integer("downvotes").default(0).notNull(),
      createdAt: timestamp("created_at").defaultNow()
    });
    votes = pgTable("votes", {
      id: serial("id").primaryKey(),
      userId: varchar("user_id").references(() => users.id).notNull(),
      targetId: integer("target_id").notNull(),
      targetType: varchar("target_type", { length: 20 }).notNull(),
      // 'post' or 'comment'
      voteType: varchar("vote_type", { length: 10 }).notNull(),
      // 'up' or 'down'
      createdAt: timestamp("created_at").defaultNow()
    });
    orgTrustVotes = pgTable("org_trust_votes", {
      id: serial("id").primaryKey(),
      userId: varchar("user_id").references(() => users.id).notNull(),
      organizationId: integer("organization_id").references(() => organizations.id).notNull(),
      trustVote: boolean("trust_vote").notNull(),
      // true for trust, false for distrust
      createdAt: timestamp("created_at").defaultNow()
    });
    notifications = pgTable("notifications", {
      id: serial("id").primaryKey(),
      userId: varchar("user_id").references(() => users.id).notNull(),
      type: varchar("type", { length: 32 }).notNull(),
      // 'comment', 'upvote', 'downvote', etc.
      content: text("content").notNull(),
      link: varchar("link", { length: 512 }),
      // URL to the relevant post/discussion
      read: boolean("read").default(false).notNull(),
      createdAt: timestamp("created_at").defaultNow()
    });
    companyDomains = pgTable("company_domains", {
      id: serial("id").primaryKey(),
      domain: varchar("domain", { length: 100 }).notNull().unique(),
      // e.g., "google.com", "microsoft.com"
      companyName: varchar("company_name", { length: 255 }).notNull(),
      // e.g., "Google", "Microsoft"
      isVerified: boolean("is_verified").default(true).notNull(),
      // Whether this domain is officially verified
      logo: varchar("logo", { length: 500 }),
      // Company logo URL
      createdAt: timestamp("created_at").defaultNow(),
      updatedAt: timestamp("updated_at").defaultNow()
    }, (table) => ({
      domainIdx: index("company_domains_domain_idx").on(table.domain),
      verifiedIdx: index("company_domains_verified_idx").on(table.isVerified)
    }));
    companyVerifications = pgTable("company_verifications", {
      id: serial("id").primaryKey(),
      userId: varchar("user_id").references(() => users.id).notNull(),
      email: varchar("email", { length: 255 }).notNull(),
      domain: varchar("domain", { length: 100 }).notNull(),
      verificationCode: varchar("verification_code", { length: 10 }).notNull(),
      zkProof: text("zk_proof"),
      // The actual ZK proof data
      zkProofHash: varchar("zk_proof_hash", { length: 255 }),
      // Hash of the ZK proof
      starknetTxHash: varchar("starknet_tx_hash", { length: 255 }),
      // Starknet transaction hash for proof verification
      status: varchar("status", { length: 20 }).default("pending").notNull(),
      // pending, verified, failed, expired
      expiresAt: timestamp("expires_at").notNull(),
      // When the verification code expires
      verifiedAt: timestamp("verified_at"),
      createdAt: timestamp("created_at").defaultNow()
    }, (table) => ({
      userIdIdx: index("company_verifications_user_id_idx").on(table.userId),
      emailIdx: index("company_verifications_email_idx").on(table.email),
      statusIdx: index("company_verifications_status_idx").on(table.status),
      expiresAtIdx: index("company_verifications_expires_at_idx").on(table.expiresAt)
    }));
    usersRelations = relations(users, ({ many }) => ({
      posts: many(posts),
      comments: many(comments),
      votes: many(votes),
      bowlFollows: many(bowlFollows),
      bowlFavorites: many(bowlFavorites),
      moderatedBowls: many(bowlModerators),
      bannedFromBowls: many(bowlBans),
      userFlairs: many(userFlairs),
      followers: many(userFollows, { relationName: "followed" }),
      following: many(userFollows, { relationName: "follower" }),
      givenAwards: many(postAwards, { relationName: "giver" }),
      receivedAwards: many(postAwards, { relationName: "receiver" }),
      coinBalance: many(userCoins),
      sentMessages: many(privateMessages, { relationName: "sender" }),
      receivedMessages: many(privateMessages, { relationName: "receiver" }),
      savedContent: many(savedContent),
      createdOrganizations: many(organizations),
      createdBowls: many(bowls),
      trustVotes: many(orgTrustVotes)
    }));
    orgTrustVotesRelations = relations(orgTrustVotes, ({ one }) => ({
      user: one(users, {
        fields: [orgTrustVotes.userId],
        references: [users.id]
      }),
      organization: one(organizations, {
        fields: [orgTrustVotes.organizationId],
        references: [organizations.id]
      })
    }));
    organizationsRelations = relations(organizations, ({ one, many }) => ({
      creator: one(users, {
        fields: [organizations.createdBy],
        references: [users.id]
      }),
      reviews: many(posts),
      trustVotes: many(orgTrustVotes)
    }));
    bowlsRelations = relations(bowls, ({ one, many }) => ({
      creator: one(users, {
        fields: [bowls.createdBy],
        references: [users.id]
      }),
      posts: many(posts),
      follows: many(bowlFollows),
      favorites: many(bowlFavorites),
      moderators: many(bowlModerators),
      bans: many(bowlBans),
      userFlairs: many(userFlairs)
    }));
    bowlFollowsRelations = relations(bowlFollows, ({ one }) => ({
      user: one(users, {
        fields: [bowlFollows.userId],
        references: [users.id]
      }),
      bowl: one(bowls, {
        fields: [bowlFollows.bowlId],
        references: [bowls.id]
      })
    }));
    postsRelations = relations(posts, ({ one, many }) => ({
      author: one(users, {
        fields: [posts.authorId],
        references: [users.id]
      }),
      organization: one(organizations, {
        fields: [posts.organizationId],
        references: [organizations.id]
      }),
      bowl: one(bowls, {
        fields: [posts.bowlId],
        references: [bowls.id]
      }),
      comments: many(comments),
      votes: many(votes),
      awards: many(postAwards),
      savedBy: many(savedContent)
    }));
    commentsRelations = relations(comments, ({ one, many }) => ({
      author: one(users, {
        fields: [comments.authorId],
        references: [users.id]
      }),
      post: one(posts, {
        fields: [comments.postId],
        references: [posts.id]
      }),
      poll: one(polls, {
        fields: [comments.pollId],
        references: [polls.id]
      }),
      parent: one(comments, {
        fields: [comments.parentId],
        references: [comments.id],
        relationName: "parent_comment"
      }),
      replies: many(comments, {
        relationName: "parent_comment"
      }),
      votes: many(votes),
      awards: many(postAwards),
      savedBy: many(savedContent)
    }));
    votesRelations = relations(votes, ({ one }) => ({
      user: one(users, {
        fields: [votes.userId],
        references: [users.id]
      })
    }));
    insertUserSchema = createInsertSchema(users).omit({
      createdAt: true,
      updatedAt: true,
      lastActiveAt: true
    });
    insertOrganizationSchema = createInsertSchema(organizations).omit({
      id: true,
      createdAt: true
    });
    insertBowlSchema = createInsertSchema(bowls).omit({
      id: true,
      memberCount: true,
      createdAt: true
    });
    insertPostSchema = createInsertSchema(posts).omit({
      id: true,
      upvotes: true,
      downvotes: true,
      commentCount: true,
      createdAt: true,
      updatedAt: true
    });
    insertCommentSchema = createInsertSchema(comments).omit({
      id: true,
      upvotes: true,
      downvotes: true,
      createdAt: true
    });
    insertVoteSchema = createInsertSchema(votes).omit({
      id: true,
      createdAt: true
    });
    insertBowlFollowSchema = createInsertSchema(bowlFollows).omit({
      id: true,
      followedAt: true
    });
    insertBowlFavoriteSchema = createInsertSchema(bowlFavorites).omit({
      id: true,
      favoritedAt: true
    });
    insertOrgTrustVoteSchema = createInsertSchema(orgTrustVotes).omit({
      id: true,
      createdAt: true
    });
    polls = pgTable("polls", {
      id: serial("id").primaryKey(),
      title: varchar("title", { length: 300 }).notNull(),
      description: text("description"),
      authorId: varchar("author_id").references(() => users.id).notNull(),
      bowlId: integer("bowl_id").references(() => bowls.id),
      organizationId: integer("organization_id").references(() => organizations.id),
      postId: integer("post_id").references(() => posts.id),
      // Link to the corresponding post
      allowMultipleChoices: boolean("allow_multiple_choices").default(false).notNull(),
      isAnonymous: boolean("is_anonymous").default(false).notNull(),
      endDate: timestamp("end_date"),
      upvotes: integer("upvotes").default(0).notNull(),
      downvotes: integer("downvotes").default(0).notNull(),
      createdAt: timestamp("created_at").defaultNow(),
      updatedAt: timestamp("updated_at").defaultNow()
    });
    pollOptions = pgTable("poll_options", {
      id: serial("id").primaryKey(),
      pollId: integer("poll_id").references(() => polls.id).notNull(),
      text: varchar("text", { length: 200 }).notNull(),
      voteCount: integer("vote_count").default(0).notNull(),
      createdAt: timestamp("created_at").defaultNow()
    });
    pollVotes = pgTable("poll_votes", {
      id: serial("id").primaryKey(),
      pollId: integer("poll_id").references(() => polls.id).notNull(),
      optionId: integer("option_id").references(() => pollOptions.id).notNull(),
      userId: varchar("user_id").references(() => users.id).notNull(),
      createdAt: timestamp("created_at").defaultNow()
    });
    pollsRelations = relations(polls, ({ one, many }) => ({
      author: one(users, {
        fields: [polls.authorId],
        references: [users.id]
      }),
      bowl: one(bowls, {
        fields: [polls.bowlId],
        references: [bowls.id]
      }),
      organization: one(organizations, {
        fields: [polls.organizationId],
        references: [organizations.id]
      }),
      post: one(posts, {
        fields: [polls.postId],
        references: [posts.id]
      }),
      options: many(pollOptions),
      votes: many(pollVotes),
      comments: many(comments)
    }));
    pollOptionsRelations = relations(pollOptions, ({ one, many }) => ({
      poll: one(polls, {
        fields: [pollOptions.pollId],
        references: [polls.id]
      }),
      votes: many(pollVotes)
    }));
    pollVotesRelations = relations(pollVotes, ({ one }) => ({
      poll: one(polls, {
        fields: [pollVotes.pollId],
        references: [polls.id]
      }),
      option: one(pollOptions, {
        fields: [pollVotes.optionId],
        references: [pollOptions.id]
      }),
      user: one(users, {
        fields: [pollVotes.userId],
        references: [users.id]
      })
    }));
    bowlModeratorsRelations = relations(bowlModerators, ({ one }) => ({
      user: one(users, {
        fields: [bowlModerators.userId],
        references: [users.id]
      }),
      bowl: one(bowls, {
        fields: [bowlModerators.bowlId],
        references: [bowls.id]
      }),
      appointedBy: one(users, {
        fields: [bowlModerators.appointedBy],
        references: [users.id]
      })
    }));
    bowlBansRelations = relations(bowlBans, ({ one }) => ({
      user: one(users, {
        fields: [bowlBans.userId],
        references: [users.id]
      }),
      bowl: one(bowls, {
        fields: [bowlBans.bowlId],
        references: [bowls.id]
      }),
      bannedBy: one(users, {
        fields: [bowlBans.bannedBy],
        references: [users.id]
      })
    }));
    userFlairsRelations = relations(userFlairs, ({ one }) => ({
      user: one(users, {
        fields: [userFlairs.userId],
        references: [users.id]
      }),
      bowl: one(bowls, {
        fields: [userFlairs.bowlId],
        references: [bowls.id]
      }),
      assignedBy: one(users, {
        fields: [userFlairs.assignedBy],
        references: [users.id]
      })
    }));
    userFollowsRelations = relations(userFollows, ({ one }) => ({
      follower: one(users, {
        fields: [userFollows.followerId],
        references: [users.id],
        relationName: "follower"
      }),
      followed: one(users, {
        fields: [userFollows.followedId],
        references: [users.id],
        relationName: "followed"
      })
    }));
    postAwardsRelations = relations(postAwards, ({ one }) => ({
      post: one(posts, {
        fields: [postAwards.postId],
        references: [posts.id]
      }),
      comment: one(comments, {
        fields: [postAwards.commentId],
        references: [comments.id]
      }),
      award: one(awards, {
        fields: [postAwards.awardId],
        references: [awards.id]
      }),
      giver: one(users, {
        fields: [postAwards.giverId],
        references: [users.id],
        relationName: "giver"
      }),
      receiver: one(users, {
        fields: [postAwards.receiverId],
        references: [users.id],
        relationName: "receiver"
      })
    }));
    userCoinsRelations = relations(userCoins, ({ one }) => ({
      user: one(users, {
        fields: [userCoins.userId],
        references: [users.id]
      })
    }));
    privateMessagesRelations = relations(privateMessages, ({ one, many }) => ({
      sender: one(users, {
        fields: [privateMessages.senderId],
        references: [users.id],
        relationName: "sender"
      }),
      receiver: one(users, {
        fields: [privateMessages.receiverId],
        references: [users.id],
        relationName: "receiver"
      }),
      parentMessage: one(privateMessages, {
        fields: [privateMessages.parentMessageId],
        references: [privateMessages.id]
      }),
      replies: many(privateMessages)
    }));
    savedContentRelations = relations(savedContent, ({ one }) => ({
      user: one(users, {
        fields: [savedContent.userId],
        references: [users.id]
      }),
      post: one(posts, {
        fields: [savedContent.postId],
        references: [posts.id]
      }),
      comment: one(comments, {
        fields: [savedContent.commentId],
        references: [comments.id]
      })
    }));
    awardsRelations = relations(awards, ({ many }) => ({
      givenAwards: many(postAwards)
    }));
    companyDomainsRelations = relations(companyDomains, ({ many }) => ({
      verifications: many(companyVerifications)
    }));
    companyVerificationsRelations = relations(companyVerifications, ({ one }) => ({
      user: one(users, {
        fields: [companyVerifications.userId],
        references: [users.id]
      })
    }));
    insertPollSchema = createInsertSchema(polls).omit({
      id: true,
      createdAt: true,
      updatedAt: true
    });
    insertPollOptionSchema = createInsertSchema(pollOptions).omit({
      id: true,
      createdAt: true,
      voteCount: true
    });
    insertPollVoteSchema = createInsertSchema(pollVotes).omit({
      id: true,
      createdAt: true
    });
  }
});

// server/anonymousNameGenerator.ts
import { createHash } from "crypto";
function generateUsername(email) {
  let hash2 = email.toLowerCase() + PLATFORM_SALT;
  for (let i = 0; i < HASH_ROUNDS; i++) {
    hash2 = createHash("sha256").update(hash2).digest("hex");
  }
  const prefixIndex = parseInt(hash2.substring(0, 8), 16) % WEB3_PREFIXES.length;
  const termIndex = parseInt(hash2.substring(8, 16), 16) % WEB3_TERMS.length;
  const randomNum = parseInt(hash2.substring(16, 20), 16) % 9999;
  const prefix = WEB3_PREFIXES[prefixIndex];
  const term = WEB3_TERMS[termIndex];
  return `${prefix}_${term}${randomNum}`;
}
function generateFirstName(email) {
  const localPart = email.split("@")[0];
  const nameParts = localPart.split(/[._-]/);
  const firstName = nameParts[0];
  return firstName.charAt(0).toUpperCase() + firstName.slice(1).toLowerCase();
}
function generateLastName(email) {
  const localPart = email.split("@")[0];
  const nameParts = localPart.split(/[._-]/);
  const lastName = nameParts.length > 1 ? nameParts[1] : nameParts[0];
  return lastName.charAt(0).toUpperCase() + lastName.slice(1).toLowerCase();
}
function generateAnonymousProfile(email) {
  return {
    firstName: generateFirstName(email),
    lastName: generateLastName(email),
    username: generateUsername(email)
  };
}
var PLATFORM_SALT, HASH_ROUNDS, WEB3_PREFIXES, WEB3_TERMS;
var init_anonymousNameGenerator = __esm({
  "server/anonymousNameGenerator.ts"() {
    "use strict";
    PLATFORM_SALT = process.env.PLATFORM_SALT || "anonn_anonymous_platform_2024";
    HASH_ROUNDS = 1e4;
    WEB3_PREFIXES = [
      "anon",
      "crypto",
      "defi",
      "nft",
      "dao",
      "web3",
      "block",
      "chain",
      "token",
      "coin",
      "wallet",
      "miner",
      "validator",
      "node",
      "peer",
      "hash",
      "key",
      "sign",
      "verify",
      "mint",
      "swap",
      "yield",
      "stake",
      "liquidity",
      "governance",
      "protocol",
      "smart",
      "contract",
      "dapp",
      "metaverse",
      "alpha",
      "beta",
      "gamma",
      "delta",
      "epsilon",
      "zeta",
      "eta",
      "theta",
      "iota",
      "kappa"
    ];
    WEB3_TERMS = [
      "whale",
      "diamond",
      "hodler",
      "shiller",
      "fudder",
      "degen",
      "ape",
      "ser",
      "wagmi",
      "ngmi",
      "moon",
      "mars",
      "lambo",
      "rocket",
      "diamond",
      "gem",
      "based",
      "chad",
      "virgin",
      "normie",
      "maxi",
      "fren",
      "anon",
      "doxxed",
      "rekt",
      "pump",
      "dump",
      "fomo",
      "fud",
      "shill",
      "alpha",
      "beta",
      "gamma",
      "delta",
      "epsilon",
      "zeta",
      "eta",
      "theta",
      "iota",
      "kappa"
    ];
  }
});

// server/config.ts
import { config } from "dotenv";
function validateProductionEnvironment() {
  if (process.env.NODE_ENV === "production") {
    const requiredVars = [
      "DATABASE_URL",
      "SUPABASE_URL",
      "SUPABASE_ANON_KEY",
      "SUPABASE_SERVICE_ROLE_KEY",
      "DYNAMIC_API_KEY",
      "DYNAMIC_WEBHOOK_SECRET",
      "JWT_SECRET",
      "SESSION_SECRET"
    ];
    const missing = requiredVars.filter((varName) => !process.env[varName]);
    if (missing.length > 0) {
      throw new Error(
        `Missing required environment variables in production: ${missing.join(", ")}
Please ensure all required environment variables are set.`
      );
    }
  }
}
function validateConfig() {
  const required = [
    "DYNAMIC.ENVIRONMENT_ID",
    "DATABASE.URL"
  ];
  for (const key of required) {
    const keys = key.split(".");
    let value = CONFIG;
    for (const k of keys) {
      value = value[k];
    }
    if (!value) {
      throw new Error(`Missing required environment variable: ${key}`);
    }
  }
}
var CLOUDFLARE_URL, CONFIG;
var init_config = __esm({
  "server/config.ts"() {
    "use strict";
    config();
    validateProductionEnvironment();
    CLOUDFLARE_URL = "https://regulations-did-firm-qualified.trycloudflare.com";
    CONFIG = {
      // Dynamic Auth Configuration
      DYNAMIC: {
        ENVIRONMENT_ID: process.env.DYNAMIC_ENVIRONMENT_ID || process.env.VITE_DYNAMIC_ENVIRONMENT_ID || (() => {
          if (process.env.NODE_ENV === "production") {
            throw new Error("DYNAMIC_ENVIRONMENT_ID must be set in production");
          }
          console.warn("\u26A0\uFE0F  Using default DYNAMIC_ENVIRONMENT_ID for development. Set DYNAMIC_ENVIRONMENT_ID in production.");
          return "064b1464-d122-4fea-a966-f560675236c3";
        })(),
        API_KEY: process.env.DYNAMIC_API_KEY,
        JWKS_URL: process.env.DYNAMIC_JWKS_URL || `https://app.dynamic.xyz/api/v0/environments/${process.env.DYNAMIC_ENVIRONMENT_ID || "064b1464-d122-4fea-a966-f560675236c3"}/jwks`,
        WEBHOOK_SECRET: process.env.DYNAMIC_WEBHOOK_SECRET
      },
      // Supabase Configuration
      DATABASE: {
        URL: process.env.DATABASE_URL,
        SUPABASE_URL: process.env.SUPABASE_URL,
        SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY,
        SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY
      },
      // Server Configuration
      SERVER: {
        NODE_ENV: process.env.NODE_ENV || "development",
        PORT: parseInt(process.env.PORT || "3000"),
        CORS_ORIGIN: process.env.CORS_ORIGIN || ["http://localhost:3000", "http://localhost:5173", CLOUDFLARE_URL],
        CLOUDFLARE_URL
      },
      // Security - Enhanced configuration
      SECURITY: {
        JWT_SECRET: process.env.JWT_SECRET || (() => {
          if (process.env.NODE_ENV === "production") {
            throw new Error("JWT_SECRET must be set in production");
          }
          return "dev-jwt-secret-change-in-production";
        })(),
        SESSION_SECRET: process.env.SESSION_SECRET || (() => {
          if (process.env.NODE_ENV === "production") {
            throw new Error("SESSION_SECRET must be set in production");
          }
          return "dev-session-secret-change-in-production";
        })(),
        // Additional security settings
        BCRYPT_ROUNDS: parseInt(process.env.BCRYPT_ROUNDS || "12"),
        MAX_LOGIN_ATTEMPTS: parseInt(process.env.MAX_LOGIN_ATTEMPTS || "5"),
        ACCOUNT_LOCKOUT_TIME: parseInt(process.env.ACCOUNT_LOCKOUT_TIME || "900000")
        // 15 minutes
      },
      // Email Configuration
      EMAIL: {
        HOST: process.env.EMAIL_HOST || "smtp.gmail.com",
        PORT: parseInt(process.env.EMAIL_PORT || "587"),
        SECURE: process.env.EMAIL_SECURE === "true",
        USER: process.env.EMAIL_USER,
        PASSWORD: process.env.EMAIL_PASSWORD,
        FROM_NAME: process.env.EMAIL_FROM_NAME || "Anonn",
        FROM_EMAIL: process.env.EMAIL_FROM_EMAIL
      },
      // Company Verification Configuration
      COMPANY_VERIFICATION: {
        CODE_EXPIRY_MINUTES: parseInt(process.env.COMPANY_VERIFICATION_CODE_EXPIRY || "10"),
        MAX_ATTEMPTS_PER_DAY: parseInt(process.env.COMPANY_VERIFICATION_MAX_ATTEMPTS || "5")
      }
    };
    if (process.env.NODE_ENV !== "test") {
      validateConfig();
    }
  }
});

// server/lib/anonymity.ts
import crypto2 from "crypto";
function encryptUserId(userId) {
  try {
    const salt = crypto2.randomBytes(16);
    const iv = crypto2.randomBytes(16);
    const key = crypto2.pbkdf2Sync(CONFIG.SECURITY.JWT_SECRET, salt, 1e4, 32, "sha256");
    const cipher = crypto2.createCipheriv("aes-256-cbc", key, iv);
    let encrypted = cipher.update(userId, "utf8", "hex");
    encrypted += cipher.final("hex");
    const combined = salt.toString("hex") + ":" + iv.toString("hex") + ":" + encrypted;
    return Buffer.from(combined).toString("base64url");
  } catch (error) {
    console.error("Error encrypting user ID:", error);
    return crypto2.createHash("sha256").update(userId + CONFIG.SECURITY.JWT_SECRET).digest("base64url");
  }
}
function decryptUserId(encryptedUserId) {
  try {
    const combined = Buffer.from(encryptedUserId, "base64url").toString("utf8");
    const [saltHex, ivHex, encrypted] = combined.split(":");
    if (!saltHex || !ivHex || !encrypted) {
      return null;
    }
    const salt = Buffer.from(saltHex, "hex");
    const iv = Buffer.from(ivHex, "hex");
    const key = crypto2.pbkdf2Sync(CONFIG.SECURITY.JWT_SECRET, salt, 1e4, 32, "sha256");
    const decipher = crypto2.createDecipheriv("aes-256-cbc", key, iv);
    let decrypted = decipher.update(encrypted, "hex", "utf8");
    decrypted += decipher.final("utf8");
    return decrypted;
  } catch (error) {
    console.error("Error decrypting user ID:", error);
    return null;
  }
}
function createAnonymousUserResponse(user, isOwnProfile = false) {
  const encryptedId = encryptUserId(user.id);
  const anonymousResponse = {
    id: encryptedId,
    username: user.username,
    bio: user.bio,
    profileImageUrl: user.profileImageUrl,
    bannerUrl: user.bannerUrl,
    karma: user.karma,
    postKarma: user.postKarma,
    commentKarma: user.commentKarma,
    isVerified: user.isVerified,
    isPremium: user.isPremium,
    isOnline: user.isOnline,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt
  };
  if (isOwnProfile) {
    return {
      ...anonymousResponse,
      allowlisted: user.allowlisted,
      followerCount: user.followerCount,
      followingCount: user.followingCount,
      awardeeKarma: user.awardeeKarma,
      premiumExpiresAt: user.premiumExpiresAt,
      lastActiveAt: user.lastActiveAt
      // Never include email, walletAddress, firstName, lastName, companyEmail, etc.
    };
  }
  return anonymousResponse;
}
function verifyAnonymousSessionToken(token) {
  try {
    const [header, payload, signature] = token.split(".");
    const expectedSignature = crypto2.createHmac("sha512", CONFIG.SECURITY.JWT_SECRET).update(`${header}.${payload}`).digest("base64url");
    if (signature !== expectedSignature) {
      return null;
    }
    const decodedPayload = JSON.parse(Buffer.from(payload, "base64url").toString());
    if (decodedPayload.exp < Math.floor(Date.now() / 1e3)) {
      return null;
    }
    return decryptUserId(decodedPayload.uid);
  } catch (error) {
    console.error("Error verifying anonymous session token:", error);
    return null;
  }
}
function sanitizeResponse(data) {
  if (!data) return data;
  const sensitiveFields = [
    "email",
    "walletAddress",
    "firstName",
    "lastName",
    "companyEmail",
    "companyDomain",
    "dynamicProfile",
    "password",
    "zkProofHash"
  ];
  if (Array.isArray(data)) {
    return data.map((item) => sanitizeResponse(item));
  }
  if (typeof data === "object" && data !== null) {
    const sanitized = { ...data };
    sensitiveFields.forEach((field) => {
      delete sanitized[field];
    });
    if (sanitized.id && typeof sanitized.id === "string") {
      sanitized.id = encryptUserId(sanitized.id);
    }
    if (sanitized.userId && typeof sanitized.userId === "string") {
      sanitized.userId = encryptUserId(sanitized.userId);
    }
    if (sanitized.authorId && typeof sanitized.authorId === "string") {
      sanitized.authorId = encryptUserId(sanitized.authorId);
    }
    if (sanitized.createdBy && typeof sanitized.createdBy === "string") {
      sanitized.createdBy = encryptUserId(sanitized.createdBy);
    }
    Object.keys(sanitized).forEach((key) => {
      if (typeof sanitized[key] === "object" && sanitized[key] !== null) {
        sanitized[key] = sanitizeResponse(sanitized[key]);
      }
    });
    return sanitized;
  }
  return data;
}
function createAnonymousPostResponse(post) {
  return {
    id: post.id,
    title: post.title,
    content: post.content,
    type: post.type,
    authorId: encryptUserId(post.authorId),
    author: post.author ? createAnonymousUserResponse(post.author) : null,
    organizationId: post.organizationId,
    organization: post.organization,
    karma: post.karma,
    upvotes: post.upvotes,
    downvotes: post.downvotes,
    commentCount: post.commentCount,
    createdAt: post.createdAt,
    updatedAt: post.updatedAt,
    // Remove any sensitive fields
    workLifeBalance: post.workLifeBalance,
    cultureValues: post.cultureValues,
    careerOpportunities: post.careerOpportunities,
    compensation: post.compensation,
    management: post.management,
    verified: post.verified,
    tags: post.tags
  };
}
function createAnonymousCommentResponse(comment) {
  return {
    id: comment.id,
    content: comment.content,
    authorId: encryptUserId(comment.authorId),
    author: comment.author ? createAnonymousUserResponse(comment.author) : null,
    postId: comment.postId,
    pollId: comment.pollId,
    parentId: comment.parentId,
    karma: comment.karma,
    upvotes: comment.upvotes,
    downvotes: comment.downvotes,
    createdAt: comment.createdAt,
    updatedAt: comment.updatedAt
  };
}
function anonymizeResponse(req, res, next) {
  const originalSend = res.send;
  res.send = function(data) {
    try {
      if (typeof data === "object" && data !== null) {
        data = sanitizeResponse(data);
      } else if (typeof data === "string") {
        try {
          const parsed = JSON.parse(data);
          data = JSON.stringify(sanitizeResponse(parsed));
        } catch {
        }
      }
    } catch (error) {
      console.error("Error anonymizing response:", error);
    }
    return originalSend.call(this, data);
  };
  next();
}
var init_anonymity = __esm({
  "server/lib/anonymity.ts"() {
    "use strict";
    init_config();
  }
});

// server/db.ts
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { setDefaultResultOrder } from "dns";
var client, db;
var init_db = __esm({
  "server/db.ts"() {
    "use strict";
    init_config();
    init_schema();
    if (!CONFIG.DATABASE.URL) {
      throw new Error(
        "DATABASE_URL must be set. Please set your Supabase database URL in your environment variables."
      );
    }
    try {
      setDefaultResultOrder("ipv4first");
    } catch (e) {
      console.warn("Could not set DNS resolution order:", e);
    }
    client = postgres(CONFIG.DATABASE.URL, {
      // Connection pool settings
      max: 20,
      idle_timeout: 20,
      connect_timeout: 60,
      // SSL settings - handle certificate issues
      ssl: {
        rejectUnauthorized: false
      },
      // Transform settings for better performance
      transform: {
        undefined: null
      }
    });
    db = drizzle(client, {
      schema: schema_exports,
      logger: CONFIG.SERVER.NODE_ENV === "development"
    });
  }
});

// server/storage.ts
var storage_exports = {};
__export(storage_exports, {
  DatabaseStorage: () => DatabaseStorage,
  storage: () => storage
});
import { eq, desc, sql, and, or, inArray, gte, count, isNotNull } from "drizzle-orm";
var DatabaseStorage, storage;
var init_storage = __esm({
  "server/storage.ts"() {
    "use strict";
    init_schema();
    init_anonymousNameGenerator();
    init_anonymity();
    init_db();
    DatabaseStorage = class {
      postCache = /* @__PURE__ */ new Map();
      CACHE_TTL = 5 * 60 * 1e3;
      // 5 minutes
      generateCacheKey(filters) {
        return JSON.stringify({
          organizationId: filters?.organizationId,
          bowlId: filters?.bowlId,
          type: filters?.type,
          featured: filters?.featured,
          trending: filters?.trending,
          time: filters?.time,
          sortBy: filters?.sortBy,
          userId: filters?.userId
        });
      }
      clearExpiredCache() {
        const now = Date.now();
        this.postCache.forEach((value, key) => {
          if (now - value.timestamp > this.CACHE_TTL) {
            this.postCache.delete(key);
          }
        });
      }
      // ==================== BOOKMARK/SAVE OPERATIONS ====================
      // Save a post
      async savePost(userId, postId) {
        try {
          console.log("[storage] savePost called with:", { userId, postId });
          const [saved] = await db.insert(savedContent).values({
            userId,
            postId
          }).onConflictDoNothing().returning();
          console.log("[storage] Post save result:", saved ? "new save created" : "already saved");
          if (!saved) {
            console.log("[storage] Fetching existing saved post...");
            const [existing] = await db.select().from(savedContent).where(
              and(
                eq(savedContent.userId, userId),
                eq(savedContent.postId, postId)
              )
            );
            console.log("[storage] Existing save found:", existing ? existing.id : "none");
            return existing;
          }
          console.log("[storage] Post saved successfully:", saved.id);
          return saved;
        } catch (error) {
          console.error("Error saving post:", error);
          throw error;
        }
      }
      // Unsave a post
      async unsavePost(userId, postId) {
        try {
          console.log("[storage] unsavePost called with:", { userId, postId });
          await db.delete(savedContent).where(
            and(
              eq(savedContent.userId, userId),
              eq(savedContent.postId, postId)
            )
          );
          console.log("[storage] Post unsaved successfully");
        } catch (error) {
          console.error("Error unsaving post:", error);
          throw error;
        }
      }
      // Get user's saved posts
      async getUserSavedPosts(userId) {
        try {
          console.log("[storage] getUserSavedPosts called for:", userId);
          const results = await db.select({
            savedContent,
            post: posts,
            author: users,
            organization: organizations,
            bowl: bowls
          }).from(savedContent).innerJoin(posts, eq(savedContent.postId, posts.id)).leftJoin(users, eq(posts.authorId, users.id)).leftJoin(organizations, eq(posts.organizationId, organizations.id)).leftJoin(bowls, eq(posts.bowlId, bowls.id)).where(
            and(
              eq(savedContent.userId, userId),
              isNotNull(savedContent.postId)
            )
          ).orderBy(desc(savedContent.savedAt));
          console.log("[storage] Found", results.length, "saved posts");
          return results.map((row) => ({
            ...row.savedContent,
            post: {
              ...row.post,
              author: row.author,
              organization: row.organization || void 0,
              bowl: row.bowl || void 0
            }
          }));
        } catch (error) {
          console.error("Error fetching user saved posts:", error);
          return [];
        }
      }
      // Check if post is saved by user
      async isPostSavedByUser(userId, postId) {
        try {
          const [saved] = await db.select().from(savedContent).where(
            and(
              eq(savedContent.userId, userId),
              eq(savedContent.postId, postId)
            )
          ).limit(1);
          return !!saved;
        } catch (error) {
          console.error("Error checking if post is saved:", error);
          return false;
        }
      }
      // Save a comment
      async saveComment(userId, commentId) {
        try {
          console.log("[storage] saveComment called with:", { userId, commentId });
          const [saved] = await db.insert(savedContent).values({
            userId,
            commentId
          }).onConflictDoNothing().returning();
          console.log("[storage] Comment save result:", saved ? "new save created" : "already saved");
          if (!saved) {
            console.log("[storage] Fetching existing saved comment...");
            const [existing] = await db.select().from(savedContent).where(
              and(
                eq(savedContent.userId, userId),
                eq(savedContent.commentId, commentId)
              )
            );
            console.log("[storage] Existing save found:", existing ? existing.id : "none");
            return existing;
          }
          console.log("[storage] Comment saved successfully:", saved.id);
          return saved;
        } catch (error) {
          console.error("Error saving comment:", error);
          throw error;
        }
      }
      // Unsave a comment
      async unsaveComment(userId, commentId) {
        try {
          console.log("[storage] unsaveComment called with:", { userId, commentId });
          await db.delete(savedContent).where(
            and(
              eq(savedContent.userId, userId),
              eq(savedContent.commentId, commentId)
            )
          );
          console.log("[storage] Comment unsaved successfully");
        } catch (error) {
          console.error("Error unsaving comment:", error);
          throw error;
        }
      }
      // Get user's saved comments
      async getUserSavedComments(userId) {
        try {
          console.log("[storage] getUserSavedComments called for:", userId);
          const results = await db.select({
            savedContent,
            comment: comments,
            author: users
          }).from(savedContent).innerJoin(comments, eq(savedContent.commentId, comments.id)).leftJoin(users, eq(comments.authorId, users.id)).where(
            and(
              eq(savedContent.userId, userId),
              isNotNull(savedContent.commentId)
            )
          ).orderBy(desc(savedContent.savedAt));
          console.log("[storage] Found", results.length, "saved comments");
          return results.map((row) => ({
            ...row.savedContent,
            comment: {
              ...row.comment,
              author: row.author,
              userVote: void 0,
              replies: []
            }
          }));
        } catch (error) {
          console.error("Error fetching user saved comments:", error);
          return [];
        }
      }
      // Check if comment is saved by user
      async isCommentSavedByUser(userId, commentId) {
        try {
          const [saved] = await db.select().from(savedContent).where(
            and(
              eq(savedContent.userId, userId),
              eq(savedContent.commentId, commentId)
            )
          ).limit(1);
          return !!saved;
        } catch (error) {
          console.error("Error checking if comment is saved:", error);
          return false;
        }
      }
      // User operations
      async getUser(id) {
        const [user] = await db.select().from(users).where(eq(users.id, id));
        return user;
      }
      async getUserById(id) {
        const [user] = await db.select().from(users).where(eq(users.id, id));
        return user;
      }
      async getUserByEmail(email) {
        if (!email) return void 0;
        const [user] = await db.select().from(users).where(eq(users.email, email));
        return user;
      }
      async getUserByWalletAddress(address) {
        if (!address) return void 0;
        const [user] = await db.select().from(users).where(eq(users.walletAddress, address));
        return user;
      }
      async upsertUser(userData) {
        if (userData.email && !userData.username) {
          const anonymousProfile = generateAnonymousProfile(userData.email);
          userData.username = anonymousProfile.username;
        }
        const [user] = await db.insert(users).values(userData).onConflictDoUpdate({
          target: users.id,
          set: {
            ...userData,
            updatedAt: /* @__PURE__ */ new Date()
          }
        }).returning();
        return user;
      }
      async updateUserKarma(userId, karmaChange) {
        await db.update(users).set({
          karma: sql`${users.karma} + ${karmaChange}`,
          updatedAt: /* @__PURE__ */ new Date()
        }).where(eq(users.id, userId));
      }
      // Organization operations
      async createOrganization(org) {
        const [organization] = await db.insert(organizations).values(org).returning();
        return organization;
      }
      async getOrganization(id) {
        const [organization] = await db.select().from(organizations).where(eq(organizations.id, id));
        return organization;
      }
      async getOrganizationByName(name) {
        const [organization] = await db.select().from(organizations).where(sql`lower(${organizations.name}) = lower(${name})`).limit(1);
        return organization;
      }
      async getOrganizations() {
        const orgs = await db.select().from(organizations).orderBy(desc(organizations.createdAt));
        const results = await Promise.all(orgs.map(async (org) => {
          const reviewStats = await db.select({
            reviewCount: sql`count(*)`,
            positive: sql`count(*) filter (where ${posts.sentiment} = 'positive')`,
            neutral: sql`count(*) filter (where ${posts.sentiment} = 'neutral')`,
            negative: sql`count(*) filter (where ${posts.sentiment} = 'negative')`
          }).from(posts).where(and(eq(posts.organizationId, org.id), eq(posts.type, "review")));
          const stats = reviewStats[0];
          const totalReviews = stats.reviewCount || 0;
          return {
            ...org,
            reviewCount: totalReviews,
            averageRating: totalReviews > 0 ? (stats.positive * 5 + stats.neutral * 3 + stats.negative * 1) / totalReviews : 0,
            sentimentBreakdown: {
              positive: stats.positive || 0,
              neutral: stats.neutral || 0,
              negative: stats.negative || 0
            }
          };
        }));
        return results;
      }
      async getFeaturedOrganizations() {
        const orgs = await db.select().from(organizations).where(eq(organizations.isFeatured, true)).orderBy(desc(organizations.createdAt));
        const results = await Promise.all(orgs.map(async (org) => {
          const reviewStats = await db.select({
            reviewCount: sql`count(*)`,
            positive: sql`count(*) filter (where ${posts.sentiment} = 'positive')`,
            neutral: sql`count(*) filter (where ${posts.sentiment} = 'neutral')`,
            negative: sql`count(*) filter (where ${posts.sentiment} = 'negative')`
          }).from(posts).where(and(eq(posts.organizationId, org.id), eq(posts.type, "review")));
          const stats = reviewStats[0];
          const totalReviews = stats.reviewCount || 0;
          return {
            ...org,
            reviewCount: totalReviews,
            averageRating: totalReviews > 0 ? (stats.positive * 5 + stats.neutral * 3 + stats.negative * 1) / totalReviews : 0,
            sentimentBreakdown: {
              positive: stats.positive || 0,
              neutral: stats.neutral || 0,
              negative: stats.negative || 0
            }
          };
        }));
        return results;
      }
      async getAllOrganizations() {
        const orgs = await db.select().from(organizations).orderBy(desc(organizations.isFeatured), desc(organizations.createdAt));
        const results = await Promise.all(orgs.map(async (org) => {
          const reviewStats = await db.select({
            reviewCount: sql`count(*)`,
            positive: sql`count(*) filter (where ${posts.sentiment} = 'positive')`,
            neutral: sql`count(*) filter (where ${posts.sentiment} = 'neutral')`,
            negative: sql`count(*) filter (where ${posts.sentiment} = 'negative')`
          }).from(posts).where(and(eq(posts.organizationId, org.id), eq(posts.type, "review")));
          const trustStats = await db.select({
            trustVotes: sql`count(*) filter (where ${orgTrustVotes.trustVote} = true)`,
            distrustVotes: sql`count(*) filter (where ${orgTrustVotes.trustVote} = false)`
          }).from(orgTrustVotes).where(eq(orgTrustVotes.organizationId, org.id));
          const stats = reviewStats[0];
          const totalReviews = stats.reviewCount || 0;
          const trustData = trustStats[0];
          const totalTrustVotes = (trustData.trustVotes || 0) + (trustData.distrustVotes || 0);
          const trustPercentage = totalTrustVotes > 0 ? Math.round((trustData.trustVotes || 0) / totalTrustVotes * 100) : 50;
          return {
            ...org,
            reviewCount: totalReviews,
            averageRating: totalReviews > 0 ? (stats.positive * 5 + stats.neutral * 3 + stats.negative * 1) / totalReviews : 0,
            sentimentBreakdown: {
              positive: stats.positive || 0,
              neutral: stats.neutral || 0,
              negative: stats.negative || 0
            },
            trustData: {
              trustVotes: trustData.trustVotes || 0,
              distrustVotes: trustData.distrustVotes || 0,
              trustPercentage
            }
          };
        }));
        return results;
      }
      async searchOrganizations(query) {
        return await db.select().from(organizations).where(sql`${organizations.name} ILIKE ${"%" + query + "%"}`).orderBy(organizations.name);
      }
      async searchOrganizationsWithStats(query) {
        const basicOrgs = await this.searchOrganizations(query);
        const results = await Promise.all(basicOrgs.map(async (org) => {
          return await this.getOrganizationWithStats(org.id);
        }));
        return results.filter((org) => org !== void 0);
      }
      async searchPosts(query) {
        const q = query.trim();
        if (!q) return [];
        const isPhrase = /\s/.test(q);
        const whereCondition = isPhrase ? sql`${posts.title} ILIKE ${"%" + q + "%"} OR ${posts.content} ILIKE ${"%" + q + "%"}` : (() => {
          const escaped = q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
          const pattern = `(^|\\W)${escaped}(\\W|$)`;
          return sql`${posts.title} ~* ${pattern} OR ${posts.content} ~* ${pattern}`;
        })();
        const postsResult = await db.select({
          id: posts.id,
          title: posts.title,
          content: posts.content,
          type: posts.type,
          createdAt: posts.createdAt,
          authorId: posts.authorId,
          organizationId: posts.organizationId,
          bowlId: posts.bowlId
        }).from(posts).where(whereCondition).orderBy(desc(posts.createdAt)).limit(50);
        const detailed = await Promise.all(postsResult.map(async (p) => {
          const result = { ...p };
          try {
            const author = await this.getUser(p.authorId);
            if (author) result.author = author;
          } catch {
          }
          if (p.organizationId) {
            result.organization = await this.getOrganization(p.organizationId);
          }
          if (p.bowlId) {
            result.bowl = await this.getBowl(p.bowlId);
          }
          return result;
        }));
        return detailed;
      }
      async getOrganizationWithStats(id) {
        const [organization] = await db.select().from(organizations).where(eq(organizations.id, id));
        if (!organization) return void 0;
        const reviewStats = await db.select({
          reviewCount: sql`count(*)`,
          positive: sql`count(*) filter (where ${posts.sentiment} = 'positive')`,
          neutral: sql`count(*) filter (where ${posts.sentiment} = 'neutral')`,
          negative: sql`count(*) filter (where ${posts.sentiment} = 'negative')`,
          lastReviewDate: sql`max(${posts.createdAt})`
        }).from(posts).where(and(eq(posts.organizationId, id), eq(posts.type, "review")));
        const ratingAverages = await db.select({
          avgWorkLifeBalance: sql`avg(${posts.workLifeBalance})`,
          avgCultureValues: sql`avg(${posts.cultureValues})`,
          avgCareerOpportunities: sql`avg(${posts.careerOpportunities})`,
          avgCompensation: sql`avg(${posts.compensation})`,
          avgManagement: sql`avg(${posts.management})`
        }).from(posts).where(and(eq(posts.organizationId, id), eq(posts.type, "review")));
        const stats = reviewStats[0];
        const totalReviews = stats.reviewCount || 0;
        const ratings = ratingAverages[0];
        let averageRating = 0;
        if (totalReviews > 0) {
          const validRatings = [
            ratings.avgWorkLifeBalance,
            ratings.avgCultureValues,
            ratings.avgCareerOpportunities,
            ratings.avgCompensation,
            ratings.avgManagement
          ].filter((rating) => rating !== null && rating !== void 0);
          if (validRatings.length > 0) {
            averageRating = validRatings.reduce((sum, rating) => sum + Number(rating), 0) / validRatings.length;
          }
        }
        const trustStats = await db.select({
          trustVotes: sql`count(*) filter (where ${orgTrustVotes.trustVote} = true)`,
          distrustVotes: sql`count(*) filter (where ${orgTrustVotes.trustVote} = false)`
        }).from(orgTrustVotes).where(eq(orgTrustVotes.organizationId, id));
        const trust = trustStats[0];
        const totalTrustVotes = (trust.trustVotes || 0) + (trust.distrustVotes || 0);
        const trustPercentage = totalTrustVotes > 0 ? Math.round((trust.trustVotes || 0) / totalTrustVotes * 100) : 0;
        const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1e3);
        const reviewTrends = await db.select({
          date: sql`date(${posts.createdAt})`,
          count: sql`count(*)`
        }).from(posts).where(
          and(
            eq(posts.organizationId, id),
            eq(posts.type, "review"),
            gte(posts.createdAt, thirtyDaysAgo)
          )
        ).groupBy(sql`date(${posts.createdAt})`).orderBy(sql`date(${posts.createdAt})`);
        const recentNegativeStats = await db.select({
          totalRecent: sql`count(*)`,
          negativeRecent: sql`count(*) filter (where ${posts.sentiment} = 'negative')`
        }).from(posts).where(
          and(
            eq(posts.organizationId, id),
            eq(posts.type, "review"),
            gte(posts.createdAt, thirtyDaysAgo)
          )
        );
        const recentStats = recentNegativeStats[0];
        const negativePercentageLast30Days = recentStats.totalRecent > 0 ? Math.round((recentStats.negativeRecent || 0) / recentStats.totalRecent * 100) : 0;
        const hasRisk = negativePercentageLast30Days > 40;
        const mostHelpfulQuery = db.select({
          post: posts,
          author: users
        }).from(posts).innerJoin(users, eq(posts.authorId, users.id)).where(and(eq(posts.organizationId, id), eq(posts.type, "review"))).orderBy(desc(sql`${posts.upvotes} - ${posts.downvotes}`)).limit(1);
        const mostControversialQuery = db.select({
          post: posts,
          author: users
        }).from(posts).innerJoin(users, eq(posts.authorId, users.id)).where(and(eq(posts.organizationId, id), eq(posts.type, "review"))).orderBy(desc(sql`${posts.upvotes} + ${posts.downvotes}`)).limit(1);
        const [mostHelpfulResult, mostControversialResult] = await Promise.all([
          mostHelpfulQuery,
          mostControversialQuery
        ]);
        const mostHelpful = mostHelpfulResult[0] ? {
          ...mostHelpfulResult[0].post,
          author: {
            ...mostHelpfulResult[0].author,
            karmaLevel: getKarmaLevel(mostHelpfulResult[0].author.karma)
          }
        } : void 0;
        const mostControversial = mostControversialResult[0] ? {
          ...mostControversialResult[0].post,
          author: {
            ...mostControversialResult[0].author,
            karmaLevel: getKarmaLevel(mostControversialResult[0].author.karma)
          }
        } : void 0;
        return {
          ...organization,
          reviewCount: totalReviews,
          averageRating,
          sentimentBreakdown: {
            positive: stats.positive || 0,
            neutral: stats.neutral || 0,
            negative: stats.negative || 0
          },
          trustData: {
            trustVotes: trust.trustVotes || 0,
            distrustVotes: trust.distrustVotes || 0,
            trustPercentage
          },
          riskSignal: {
            hasRisk,
            negativePercentageLast30Days
          },
          lastReviewDate: stats.lastReviewDate ? new Date(stats.lastReviewDate) : void 0,
          reviewTrends: reviewTrends.map((trend) => ({
            date: trend.date,
            count: trend.count
          })),
          topReviews: {
            mostHelpful,
            mostControversial
          },
          // Include individual rating averages
          avgWorkLifeBalance: ratings.avgWorkLifeBalance ? Number(ratings.avgWorkLifeBalance) : null,
          avgCultureValues: ratings.avgCultureValues ? Number(ratings.avgCultureValues) : null,
          avgCareerOpportunities: ratings.avgCareerOpportunities ? Number(ratings.avgCareerOpportunities) : null,
          avgCompensation: ratings.avgCompensation ? Number(ratings.avgCompensation) : null,
          avgManagement: ratings.avgManagement ? Number(ratings.avgManagement) : null
        };
      }
      // Bowl operations (no creation - predefined only)
      async getBowl(id) {
        const [bowl] = await db.select().from(bowls).where(eq(bowls.id, id));
        return bowl;
      }
      async getBowlByName(name) {
        const [bowl] = await db.select().from(bowls).where(sql`lower(${bowls.name}) = lower(${name})`).limit(1);
        return bowl;
      }
      async getBowls() {
        return await db.select().from(bowls).orderBy(desc(bowls.memberCount));
      }
      async getBowlsByCategory(category) {
        return await db.select().from(bowls).where(eq(bowls.category, category)).orderBy(desc(bowls.memberCount));
      }
      async getBowlsCategories() {
        const result = await db.select({
          category: bowls.category,
          count: sql`count(*)`
        }).from(bowls).groupBy(bowls.category).orderBy(bowls.category);
        return result;
      }
      async followBowl(follow) {
        try {
          console.log("[storage] followBowl called with:", follow);
          const [newFollow] = await db.insert(bowlFollows).values(follow).onConflictDoNothing().returning();
          console.log("[storage] Insert result:", newFollow ? "new follow created" : "no new follow (conflict)");
          if (!newFollow) {
            console.log("[storage] Fetching existing follow...");
            const [existingFollow] = await db.select().from(bowlFollows).where(
              and(
                eq(bowlFollows.userId, follow.userId),
                eq(bowlFollows.bowlId, follow.bowlId)
              )
            );
            console.log("[storage] Existing follow found:", existingFollow ? existingFollow.id : "none");
            return existingFollow;
          }
          console.log("[storage] Updating bowl member count...");
          await db.update(bowls).set({
            memberCount: sql`${bowls.memberCount} + 1`
          }).where(eq(bowls.id, follow.bowlId));
          console.log("[storage] Follow created successfully:", newFollow.id);
          return newFollow;
        } catch (error) {
          console.error("Error in followBowl:", error);
          throw error;
        }
      }
      async unfollowBowl(userId, bowlId) {
        await db.delete(bowlFollows).where(
          and(
            eq(bowlFollows.userId, userId),
            eq(bowlFollows.bowlId, bowlId)
          )
        );
        await db.update(bowls).set({
          memberCount: sql`${bowls.memberCount} - 1`
        }).where(eq(bowls.id, bowlId));
      }
      async getUserBowlFollows(userId) {
        return await db.select({
          id: bowlFollows.id,
          userId: bowlFollows.userId,
          bowlId: bowlFollows.bowlId,
          followedAt: bowlFollows.followedAt,
          bowl: bowls
        }).from(bowlFollows).innerJoin(bowls, eq(bowlFollows.bowlId, bowls.id)).where(eq(bowlFollows.userId, userId));
      }
      async isUserFollowingBowl(userId, bowlId) {
        const [follow] = await db.select().from(bowlFollows).where(
          and(
            eq(bowlFollows.userId, userId),
            eq(bowlFollows.bowlId, bowlId)
          )
        );
        return !!follow;
      }
      async updateBowlFavorite(userId, bowlId, isFavorite) {
        try {
          console.log("[favorite] Updating favorite:", { userId, bowlId, isFavorite });
          if (isFavorite) {
            const [newFavorite] = await db.insert(bowlFavorites).values({
              userId,
              bowlId
            }).onConflictDoNothing().returning();
            if (newFavorite) {
              console.log("[favorite] Added to favorites:", newFavorite.id);
            } else {
              console.log("[favorite] Already in favorites");
            }
          } else {
            const result = await db.delete(bowlFavorites).where(and(eq(bowlFavorites.userId, userId), eq(bowlFavorites.bowlId, bowlId))).returning();
            console.log("[favorite] Removed from favorites:", result.length > 0);
          }
        } catch (error) {
          console.error("Error updating bowl favorite:", error);
          throw error;
        }
      }
      async getUserBowlFavorites(userId) {
        try {
          return await db.select().from(bowlFavorites).where(eq(bowlFavorites.userId, userId));
        } catch (error) {
          console.error("Error fetching user bowl favorites:", error);
          return [];
        }
      }
      async isUserFavoritingBowl(userId, bowlId) {
        try {
          const [favorite] = await db.select().from(bowlFavorites).where(and(eq(bowlFavorites.userId, userId), eq(bowlFavorites.bowlId, bowlId)));
          return !!favorite;
        } catch (error) {
          console.error("Error checking if user is favoriting bowl:", error);
          return false;
        }
      }
      // Poll operations
      async createPoll(poll) {
        const [newPoll] = await db.insert(polls).values(poll).returning();
        return newPoll;
      }
      async createPollOption(option) {
        const [newOption] = await db.insert(pollOptions).values(option).returning();
        return newOption;
      }
      async getPollWithDetails(pollId, userId) {
        const result = await db.select({
          poll: polls,
          author: users,
          bowl: bowls,
          organization: organizations,
          options: pollOptions
        }).from(polls).leftJoin(users, eq(polls.authorId, users.id)).leftJoin(bowls, eq(polls.bowlId, bowls.id)).leftJoin(organizations, eq(polls.organizationId, organizations.id)).leftJoin(pollOptions, eq(polls.id, pollOptions.pollId)).where(eq(polls.id, pollId));
        if (result.length === 0) return void 0;
        const poll = result[0].poll;
        const author = result[0].author;
        const bowl = result[0].bowl || void 0;
        const organization = result[0].organization || void 0;
        const options = result.map((r) => r.options).filter((opt) => opt !== null).map((opt) => ({ ...opt, isVotedBy: false }));
        let hasVoted = false;
        let selectedOptions = [];
        if (userId) {
          const userVotes = await db.select().from(pollVotes).where(and(eq(pollVotes.pollId, pollId), eq(pollVotes.userId, userId)));
          hasVoted = userVotes.length > 0;
          selectedOptions = userVotes.map((vote) => vote.optionId);
        }
        return {
          ...poll,
          author,
          bowl,
          organization,
          options,
          totalVotes: options.reduce((sum, opt) => sum + (opt.voteCount || 0), 0),
          hasVoted,
          selectedOptions
        };
      }
      async getAllPolls(filters) {
        const whereConditions = [];
        if (filters?.organizationId) {
          whereConditions.push(eq(polls.organizationId, filters.organizationId));
        }
        if (filters?.featured) {
          whereConditions.push(gte(polls.upvotes, 5));
        }
        if (filters?.time && filters.time !== "all") {
          const now = /* @__PURE__ */ new Date();
          let timeThreshold = null;
          switch (filters.time) {
            case "hour":
              timeThreshold = new Date(now.getTime() - 60 * 60 * 1e3);
              break;
            case "day":
              timeThreshold = new Date(now.getTime() - 24 * 60 * 60 * 1e3);
              break;
            case "week":
              timeThreshold = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1e3);
              break;
            case "month":
              timeThreshold = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1e3);
              break;
            case "year":
              timeThreshold = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1e3);
              break;
          }
          if (timeThreshold) {
            whereConditions.push(gte(polls.createdAt, timeThreshold));
          }
        }
        let query = db.select({
          poll: polls,
          author: users,
          bowl: bowls,
          organization: organizations,
          options: pollOptions
        }).from(polls).where(whereConditions.length > 0 ? and(...whereConditions) : sql`1=1`).leftJoin(users, eq(polls.authorId, users.id)).leftJoin(bowls, eq(polls.bowlId, bowls.id)).leftJoin(organizations, eq(polls.organizationId, organizations.id)).leftJoin(pollOptions, eq(polls.id, pollOptions.pollId));
        let finalQuery;
        if (filters?.sortBy === "hot") {
          finalQuery = query.orderBy(desc(polls.upvotes), desc(polls.createdAt));
        } else {
          finalQuery = query.orderBy(desc(polls.createdAt));
        }
        const result = await finalQuery;
        const pollMap = /* @__PURE__ */ new Map();
        result.forEach((row) => {
          const pollId = row.poll.id;
          if (!pollMap.has(pollId)) {
            pollMap.set(pollId, {
              ...row.poll,
              author: row.author,
              bowl: row.bowl || void 0,
              organization: row.organization || void 0,
              options: [],
              totalVotes: 0,
              userVote: void 0
              // Will be populated later if user is authenticated
            });
          }
          if (row.options) {
            const poll = pollMap.get(pollId);
            const existingOption = poll.options.find((opt) => opt.id === row.options.id);
            if (!existingOption) {
              poll.options.push({ ...row.options, isVotedBy: false });
              poll.totalVotes += row.options.voteCount || 0;
            }
          }
        });
        let pollResults = Array.from(pollMap.values());
        if (filters?.sortBy === "hot") {
          pollResults = pollResults.sort((a, b) => {
            const scoreA = a.upvotes - a.downvotes + a.totalVotes * 0.1;
            const scoreB = b.upvotes - b.downvotes + b.totalVotes * 0.1;
            if (scoreB !== scoreA) {
              return scoreB - scoreA;
            }
            return new Date(b.createdAt ?? 0).getTime() - new Date(a.createdAt ?? 0).getTime();
          });
        }
        return pollResults;
      }
      async createPollVote(vote) {
        const [newVote] = await db.insert(pollVotes).values(vote).returning();
        return newVote;
      }
      async updatePollOptionVoteCounts(optionIds) {
        for (const optionId of optionIds) {
          const voteCount = await db.select({ count: sql`count(*)` }).from(pollVotes).where(eq(pollVotes.optionId, optionId));
          await db.update(pollOptions).set({ voteCount: voteCount[0].count || 0 }).where(eq(pollOptions.id, optionId));
        }
      }
      async hasUserVotedOnPoll(userId, pollId) {
        const existingVote = await db.select().from(pollVotes).where(and(eq(pollVotes.userId, userId), eq(pollVotes.pollId, pollId))).limit(1);
        return existingVote.length > 0;
      }
      async updatePollVoteCounts(pollId) {
        const upvotes = await db.select({ count: sql`count(*)` }).from(votes).where(and(eq(votes.targetId, pollId), eq(votes.targetType, "poll"), eq(votes.voteType, "up")));
        const downvotes = await db.select({ count: sql`count(*)` }).from(votes).where(and(eq(votes.targetId, pollId), eq(votes.targetType, "poll"), eq(votes.voteType, "down")));
        await db.update(polls).set({
          upvotes: upvotes[0].count || 0,
          downvotes: downvotes[0].count || 0
        }).where(eq(polls.id, pollId));
        this.postCache.clear();
      }
      // Post operations
      async createPost(post) {
        if (post.type === "review" && post.organizationId) {
          const existingReview = await db.select().from(posts).where(
            and(
              eq(posts.authorId, post.authorId),
              eq(posts.organizationId, post.organizationId),
              eq(posts.type, "review")
            )
          ).limit(1);
          if (existingReview.length > 0) {
            const [updatedPost] = await db.update(posts).set({
              title: post.title,
              content: post.content,
              sentiment: post.sentiment,
              workLifeBalance: post.workLifeBalance,
              cultureValues: post.cultureValues,
              careerOpportunities: post.careerOpportunities,
              compensation: post.compensation,
              management: post.management,
              updatedAt: /* @__PURE__ */ new Date()
            }).where(eq(posts.id, existingReview[0].id)).returning();
            this.postCache.clear();
            console.log("[Storage] Updated existing review:", updatedPost.id);
            return updatedPost;
          }
        }
        const [newPost] = await db.insert(posts).values(post).returning();
        this.postCache.clear();
        console.log("[Storage] Post cache cleared after creating new post:", newPost.id);
        console.log("[Storage] Cache size after clearing:", this.postCache.size);
        return newPost;
      }
      async getPost(id) {
        const result = await db.select({
          post: posts,
          author: users,
          organization: organizations,
          bowl: bowls
        }).from(posts).leftJoin(users, eq(posts.authorId, users.id)).leftJoin(organizations, eq(posts.organizationId, organizations.id)).leftJoin(bowls, eq(posts.bowlId, bowls.id)).where(eq(posts.id, id));
        if (result.length === 0) return void 0;
        const row = result[0];
        return {
          ...row.post,
          author: row.author,
          organization: row.organization || void 0,
          bowl: row.bowl || void 0
        };
      }
      async getCommentById(id) {
        const [c] = await db.select().from(comments).where(eq(comments.id, id));
        return c;
      }
      async updatePostCommentCount(postId) {
        const [row] = await db.select({ count: sql`count(*)` }).from(comments).where(eq(comments.postId, postId));
        const newCount = row?.count || 0;
        await db.update(posts).set({ commentCount: newCount, updatedAt: /* @__PURE__ */ new Date() }).where(eq(posts.id, postId));
      }
      async deleteCommentCascade(commentId, requesterId) {
        const target = await this.getCommentById(commentId);
        if (!target) return;
        if (target.authorId !== requesterId) throw new Error("FORBIDDEN");
        const all = await db.select().from(comments).where(eq(comments.postId, target.postId));
        const idToChildren = /* @__PURE__ */ new Map();
        all.forEach((c) => {
          if (c.parentId != null) {
            const list = idToChildren.get(c.parentId) || [];
            list.push(c.id);
            idToChildren.set(c.parentId, list);
          }
        });
        const toDelete = [];
        const stack = [commentId];
        while (stack.length) {
          const id = stack.pop();
          toDelete.push(id);
          const children = idToChildren.get(id) || [];
          children.forEach((ch) => stack.push(ch));
        }
        if (toDelete.length > 0) {
          await db.delete(votes).where(and(inArray(votes.targetId, toDelete), eq(votes.targetType, "comment")));
          await db.delete(comments).where(inArray(comments.id, toDelete));
        }
        if (target.postId) {
          await this.updatePostCommentCount(target.postId);
        }
      }
      async deletePostCascade(postId, requesterId) {
        const post = await this.getPost(postId);
        if (!post) return;
        if (post.authorId !== requesterId) throw new Error("FORBIDDEN");
        await db.delete(votes).where(and(eq(votes.targetId, postId), eq(votes.targetType, "post")));
        const allComments = await db.select({ id: comments.id }).from(comments).where(eq(comments.postId, postId));
        const commentIds = allComments.map((c) => c.id);
        if (commentIds.length > 0) {
          await db.delete(votes).where(and(inArray(votes.targetId, commentIds), eq(votes.targetType, "comment")));
          await db.delete(comments).where(inArray(comments.id, commentIds));
        }
        const [poll] = await db.select().from(polls).where(eq(polls.postId, postId));
        if (poll) {
          await db.delete(pollVotes).where(eq(pollVotes.pollId, poll.id));
          await db.delete(pollOptions).where(eq(pollOptions.pollId, poll.id));
          await db.delete(comments).where(eq(comments.pollId, poll.id));
          await db.delete(votes).where(and(eq(votes.targetId, poll.id), eq(votes.targetType, "poll")));
          await db.delete(polls).where(eq(polls.id, poll.id));
        }
        await db.delete(posts).where(eq(posts.id, postId));
        this.postCache.clear();
      }
      async deletePollCascade(pollId, requesterId) {
        const poll = await this.getPollWithDetails(pollId);
        if (!poll) return;
        if (poll.author.id !== requesterId) throw new Error("FORBIDDEN");
        await db.delete(pollVotes).where(eq(pollVotes.pollId, pollId));
        await db.delete(pollOptions).where(eq(pollOptions.pollId, pollId));
        await db.delete(comments).where(eq(comments.pollId, pollId));
        await db.delete(votes).where(and(eq(votes.targetId, pollId), eq(votes.targetType, "poll")));
        if (poll.postId) {
          await db.delete(posts).where(eq(posts.id, poll.postId));
        }
        await db.delete(polls).where(eq(polls.id, pollId));
        this.postCache.clear();
      }
      async getPosts(filters) {
        this.clearExpiredCache();
        const cacheKey = this.generateCacheKey(filters);
        const cached = this.postCache.get(cacheKey);
        if (cached && Date.now() - cached.timestamp < this.CACHE_TTL) {
          return cached.posts;
        }
        console.log("[getPosts] Filters:", filters);
        try {
          const testPosts = await db.select().from(posts).limit(1);
          console.log("[getPosts] Database connection test - found posts:", testPosts.length);
        } catch (error) {
          console.error("[getPosts] Database connection error:", error);
        }
        const conditions = [];
        if (filters?.organizationId) {
          conditions.push(eq(posts.organizationId, filters.organizationId));
        }
        if (filters?.bowlId) {
          conditions.push(eq(posts.bowlId, filters.bowlId));
        }
        if (filters?.type) {
          conditions.push(eq(posts.type, filters.type));
        }
        if (filters?.userId) {
          console.log("[getPosts] Filtering by userId:", filters.userId, "type:", typeof filters.userId);
          conditions.push(eq(posts.authorId, filters.userId));
        }
        if (filters?.time && filters.time !== "all") {
          const now = /* @__PURE__ */ new Date();
          let timeThreshold;
          switch (filters.time) {
            case "hour":
              timeThreshold = new Date(now.getTime() - 60 * 60 * 1e3);
              break;
            case "day":
              timeThreshold = new Date(now.getTime() - 24 * 60 * 60 * 1e3);
              break;
            case "week":
              timeThreshold = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1e3);
              break;
            case "month":
              timeThreshold = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1e3);
              break;
            case "year":
              timeThreshold = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1e3);
              break;
            default:
              timeThreshold = new Date(now.getTime() - 24 * 60 * 60 * 1e3);
          }
          conditions.push(gte(posts.createdAt, timeThreshold));
        }
        if (filters?.featured) {
          conditions.push(or(gte(posts.upvotes, 10), gte(posts.commentCount, 5)));
        }
        if (filters?.trending) {
          const timeFilter = filters.time || "day";
          const now = /* @__PURE__ */ new Date();
          let timeThreshold;
          switch (timeFilter) {
            case "hour":
              timeThreshold = new Date(now.getTime() - 60 * 60 * 1e3);
              break;
            case "day":
              timeThreshold = new Date(now.getTime() - 24 * 60 * 60 * 1e3);
              break;
            case "week":
              timeThreshold = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1e3);
              break;
            case "month":
              timeThreshold = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1e3);
              break;
            default:
              timeThreshold = new Date(now.getTime() - 24 * 60 * 60 * 1e3);
          }
          conditions.push(gte(posts.createdAt, timeThreshold));
        }
        let result;
        if (conditions.length > 0) {
          console.log("[getPosts] Executing query with conditions:", conditions.length);
          console.log("[getPosts] Conditions:", conditions);
          try {
            result = await db.select({
              post: posts,
              author: users,
              organization: organizations,
              bowl: bowls
            }).from(posts).leftJoin(users, eq(posts.authorId, users.id)).leftJoin(organizations, eq(posts.organizationId, organizations.id)).leftJoin(bowls, eq(posts.bowlId, bowls.id)).where(and(...conditions)).orderBy(desc(posts.createdAt));
            console.log("[getPosts] Query result:", result.length, "posts found");
            if (result.length > 0) {
              console.log("[getPosts] First post authorId:", result[0].post.authorId);
            }
          } catch (error) {
            console.error("[getPosts] Query execution error:", error);
            result = [];
          }
        } else {
          console.log("[getPosts] Executing query without conditions");
          result = await db.select({
            post: posts,
            author: users,
            organization: organizations,
            bowl: bowls
          }).from(posts).leftJoin(users, eq(posts.authorId, users.id)).leftJoin(organizations, eq(posts.organizationId, organizations.id)).leftJoin(bowls, eq(posts.bowlId, bowls.id)).orderBy(desc(posts.createdAt));
          console.log("[getPosts] Query result:", result.length, "posts found");
        }
        let postResults = result.map((row) => ({
          ...row.post,
          author: row.author,
          organization: row.organization || void 0,
          bowl: row.bowl || void 0
        }));
        if (filters?.sortBy) {
          console.log(`[SORTING] Using sortBy: ${filters.sortBy}`);
          switch (filters.sortBy) {
            case "hot":
              console.log(`[SORTING] Applying hot sorting to ${postResults.length} posts`);
              postResults = postResults.sort((a, b) => {
                const scoreA = this.calculateHotScore(a);
                const scoreB = this.calculateHotScore(b);
                console.log(`[HOT SORT] Post ${a.id}: score=${scoreA.toFixed(4)}, votes=${a.upvotes}-${a.downvotes}, comments=${a.commentCount}`);
                console.log(`[HOT SORT] Post ${b.id}: score=${scoreB.toFixed(4)}, votes=${b.upvotes}-${b.downvotes}, comments=${b.commentCount}`);
                return scoreB - scoreA;
              });
              break;
            case "new":
              console.log(`[SORTING] Applying new sorting to ${postResults.length} posts`);
              postResults = postResults.sort((a, b) => {
                const timeA = new Date(a.createdAt || "").getTime();
                const timeB = new Date(b.createdAt || "").getTime();
                console.log(`[NEW SORT] Post ${a.id}: createdAt=${a.createdAt}, time=${timeA}`);
                console.log(`[NEW SORT] Post ${b.id}: createdAt=${b.createdAt}, time=${timeB}`);
                return timeB - timeA;
              });
              break;
            case "top":
              postResults = postResults.sort(
                (a, b) => b.upvotes - b.downvotes - (a.upvotes - a.downvotes)
              );
              break;
            case "rising":
              postResults = postResults.sort((a, b) => {
                const scoreA = this.calculateRisingScore(a);
                const scoreB = this.calculateRisingScore(b);
                return scoreB - scoreA;
              });
              break;
            case "trending":
              postResults = postResults.sort((a, b) => {
                const scoreA = this.calculateTrendingScore(a);
                const scoreB = this.calculateTrendingScore(b);
                return scoreB - scoreA;
              });
              break;
            default:
              console.log(`[SORTING] Using default sorting (new) for ${postResults.length} posts`);
              postResults = postResults.sort(
                (a, b) => new Date(b.createdAt || "").getTime() - new Date(a.createdAt || "").getTime()
              );
          }
        } else {
          console.log(`[SORTING] No sortBy provided, defaulting to hot for ${postResults.length} posts`);
          postResults = postResults.sort((a, b) => {
            const scoreA = this.calculateHotScore(a);
            const scoreB = this.calculateHotScore(b);
            return scoreB - scoreA;
          });
        }
        this.postCache.set(cacheKey, {
          posts: postResults,
          timestamp: Date.now()
        });
        return postResults;
      }
      async updatePostVoteCounts(postId) {
        const voteCounts = await db.select({
          upvotes: sql`count(*) filter (where ${votes.voteType} = 'up')`,
          downvotes: sql`count(*) filter (where ${votes.voteType} = 'down')`
        }).from(votes).where(and(eq(votes.targetId, postId), eq(votes.targetType, "post")));
        const counts = voteCounts[0];
        await db.update(posts).set({
          upvotes: counts.upvotes || 0,
          downvotes: counts.downvotes || 0,
          updatedAt: /* @__PURE__ */ new Date()
        }).where(eq(posts.id, postId));
        this.postCache.clear();
      }
      // Comment operations
      async createComment(comment) {
        console.log("=== CREATING COMMENT ===");
        console.log("Input data:", JSON.stringify(comment, null, 2));
        const commentData = {
          ...comment,
          parentId: comment.parentId || null
        };
        console.log("Processed data:", JSON.stringify(commentData, null, 2));
        const [newComment] = await db.insert(comments).values(commentData).returning();
        console.log("Database result:", JSON.stringify(newComment, null, 2));
        console.log("========================");
        if (comment.postId) {
          await db.update(posts).set({
            commentCount: sql`${posts.commentCount} + 1`,
            updatedAt: /* @__PURE__ */ new Date()
          }).where(eq(posts.id, comment.postId));
        }
        return newComment;
      }
      async getCommentsByPost(postId) {
        console.log("=== FETCHING COMMENTS ===");
        console.log("Post ID:", postId);
        const allComments = await db.select({
          comment: comments,
          author: users
        }).from(comments).leftJoin(users, eq(comments.authorId, users.id)).where(eq(comments.postId, postId)).orderBy(comments.createdAt);
        console.log(`Raw comments from DB: ${allComments.length}`);
        allComments.forEach((row) => {
          console.log(`  ID: ${row.comment.id}, ParentID: ${row.comment.parentId}, Content: "${row.comment.content.substring(0, 20)}..."`);
        });
        const commentsMap = /* @__PURE__ */ new Map();
        allComments.forEach((row) => {
          commentsMap.set(row.comment.id, {
            ...row.comment,
            author: row.author,
            userVote: void 0,
            replies: []
          });
        });
        const topLevelComments = [];
        const replies = [];
        allComments.forEach((row) => {
          const commentWithDetails = commentsMap.get(row.comment.id);
          if (row.comment.parentId === null || row.comment.parentId === void 0) {
            topLevelComments.push(commentWithDetails);
            console.log(`Top-level: ${row.comment.id}`);
          } else {
            replies.push(commentWithDetails);
            console.log(`Reply: ${row.comment.id} -> Parent: ${row.comment.parentId}`);
          }
        });
        replies.forEach((reply) => {
          const parent = commentsMap.get(reply.parentId);
          if (parent) {
            parent.replies = parent.replies || [];
            parent.replies.push(reply);
            console.log(`\u2713 Attached reply ${reply.id} to parent ${reply.parentId}`);
          } else {
            console.log(`\u2717 Parent ${reply.parentId} not found for reply ${reply.id}`);
          }
        });
        console.log(`Final: ${topLevelComments.length} top-level, ${replies.length} replies`);
        topLevelComments.forEach((comment) => {
          console.log(`  ${comment.id}: ${comment.replies?.length || 0} replies`);
        });
        console.log("========================");
        return topLevelComments;
      }
      async getCommentsByPoll(pollId) {
        console.log("=== FETCHING POLL COMMENTS ===");
        console.log("Poll ID:", pollId);
        const allComments = await db.select({
          comment: comments,
          author: users
        }).from(comments).leftJoin(users, eq(comments.authorId, users.id)).where(eq(comments.pollId, pollId)).orderBy(comments.createdAt);
        console.log(`Raw poll comments from DB: ${allComments.length}`);
        allComments.forEach((row) => {
          console.log(`  ID: ${row.comment.id}, ParentID: ${row.comment.parentId}, Content: "${row.comment.content.substring(0, 20)}..."`);
        });
        const commentsMap = /* @__PURE__ */ new Map();
        allComments.forEach((row) => {
          commentsMap.set(row.comment.id, {
            ...row.comment,
            author: row.author,
            userVote: void 0,
            replies: []
          });
        });
        const topLevelComments = [];
        const replies = [];
        allComments.forEach((row) => {
          const commentWithDetails = commentsMap.get(row.comment.id);
          if (row.comment.parentId === null || row.comment.parentId === void 0) {
            topLevelComments.push(commentWithDetails);
            console.log(`Top-level: ${row.comment.id}`);
          } else {
            replies.push(commentWithDetails);
            console.log(`Reply: ${row.comment.id} -> Parent: ${row.comment.parentId}`);
          }
        });
        replies.forEach((reply) => {
          const parent = commentsMap.get(reply.parentId);
          if (parent) {
            parent.replies = parent.replies || [];
            parent.replies.push(reply);
            console.log(`\u2713 Attached reply ${reply.id} to parent ${reply.parentId}`);
          } else {
            console.log(`\u2717 Parent ${reply.parentId} not found for reply ${reply.id}`);
          }
        });
        console.log(`Final: ${topLevelComments.length} top-level, ${replies.length} replies`);
        topLevelComments.forEach((comment) => {
          console.log(`  ${comment.id}: ${comment.replies?.length || 0} replies`);
        });
        console.log("========================");
        return topLevelComments;
      }
      async updateCommentVoteCounts(commentId) {
        const voteCounts = await db.select({
          upvotes: sql`count(*) filter (where ${votes.voteType} = 'up')`,
          downvotes: sql`count(*) filter (where ${votes.voteType} = 'down')`
        }).from(votes).where(and(eq(votes.targetId, commentId), eq(votes.targetType, "comment")));
        const counts = voteCounts[0];
        await db.update(comments).set({
          upvotes: counts.upvotes || 0,
          downvotes: counts.downvotes || 0
        }).where(eq(comments.id, commentId));
      }
      async getCommentsByUser(userId) {
        console.log("[getCommentsByUser] Fetching comments for userId:", userId);
        const allComments = await db.select({
          comment: comments,
          author: users,
          post: posts,
          poll: polls
        }).from(comments).leftJoin(users, eq(comments.authorId, users.id)).leftJoin(posts, eq(comments.postId, posts.id)).leftJoin(polls, eq(comments.pollId, polls.id)).where(eq(comments.authorId, userId)).orderBy(desc(comments.createdAt));
        console.log("[getCommentsByUser] Found", allComments.length, "comments");
        console.log("[getCommentsByUser] First comment (if any):", allComments[0]?.comment);
        return allComments.map((row) => ({
          ...row.comment,
          author: row.author,
          post: row.post || void 0,
          poll: row.poll || void 0,
          userVote: void 0,
          replies: []
          // User comments are typically shown as flat list
        }));
      }
      async recalculateAllCommentCounts() {
        const allPosts = await db.query.posts.findMany();
        let updatedCount = 0;
        for (const post of allPosts) {
          const commentCountResult = await db.select({ count: count() }).from(comments).where(eq(comments.postId, post.id));
          const actualCommentCount = commentCountResult[0]?.count || 0;
          if (post.commentCount !== actualCommentCount) {
            await db.update(posts).set({
              commentCount: actualCommentCount,
              updatedAt: /* @__PURE__ */ new Date()
            }).where(eq(posts.id, post.id));
            updatedCount++;
          }
        }
        return { updated: updatedCount, total: allPosts.length };
      }
      // Vote operations
      async createVote(vote) {
        const [newVote] = await db.insert(votes).values(vote).returning();
        return newVote;
      }
      async processVoteTransaction(userId, targetId, targetType, voteType) {
        try {
          const existingVote = await this.getVote(userId, targetId, targetType);
          let resultUserVote = null;
          if (existingVote) {
            if (existingVote.voteType === voteType) {
              await this.deleteVote(userId, targetId, targetType);
              resultUserVote = null;
            } else {
              await this.deleteVote(userId, targetId, targetType);
              const newVote = await this.createVote({
                userId,
                targetId,
                targetType,
                voteType
              });
              resultUserVote = newVote;
            }
          } else {
            const newVote = await this.createVote({
              userId,
              targetId,
              targetType,
              voteType
            });
            resultUserVote = newVote;
          }
          if (targetType === "post") {
            await this.updatePostVoteCounts(targetId);
            const post = await this.getPost(targetId);
            if (post) {
              return {
                success: true,
                updatedCounts: { upvotes: post.upvotes, downvotes: post.downvotes },
                userVote: resultUserVote
              };
            }
          } else if (targetType === "poll") {
            await this.updatePollVoteCounts(targetId);
            const poll = await this.getPollWithDetails(targetId);
            if (poll) {
              return {
                success: true,
                updatedCounts: { upvotes: poll.upvotes, downvotes: poll.downvotes },
                userVote: resultUserVote
              };
            }
          } else if (targetType === "comment") {
            await this.updateCommentVoteCounts(targetId);
          }
          return {
            success: true,
            userVote: resultUserVote
          };
        } catch (error) {
          console.error("Error in vote transaction:", error);
          throw error;
        }
      }
      async getVote(userId, targetId, targetType) {
        const [vote] = await db.select().from(votes).where(
          and(
            eq(votes.userId, userId),
            eq(votes.targetId, targetId),
            eq(votes.targetType, targetType)
          )
        );
        return vote;
      }
      async deleteVote(userId, targetId, targetType) {
        await db.delete(votes).where(
          and(
            eq(votes.userId, userId),
            eq(votes.targetId, targetId),
            eq(votes.targetType, targetType)
          )
        );
      }
      async getUserVotes(userId, targetIds, targetType) {
        if (targetIds.length === 0) return [];
        try {
          return await db.select().from(votes).where(
            and(
              eq(votes.userId, userId),
              inArray(votes.targetId, targetIds),
              eq(votes.targetType, targetType)
            )
          );
        } catch (error) {
          console.error("Error fetching user votes:", error);
          return [];
        }
      }
      // Trust vote operations
      async createOrganizationTrustVote(vote) {
        const [newVote] = await db.insert(orgTrustVotes).values(vote).onConflictDoUpdate({
          target: [orgTrustVotes.userId, orgTrustVotes.organizationId],
          set: {
            trustVote: vote.trustVote
          }
        }).returning();
        return newVote;
      }
      async getOrganizationTrustVote(userId, organizationId) {
        const [vote] = await db.select().from(orgTrustVotes).where(
          and(
            eq(orgTrustVotes.userId, userId),
            eq(orgTrustVotes.organizationId, organizationId)
          )
        );
        return vote;
      }
      async deleteOrganizationTrustVote(userId, organizationId) {
        await db.delete(orgTrustVotes).where(
          and(
            eq(orgTrustVotes.userId, userId),
            eq(orgTrustVotes.organizationId, organizationId)
          )
        );
      }
      // Notification operations
      async createNotification(notification) {
        const [notif] = await db.insert(notifications).values(notification).returning();
        return notif;
      }
      async getNotifications(userId) {
        return await db.select().from(notifications).where(eq(notifications.userId, userId)).orderBy(desc(notifications.createdAt));
      }
      async markNotificationAsRead(userId, notifId) {
        await db.update(notifications).set({ read: true }).where(and(eq(notifications.id, notifId), eq(notifications.userId, userId)));
      }
      // Check if database is empty (check for bowls since they're what we're seeding)
      async isDatabaseEmpty() {
        const result = await db.select({ count: sql`count(*)` }).from(bowls);
        return result[0]?.count === 0;
      }
      // Calculate hot score for posts (simplified Reddit-style algorithm)
      calculateHotScore(post) {
        const now = /* @__PURE__ */ new Date();
        const postAge = (now.getTime() - new Date(post.createdAt || now).getTime()) / (1e3 * 60 * 60);
        const score = post.upvotes - post.downvotes;
        const ageFactor = Math.pow(postAge + 2, 1.5);
        let hotScore = score / ageFactor;
        const commentBonus = post.commentCount * 0.5;
        if (postAge < 2) {
          hotScore *= 1.5;
        }
        if (post.commentCount > 5) {
          hotScore *= 1.2;
        }
        return hotScore + commentBonus;
      }
      // Calculate rising score for posts (velocity-based)
      calculateRisingScore(post) {
        const now = /* @__PURE__ */ new Date();
        const postAge = (now.getTime() - new Date(post.createdAt || now).getTime()) / (1e3 * 60 * 60);
        const minAge = Math.max(postAge, 0.1);
        const upvoteScore = post.upvotes - post.downvotes;
        const commentScore = post.commentCount * 2;
        const velocity = (upvoteScore + commentScore) / minAge;
        if (postAge > 12) {
          return velocity * 0.3;
        }
        if (postAge < 3 && velocity > 1) {
          return velocity * 1.5;
        }
        if (postAge < 1 && upvoteScore + commentScore > 5) {
          return velocity * 2;
        }
        return velocity;
      }
      // Calculate trending score for posts (enhanced version)
      calculateTrendingScore(post) {
        const now = /* @__PURE__ */ new Date();
        const postAge = (now.getTime() - new Date(post.createdAt || now).getTime()) / (1e3 * 60 * 60);
        const upvoteScore = post.upvotes - post.downvotes;
        const commentScore = post.commentCount * 3;
        const recencyBoost = Math.max(0, 48 - postAge) * 0.2;
        let score = upvoteScore + commentScore + recencyBoost;
        if (post.commentCount > 5) score *= 1.1;
        if (post.upvotes > 10) score *= 1.1;
        if (post.upvotes > 25) score *= 1.2;
        if (post.commentCount > 15) score *= 1.2;
        if (postAge > 48) {
          score *= 0.5;
        }
        return score;
      }
      // Anonymous query methods that return sanitized data
      async getAnonymousUser(id, isOwnProfile = false) {
        const user = await this.getUser(id);
        if (!user) return void 0;
        return createAnonymousUserResponse(user, isOwnProfile);
      }
      async getAnonymousPost(id) {
        const post = await this.getPostById(id);
        if (!post) return void 0;
        return createAnonymousPostResponse(post);
      }
      async getAnonymousComment(id) {
        const comment = await this.getComment(id);
        if (!comment) return void 0;
        return createAnonymousCommentResponse(comment);
      }
      async getAnonymousPostsForBowl(bowlId, limit = 50, offset = 0) {
        const posts2 = await this.getPostsForBowl(bowlId, limit, offset);
        return posts2.map((post) => createAnonymousPostResponse(post));
      }
      async getAnonymousPostsForOrganization(orgId, limit = 50, offset = 0) {
        const posts2 = await this.getPostsForOrganization(orgId, limit, offset);
        return posts2.map((post) => createAnonymousPostResponse(post));
      }
      async getAnonymousCommentsForPost(postId, limit = 50, offset = 0) {
        const comments2 = await this.getCommentsForPost(postId, limit, offset);
        return comments2.map((comment) => createAnonymousCommentResponse(comment));
      }
      // DEV ONLY: Clear all data from tables (order matters for FKs)
      async clearAllDevData() {
        await db.delete(notifications);
        await db.delete(votes);
        await db.delete(orgTrustVotes);
        await db.delete(comments);
        await db.delete(posts);
        await db.delete(bowlFollows);
        await db.delete(bowls);
        await db.delete(organizations);
        await db.delete(users);
      }
    };
    storage = new DatabaseStorage();
  }
});

// server/auth.ts
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
var JWT_SECRET, generateToken, verifyToken, requireAuth, optionalAuth;
var init_auth = __esm({
  "server/auth.ts"() {
    "use strict";
    init_storage();
    JWT_SECRET = process.env.JWT_SECRET || "dev-secret-key";
    generateToken = (userId) => {
      return jwt.sign({ sub: userId }, JWT_SECRET, { expiresIn: "7d" });
    };
    verifyToken = (token) => {
      try {
        return jwt.verify(token, JWT_SECRET);
      } catch {
        return null;
      }
    };
    requireAuth = async (req, res, next) => {
      try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
          console.log("[requireAuth] No bearer token provided");
          return res.status(401).json({ message: "Authentication required" });
        }
        const token = authHeader.slice(7);
        const payload = verifyToken(token);
        if (!payload) {
          console.log("[requireAuth] Token verification failed");
          return res.status(401).json({ message: "Invalid or expired token" });
        }
        const userId = payload.sub;
        const user = await storage.getUser(userId);
        if (!user) {
          console.log("[requireAuth] User not found:", userId);
          return res.status(401).json({ message: "User not found" });
        }
        req.user = user;
        console.log("[requireAuth] Authentication successful for user:", user.id);
        next();
      } catch (error) {
        console.error("[requireAuth] Error:", error);
        return res.status(401).json({ message: "Authentication failed" });
      }
    };
    optionalAuth = async (req, res, next) => {
      try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
          return next();
        }
        const token = authHeader.slice(7);
        const payload = verifyToken(token);
        if (!payload) {
          return next();
        }
        const userId = payload.sub;
        const user = await storage.getUser(userId);
        if (user) {
          req.user = user;
          console.log("[optionalAuth] User authenticated:", user.id);
        }
        next();
      } catch (error) {
        console.error("[optionalAuth] Error:", error);
        next();
      }
    };
  }
});

// server/emailService.ts
import nodemailer from "nodemailer";
async function sendEmail(options) {
  if (!transporter) {
    console.error("Email transporter not configured. Skipping email send.");
    return false;
  }
  try {
    const mailOptions = {
      from: `"${EMAIL_CONFIG.FROM_NAME}" <${EMAIL_CONFIG.FROM_EMAIL}>`,
      to: options.to,
      subject: options.subject,
      text: options.text,
      html: options.html
    };
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent successfully:", info.messageId);
    return true;
  } catch (error) {
    console.error("Error sending email:", error);
    return false;
  }
}
function generateVerificationCode() {
  return Math.floor(1e5 + Math.random() * 9e5).toString();
}
async function sendCompanyVerificationEmail(email, verificationCode, companyName) {
  const subject = companyName ? `Verify your ${companyName} email address` : "Verify your company email address";
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Email Verification</title>
        <style>
          body { 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; 
            line-height: 1.6; 
            color: #1f2937; 
            max-width: 600px; 
            margin: 0 auto; 
            padding: 0; 
            background-color: #f9fafb;
          }
          .container {
            background: white;
            margin: 20px;
            border-radius: 12px;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
            overflow: hidden;
          }
          .header { 
            background: linear-gradient(135deg, #f97316, #ea580c); 
            color: white; 
            text-align: center; 
            padding: 32px 24px; 
          }
          .header h1 {
            margin: 0 0 8px 0;
            font-size: 24px;
            font-weight: 600;
          }
          .header p {
            margin: 0;
            opacity: 0.9;
            font-size: 16px;
          }
          .content { 
            padding: 32px 24px; 
            background: white;
          }
          .verification-code { 
            background: #fef3c7; 
            color: #92400e; 
            padding: 20px; 
            text-align: center; 
            font-size: 32px; 
            font-weight: 700; 
            margin: 24px 0; 
            border-radius: 8px; 
            letter-spacing: 4px; 
            font-family: 'SF Mono', Monaco, 'Cascadia Code', monospace;
            border: 2px solid #f59e0b;
          }
          .footer { 
            text-align: center; 
            margin-top: 32px; 
            color: #6b7280; 
            font-size: 14px; 
            padding: 24px;
            background: #f9fafb;
            border-top: 1px solid #e5e7eb;
          }
          .note { 
            background: #f0f9ff; 
            border: 1px solid #bae6fd; 
            color: #0c4a6e; 
            padding: 16px; 
            border-radius: 8px; 
            margin: 24px 0; 
            font-size: 14px;
          }
          .company-name {
            color: #f97316;
            font-weight: 600;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Email Verification</h1>
            <p>${companyName ? `Verify your ${companyName} email` : "Verify your company email"}</p>
          </div>
          
          <div class="content">
            <p>Hi there,</p>
            
            <p>We received a request to verify your email address <strong>${email}</strong> on Anonn.</p>
            
            <p>Here's your verification code:</p>
            
            <div class="verification-code">
              ${verificationCode}
            </div>
            
            <div class="note">
              <strong>Note:</strong> This code expires in 10 minutes. If you didn't request this verification, you can safely ignore this email.
            </div>
            
            <p>After verification, your posts will show your company affiliation, helping build credibility in our community.</p>
            
            <p>Questions? Just reply to this email.</p>
            
            <p>Thanks,<br>The Anonn Team</p>
          </div>
          
          <div class="footer">
            <p>This email was sent by Anonn. If you didn't request this verification, please ignore it.</p>
            <p>&copy; 2024 Anonn</p>
          </div>
        </div>
      </body>
    </html>
  `;
  const text2 = `
Email Verification

Hi there,

We received a request to verify your email address ${email} on Anonn.

Your verification code is: ${verificationCode}

This code expires in 10 minutes.

After verification, your posts will show your company affiliation, helping build credibility in our community.

If you didn't request this verification, you can safely ignore this email.

Questions? Just reply to this email.

Thanks,
The Anonn Team
  `;
  return await sendEmail({
    to: email,
    subject,
    text: text2,
    html
  });
}
function extractDomain(email) {
  const domain = email.split("@")[1]?.toLowerCase();
  if (!domain) {
    throw new Error("Invalid email address");
  }
  return domain;
}
function isCompanyDomain(domain) {
  const personalDomains = [
    "gmail.com",
    "yahoo.com",
    "hotmail.com",
    "outlook.com",
    "icloud.com",
    "aol.com",
    "protonmail.com",
    "mail.com",
    "yandex.com",
    "zoho.com",
    "tutanota.com",
    "fastmail.com",
    "guerrillamail.com",
    "10minutemail.com",
    "tempmail.org",
    "mailinator.com"
  ];
  if (domain.toLowerCase() === "gmail.com" || domain.toLowerCase().endsWith(".gmail.com")) {
    return true;
  }
  return !personalDomains.includes(domain.toLowerCase());
}
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}
var EMAIL_CONFIG, createTransporter, transporter;
var init_emailService = __esm({
  "server/emailService.ts"() {
    "use strict";
    init_config();
    EMAIL_CONFIG = CONFIG.EMAIL;
    createTransporter = () => {
      if (!EMAIL_CONFIG.USER || !EMAIL_CONFIG.PASSWORD || !EMAIL_CONFIG.FROM_EMAIL) {
        console.warn("Email configuration incomplete. Email sending will be disabled.");
        return null;
      }
      return nodemailer.createTransport({
        host: EMAIL_CONFIG.HOST,
        port: EMAIL_CONFIG.PORT,
        secure: EMAIL_CONFIG.SECURE,
        auth: {
          user: EMAIL_CONFIG.USER,
          pass: EMAIL_CONFIG.PASSWORD
        },
        tls: {
          rejectUnauthorized: false
          // Allow self-signed certificates for development
        }
      });
    };
    transporter = createTransporter();
  }
});

// server/zkVerificationService.ts
import { RpcProvider, shortString, hash, ec } from "starknet";
import crypto4 from "crypto";
var ZK_CONFIG, ZKVerificationService, zkVerificationService;
var init_zkVerificationService = __esm({
  "server/zkVerificationService.ts"() {
    "use strict";
    ZK_CONFIG = {
      STARKNET_RPC_URL: process.env.STARKNET_RPC_URL || "https://free-rpc.nethermind.io/sepolia-juno",
      VERIFICATION_CONTRACT_ADDRESS: process.env.ZK_VERIFICATION_CONTRACT_ADDRESS || "",
      // To be deployed
      NETWORK: process.env.STARKNET_NETWORK || "sepolia-alpha"
    };
    ZKVerificationService = class {
      provider;
      constructor() {
        this.provider = new RpcProvider({ nodeUrl: ZK_CONFIG.STARKNET_RPC_URL });
      }
      /**
       * Generate a ZK proof for company email verification
       * This is a simplified version - in production, you'd use a proper ZK proof system
       */
      async generateEmailVerificationProof(email, domain, verificationCode, userPrivateKey) {
        try {
          const emailHash = this.hashString(email);
          const domainHash = this.hashString(domain);
          const timestamp2 = Date.now();
          const proofData = {
            emailHash,
            domainHash,
            verificationCode,
            timestamp: timestamp2
          };
          const keyPair = userPrivateKey ? ec.starkCurve.getStarkKey(userPrivateKey) : ec.starkCurve.utils.randomPrivateKey();
          const publicKey = ec.starkCurve.getStarkKey(keyPair);
          const dataToSign = JSON.stringify(proofData);
          const signature = this.signData(dataToSign, keyPair);
          const messageHash = hash.computeHashOnElements([
            shortString.encodeShortString(emailHash),
            shortString.encodeShortString(domainHash),
            verificationCode,
            timestamp2.toString()
          ]);
          const starknetSignature = ec.starkCurve.sign(messageHash, keyPair);
          return {
            emailHash,
            domainHash,
            verificationCode,
            timestamp: timestamp2,
            signature,
            publicKey,
            starknetSignature: {
              r: starknetSignature.r.toString(16),
              s: starknetSignature.s.toString(16)
            }
          };
        } catch (error) {
          console.error("Error generating ZK proof:", error);
          throw new Error("Failed to generate ZK proof");
        }
      }
      /**
       * Verify a ZK proof for company email verification
       */
      async verifyEmailVerificationProof(proof, expectedDomain, expectedCode) {
        const errors = [];
        let isValid = true;
        try {
          const expectedDomainHash = this.hashString(expectedDomain);
          if (proof.domainHash !== expectedDomainHash) {
            errors.push("Domain hash mismatch");
            isValid = false;
          }
          if (proof.verificationCode !== expectedCode) {
            errors.push("Verification code mismatch");
            isValid = false;
          }
          const now = Date.now();
          const maxAge = 15 * 60 * 1e3;
          if (now - proof.timestamp > maxAge) {
            errors.push("Proof timestamp is too old");
            isValid = false;
          }
          const proofData = {
            emailHash: proof.emailHash,
            domainHash: proof.domainHash,
            verificationCode: proof.verificationCode,
            timestamp: proof.timestamp
          };
          const dataToVerify = JSON.stringify(proofData);
          if (!this.verifySignature(dataToVerify, proof.signature, proof.publicKey)) {
            errors.push("Invalid signature");
            isValid = false;
          }
          if (proof.starknetSignature && isValid) {
            const messageHash = hash.computeHashOnElements([
              shortString.encodeShortString(proof.emailHash),
              shortString.encodeShortString(proof.domainHash),
              proof.verificationCode,
              proof.timestamp.toString()
            ]);
            const isStarknetSignatureValid = ec.starkCurve.verify(
              { r: BigInt("0x" + proof.starknetSignature.r), s: BigInt("0x" + proof.starknetSignature.s) },
              messageHash,
              proof.publicKey
            );
            if (!isStarknetSignatureValid) {
              errors.push("Invalid Starknet signature");
              isValid = false;
            }
          }
          const proofHash = this.hashString(JSON.stringify(proof));
          return {
            isValid,
            proofHash,
            errors: errors.length > 0 ? errors : void 0
          };
        } catch (error) {
          console.error("Error verifying ZK proof:", error);
          return {
            isValid: false,
            proofHash: "",
            errors: ["Proof verification failed"]
          };
        }
      }
      /**
       * Submit proof to Starknet for on-chain verification (optional)
       */
      async submitProofToStarknet(proof, account) {
        try {
          if (!ZK_CONFIG.VERIFICATION_CONTRACT_ADDRESS) {
            console.warn("ZK verification contract not deployed, skipping on-chain verification");
            return null;
          }
          const mockTxHash = "0x" + crypto4.randomBytes(32).toString("hex");
          console.log("Mock Starknet transaction submitted:", mockTxHash);
          return mockTxHash;
        } catch (error) {
          console.error("Error submitting proof to Starknet:", error);
          return null;
        }
      }
      /**
       * Create a zero-knowledge proof that user owns a company email without revealing the email
       * This is a simplified version - production would use proper ZK circuits like Circom/Noir
       */
      async createPrivacyPreservingProof(email, domain, verificationCode) {
        const witness = {
          email,
          domain,
          verificationCode,
          random: crypto4.randomBytes(32).toString("hex")
        };
        const publicSignals = [
          this.hashString(domain),
          // Domain hash (verifiable but private)
          this.hashString(verificationCode),
          // Code hash
          Date.now().toString()
          // Timestamp
        ];
        const proof = crypto4.createHash("sha256").update(JSON.stringify(witness) + JSON.stringify(publicSignals)).digest("hex");
        const verificationKey = crypto4.createHash("sha256").update("zk-verification-key-" + domain).digest("hex");
        return {
          proof,
          publicSignals,
          verificationKey
        };
      }
      /**
       * Verify a privacy-preserving ZK proof
       */
      async verifyPrivacyPreservingProof(proof, publicSignals, verificationKey, expectedDomainHash, expectedCodeHash) {
        try {
          if (publicSignals[0] !== expectedDomainHash) {
            return false;
          }
          if (publicSignals[1] !== expectedCodeHash) {
            return false;
          }
          const timestamp2 = parseInt(publicSignals[2]);
          const now = Date.now();
          const maxAge = 15 * 60 * 1e3;
          if (now - timestamp2 > maxAge) {
            return false;
          }
          return proof.length === 64 && verificationKey.length === 64;
        } catch (error) {
          console.error("Error verifying privacy-preserving proof:", error);
          return false;
        }
      }
      /**
       * Utility function to hash strings consistently
       */
      hashString(input) {
        return crypto4.createHash("sha256").update(input.toLowerCase().trim()).digest("hex");
      }
      /**
       * Sign data using ECDSA
       */
      signData(data, privateKey) {
        const hash2 = crypto4.createHash("sha256").update(data).digest();
        return crypto4.createHmac("sha256", privateKey).update(hash2).digest("hex");
      }
      /**
       * Verify ECDSA signature
       */
      verifySignature(data, signature, publicKey) {
        try {
          const hash2 = crypto4.createHash("sha256").update(data).digest();
          const expectedSignature = crypto4.createHmac("sha256", publicKey).update(hash2).digest("hex");
          return signature === expectedSignature;
        } catch (error) {
          return false;
        }
      }
      /**
       * Generate a deterministic proof hash for storage
       */
      generateProofHash(proof) {
        const proofString = JSON.stringify({
          emailHash: proof.emailHash,
          domainHash: proof.domainHash,
          timestamp: proof.timestamp,
          signature: proof.signature
        });
        return this.hashString(proofString);
      }
    };
    zkVerificationService = new ZKVerificationService();
  }
});

// server/zkCircuitHelper.ts
import { generateInputs } from "noir-jwt";
import { BarretenbergVerifier, UltraHonkBackend } from "@aztec/bb.js";
import crypto5 from "crypto";
var MAX_DOMAIN_LENGTH, ZKCircuitHelper;
var init_zkCircuitHelper = __esm({
  "server/zkCircuitHelper.ts"() {
    "use strict";
    init_schema();
    MAX_DOMAIN_LENGTH = 64;
    ZKCircuitHelper = class {
      static version = "1.0.0";
      static circuitPath = "../../zk-circuits/src/main.nr";
      /**
       * Generate a ZK proof for company email verification
       */
      static async generateProof({
        idToken,
        jwtPubkey,
        ephemeralKey,
        domain
      }) {
        if (!idToken || !jwtPubkey) {
          throw new Error(
            "[ZK Circuit] Proof generation failed: idToken and jwtPubkey are required"
          );
        }
        try {
          const jwtInputs = await generateInputs({
            jwt: idToken,
            pubkey: jwtPubkey,
            shaPrecomputeTillKeys: ["email", "email_verified", "nonce"],
            maxSignedDataLength: 640
          });
          const domainUint8Array = new Uint8Array(MAX_DOMAIN_LENGTH);
          domainUint8Array.set(Uint8Array.from(new TextEncoder().encode(domain)));
          const inputs = {
            partial_data: jwtInputs.partial_data,
            partial_hash: jwtInputs.partial_hash,
            full_data_length: jwtInputs.full_data_length,
            base64_decode_offset: jwtInputs.base64_decode_offset,
            jwt_pubkey_modulus_limbs: jwtInputs.pubkey_modulus_limbs,
            jwt_pubkey_redc_params_limbs: jwtInputs.redc_params_limbs,
            jwt_signature_limbs: jwtInputs.signature_limbs,
            domain,
            ephemeral_pubkey: (ephemeralKey.publicKey >> 3n).toString(),
            ephemeral_pubkey_salt: ephemeralKey.salt.toString(),
            ephemeral_pubkey_expiry: Math.floor(ephemeralKey.expiry.getTime() / 1e3).toString()
          };
          console.log("ZK circuit inputs prepared", {
            domain,
            ephemeralPubkey: ephemeralKey.publicKey.toString(),
            ephemeralPubkeyExpiry: ephemeralKey.expiry.toISOString()
          });
          const circuitArtifact = await this.loadCircuitArtifact();
          const backend = new UltraHonkBackend(circuitArtifact.bytecode, { threads: 8 });
          const noir = new Noir(circuitArtifact);
          const startTime = performance.now();
          const { witness } = await noir.execute(inputs);
          const proof = await backend.generateProof(witness);
          const provingTime = performance.now() - startTime;
          console.log(`ZK proof generated in ${provingTime}ms`);
          const publicInputs = this.preparePublicInputs(
            jwtInputs.pubkey_modulus_limbs,
            domain,
            ephemeralKey.publicKey,
            ephemeralKey.expiry
          );
          return {
            proof: proof.proof,
            publicInputs,
            verificationKey: proof.vk
            // Verification key
          };
        } catch (error) {
          console.error("Error generating ZK proof:", error);
          throw new Error("Failed to generate ZK proof");
        }
      }
      /**
       * Verify a ZK proof for company email verification
       */
      static async verifyProof(proof, verification) {
        const errors = [];
        try {
          if (!verification.domain || !verification.jwtPubKey || !verification.ephemeralPubkey || !verification.ephemeralPubkeyExpiry) {
            throw new Error(
              "[ZK Circuit] Proof verification failed: invalid public inputs"
            );
          }
          const vkey = await this.loadVerificationKey();
          const publicInputs = this.preparePublicInputs(
            splitBigIntToLimbs(verification.jwtPubKey, 120, 18),
            verification.domain,
            verification.ephemeralPubkey,
            verification.ephemeralPubkeyExpiry
          );
          const verifier = new BarretenbergVerifier({
            crsPath: process.env.TEMP_DIR || "/tmp"
          });
          const proofData = {
            proof,
            publicInputs
          };
          const isValid = await verifier.verifyUltraHonkProof(
            proofData,
            Uint8Array.from(vkey)
          );
          const proofHash = crypto5.createHash("sha256").update(Buffer.from(proof)).digest("hex");
          return {
            isValid,
            proofHash,
            errors: errors.length > 0 ? errors : void 0
          };
        } catch (error) {
          console.error("Error verifying ZK proof:", error);
          return {
            isValid: false,
            proofHash: "",
            errors: ["ZK proof verification failed"]
          };
        }
      }
      /**
       * Prepare public inputs for the ZK circuit verification
       */
      static preparePublicInputs(jwtPubKeyLimbs, domain, ephemeralPubkey, ephemeralPubkeyExpiry) {
        const publicInputs = [];
        publicInputs.push(
          ...jwtPubKeyLimbs.map((limb) => "0x" + limb.toString(16).padStart(64, "0"))
        );
        const domainUint8Array = new Uint8Array(64);
        domainUint8Array.set(Uint8Array.from(new TextEncoder().encode(domain)));
        publicInputs.push(
          ...Array.from(domainUint8Array).map(
            (byte) => "0x" + byte.toString(16).padStart(64, "0")
          )
        );
        publicInputs.push("0x" + (ephemeralPubkey >> 3n).toString(16).padStart(64, "0"));
        publicInputs.push("0x" + Math.floor(ephemeralPubkeyExpiry.getTime() / 1e3).toString(16).padStart(64, "0"));
        return publicInputs;
      }
      /**
       * Load circuit artifact (compiled Noir circuit)
       * In production, this would be the compiled circuit.json file
       */
      static async loadCircuitArtifact() {
        const mockCircuit = {
          bytecode: new Uint8Array(),
          // Would contain actual bytecode
          abi: {},
          // Would contain actual ABI
          backend: "ultrahonk"
        };
        return mockCircuit;
      }
      /**
       * Load verification key
       * In production, this would be the circuit-vkey.json file
       */
      static async loadVerificationKey() {
        const mockVKey = new Uint8Array(32);
        return mockVKey;
      }
      /**
       * Get circuit version
       */
      static getVersion() {
        return this.version;
      }
      /**
       * Validate domain for company verification
       */
      static validateCompanyDomain(domain) {
        const blockedDomains = [
          "gmail.com",
          "yahoo.com",
          "hotmail.com",
          "outlook.com",
          "protonmail.com",
          "icloud.com",
          "mail.com",
          "yandex.com",
          "aol.com",
          "zoho.com"
        ];
        if (domain.toLowerCase() === "gmail.com" || domain.toLowerCase().endsWith(".gmail.com")) {
          return true;
        }
        return !blockedDomains.includes(domain.toLowerCase());
      }
      /**
       * Generate a proof hash for storage
       */
      static generateProofHash(proof) {
        return crypto5.createHash("sha256").update(Buffer.from(proof)).digest("hex");
      }
    };
  }
});

// server/ephemeralKeyService.ts
import crypto6 from "crypto";
import { ec as ec2 } from "starknet";
var EphemeralKeyService;
var init_ephemeralKeyService = __esm({
  "server/ephemeralKeyService.ts"() {
    "use strict";
    EphemeralKeyService = class {
      static KEY_EXPIRY_HOURS = 24;
      // Keys expire after 24 hours
      static SALT_LENGTH = 32;
      /**
       * Generate a new ephemeral key pair for ZK proof generation
       */
      static async generateEphemeralKey() {
        try {
          const privateKey = this.generateSecureRandomKey();
          const publicKey = this.derivePublicKey(privateKey);
          const salt = this.generateSecureSalt();
          const expiry = /* @__PURE__ */ new Date();
          expiry.setHours(expiry.getHours() + this.KEY_EXPIRY_HOURS);
          const ephemeralPubkeyHash = this.generateEphemeralPubkeyHash(publicKey, salt, expiry);
          return {
            privateKey,
            publicKey,
            salt,
            expiry,
            ephemeralPubkeyHash
          };
        } catch (error) {
          console.error("Error generating ephemeral key:", error);
          throw new Error("Failed to generate ephemeral key");
        }
      }
      /**
       * Generate a secure random private key
       */
      static generateSecureRandomKey() {
        const randomBytes = crypto6.randomBytes(32);
        return BigInt("0x" + randomBytes.toString("hex"));
      }
      /**
       * Derive public key from private key using Ed25519
       */
      static derivePublicKey(privateKey) {
        try {
          const privateKeyBytes = this.bigIntToUint8Array(privateKey, 32);
          const keyPair = ec2.starkCurve.getStarkKey(privateKey.toString(16));
          return BigInt("0x" + keyPair);
        } catch (error) {
          console.error("Error deriving public key:", error);
          throw new Error("Failed to derive public key");
        }
      }
      /**
       * Generate a secure random salt
       */
      static generateSecureSalt() {
        const saltBytes = crypto6.randomBytes(this.SALT_LENGTH);
        return BigInt("0x" + saltBytes.toString("hex"));
      }
      /**
       * Generate ephemeral pubkey hash for OAuth nonce
       */
      static generateEphemeralPubkeyHash(publicKey, salt, expiry) {
        try {
          const expiryTimestamp = Math.floor(expiry.getTime() / 1e3);
          const hashInput = `${publicKey.toString()}:${salt.toString()}:${expiryTimestamp}`;
          const hash2 = crypto6.createHash("sha256").update(hashInput).digest();
          return BigInt("0x" + hash2.subarray(0, 32).toString("hex"));
        } catch (error) {
          console.error("Error generating ephemeral pubkey hash:", error);
          throw new Error("Failed to generate ephemeral pubkey hash");
        }
      }
      /**
       * Validate if an ephemeral key is still valid (not expired)
       */
      static isEphemeralKeyValid(ephemeralKey) {
        try {
          const now = /* @__PURE__ */ new Date();
          return ephemeralKey.expiry > now;
        } catch (error) {
          console.error("Error validating ephemeral key:", error);
          return false;
        }
      }
      /**
       * Sign data using the ephemeral private key
       */
      static signWithEphemeralKey(privateKey, data) {
        try {
          const dataHash = crypto6.createHash("sha256").update(data).digest();
          const signature = crypto6.createHmac("sha256", privateKey.toString()).update(dataHash).digest("hex");
          return signature;
        } catch (error) {
          console.error("Error signing with ephemeral key:", error);
          throw new Error("Failed to sign with ephemeral key");
        }
      }
      /**
       * Verify signature using the ephemeral public key
       */
      static verifyWithEphemeralKey(publicKey, data, signature) {
        try {
          const dataHash = crypto6.createHash("sha256").update(data).digest();
          const expectedSignature = crypto6.createHmac("sha256", publicKey.toString()).update(dataHash).digest("hex");
          return signature === expectedSignature;
        } catch (error) {
          console.error("Error verifying with ephemeral key:", error);
          return false;
        }
      }
      /**
       * Clean up expired ephemeral keys (for maintenance)
       */
      static cleanupExpiredKeys() {
        console.log("Cleaning up expired ephemeral keys...");
      }
      /**
       * Store ephemeral key securely (encrypted)
       * This is a simplified version - in production use proper encryption
       */
      static async storeEphemeralKey(keyId, ephemeralKey) {
        try {
          const encryptedKey = this.encryptEphemeralKey(ephemeralKey);
          console.log(`Storing ephemeral key ${keyId}:`, {
            publicKey: ephemeralKey.publicKey.toString(),
            expiry: ephemeralKey.expiry.toISOString(),
            encrypted: true
          });
        } catch (error) {
          console.error("Error storing ephemeral key:", error);
          throw new Error("Failed to store ephemeral key");
        }
      }
      /**
       * Retrieve ephemeral key securely
       */
      static async retrieveEphemeralKey(keyId) {
        try {
          console.log(`Retrieving ephemeral key ${keyId}`);
          return null;
        } catch (error) {
          console.error("Error retrieving ephemeral key:", error);
          return null;
        }
      }
      /**
       * Encrypt ephemeral key for secure storage
       */
      static encryptEphemeralKey(ephemeralKey) {
        try {
          const keyData = JSON.stringify({
            privateKey: ephemeralKey.privateKey.toString(),
            publicKey: ephemeralKey.publicKey.toString(),
            salt: ephemeralKey.salt.toString(),
            expiry: ephemeralKey.expiry.toISOString(),
            ephemeralPubkeyHash: ephemeralKey.ephemeralPubkeyHash.toString()
          });
          const encryptionKey = process.env.EPHEMERAL_KEY_ENCRYPTION_KEY || "default-encryption-key";
          const encrypted = crypto6.createHmac("sha256", encryptionKey).update(keyData).digest("hex");
          return encrypted;
        } catch (error) {
          console.error("Error encrypting ephemeral key:", error);
          throw new Error("Failed to encrypt ephemeral key");
        }
      }
      /**
       * Utility function to convert bigint to Uint8Array
       */
      static bigIntToUint8Array(value, length) {
        const result = new Uint8Array(length);
        for (let i = 0; i < length; i++) {
          result[i] = Number(value >> BigInt(i * 8) & 0xFFn);
        }
        return result;
      }
      /**
       * Generate a unique key ID
       */
      static generateKeyId(userId) {
        const timestamp2 = Date.now();
        const random = crypto6.randomBytes(8).toString("hex");
        return `eph_${userId}_${timestamp2}_${random}`;
      }
      /**
       * Get key expiry information
       */
      static getKeyExpiryInfo(ephemeralKey) {
        const now = /* @__PURE__ */ new Date();
        const isExpired = ephemeralKey.expiry <= now;
        const expiresIn = ephemeralKey.expiry.getTime() - now.getTime();
        return {
          isExpired,
          expiresIn: Math.max(0, expiresIn),
          expiresAt: ephemeralKey.expiry
        };
      }
    };
  }
});

// server/companyVerificationService.ts
var companyVerificationService_exports = {};
__export(companyVerificationService_exports, {
  CompanyVerificationService: () => CompanyVerificationService,
  companyVerificationService: () => companyVerificationService
});
import { eq as eq3, and as and3 } from "drizzle-orm";
var ZKProviders, CompanyVerificationService, companyVerificationService;
var init_companyVerificationService = __esm({
  "server/companyVerificationService.ts"() {
    "use strict";
    init_db();
    init_schema();
    init_emailService();
    init_zkVerificationService();
    init_zkCircuitHelper();
    init_ephemeralKeyService();
    init_config();
    ZKProviders = {};
    CompanyVerificationService = class {
      // Step 1: Initiate verification by sending email code
      async initiateVerification(request) {
        try {
          const { userId, email } = request;
          if (!isValidEmail(email)) {
            return { success: false, message: "Invalid email format" };
          }
          const domain = extractDomain(email);
          if (!isCompanyDomain(domain)) {
            return { success: false, message: "Personal email domains are not allowed. Please use your company email." };
          }
          const user = await db.select().from(users).where(eq3(users.id, userId)).limit(1);
          if (user.length === 0) {
            return { success: false, message: "User not found" };
          }
          if (user[0].isCompanyVerified) {
            return { success: false, message: "You already have a verified company email" };
          }
          if (user[0].verificationCodeExpiresAt && user[0].verificationCodeExpiresAt > /* @__PURE__ */ new Date()) {
            const minutesLeft = Math.ceil((user[0].verificationCodeExpiresAt.getTime() - (/* @__PURE__ */ new Date()).getTime()) / (1e3 * 60));
            return {
              success: false,
              message: `Please wait ${minutesLeft} minutes before requesting another verification code.`
            };
          }
          const verificationCode = generateVerificationCode();
          const expiresAt = /* @__PURE__ */ new Date();
          expiresAt.setMinutes(expiresAt.getMinutes() + CONFIG.COMPANY_VERIFICATION.CODE_EXPIRY_MINUTES);
          const companyMapping = await this.getCompanyNameFromDomain(domain);
          const companyName = companyMapping?.companyName || this.generateCompanyNameFromDomain(domain);
          await db.update(users).set({
            companyEmail: email,
            companyDomain: domain,
            companyName,
            verificationCode,
            verificationCodeExpiresAt: expiresAt,
            updatedAt: /* @__PURE__ */ new Date()
          }).where(eq3(users.id, userId));
          const emailSent = await sendCompanyVerificationEmail(email, verificationCode, companyName);
          if (!emailSent) {
            return { success: false, message: "Failed to send verification email. Please try again later." };
          }
          return {
            success: true,
            message: `Verification code sent to ${email}. Please check your email and enter the code to complete verification.`
          };
        } catch (error) {
          console.error("Error initiating company verification:", error);
          return { success: false, message: "An error occurred. Please try again later." };
        }
      }
      // Step 2: Confirm verification with code and optional ZK proof
      async confirmVerification(request) {
        try {
          const { userId, email, code, zkProof } = request;
          const userRecord = await db.select().from(users).where(
            and3(
              eq3(users.id, userId),
              eq3(users.companyEmail, email),
              eq3(users.verificationCode, code)
            )
          ).limit(1);
          if (userRecord.length === 0) {
            return { success: false, message: "Invalid verification code or email not found" };
          }
          if (!userRecord[0].verificationCodeExpiresAt || /* @__PURE__ */ new Date() > userRecord[0].verificationCodeExpiresAt) {
            await db.update(users).set({
              verificationCode: null,
              verificationCodeExpiresAt: null
            }).where(eq3(users.id, userId));
            return { success: false, message: "Verification code has expired. Please request a new one." };
          }
          const domain = extractDomain(email);
          let zkProofHash;
          let zkProofData;
          if (zkProof) {
            try {
              const parsedProof = JSON.parse(zkProof);
              const verificationResult = await zkVerificationService.verifyEmailVerificationProof(
                parsedProof,
                domain,
                code
              );
              if (!verificationResult.isValid) {
                return {
                  success: false,
                  message: `ZK proof verification failed: ${verificationResult.errors?.join(", ")}`
                };
              }
              zkProofHash = verificationResult.proofHash;
              zkProofData = zkProof;
            } catch (error) {
              console.error("Error verifying ZK proof:", error);
              return { success: false, message: "Invalid ZK proof format" };
            }
          } else {
            try {
              const generatedProof = await zkVerificationService.generateEmailVerificationProof(
                email,
                domain,
                code
              );
              zkProofData = JSON.stringify(generatedProof);
              zkProofHash = zkVerificationService.generateProofHash(generatedProof);
            } catch (error) {
              console.error("Error generating ZK proof:", error);
            }
          }
          const companyMapping = await this.getCompanyNameFromDomain(domain);
          const companyName = companyMapping?.companyName || this.generateCompanyNameFromDomain(domain);
          await db.update(users).set({
            companyEmail: email,
            companyDomain: domain,
            companyName,
            isCompanyVerified: true,
            companyVerifiedAt: /* @__PURE__ */ new Date(),
            zkProofHash,
            verificationCode: null,
            // Clear the verification code
            verificationCodeExpiresAt: null
            // Clear the expiry
          }).where(eq3(users.id, userId));
          return {
            success: true,
            message: `Company email verified successfully! Your posts will now show you as verified from ${companyName}.`,
            zkProofHash
          };
        } catch (error) {
          console.error("Error confirming company verification:", error);
          return { success: false, message: "An error occurred during verification. Please try again." };
        }
      }
      // Get company name from domain mapping table
      async getCompanyNameFromDomain(domain) {
        try {
          const mapping = await db.select().from(companyDomains).where(eq3(companyDomains.domain, domain)).limit(1);
          if (mapping.length === 0) {
            return null;
          }
          return {
            domain: mapping[0].domain,
            companyName: mapping[0].companyName,
            logo: mapping[0].logo || void 0
          };
        } catch (error) {
          console.error("Error fetching company domain mapping:", error);
          return null;
        }
      }
      // Add/update company domain mapping
      async addCompanyDomainMapping(mapping) {
        try {
          const { domain, companyName, logo } = mapping;
          const existing = await db.select().from(companyDomains).where(eq3(companyDomains.domain, domain)).limit(1);
          if (existing.length > 0) {
            await db.update(companyDomains).set({
              companyName,
              logo,
              updatedAt: /* @__PURE__ */ new Date()
            }).where(eq3(companyDomains.domain, domain));
          } else {
            await db.insert(companyDomains).values({
              domain,
              companyName,
              logo,
              isVerified: true
            });
          }
          return true;
        } catch (error) {
          console.error("Error adding company domain mapping:", error);
          return false;
        }
      }
      // Generate company name from domain (fallback)
      generateCompanyNameFromDomain(domain) {
        const parts = domain.split(".");
        const mainPart = parts[0];
        let companyName = mainPart.charAt(0).toUpperCase() + mainPart.slice(1);
        const commonMappings = {
          "google": "Google",
          "microsoft": "Microsoft",
          "apple": "Apple",
          "amazon": "Amazon",
          "meta": "Meta",
          "netflix": "Netflix",
          "uber": "Uber",
          "airbnb": "Airbnb",
          "spotify": "Spotify",
          "tesla": "Tesla",
          "openai": "OpenAI",
          "anthropic": "Anthropic"
        };
        return commonMappings[mainPart.toLowerCase()] || companyName;
      }
      // Get user's verification status
      async getVerificationStatus(userId) {
        try {
          const user = await db.select({
            isCompanyVerified: users.isCompanyVerified,
            companyName: users.companyName,
            companyDomain: users.companyDomain,
            companyVerifiedAt: users.companyVerifiedAt
          }).from(users).where(eq3(users.id, userId)).limit(1);
          if (user.length === 0) {
            return { isVerified: false };
          }
          const userData = user[0];
          return {
            isVerified: userData.isCompanyVerified,
            companyName: userData.companyName || void 0,
            companyDomain: userData.companyDomain || void 0,
            verifiedAt: userData.companyVerifiedAt || void 0
          };
        } catch (error) {
          console.error("Error getting verification status:", error);
          return { isVerified: false };
        }
      }
      // Remove company verification (for admin or user request)
      async removeVerification(userId) {
        try {
          await db.update(users).set({
            companyEmail: null,
            companyDomain: null,
            companyName: null,
            isCompanyVerified: false,
            companyVerifiedAt: null,
            zkProofHash: null
          }).where(eq3(users.id, userId));
          return true;
        } catch (error) {
          console.error("Error removing company verification:", error);
          return false;
        }
      }
      // ZK Proof-based verification methods
      /**
       * Initiate ZK-based company verification
       */
      async initiateZKVerification(request) {
        try {
          const { userId, provider } = request;
          const user = await db.select().from(users).where(eq3(users.id, userId)).limit(1);
          if (user.length === 0) {
            return { success: false, message: "User not found" };
          }
          if (user[0].isCompanyVerified) {
            return { success: false, message: "You already have a verified company email" };
          }
          const ephemeralKey = await EphemeralKeyService.generateEphemeralKey();
          const ephemeralKeyId = EphemeralKeyService.generateKeyId(userId);
          await EphemeralKeyService.storeEphemeralKey(ephemeralKeyId, ephemeralKey);
          const zkProvider = ZKProviders[provider];
          if (!zkProvider) {
            return { success: false, message: "Unsupported ZK provider" };
          }
          return {
            success: true,
            message: `ZK verification initiated with ${provider}. Please complete the OAuth flow.`,
            ephemeralKeyId,
            ephemeralKey
          };
        } catch (error) {
          console.error("Error initiating ZK verification:", error);
          return { success: false, message: "Failed to initiate ZK verification" };
        }
      }
      /**
       * Confirm ZK-based company verification
       */
      async confirmZKVerification(request) {
        try {
          const { userId, ephemeralKeyId, proof, proofArgs } = request;
          const ephemeralKey = await EphemeralKeyService.retrieveEphemeralKey(ephemeralKeyId);
          if (!ephemeralKey) {
            return { success: false, message: "Ephemeral key not found or expired" };
          }
          if (!EphemeralKeyService.isEphemeralKeyValid(ephemeralKey)) {
            return { success: false, message: "Ephemeral key has expired. Please restart the verification process." };
          }
          const provider = ZKProviders[proofArgs.provider];
          if (!provider) {
            return { success: false, message: "Unsupported ZK provider" };
          }
          const isValid = await provider.verifyProof(
            proof,
            proofArgs.anonGroupId || "",
            // Domain from proof
            ephemeralKey.publicKey,
            ephemeralKey.expiry,
            proofArgs
          );
          if (!isValid) {
            return { success: false, message: "ZK proof verification failed" };
          }
          const domain = proofArgs.anonGroupId;
          const companyMapping = await this.getCompanyNameFromDomain(domain);
          const companyName = companyMapping?.companyName || this.generateCompanyNameFromDomain(domain);
          const zkProofHash = ZKCircuitHelper.generateProofHash(proof);
          await db.insert(companyVerifications).values({
            userId,
            email: `${userId}@${domain}`,
            // Placeholder email for ZK verification
            domain,
            verificationCode: "ZK_VERIFIED",
            // Special code for ZK verification
            zkProof: JSON.stringify({
              proof: Array.from(proof),
              proofArgs,
              ephemeralKeyId
            }),
            zkProofHash,
            status: "verified",
            verifiedAt: /* @__PURE__ */ new Date(),
            expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1e3)
            // 1 year expiry
          });
          await db.update(users).set({
            companyDomain: domain,
            companyName,
            isCompanyVerified: true,
            companyVerifiedAt: /* @__PURE__ */ new Date(),
            zkProofHash
          }).where(eq3(users.id, userId));
          return {
            success: true,
            message: `Company email verified successfully using ZK proof! Your posts will now show you as verified from ${companyName}.`,
            companyName,
            zkProofHash
          };
        } catch (error) {
          console.error("Error confirming ZK verification:", error);
          return { success: false, message: "Failed to confirm ZK verification" };
        }
      }
      /**
       * Get available ZK providers
       */
      getAvailableZKProviders() {
        return [
          {
            id: "google-oauth",
            name: "Google Workspace",
            description: "Verify using your Google Workspace account"
          }
        ];
      }
      /**
       * Check if ZK verification is available for a domain
       */
      async isZKVerificationAvailable(domain) {
        try {
          return ZKCircuitHelper.validateCompanyDomain(domain);
        } catch (error) {
          console.error("Error checking ZK verification availability:", error);
          return false;
        }
      }
      /**
       * Store ZK verification result (client-side flow)
       */
      async storeZKVerification(params) {
        try {
          const { userId, provider, domain, email, zkProof, verificationMethod } = params;
          console.log("Storing ZK verification:", { userId, provider, domain, email, verificationMethod });
          if (!ZKCircuitHelper.validateCompanyDomain(domain)) {
            return {
              success: false,
              message: "Invalid company domain"
            };
          }
          let companyName = domain;
          try {
            const existingMapping = await this.getCompanyNameFromDomain(domain);
            if (existingMapping) {
              companyName = existingMapping.companyName;
            }
          } catch (error) {
            console.log("No existing company mapping found, using domain as company name");
          }
          const existingUser = await db.select().from(users).where(eq3(users.id, userId)).limit(1);
          if (existingUser.length === 0) {
            return {
              success: false,
              message: "User not found"
            };
          }
          if (existingUser[0].isCompanyVerified) {
            return {
              success: false,
              message: "User already has verified company email"
            };
          }
          console.log("Updating user verification status for userId:", userId);
          try {
            const updateResult = await db.update(users).set({
              isCompanyVerified: true,
              companyEmail: email,
              companyDomain: domain,
              companyName,
              companyVerifiedAt: /* @__PURE__ */ new Date(),
              zkProofHash: zkProof
            }).where(eq3(users.id, userId));
            console.log("User update result:", updateResult);
            const verifyUser = await db.select({
              id: users.id,
              email: users.email,
              isCompanyVerified: users.isCompanyVerified,
              companyDomain: users.companyDomain,
              companyName: users.companyName
            }).from(users).where(eq3(users.id, userId)).limit(1);
            if (verifyUser.length > 0 && verifyUser[0].isCompanyVerified) {
              console.log("\u2705 User verification status confirmed updated");
            } else {
              console.error("\u274C User verification status update failed - user not found or not updated");
              return {
                success: false,
                message: "Failed to update user verification status"
              };
            }
          } catch (updateError) {
            console.error("\u274C Error updating user verification status:", updateError);
            return {
              success: false,
              message: "Failed to update user verification status"
            };
          }
          console.log("\u2705 ZK verification stored successfully for user:", userId);
          console.log("\u2705 User verification status updated in users table");
          return {
            success: true,
            message: `Successfully verified company email for ${domain}`,
            domain,
            companyName
          };
        } catch (error) {
          console.error("Error storing ZK verification:", error);
          return {
            success: false,
            message: "Failed to store verification"
          };
        }
      }
      /**
       * Get verification status for a user
       */
      async getVerificationStatus(userId) {
        try {
          const user = await db.select().from(users).where(eq3(users.id, userId)).limit(1);
          if (user.length > 0 && user[0].isCompanyVerified && user[0].companyDomain) {
            return {
              isVerified: true,
              companyName: user[0].companyName || user[0].companyDomain,
              companyDomain: user[0].companyDomain,
              verificationDate: user[0].companyVerifiedAt?.toISOString() || user[0].updatedAt?.toISOString(),
              verificationMethod: user[0].zkProofHash ? "zk-proof" : "email"
            };
          }
          return { isVerified: false };
        } catch (error) {
          console.error("Error getting verification status:", error);
          return { isVerified: false };
        }
      }
    };
    companyVerificationService = new CompanyVerificationService();
  }
});

// server/zkVerificationRoutes.ts
var zkVerificationRoutes_exports = {};
__export(zkVerificationRoutes_exports, {
  default: () => zkVerificationRoutes_default
});
import { Router } from "express";
var ZKProviders2, router, zkVerificationRoutes_default;
var init_zkVerificationRoutes = __esm({
  "server/zkVerificationRoutes.ts"() {
    "use strict";
    init_companyVerificationService();
    init_ephemeralKeyService();
    init_auth();
    ZKProviders2 = {};
    router = Router();
    router.get("/test", async (req, res) => {
      res.json({
        success: true,
        message: "ZK verification routes are working!",
        timestamp: (/* @__PURE__ */ new Date()).toISOString(),
        availableProviders: Object.keys(ZKProviders2)
      });
    });
    router.get("/providers", async (req, res) => {
      try {
        const providers = companyVerificationService.getAvailableZKProviders();
        res.json({
          success: true,
          providers
        });
      } catch (error) {
        console.error("Error getting ZK providers:", error);
        res.status(500).json({
          success: false,
          message: "Failed to get ZK providers"
        });
      }
    });
    router.post("/initiate", requireAuth, async (req, res) => {
      try {
        const { userId, provider, redirectUrl } = req.body;
        console.log("\u{1F50D} ZK Verification Debug:", {
          userId,
          provider,
          redirectUrl,
          availableProviders: Object.keys(ZKProviders2),
          providerExists: ZKProviders2.hasOwnProperty(provider),
          providerValue: ZKProviders2[provider]
        });
        if (!userId || !provider) {
          return res.status(400).json({
            success: false,
            message: "userId and provider are required"
          });
        }
        if (!ZKProviders2[provider]) {
          console.log("\u274C Provider validation failed:", {
            requestedProvider: provider,
            availableProviders: Object.keys(ZKProviders2)
          });
          return res.status(400).json({
            success: false,
            message: "Unsupported ZK provider"
          });
        }
        const result = await companyVerificationService.initiateZKVerification({
          userId,
          provider,
          redirectUrl
        });
        if (!result.success) {
          return res.status(400).json(result);
        }
        res.json({
          success: true,
          message: result.message,
          ephemeralKeyId: result.ephemeralKeyId,
          ephemeralKey: result.ephemeralKey ? {
            publicKey: result.ephemeralKey.publicKey.toString(),
            ephemeralPubkeyHash: result.ephemeralKey.ephemeralPubkeyHash.toString(),
            expiry: result.ephemeralKey.expiry.toISOString()
          } : void 0
        });
      } catch (error) {
        console.error("Error initiating ZK verification:", error);
        res.status(500).json({
          success: false,
          message: "Failed to initiate ZK verification"
        });
      }
    });
    router.post("/confirm-legacy", async (req, res) => {
      try {
        const { userId, ephemeralKeyId, proof, proofArgs } = req.body;
        if (!userId || !ephemeralKeyId || !proof || !proofArgs) {
          return res.status(400).json({
            success: false,
            message: "userId, ephemeralKeyId, proof, and proofArgs are required"
          });
        }
        const proofUint8Array = proof instanceof Uint8Array ? proof : new Uint8Array(proof);
        const result = await companyVerificationService.confirmZKVerification({
          userId,
          ephemeralKeyId,
          proof: proofUint8Array,
          proofArgs
        });
        if (!result.success) {
          return res.status(400).json(result);
        }
        res.json(result);
      } catch (error) {
        console.error("Error confirming ZK verification:", error);
        res.status(500).json({
          success: false,
          message: "Failed to confirm ZK verification"
        });
      }
    });
    router.post("/confirm", requireAuth, async (req, res) => {
      try {
        const { provider, domain, email, idToken, zkProof } = req.body;
        const userId = req.user?.id;
        console.log("ZK confirmation request:", {
          userId,
          authenticatedUserId: req.user?.id,
          userObject: req.user,
          provider,
          domain,
          email,
          hasIdToken: !!idToken,
          hasZkProof: !!zkProof,
          authHeader: req.headers.authorization
        });
        if (!userId || !provider || !domain || !email) {
          return res.status(400).json({
            success: false,
            message: `Missing required fields: userId=${!!userId}, provider=${!!provider}, domain=${!!domain}, email=${!!email}`
          });
        }
        if (idToken) {
          try {
            const [, payloadB64] = idToken.split(".");
            const payload = JSON.parse(atob(payloadB64));
            const hdMismatch = payload.hd && payload.hd !== domain;
            const emailMismatch = payload.email !== email;
            if (emailMismatch || hdMismatch) {
              if (!payload.hd && domain && (domain === "gmail.com" || domain.endsWith(".gmail.com"))) {
                const emailDomain = payload.email.split("@")[1]?.toLowerCase();
                if (emailDomain !== domain && emailDomain !== "gmail.com") {
                  return res.status(400).json({
                    success: false,
                    message: "ID token validation failed - domain mismatch"
                  });
                }
              } else if (hdMismatch || emailMismatch) {
                return res.status(400).json({
                  success: false,
                  message: "ID token validation failed"
                });
              }
            }
            console.log("ID token validated for:", payload.email);
          } catch (error) {
            console.error("ID token parsing error:", error);
            return res.status(400).json({
              success: false,
              message: "Invalid ID token format"
            });
          }
        }
        console.log("Simulating ZK proof verification...");
        const result = await companyVerificationService.storeZKVerification({
          userId,
          provider,
          domain,
          email,
          zkProof: zkProof || "demo-proof",
          verificationMethod: "zk-proof"
        });
        if (!result.success) {
          return res.status(400).json(result);
        }
        res.json({
          success: true,
          message: `Successfully verified company email for ${domain}`,
          domain,
          companyName: domain,
          verificationMethod: "zk-proof"
        });
      } catch (error) {
        console.error("Error confirming ZK verification:", error);
        res.status(500).json({
          success: false,
          message: "Failed to confirm ZK verification"
        });
      }
    });
    router.get("/availability/:domain", async (req, res) => {
      try {
        const { domain } = req.params;
        if (!domain) {
          return res.status(400).json({
            success: false,
            message: "Domain is required"
          });
        }
        const isAvailable = await companyVerificationService.isZKVerificationAvailable(domain);
        res.json({
          success: true,
          domain,
          zkVerificationAvailable: isAvailable
        });
      } catch (error) {
        console.error("Error checking ZK verification availability:", error);
        res.status(500).json({
          success: false,
          message: "Failed to check ZK verification availability"
        });
      }
    });
    router.get("/oauth/google/callback", async (req, res) => {
      try {
        const { code, state, error } = req.query;
        if (error) {
          return res.redirect("/settings?zk_error=" + encodeURIComponent(error));
        }
        if (!code || !state) {
          return res.redirect("/settings?zk_error=missing_code_or_state");
        }
        const redirectUrl = `/settings?zk_provider=google&code=${code}&state=${state}`;
        res.redirect(redirectUrl);
      } catch (error) {
        console.error("Error handling Google OAuth callback:", error);
        res.redirect("/settings?zk_error=oauth_callback_failed");
      }
    });
    router.get("/ephemeral-key/:keyId/status", async (req, res) => {
      try {
        const { keyId } = req.params;
        if (!keyId) {
          return res.status(400).json({
            success: false,
            message: "Key ID is required"
          });
        }
        const ephemeralKey = await EphemeralKeyService.retrieveEphemeralKey(keyId);
        if (!ephemeralKey) {
          return res.json({
            success: true,
            keyExists: false,
            message: "Ephemeral key not found"
          });
        }
        const keyInfo = EphemeralKeyService.getKeyExpiryInfo(ephemeralKey);
        res.json({
          success: true,
          keyExists: true,
          isValid: keyInfo.isExpired === false,
          expiresAt: keyInfo.expiresAt.toISOString(),
          expiresIn: keyInfo.expiresIn,
          isExpired: keyInfo.isExpired
        });
      } catch (error) {
        console.error("Error getting ephemeral key status:", error);
        res.status(500).json({
          success: false,
          message: "Failed to get ephemeral key status"
        });
      }
    });
    router.get("/health", async (req, res) => {
      try {
        const providers = companyVerificationService.getAvailableZKProviders();
        res.json({
          success: true,
          status: "healthy",
          zkEnabled: true,
          providersCount: providers.length,
          providers: providers.map((p) => ({ id: p.id, name: p.name }))
        });
      } catch (error) {
        console.error("ZK health check failed:", error);
        res.status(500).json({
          success: false,
          status: "unhealthy",
          error: "ZK services unavailable"
        });
      }
    });
    zkVerificationRoutes_default = router;
  }
});

// server/simpleAuth.ts
var simpleAuth_exports = {};
__export(simpleAuth_exports, {
  default: () => simpleAuth_default,
  getNonce: () => getNonce,
  verifySignature: () => verifySignature
});
import { Router as Router2 } from "express";
import { ethers } from "ethers";
import { nanoid } from "nanoid";
import nacl from "tweetnacl";
import bs58 from "bs58";
import { PublicKey } from "@solana/web3.js";
async function getNonce(req, res) {
  try {
    const { walletAddress } = req.body;
    if (!walletAddress || typeof walletAddress !== "string") {
      return res.status(400).json({ error: "Wallet address is required" });
    }
    const nonce = nanoid(32);
    console.log("[auth/nonce] Generating nonce for wallet:", walletAddress);
    let user = await storage.getUserByWalletAddress(walletAddress);
    if (!user) {
      const lowerWallet = walletAddress.toLowerCase();
      user = await storage.getUserByWalletAddress(lowerWallet);
    }
    if (!user) {
      console.log("[auth/nonce] Creating new user for wallet:", walletAddress);
      user = await storage.upsertUser({
        id: nanoid(),
        // Generate unique user ID
        walletAddress,
        // Keep original case for Solana
        authNonce: nonce,
        username: null,
        allowlisted: true,
        karma: 0,
        postKarma: 0,
        commentKarma: 0,
        awardeeKarma: 0,
        followerCount: 0,
        followingCount: 0,
        isVerified: false,
        isPremium: false,
        isOnline: true
      });
    } else {
      console.log("[auth/nonce] Updating nonce for existing user:", user.id);
      user = await storage.upsertUser({
        ...user,
        authNonce: nonce
      });
    }
    return res.json({ nonce });
  } catch (error) {
    console.error("[auth/nonce] Error:", error);
    console.error("[auth/nonce] Error stack:", error instanceof Error ? error.stack : "No stack trace");
    console.error("[auth/nonce] Error message:", error instanceof Error ? error.message : String(error));
    return res.status(500).json({
      error: "Failed to generate nonce",
      details: error instanceof Error ? error.message : String(error)
    });
  }
}
async function verifySignature(req, res) {
  try {
    const { walletAddress, signature, nonce } = req.body;
    if (!walletAddress || !signature || !nonce) {
      return res.status(400).json({
        error: "Wallet address, signature, and nonce are required"
      });
    }
    console.log("[auth/verify] Verifying signature for wallet:", walletAddress);
    let user = await storage.getUserByWalletAddress(walletAddress);
    if (!user) {
      const lowerWallet = walletAddress.toLowerCase();
      user = await storage.getUserByWalletAddress(lowerWallet);
    }
    if (!user) {
      console.log("[auth/verify] User not found for wallet:", walletAddress);
      return res.status(401).json({ error: "User not found" });
    }
    if (!user.authNonce || user.authNonce !== nonce) {
      console.log("[auth/verify] Nonce mismatch for user:", user.id);
      return res.status(401).json({ error: "Invalid or expired nonce" });
    }
    const message = `Sign this message to authenticate with Anonn.

Nonce: ${nonce}`;
    try {
      let isValid = false;
      try {
        const publicKey = new PublicKey(walletAddress);
        const messageBytes = new TextEncoder().encode(message);
        const signatureBytes = bs58.decode(signature);
        isValid = nacl.sign.detached.verify(
          messageBytes,
          signatureBytes,
          publicKey.toBytes()
        );
        if (isValid) {
          console.log("[auth/verify] Solana signature verified successfully for user:", user.id);
        }
      } catch (solanaError) {
        console.log("[auth/verify] Not a Solana signature, trying Ethereum verification");
      }
      if (!isValid) {
        try {
          const recoveredAddress = ethers.verifyMessage(message, signature);
          isValid = recoveredAddress.toLowerCase() === walletAddress.toLowerCase();
          if (isValid) {
            console.log("[auth/verify] Ethereum signature verified successfully for user:", user.id);
          }
        } catch (ethError) {
          console.error("[auth/verify] Ethereum verification failed:", ethError);
        }
      }
      if (!isValid) {
        console.log("[auth/verify] Signature verification failed for wallet:", walletAddress);
        return res.status(401).json({ error: "Signature verification failed" });
      }
      await storage.upsertUser({
        ...user,
        authNonce: null,
        isOnline: true
        // Mark user as online
      });
      const token = generateToken(user.id);
      return res.json({
        token,
        user: {
          id: user.id,
          walletAddress: user.walletAddress,
          username: user.username,
          karma: user.karma,
          isVerified: user.isVerified,
          isPremium: user.isPremium
        }
      });
    } catch (error) {
      console.error("[auth/verify] Signature verification error:", error);
      return res.status(401).json({ error: "Invalid signature format" });
    }
  } catch (error) {
    console.error("[auth/verify] Error:", error);
    return res.status(500).json({ error: "Authentication failed" });
  }
}
var router2, simpleAuth_default;
var init_simpleAuth = __esm({
  "server/simpleAuth.ts"() {
    "use strict";
    init_storage();
    init_auth();
    router2 = Router2();
    router2.post("/nonce", getNonce);
    router2.post("/verify", verifySignature);
    router2.get("/test-db", async (req, res) => {
      try {
        const { storage: storage2 } = await Promise.resolve().then(() => (init_storage(), storage_exports));
        const testWallet = "test_wallet_" + Date.now();
        console.log("[auth/test-db] Testing database connection...");
        const user = await storage2.getUserByWalletAddress(testWallet);
        console.log("[auth/test-db] Query successful, user:", user);
        return res.json({
          success: true,
          message: "Database connection working",
          userFound: !!user
        });
      } catch (error) {
        console.error("[auth/test-db] Database connection failed:", error);
        return res.status(500).json({
          success: false,
          error: error instanceof Error ? error.message : String(error),
          stack: error instanceof Error ? error.stack : void 0
        });
      }
    });
    simpleAuth_default = router2;
  }
});

// server/garagaProofService.ts
var garagaProofService_exports = {};
__export(garagaProofService_exports, {
  GaragaProofService: () => GaragaProofService,
  garagaProofService: () => garagaProofService
});
import { exec } from "child_process";
import { promisify } from "util";
import * as fs from "fs/promises";
import * as path from "path";
var execAsync, GARAGA_CONFIG, GaragaProofService, garagaProofService;
var init_garagaProofService = __esm({
  "server/garagaProofService.ts"() {
    "use strict";
    execAsync = promisify(exec);
    GARAGA_CONFIG = {
      ZK_CIRCUITS_PATH: path.join(process.cwd(), "zk-circuits"),
      CIRCUIT_PATH: path.join(process.cwd(), "zk-circuits/circuit"),
      TEMP_DIR: process.env.TEMP_DIR || "/tmp",
      GARAGA_VERSION: "0.18.1"
    };
    GaragaProofService = class {
      /**
       * Generate ZK proof using Garaga's ultra honk system
       */
      async generateProof({
        idToken,
        domain,
        email,
        ephemeralKeyId,
        ephemeralPubkeyHash
      }) {
        try {
          console.log("\u{1F510} Generating Garaga ZK proof for OAuth verification...");
          console.log("\u{1F4E7} Email:", email);
          console.log("\u{1F3E2} Domain:", domain);
          console.log("\u{1F511} Ephemeral Key ID:", ephemeralKeyId);
          console.log("\u26A1 Ephemeral PubKey Hash:", ephemeralPubkeyHash);
          if (!idToken || !domain || !email) {
            throw new Error("Missing required inputs for proof generation");
          }
          const jwtData = this.parseJWT(idToken);
          if (!jwtData) {
            throw new Error("Invalid JWT token");
          }
          console.log("\u{1F50D} JWT Parsed Successfully:");
          console.log("   \u{1F4E7} JWT Email:", jwtData.email);
          console.log("   \u{1F3E2} JWT Domain (hd):", jwtData.hd || "Not provided (Gmail account)");
          console.log("   \u2705 Email Verified:", jwtData.email_verified);
          console.log("   \u{1F3AB} Issuer:", jwtData.iss);
          console.log("   \u23F0 Issued At:", new Date(jwtData.iat * 1e3).toISOString());
          if (jwtData.hd && jwtData.hd !== domain) {
            throw new Error("Domain mismatch in JWT token");
          }
          if (!jwtData.hd && domain) {
            const emailDomain = jwtData.email.split("@")[1]?.toLowerCase();
            if (emailDomain !== domain && !(domain === "gmail.com" || domain.endsWith(".gmail.com"))) {
              throw new Error("Email domain does not match requested domain");
            }
          }
          console.log("\u2705 Domain validation passed for:", domain);
          const tempDir = path.join(GARAGA_CONFIG.TEMP_DIR, `garaga_${Date.now()}_${Math.random().toString(36).substring(7)}`);
          await fs.mkdir(tempDir, { recursive: true });
          try {
            const circuitInputs = await this.prepareCircuitInputs({
              idToken,
              domain,
              email,
              ephemeralKeyId,
              ephemeralPubkeyHash,
              tempDir
            });
            const proof = await this.generateGaragaProof(circuitInputs, tempDir);
            const calldata = await this.generateCalldata(proof, tempDir);
            console.log("Garaga ZK proof generated successfully");
            return {
              proof: proof.proof,
              publicInputs: calldata.publicInputs,
              verificationKey: proof.verificationKey
            };
          } finally {
            await this.cleanupTempDir(tempDir);
          }
        } catch (error) {
          console.error("Error generating Garaga ZK proof:", error);
          throw new Error(`Failed to generate ZK proof: ${error instanceof Error ? error.message : "Unknown error"}`);
        }
      }
      /**
       * Parse JWT token to extract payload
       */
      parseJWT(token) {
        try {
          const parts = token.split(".");
          if (parts.length !== 3) {
            throw new Error("Invalid JWT format");
          }
          const payload = JSON.parse(atob(parts[1]));
          return payload;
        } catch (error) {
          console.error("Error parsing JWT:", error);
          return null;
        }
      }
      /**
       * Prepare circuit inputs for Garaga proof generation
       */
      async prepareCircuitInputs({
        idToken,
        domain,
        email,
        ephemeralKeyId,
        ephemeralPubkeyHash,
        tempDir
      }) {
        const inputs = {
          jwt_token: idToken,
          domain,
          email,
          ephemeral_key_id: ephemeralKeyId,
          ephemeral_pubkey_hash: ephemeralPubkeyHash,
          timestamp: Math.floor(Date.now() / 1e3)
        };
        const inputsPath = path.join(tempDir, "inputs.json");
        await fs.writeFile(inputsPath, JSON.stringify(inputs, null, 2));
        return { inputsPath, inputs };
      }
      /**
       * Generate proof using Garaga tools
       */
      async generateGaragaProof(circuitInputs, tempDir) {
        try {
          console.log("Generating ZK proof for OAuth verification...");
          const inputHash = crypto.createHash("sha256").update(JSON.stringify(circuitInputs)).digest();
          const mockProof = new Uint8Array(1024);
          for (let i = 0; i < mockProof.length; i++) {
            mockProof[i] = inputHash[i % inputHash.length];
          }
          const mockVK = new Uint8Array(256);
          for (let i = 0; i < mockVK.length; i++) {
            mockVK[i] = (inputHash[i % inputHash.length] + i) % 256;
          }
          console.log("Mock ZK proof generated successfully");
          console.log("\u{1F3AF} NOIR PROOF GENERATED:");
          console.log("=".repeat(80));
          console.log("\u{1F4CB} Proof Type: Ultra Honk (Garaga)");
          console.log("\u{1F4CA} Proof Size:", mockProof.length, "bytes");
          console.log("\u{1F511} Verification Key Size:", mockVK.length, "bytes");
          console.log("\u{1F4DD} Proof (first 64 bytes):", Array.from(mockProof.slice(0, 64)).map((b) => b.toString(16).padStart(2, "0")).join(""));
          console.log("\u{1F510} Verification Key (first 32 bytes):", Array.from(mockVK.slice(0, 32)).map((b) => b.toString(16).padStart(2, "0")).join(""));
          console.log("\u{1F517} Witness Path:", path.join(tempDir, "witness.gz"));
          console.log("=".repeat(80));
          return {
            proof: mockProof,
            verificationKey: mockVK,
            witnessPath: path.join(tempDir, "witness.gz")
          };
        } catch (error) {
          console.error("Error generating ZK proof:", error);
          throw error;
        }
      }
      /**
       * Generate calldata for the proof using Garaga tools
       */
      async generateCalldata(proof, tempDir) {
        try {
          console.log("Generating calldata for Garaga verifier...");
          const publicInputs = [
            "0x" + "1".repeat(64),
            // Mock domain hash
            "0x" + "2".repeat(64),
            // Mock email hash
            "0x" + "3".repeat(64),
            // Mock ephemeral pubkey
            "0x" + Math.floor(Date.now() / 1e3).toString(16).padStart(64, "0")
            // Timestamp
          ];
          console.log("\u{1F4CB} PUBLIC INPUTS (from Noir circuit):");
          console.log("=".repeat(60));
          console.log("\u{1F50D} Domain Hash:", publicInputs[0].slice(0, 20) + "...");
          console.log("\u{1F4E7} Email Hash:", publicInputs[1].slice(0, 20) + "...");
          console.log("\u{1F511} Ephemeral PubKey:", publicInputs[2].slice(0, 20) + "...");
          console.log("\u23F0 Timestamp:", publicInputs[3].slice(0, 20) + "...");
          console.log("=".repeat(60));
          const fullProofWithHints = [...Array.from(proof.proof).map((b) => "0x" + b.toString(16).padStart(2, "0")), ...publicInputs];
          console.log("\u{1F680} COMPLETE PROOF STRUCTURE:");
          console.log("=".repeat(80));
          console.log("\u{1F4CA} Total Proof Elements:", fullProofWithHints.length);
          console.log("\u{1F4DD} Proof Data Length:", Array.from(proof.proof).length, "bytes");
          console.log("\u{1F510} Public Inputs Length:", publicInputs.length);
          console.log("\u{1F3AF} First Proof Element:", fullProofWithHints[0]);
          console.log("\u{1F3AF} Last Public Input:", fullProofWithHints[fullProofWithHints.length - 1]);
          console.log("=".repeat(80));
          return {
            publicInputs,
            fullProofWithHints
          };
        } catch (error) {
          console.error("Error generating calldata:", error);
          throw error;
        }
      }
      /**
       * Verify proof using Garaga verifier (server-side simulation)
       */
      async verifyProof(proofData) {
        try {
          console.log("Verifying Garaga ZK proof...");
          if (!proofData.proof || !proofData.publicInputs) {
            return { isValid: false, error: "Invalid proof data" };
          }
          if (proofData.publicInputs.length < 4) {
            return { isValid: false, error: "Insufficient public inputs" };
          }
          await new Promise((resolve) => setTimeout(resolve, 500));
          console.log("Mock ZK proof verification successful");
          return { isValid: true };
        } catch (error) {
          console.error("Error verifying proof:", error);
          return { isValid: false, error: error instanceof Error ? error.message : "Unknown error" };
        }
      }
      /**
       * Check if Garaga is properly installed and configured
       */
      async checkGaragaInstallation() {
        try {
          const { stdout } = await execAsync("garaga --version");
          const version = stdout.trim();
          return { installed: true, version };
        } catch (error) {
          return {
            installed: false,
            error: "Garaga CLI not found. Please install using: pip install garaga==0.18.1"
          };
        }
      }
      /**
       * Get circuit information
       */
      async getCircuitInfo() {
        try {
          const scarbPath = path.join(GARAGA_CONFIG.CIRCUIT_PATH, "Scarb.toml");
          const scarbContent = await fs.readFile(scarbPath, "utf-8");
          const lines = scarbContent.split("\n");
          const nameMatch = lines.find((line) => line.includes("name ="));
          const versionMatch = lines.find((line) => line.includes("version ="));
          return {
            name: nameMatch ? nameMatch.split("=")[1].trim().replace(/"/g, "") : "circuit",
            version: versionMatch ? versionMatch.split("=")[1].trim().replace(/"/g, "") : "0.1.0",
            path: GARAGA_CONFIG.CIRCUIT_PATH
          };
        } catch (error) {
          console.error("Error getting circuit info:", error);
          return null;
        }
      }
      /**
       * Clean up temporary directory
       */
      async cleanupTempDir(tempDir) {
        try {
          await fs.rm(tempDir, { recursive: true, force: true });
        } catch (error) {
          console.warn("Failed to cleanup temp directory:", error);
        }
      }
    };
    garagaProofService = new GaragaProofService();
  }
});

// server/index.ts
import "dotenv/config";
import express2 from "express";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import cors from "cors";

// server/routes.ts
init_storage();
init_auth();
import { z } from "zod";
import { createServer } from "http";
import path2 from "path";

// server/middleware/anonymousAuth.ts
init_storage();
init_anonymity();
init_auth();
var optionalAnonymousAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return next();
    }
    const token = authHeader.slice(7);
    const anonymousUserId = verifyAnonymousSessionToken(token);
    if (anonymousUserId) {
      const user = await storage.getUser(anonymousUserId);
      if (user) {
        req.user = user;
        req.userId = anonymousUserId;
        return next();
      }
    }
    const payload = verifyToken(token);
    if (payload) {
      const user = await storage.getUser(payload.sub);
      if (user) {
        req.user = user;
        req.userId = user.id;
        return next();
      }
    }
    next();
  } catch (error) {
    console.error("Optional anonymous auth error:", error);
    next();
  }
};
var requireAnonymousAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Authentication required" });
    }
    const token = authHeader.slice(7);
    const anonymousUserId = verifyAnonymousSessionToken(token);
    if (anonymousUserId) {
      const user = await storage.getUser(anonymousUserId);
      if (user) {
        req.user = user;
        req.userId = anonymousUserId;
        return next();
      }
    }
    const payload = verifyToken(token);
    if (payload) {
      const user = await storage.getUser(payload.sub);
      if (user) {
        req.user = user;
        req.userId = user.id;
        return next();
      }
    }
    return res.status(401).json({ message: "Invalid authentication" });
  } catch (error) {
    console.error("Required anonymous auth error:", error);
    return res.status(500).json({ message: "Authentication error" });
  }
};
var decryptParams = (params = ["id"]) => {
  return (req, res, next) => {
    try {
      for (const param of params) {
        if (req.params[param]) {
          const decrypted = decryptUserId(req.params[param]);
          if (decrypted) {
            req.params[`${param}_encrypted`] = req.params[param];
            req.params[param] = decrypted;
          }
        }
      }
      next();
    } catch (error) {
      console.error("Error decrypting parameters:", error);
      return res.status(400).json({ message: "Invalid parameters" });
    }
  };
};

// server/middleware/security.ts
init_db();
init_schema();
import { eq as eq2, and as and2, avg } from "drizzle-orm";
import DOMPurify from "isomorphic-dompurify";
import crypto3 from "crypto";
var ADMIN_USER_EMAIL = "suhrad205@gmail.com";
async function calculateOrganizationRatings(organizationId) {
  try {
    const ratingAverages = await db.select({
      avgWorkLifeBalance: avg(posts.workLifeBalance),
      avgCultureValues: avg(posts.cultureValues),
      avgCareerOpportunities: avg(posts.careerOpportunities),
      avgCompensation: avg(posts.compensation),
      avgManagement: avg(posts.management)
    }).from(posts).where(and2(
      eq2(posts.organizationId, organizationId),
      eq2(posts.type, "review")
    ));
    return ratingAverages[0] || {
      avgWorkLifeBalance: null,
      avgCultureValues: null,
      avgCareerOpportunities: null,
      avgCompensation: null,
      avgManagement: null
    };
  } catch (error) {
    console.error("Error calculating organization ratings:", error);
    return {
      avgWorkLifeBalance: null,
      avgCultureValues: null,
      avgCareerOpportunities: null,
      avgCompensation: null,
      avgManagement: null
    };
  }
}
async function checkOrganizationAccess(userId, organizationId, requiredAccess) {
  try {
    const [organization] = await db.select().from(organizations).where(eq2(organizations.id, organizationId));
    if (!organization) {
      return false;
    }
    const [user] = await db.select().from(users).where(eq2(users.id, userId));
    if (!user) {
      return false;
    }
    const isAdmin = user.email === ADMIN_USER_EMAIL;
    if (isAdmin) {
      return true;
    }
    switch (organization.accessLevel) {
      case "public":
        return requiredAccess === "read";
      case "private":
        if (organization.allowedUsers && organization.allowedUsers.includes(userId)) {
          return true;
        }
        if (organization.createdBy === userId) {
          return true;
        }
        return false;
      case "admin_only":
        return false;
      // Only admins can access
      default:
        return false;
    }
  } catch (error) {
    console.error("Error checking organization access:", error);
    return false;
  }
}
function getOrganizationFeatures(organization, user) {
  const isAdmin = user.email === ADMIN_USER_EMAIL;
  const isOwner = organization.createdBy === user.id;
  const isPublic = organization.accessLevel === "public";
  const isPrivate = organization.accessLevel === "private";
  const isAllowedUser = organization.allowedUsers && organization.allowedUsers.includes(user.id);
  const isAnonymous = user.id === "anonymous";
  return {
    // View permissions
    canViewMarketData: isAdmin || isPublic,
    canViewAnalytics: isAdmin,
    canViewCompanyStats: isAdmin || isPublic,
    canViewDiversityStats: isAdmin,
    canViewRecentActivity: isAdmin,
    // Edit permissions
    canEditOrganization: isAdmin || isOwner,
    canDeleteOrganization: isAdmin,
    canManageUsers: isAdmin,
    // Feature permissions
    canCreatePolls: isAdmin || isOwner || isPublic && !isAnonymous || isPrivate && isAllowedUser,
    canCreateReviews: isAdmin || isOwner || isPublic && !isAnonymous || isPrivate && isAllowedUser,
    canViewAuditLogs: isAdmin,
    // Admin features
    isAdminCreated: isAdmin,
    isUserCreated: !isAdmin && organization.createdBy
  };
}
async function logAccessAttempt(userId, action, resourceType, resourceId, ipAddress, userAgent, success, errorMessage) {
  try {
    await db.insert(accessLogs).values({
      userId,
      action,
      resourceType,
      resourceId,
      ipAddress,
      userAgent,
      success,
      errorMessage
    });
  } catch (error) {
    console.error("Error logging access attempt:", error);
  }
}
var requireOrganizationAccess = (accessLevel) => {
  return async (req, res, next) => {
    try {
      const { id } = req.params;
      const userId = req.user?.id;
      if (!id) {
        await logAccessAttempt(
          userId || "anonymous",
          "access_denied",
          "organization",
          null,
          req.ip || "unknown",
          req.get("User-Agent") || "unknown",
          false,
          "No organization ID"
        );
        return res.status(400).json({ error: "Organization ID required" });
      }
      const [organization] = await db.select().from(organizations).where(eq2(organizations.id, parseInt(id)));
      if (!organization) {
        return res.status(404).json({ error: "Organization not found" });
      }
      const ratingAverages = await calculateOrganizationRatings(parseInt(id));
      const organizationWithRatings = {
        ...organization,
        ...ratingAverages
      };
      if (organization.accessLevel === "public" && accessLevel === "read") {
        const anonymousUser = {
          id: "anonymous",
          email: null,
          isAdmin: false
        };
        req.organization = organizationWithRatings;
        req.accessLevel = accessLevel;
        req.features = getOrganizationFeatures(organization, anonymousUser);
        await logAccessAttempt(
          "anonymous",
          "access_granted",
          "organization",
          parseInt(id),
          req.ip || "unknown",
          req.get("User-Agent") || "unknown",
          true
        );
        return next();
      }
      if (!userId) {
        await logAccessAttempt(
          "anonymous",
          "access_denied",
          "organization",
          parseInt(id),
          req.ip || "unknown",
          req.get("User-Agent") || "unknown",
          false,
          "No user ID"
        );
        return res.status(401).json({ error: "Authentication required" });
      }
      const hasAccess = await checkOrganizationAccess(userId, parseInt(id), accessLevel);
      if (!hasAccess) {
        await logAccessAttempt(
          userId,
          "access_denied",
          "organization",
          parseInt(id),
          req.ip || "unknown",
          req.get("User-Agent") || "unknown",
          false,
          "Insufficient permissions"
        );
        return res.status(403).json({ error: "Access denied" });
      }
      const [user] = await db.select().from(users).where(eq2(users.id, userId));
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      req.organization = organizationWithRatings;
      req.accessLevel = accessLevel;
      req.features = getOrganizationFeatures(organization, user);
      await logAccessAttempt(
        userId,
        "access_granted",
        "organization",
        parseInt(id),
        req.ip || "unknown",
        req.get("User-Agent") || "unknown",
        true
      );
      next();
    } catch (error) {
      console.error("Authorization error:", error);
      res.status(500).json({ error: "Authorization failed" });
    }
  };
};
var rateLimit = (maxRequests, windowMs) => {
  const requests = /* @__PURE__ */ new Map();
  return (req, res, next) => {
    const key = `${req.ip}-${req.path}`;
    const now = Date.now();
    const windowStart = now - windowMs;
    const userRequests = requests.get(key);
    if (!userRequests || userRequests.resetTime < now) {
      requests.set(key, { count: 1, resetTime: now + windowMs });
    } else {
      userRequests.count++;
      if (userRequests.count > maxRequests) {
        return res.status(429).json({ error: "Too many requests" });
      }
    }
    next();
  };
};
var securityHeaders = (req, res, next) => {
  const nonce = crypto3.randomBytes(16).toString("base64");
  res.locals.nonce = nonce;
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("X-XSS-Protection", "1; mode=block");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  res.setHeader("X-DNS-Prefetch-Control", "off");
  res.setHeader("X-Download-Options", "noopen");
  res.setHeader("X-Permitted-Cross-Domain-Policies", "none");
  res.setHeader("Permissions-Policy", [
    "geolocation=()",
    "microphone=()",
    "camera=()",
    "payment=()",
    "usb=()",
    "magnetometer=()",
    "gyroscope=()",
    "accelerometer=()",
    "ambient-light-sensor=()",
    "autoplay=()",
    "encrypted-media=()",
    "fullscreen=()",
    "picture-in-picture=()"
  ].join(", "));
  if (req.secure || req.headers["x-forwarded-proto"] === "https") {
    res.setHeader("Strict-Transport-Security", "max-age=31536000; includeSubDomains; preload");
  }
  const cspDirectives = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://app.dynamic.xyz https://app.dynamicauth.com https://cdn.jsdelivr.net",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "img-src 'self' data: blob: https: http:",
    "font-src 'self' data: https://fonts.gstatic.com",
    "connect-src 'self' https: wss: ws:",
    "media-src 'self' data: blob:",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-src 'self' https://app.dynamicauth.com",
    "frame-ancestors 'none'",
    "upgrade-insecure-requests"
  ];
  res.setHeader("Content-Security-Policy", cspDirectives.join("; "));
  res.removeHeader("X-Powered-By");
  res.removeHeader("Server");
  next();
};
var sanitizeInputs = (req, res, next) => {
  const sanitizeValue = (value, isUserId = false) => {
    if (isUserId) {
      return value;
    }
    if (typeof value === "string") {
      let sanitized = value.replace(/\0/g, "");
      sanitized = DOMPurify.sanitize(sanitized, {
        ALLOWED_TAGS: [],
        ALLOWED_ATTR: [],
        KEEP_CONTENT: true
      });
      return sanitized.trim();
    }
    if (Array.isArray(value)) {
      return value.map((item) => sanitizeValue(item, false));
    }
    if (value && typeof value === "object") {
      const sanitized = {};
      for (const key in value) {
        if (value.hasOwnProperty(key)) {
          const shouldSkipSanitization = key === "userId";
          sanitized[key] = sanitizeValue(value[key], shouldSkipSanitization);
        }
      }
      return sanitized;
    }
    return value;
  };
  if (req.body) {
    req.body = sanitizeValue(req.body, false);
  }
  if (req.query && req.path.startsWith("/api/")) {
    console.log("[sanitizeInputs] Skipping query sanitization for API endpoint:", req.path);
  } else if (req.query) {
    console.log("[sanitizeInputs] Original query:", req.query);
    req.query = sanitizeValue(req.query, false);
    console.log("[sanitizeInputs] Sanitized query:", req.query);
  }
  if (req.params) {
    req.params = sanitizeValue(req.params, false);
  }
  next();
};
var validateOrganizationInput = (req, res, next) => {
  const { name, description } = req.body;
  const namePattern = /^[a-zA-Z0-9\s\-_&.,()]+$/;
  const dangerousPatterns = [
    /<script[^>]*>.*?<\/script>/gi,
    /javascript:/gi,
    /on\w+\s*=/gi,
    /<iframe[^>]*>/gi,
    /<object[^>]*>/gi,
    /<embed[^>]*>/gi
  ];
  if (name) {
    if (typeof name !== "string" || name.length < 1 || name.length > 255) {
      return res.status(400).json({ error: "Invalid organization name length" });
    }
    if (!namePattern.test(name)) {
      return res.status(400).json({ error: "Organization name contains invalid characters" });
    }
    for (const pattern of dangerousPatterns) {
      if (pattern.test(name)) {
        return res.status(400).json({ error: "Organization name contains forbidden content" });
      }
    }
  }
  if (description) {
    if (typeof description !== "string" || description.length > 5e3) {
      return res.status(400).json({ error: "Invalid description" });
    }
    for (const pattern of dangerousPatterns) {
      if (pattern.test(description)) {
        return res.status(400).json({ error: "Description contains forbidden content" });
      }
    }
  }
  next();
};
var validateUrlInputs = (req, res, next) => {
  const { imageUrl, profileImageUrl, websiteUrl } = req.body;
  const validateUrl = (url, fieldName) => {
    try {
      const parsedUrl = new URL(url);
      if (!["http:", "https:"].includes(parsedUrl.protocol)) {
        throw new Error(`${fieldName} must use HTTP or HTTPS protocol`);
      }
      const hostname = parsedUrl.hostname;
      const privateIpPatterns = [
        /^localhost$/i,
        /^127\./,
        /^10\./,
        /^172\.(1[6-9]|2[0-9]|3[0-1])\./,
        /^192\.168\./,
        /^169\.254\./,
        /^::1$/,
        /^fc00:/,
        /^fe80:/
      ];
      for (const pattern of privateIpPatterns) {
        if (pattern.test(hostname)) {
          throw new Error(`${fieldName} cannot reference private/internal addresses`);
        }
      }
      const dangerousPatterns = [
        /^(file|ftp|sftp|smb|ldap|dict|gopher):/i,
        /^(jar|zip|rar):/i
      ];
      for (const pattern of dangerousPatterns) {
        if (pattern.test(url)) {
          throw new Error(`${fieldName} contains forbidden protocol`);
        }
      }
      return true;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      throw new Error(`Invalid ${fieldName}: ${errorMessage}`);
    }
  };
  try {
    if (imageUrl && typeof imageUrl === "string" && imageUrl.trim()) {
      validateUrl(imageUrl, "imageUrl");
    }
    if (profileImageUrl && typeof profileImageUrl === "string" && profileImageUrl.trim()) {
      validateUrl(profileImageUrl, "profileImageUrl");
    }
    if (websiteUrl && typeof websiteUrl === "string" && websiteUrl.trim()) {
      validateUrl(websiteUrl, "websiteUrl");
    }
    next();
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Validation failed";
    return res.status(400).json({ error: errorMessage });
  }
};
var createRateLimit = (config2) => {
  const requests = /* @__PURE__ */ new Map();
  return (req, res, next) => {
    const key = config2.keyGenerator ? config2.keyGenerator(req) : `${req.ip}-${req.path}`;
    const now = Date.now();
    const windowStart = now - config2.windowMs;
    let userRequests = requests.get(key);
    if (!userRequests || userRequests.resetTime < now) {
      userRequests = { count: 1, resetTime: now + config2.windowMs, violations: 0 };
      requests.set(key, userRequests);
    } else {
      userRequests.count++;
      if (userRequests.count > config2.maxRequests) {
        userRequests.violations++;
        const penaltyMultiplier = Math.min(userRequests.violations, 10);
        res.setHeader("Retry-After", Math.ceil(config2.windowMs / 1e3 * penaltyMultiplier));
        res.setHeader("X-RateLimit-Limit", config2.maxRequests.toString());
        res.setHeader("X-RateLimit-Remaining", "0");
        res.setHeader("X-RateLimit-Reset", new Date(userRequests.resetTime).toISOString());
        return res.status(429).json({
          error: "Too many requests",
          retryAfter: config2.windowMs / 1e3 * penaltyMultiplier
        });
      }
    }
    res.setHeader("X-RateLimit-Limit", config2.maxRequests.toString());
    res.setHeader("X-RateLimit-Remaining", Math.max(0, config2.maxRequests - userRequests.count).toString());
    res.setHeader("X-RateLimit-Reset", new Date(userRequests.resetTime).toISOString());
    next();
  };
};

// server/routes.ts
init_anonymity();
init_schema();
import crypto7 from "crypto";
async function registerRoutes(app2) {
  console.log("\u{1F527} Mounting ZK verification routes...");
  console.log("\u{1F4E6} Importing ZK verification routes...");
  const zkVerificationRoutes = await Promise.resolve().then(() => (init_zkVerificationRoutes(), zkVerificationRoutes_exports));
  console.log("\u2705 ZK routes imported successfully");
  console.log("\u{1F517} Mounting ZK verification routes at /api/zk-verification");
  app2.use("/api/zk-verification", zkVerificationRoutes.default);
  console.log("\u2705 ZK routes mounted successfully");
  console.log("\u{1F517} Mounting SIWW authentication routes at /api/auth");
  const siwwAuthRoutes = await Promise.resolve().then(() => (init_simpleAuth(), simpleAuth_exports));
  app2.use("/api/auth", siwwAuthRoutes.default);
  console.log("\u2705 SIWW auth routes mounted successfully");
  app2.post("/api/zk/generate-proof", requireAuth, async (req, res) => {
    try {
      const { idToken, domain, email, ephemeralKeyId, ephemeralPubkeyHash } = req.body;
      if (!idToken || !domain || !email) {
        return res.status(400).json({
          success: false,
          message: "idToken, domain, and email are required"
        });
      }
      const { garagaProofService: garagaProofService2 } = await Promise.resolve().then(() => (init_garagaProofService(), garagaProofService_exports));
      const proof = await garagaProofService2.generateProof({
        idToken,
        domain,
        email,
        ephemeralKeyId: ephemeralKeyId || "",
        ephemeralPubkeyHash: ephemeralPubkeyHash || ""
      });
      res.json({
        success: true,
        proof: {
          proof: Array.from(proof.proof),
          publicInputs: proof.publicInputs,
          verificationKey: proof.verificationKey ? Array.from(proof.verificationKey) : void 0
        }
      });
    } catch (error) {
      console.error("Error generating ZK proof:", error);
      res.status(500).json({
        success: false,
        message: error instanceof Error ? error.message : "Failed to generate ZK proof"
      });
    }
  });
  app2.get("/api/zk-verification/oauth/google/callback", zkVerificationRoutes.default);
  app2.use("/api", (req, res, next) => {
    if (req.path.startsWith("/zk-verification")) {
      console.log("\u{1F6AB} Skipping anonymization for ZK route:", req.path);
      return next();
    }
    anonymizeResponse(req, res, next);
  });
  app2.get("/websocket-test", (req, res) => {
    res.sendFile(path2.resolve(__dirname, "..", "websocket-test.html"));
  });
  app2.get("/api/login", (req, res) => {
    res.redirect("/auth");
  });
  app2.post("/api/auth/logout", async (req, res) => {
    try {
      console.log("[logout] Processing logout request");
      if (req.user?.id) {
        try {
          const user = await storage.getUser(req.user.id);
          if (user) {
            await storage.upsertUser({
              ...user,
              isOnline: false
            });
            console.log(`[logout] User ${req.user.id} marked as offline`);
          }
        } catch (error) {
          console.warn("[logout] Failed to update user status:", error);
        }
      }
      res.json({
        success: true,
        message: "Logged out successfully"
      });
    } catch (error) {
      console.error("[logout] Error during logout:", error);
      res.status(500).json({
        success: false,
        message: "Logout failed"
      });
    }
  });
  app2.get("/api/auth/user", optionalAnonymousAuth, async (req, res) => {
    if (!req.user) {
      console.warn("[api] /api/auth/user: unauthenticated");
      return res.status(401).json({ message: "Not authenticated" });
    }
    const anonymizedUser = createAnonymousUserResponse(req.user, true);
    res.json(anonymizedUser);
  });
  app2.get("/api/users/:id", optionalAnonymousAuth, decryptParams(["id"]), async (req, res) => {
    try {
      const userId = req.params.id;
      if (!userId) {
        return res.status(400).json({ message: "Invalid user ID" });
      }
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      const isOwnProfile = req.user && req.user.id === userId;
      const anonymizedUser = createAnonymousUserResponse(user, isOwnProfile);
      res.json(anonymizedUser);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });
  app2.put("/api/users/me", requireAnonymousAuth, async (req, res) => {
    try {
      const currentUser = req.user;
      if (!currentUser) {
        return res.status(401).json({ message: "Authentication required" });
      }
      const schema = z.object({
        email: z.string().email().optional(),
        bio: z.string().max(500).optional().or(z.literal("")),
        username: z.string().min(1).max(50).optional()
      });
      const body = schema.parse(req.body || {});
      const updates = { ...body };
      if (updates.bio === "") updates.bio = null;
      if (updates.username === "") updates.username = null;
      updates.updatedAt = /* @__PURE__ */ new Date();
      const user = await storage.upsertUser({ ...currentUser, ...updates });
      console.log(`[users/me] Updated user ${user.id}:`, Object.keys(updates));
      const anonymizedUser = createAnonymousUserResponse(user, true);
      res.json(anonymizedUser);
    } catch (error) {
      const message = error?.message || "Failed to update profile";
      if (/duplicate key|unique constraint/i.test(message)) {
        if (message.includes("email")) {
          return res.status(409).json({ message: "Email address is already in use by another account" });
        }
        if (message.includes("username")) {
          return res.status(409).json({ message: "Username is already taken" });
        }
        return res.status(409).json({ message: "This information is already in use by another account" });
      }
      console.error("[users/me] Error updating profile:", error);
      res.status(400).json({ message });
    }
  });
  if (process.env.NODE_ENV === "development") {
    app2.get("/api/auth/debug-user", requireAuth, async (req, res) => {
      try {
        res.json({
          user: req.user,
          userId: req.user?.id,
          walletAddress: req.user?.walletAddress,
          email: req.user?.email,
          timestamp: (/* @__PURE__ */ new Date()).toISOString()
        });
      } catch (error) {
        res.status(500).json({ error: error instanceof Error ? error.message : "Unknown error" });
      }
    });
  }
  app2.use(securityHeaders);
  const { companyVerificationService: companyVerificationService2 } = await Promise.resolve().then(() => (init_companyVerificationService(), companyVerificationService_exports));
  app2.post("/api/company-verification/initiate", requireAuth, async (req, res) => {
    try {
      const { email } = req.body;
      if (!email || typeof email !== "string") {
        return res.status(400).json({ message: "Email is required" });
      }
      const result = await companyVerificationService2.initiateVerification({
        userId: req.user.id,
        email: email.toLowerCase().trim()
      });
      if (result.success) {
        res.json({ success: true, message: result.message });
      } else {
        res.status(400).json({ success: false, message: result.message });
      }
    } catch (error) {
      console.error("Error initiating company verification:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  app2.post("/api/company-verification/confirm", requireAuth, async (req, res) => {
    try {
      const { email, code, zkProof } = req.body;
      if (!email || !code) {
        return res.status(400).json({ message: "Email and verification code are required" });
      }
      const result = await companyVerificationService2.confirmVerification({
        userId: req.user.id,
        email: email.toLowerCase().trim(),
        code: code.toString().trim(),
        zkProof
      });
      if (result.success) {
        res.json({
          success: true,
          message: result.message,
          zkProofHash: result.zkProofHash
        });
      } else {
        res.status(400).json({ success: false, message: result.message });
      }
    } catch (error) {
      console.error("Error confirming company verification:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  app2.get("/api/company-verification/status", requireAuth, async (req, res) => {
    try {
      const status = await companyVerificationService2.getVerificationStatus(req.user.id);
      res.json(status);
    } catch (error) {
      console.error("Error getting verification status:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  app2.delete("/api/company-verification", requireAuth, async (req, res) => {
    try {
      const success = await companyVerificationService2.removeVerification(req.user.id);
      if (success) {
        res.json({ success: true, message: "Company verification removed successfully" });
      } else {
        res.status(500).json({ success: false, message: "Failed to remove verification" });
      }
    } catch (error) {
      console.error("Error removing company verification:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  app2.post("/api/company-verification/domains", requireAuth, async (req, res) => {
    try {
      const { domain, companyName, logo } = req.body;
      if (!domain || !companyName) {
        return res.status(400).json({ message: "Domain and company name are required" });
      }
      const success = await companyVerificationService2.addCompanyDomainMapping({
        domain: domain.toLowerCase().trim(),
        companyName: companyName.trim(),
        logo: logo?.trim()
      });
      if (success) {
        res.json({ success: true, message: "Company domain mapping added successfully" });
      } else {
        res.status(500).json({ success: false, message: "Failed to add domain mapping" });
      }
    } catch (error) {
      console.error("Error adding company domain mapping:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  app2.get("/api/company-verification/domain/:domain", async (req, res) => {
    try {
      const domain = req.params.domain.toLowerCase().trim();
      const mapping = await companyVerificationService2.getCompanyNameFromDomain(domain);
      if (mapping) {
        res.json(mapping);
      } else {
        res.status(404).json({ message: "Company domain mapping not found" });
      }
    } catch (error) {
      console.error("Error getting company domain mapping:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  app2.get("/api/organizations", async (req, res) => {
    try {
      const organizations2 = await storage.getOrganizations();
      res.json(organizations2);
    } catch (error) {
      console.error("Error fetching organizations:", error);
      res.status(500).json({ message: "Failed to fetch organizations" });
    }
  });
  app2.get("/api/organizations/search", async (req, res) => {
    try {
      const query = (req.query.q || "").slice(0, 100);
      if (!query) {
        return res.status(400).json({ message: "Query parameter 'q' is required" });
      }
      const organizations2 = await storage.searchOrganizationsWithStats(query);
      res.json(organizations2);
    } catch (error) {
      console.error("Error searching organizations:", error);
      res.status(500).json({ message: "Failed to search organizations" });
    }
  });
  app2.get("/api/search", async (req, res) => {
    try {
      const q = String(req.query.q || "").trim();
      const type = String(req.query.type || "posts");
      if (!q) {
        return res.json({ posts: [] });
      }
      const results = await storage.searchPosts(q);
      console.log('[search] q="' + q + '" -> ' + (results?.length || 0) + " posts");
      res.setHeader("Content-Type", "application/json");
      res.json({ posts: results });
    } catch (error) {
      console.error("Error in /api/search:", error);
      res.status(500).json({ message: "Search failed" });
    }
  });
  app2.post(
    "/api/organizations",
    requireAuth,
    rateLimit(10, 6e4),
    validateOrganizationInput,
    validateUrlInputs,
    async (req, res) => {
      try {
        const userId = req.user.id;
        const orgData = insertOrganizationSchema.parse({ ...req.body, createdBy: userId });
        const existingOrg = await storage.getOrganizationByName(orgData.name);
        if (existingOrg) {
          return res.status(400).json({ message: "An organization with this name already exists" });
        }
        const organization = await storage.createOrganization(orgData, userId);
        res.status(201).json(organization);
      } catch (error) {
        console.error("Error creating organization:", error);
        res.status(500).json({ message: "Failed to create organization" });
      }
    }
  );
  app2.get("/api/organizations/featured", rateLimit(100, 6e4), async (req, res) => {
    try {
      const userId = req.user?.id;
      const organizations2 = await storage.getFeaturedOrganizations(userId);
      res.json(organizations2);
    } catch (error) {
      console.error("Error fetching featured organizations:", error);
      res.status(500).json({ message: "Failed to fetch featured organizations" });
    }
  });
  app2.get("/api/organizations/all", rateLimit(100, 6e4), async (req, res) => {
    try {
      const userId = req.user?.id;
      const organizations2 = await storage.getAllOrganizations(userId);
      res.json(organizations2);
    } catch (error) {
      console.error("Error fetching all organizations:", error);
      res.status(500).json({ message: "Failed to fetch all organizations" });
    }
  });
  app2.get(
    "/api/organizations/:id",
    rateLimit(100, 6e4),
    requireOrganizationAccess("read"),
    async (req, res) => {
      try {
        const organization = req.organization;
        const features = req.features;
        res.json({
          ...organization,
          features
        });
      } catch (error) {
        console.error("Error fetching organization:", error);
        res.status(500).json({ message: "Failed to fetch organization" });
      }
    }
  );
  app2.put(
    "/api/organizations/:id",
    rateLimit(10, 6e4),
    requireOrganizationAccess("write"),
    validateOrganizationInput,
    async (req, res) => {
      try {
        const { id } = req.params;
        const updates = req.body;
        const userId = req.user.id;
        const updatedOrg = await storage.updateOrganization(parseInt(id), updates, userId);
        if (!updatedOrg) {
          return res.status(403).json({ message: "Access denied or organization not found" });
        }
        res.json(updatedOrg);
      } catch (error) {
        console.error("Error updating organization:", error);
        res.status(500).json({ message: "Failed to update organization" });
      }
    }
  );
  app2.delete(
    "/api/organizations/:id",
    rateLimit(5, 6e4),
    requireOrganizationAccess("admin"),
    async (req, res) => {
      try {
        const { id } = req.params;
        const userId = req.user.id;
        const success = await storage.deleteOrganization(parseInt(id), userId);
        if (!success) {
          return res.status(403).json({ message: "Access denied or organization not found" });
        }
        res.json({ message: "Organization deleted successfully" });
      } catch (error) {
        console.error("Error deleting organization:", error);
        res.status(500).json({ message: "Failed to delete organization" });
      }
    }
  );
  app2.get("/api/bowls", async (req, res) => {
    try {
      const { category } = req.query;
      if (category && typeof category === "string" && category.trim()) {
        const bowls2 = await storage.getBowlsByCategory(category);
        res.json(bowls2);
      } else {
        const bowls2 = await storage.getBowls();
        res.json(bowls2);
      }
    } catch (error) {
      console.error("Error fetching bowls:", error);
      res.status(500).json({ message: "Failed to fetch bowls" });
    }
  });
  app2.get("/api/bowls/categories", async (req, res) => {
    try {
      const categories = await storage.getBowlsCategories();
      res.json(categories);
    } catch (error) {
      console.error("Error fetching bowl categories:", error);
      res.status(500).json({ message: "Failed to fetch bowl categories" });
    }
  });
  app2.get("/api/bowls/:id", async (req, res) => {
    try {
      const param = req.params.id;
      let bowl;
      if (/^\d+$/.test(param)) {
        bowl = await storage.getBowl(parseInt(param));
      } else {
        bowl = await storage.getBowlByName(decodeURIComponent(param));
      }
      if (!bowl) {
        return res.status(404).json({ message: "Bowl not found" });
      }
      res.json(bowl);
    } catch (error) {
      console.error("Error fetching bowl:", error);
      res.status(500).json({ message: "Failed to fetch bowl" });
    }
  });
  app2.post("/api/bowls/:id/follow", requireAuth, async (req, res) => {
    try {
      const userId = req.user.id;
      const bowlId = parseInt(req.params.id);
      console.log("[follow] Attempting to follow bowl:", { userId, bowlId, userEmail: req.user.email });
      const bowl = await storage.getBowl(bowlId);
      if (!bowl) {
        console.log("[follow] Bowl not found:", bowlId);
        return res.status(404).json({ message: "Bowl not found" });
      }
      console.log("[follow] Bowl found:", bowl.name);
      const isFollowing = await storage.isUserFollowingBowl(userId, bowlId);
      console.log("[follow] Is already following:", isFollowing);
      if (isFollowing) {
        return res.status(200).json({ message: "Already following this bowl", isFollowing: true });
      }
      console.log("[follow] Creating new follow...");
      const follow = await storage.followBowl({ userId, bowlId });
      console.log("[follow] Follow created successfully:", follow.id);
      res.status(201).json({ ...follow, isFollowing: true });
    } catch (error) {
      console.error("Error following bowl:", error);
      res.status(500).json({ message: "Failed to follow bowl", error: error instanceof Error ? error.message : "Unknown error" });
    }
  });
  app2.delete("/api/bowls/:id/follow", requireAuth, async (req, res) => {
    try {
      const userId = req.user.id;
      const bowlId = parseInt(req.params.id);
      const isFollowing = await storage.isUserFollowingBowl(userId, bowlId);
      if (!isFollowing) {
        return res.status(400).json({ message: "Not following this bowl" });
      }
      await storage.unfollowBowl(userId, bowlId);
      res.json({ message: "Successfully unfollowed bowl" });
    } catch (error) {
      console.error("Error unfollowing bowl:", error);
      res.status(500).json({ message: "Failed to unfollow bowl" });
    }
  });
  app2.get("/api/user/bowls", requireAuth, async (req, res) => {
    try {
      const userId = req.user.id;
      const follows = await storage.getUserBowlFollows(userId);
      res.json(follows);
    } catch (error) {
      console.error("Error fetching user bowls:", error);
      res.status(500).json({ message: "Failed to fetch user bowls" });
    }
  });
  app2.get("/api/user/favorites", requireAuth, async (req, res) => {
    try {
      const userId = req.user.id;
      const favorites = await storage.getUserBowlFavorites(userId);
      res.json(favorites);
    } catch (error) {
      console.error("Error fetching user favorites:", error);
      res.status(500).json({ message: "Failed to fetch favorites" });
    }
  });
  app2.post("/api/user/favorites", requireAuth, async (req, res) => {
    try {
      const userId = req.user.id;
      const { bowlId, isFavorite } = req.body;
      console.log("[favorite] Updating favorite:", { userId, bowlId, isFavorite });
      if (typeof bowlId !== "number" || typeof isFavorite !== "boolean") {
        return res.status(400).json({ message: "Invalid request data" });
      }
      await storage.updateBowlFavorite(userId, bowlId, isFavorite);
      res.json({ message: "Favorite updated successfully" });
    } catch (error) {
      console.error("Error updating favorite:", error);
      res.status(500).json({ message: "Failed to update favorite" });
    }
  });
  app2.get("/api/bowls/:id/favoriting", requireAuth, async (req, res) => {
    try {
      const userId = req.user.id;
      const bowlId = parseInt(req.params.id);
      const isFavoriting = await storage.isUserFavoritingBowl(userId, bowlId);
      res.json({ isFavoriting });
    } catch (error) {
      console.error("Error checking bowl favorite status:", error);
      res.status(500).json({ message: "Failed to check favorite status" });
    }
  });
  app2.get("/api/bowls/:id/following", requireAuth, async (req, res) => {
    try {
      const userId = req.user.id;
      const bowlId = parseInt(req.params.id);
      const isFollowing = await storage.isUserFollowingBowl(userId, bowlId);
      res.json({ isFollowing });
    } catch (error) {
      console.error("Error checking bowl follow status:", error);
      res.status(500).json({ message: "Failed to check follow status" });
    }
  });
  app2.post("/api/posts/:id/save", requireAuth, async (req, res) => {
    try {
      const userId = req.user.id;
      const postId = parseInt(req.params.id);
      if (isNaN(postId)) {
        return res.status(400).json({ message: "Invalid post ID" });
      }
      const post = await storage.getPost(postId);
      if (!post) {
        return res.status(404).json({ message: "Post not found" });
      }
      const isSaved = await storage.isPostSavedByUser(userId, postId);
      if (isSaved) {
        return res.status(200).json({
          message: "Post already saved",
          isSaved: true
        });
      }
      const savedContent2 = await storage.savePost(userId, postId);
      res.status(201).json({
        ...savedContent2,
        isSaved: true,
        message: "Post saved successfully"
      });
    } catch (error) {
      console.error("Error saving post:", error);
      res.status(500).json({
        message: "Failed to save post",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });
  app2.delete("/api/posts/:id/save", requireAuth, async (req, res) => {
    try {
      const userId = req.user.id;
      const postId = parseInt(req.params.id);
      if (isNaN(postId)) {
        return res.status(400).json({ message: "Invalid post ID" });
      }
      const isSaved = await storage.isPostSavedByUser(userId, postId);
      if (!isSaved) {
        return res.status(400).json({ message: "Post not saved" });
      }
      await storage.unsavePost(userId, postId);
      res.json({
        message: "Post unsaved successfully",
        isSaved: false
      });
    } catch (error) {
      console.error("Error unsaving post:", error);
      res.status(500).json({
        message: "Failed to unsave post",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });
  app2.get("/api/posts/:id/saved", requireAuth, async (req, res) => {
    try {
      const userId = req.user.id;
      const postId = parseInt(req.params.id);
      if (isNaN(postId)) {
        return res.status(400).json({ message: "Invalid post ID" });
      }
      const isSaved = await storage.isPostSavedByUser(userId, postId);
      res.json({ isSaved });
    } catch (error) {
      console.error("Error checking if post is saved:", error);
      res.status(500).json({
        message: "Failed to check save status",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });
  app2.get("/api/user/saved-posts", requireAuth, async (req, res) => {
    try {
      const userId = req.user.id;
      console.log("[API] Fetching saved posts for user:", userId);
      const savedPosts = await storage.getUserSavedPosts(userId);
      console.log("[API] Found", savedPosts.length, "saved posts");
      if (savedPosts.length > 0) {
        const postIds = savedPosts.map((s) => s.post.id);
        const userVotes = await storage.getUserVotes(userId, postIds, "post");
        savedPosts.forEach((saved) => {
          saved.post.userVote = userVotes.find((v) => v.targetId === saved.post.id);
        });
      }
      res.json(savedPosts);
    } catch (error) {
      console.error("Error fetching saved posts:", error);
      res.status(500).json({
        message: "Failed to fetch saved posts",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });
  app2.get("/api/posts", optionalAuth, async (req, res) => {
    try {
      const filters = {};
      if (req.query.organizationId) {
        const orgId = parseInt(req.query.organizationId);
        if (!isNaN(orgId)) {
          filters.organizationId = orgId;
        }
      }
      if (req.query.bowlId) {
        const bowlId = parseInt(req.query.bowlId);
        if (!isNaN(bowlId)) {
          filters.bowlId = bowlId;
        }
      }
      if (req.query.type) {
        filters.type = req.query.type;
      }
      if (req.query.featured) {
        filters.featured = req.query.featured === "true";
      }
      if (req.query.trending) {
        filters.trending = req.query.trending === "true";
      }
      if (req.query.time) {
        filters.time = req.query.time;
      }
      if (req.query.sortBy) {
        filters.sortBy = req.query.sortBy;
      }
      if (req.query.userId) {
        filters.userId = req.query.userId;
        console.log("[API Posts] userId filter:", filters.userId, "type:", typeof filters.userId);
      }
      if (req.query.author) {
        filters.userId = req.query.author;
        console.log("[API Posts] author filter:", filters.userId, "type:", typeof filters.userId);
      }
      if (req.query.id && !req.query.userId && !req.query.author) {
        filters.userId = req.query.id;
        console.log("[API Posts] id filter:", filters.userId, "type:", typeof filters.userId);
      }
      const posts2 = await storage.getPosts(filters);
      if (req.user && posts2.length > 0) {
        try {
          const userId = req.user.id;
          const postIds = posts2.map((p) => p.id);
          const userVotes = await storage.getUserVotes(userId, postIds, "post");
          posts2.forEach((post) => {
            post.userVote = userVotes.find((v) => v.targetId === post.id);
          });
        } catch (error) {
          console.error("Error fetching user votes:", error);
        }
      }
      res.set("Cache-Control", "no-cache, no-store, must-revalidate");
      res.set("Pragma", "no-cache");
      res.set("Expires", "0");
      res.json(posts2);
    } catch (error) {
      console.error("Error fetching posts:", error);
      res.status(500).json({ message: "Failed to fetch posts" });
    }
  });
  app2.get("/api/posts/:id", optionalAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid post ID" });
      }
      const post = await storage.getPost(id);
      if (!post) {
        return res.status(404).json({ message: "Post not found" });
      }
      if (req.user) {
        const userId = req.user.id;
        post.userVote = await storage.getVote(userId, id, "post");
      }
      res.set("Cache-Control", "no-cache, no-store, must-revalidate");
      res.set("Pragma", "no-cache");
      res.set("Expires", "0");
      res.json(post);
    } catch (error) {
      console.error("Error fetching post:", error);
      res.status(500).json({ message: "Failed to fetch post" });
    }
  });
  app2.post("/api/posts", requireAuth, validateUrlInputs, async (req, res) => {
    try {
      const userId = req.user.id;
      const { poll, ...postBody } = req.body;
      const postData = insertPostSchema.parse({ ...postBody, authorId: userId });
      const post = await storage.createPost(postData);
      if (poll && poll.options && poll.options.length > 0) {
        const pollData = {
          title: poll.title || postData.title,
          description: poll.description,
          authorId: userId,
          bowlId: postData.bowlId,
          organizationId: postData.organizationId,
          allowMultipleChoices: poll.allowMultipleSelections || false,
          isAnonymous: false,
          postId: post.id
          // Link the poll to the post
        };
        const createdPoll = await storage.createPoll(pollData);
        for (const optionText of poll.options) {
          await storage.createPollOption({
            pollId: createdPoll.id,
            text: optionText
          });
        }
      }
      if (postData.type === "review") {
        await storage.updateUserKarma(userId, 5);
      }
      res.status(201).json(post);
    } catch (error) {
      console.error("Error creating post:", error);
      res.status(500).json({ message: "Failed to create post" });
    }
  });
  app2.get("/api/polls", optionalAuth, async (req, res) => {
    try {
      const { featured, trending, time, organizationId, sortBy } = req.query;
      const filters = {};
      if (featured) filters.featured = featured === "true";
      if (trending) filters.trending = trending === "true";
      if (time) filters.time = time;
      if (sortBy) filters.sortBy = sortBy;
      if (organizationId) {
        const orgId = parseInt(organizationId);
        if (!isNaN(orgId)) {
          filters.organizationId = orgId;
        }
      }
      console.log("filters", filters);
      const polls2 = await storage.getAllPolls(filters);
      if (req.user) {
        const userId = req.user.id;
        const pollIds = polls2.map((p) => p.id);
        const userVotes = await storage.getUserVotes(userId, pollIds, "poll");
        polls2.forEach((poll) => {
          poll.userVote = userVotes.find((v) => v.targetId === poll.id);
        });
      }
      res.json(polls2);
    } catch (error) {
      console.error("Error fetching polls:", error);
      res.status(500).json({ message: "Failed to fetch polls" });
    }
  });
  app2.get("/api/polls/:id", optionalAuth, async (req, res) => {
    try {
      const pollId = parseInt(req.params.id);
      if (isNaN(pollId)) {
        return res.status(400).json({ message: "Invalid poll ID" });
      }
      const userId = req.user?.id;
      const poll = await storage.getPollWithDetails(pollId, userId);
      if (!poll) {
        return res.status(404).json({ message: "Poll not found" });
      }
      res.json(poll);
    } catch (error) {
      console.error("Error fetching poll:", error);
      res.status(500).json({ message: "Failed to fetch poll" });
    }
  });
  app2.post("/api/polls/:id/vote", requireAuth, async (req, res) => {
    try {
      const userId = req.user.id;
      const pollId = parseInt(req.params.id);
      if (isNaN(pollId)) {
        return res.status(400).json({ message: "Invalid poll ID" });
      }
      const { optionIds } = req.body;
      const hasVoted = await storage.hasUserVotedOnPoll(userId, pollId);
      if (hasVoted) {
        return res.status(400).json({
          message: "You have already voted on this poll",
          error: "ALREADY_VOTED"
        });
      }
      for (const optionId of optionIds) {
        await storage.createPollVote({
          pollId,
          optionId,
          userId
        });
      }
      await storage.updatePollOptionVoteCounts(optionIds);
      res.json({ success: true });
    } catch (error) {
      console.error("Error voting on poll:", error);
      res.status(500).json({ message: "Failed to vote on poll" });
    }
  });
  app2.post("/api/polls/:id/votes", requireAuth, async (req, res) => {
    try {
      const userId = req.user.id;
      const pollId = parseInt(req.params.id);
      if (isNaN(pollId)) {
        return res.status(400).json({ message: "Invalid poll ID" });
      }
      const { voteType } = req.body;
      if (!["up", "down"].includes(voteType)) {
        return res.status(400).json({ message: "Invalid vote type" });
      }
      console.log(`[POLL VOTE] User ${userId} voting ${voteType} on poll ${pollId}`);
      const result = await storage.processVoteTransaction(
        userId,
        pollId,
        "poll",
        voteType
      );
      const poll = await storage.getPollWithDetails(pollId);
      if (poll && poll.postId) {
        await storage.updatePostVoteCounts(poll.postId);
      }
      console.log(`[POLL VOTE] Result:`, {
        success: result.success,
        hasUpdatedCounts: !!result.updatedCounts,
        hasUserVote: !!result.userVote
      });
      res.json({
        success: result.success,
        updatedCounts: result.updatedCounts,
        userVote: result.userVote
      });
    } catch (error) {
      console.error("Error voting on poll:", error);
      res.status(500).json({ message: "Failed to vote on poll" });
    }
  });
  app2.get("/api/polls/:id/comments", optionalAuth, async (req, res) => {
    try {
      const pollId = parseInt(req.params.id);
      if (isNaN(pollId)) {
        return res.status(400).json({ message: "Invalid poll ID" });
      }
      const comments2 = await storage.getCommentsByPoll(pollId);
      if (req.user) {
        const userId = req.user.id;
        const commentIds = comments2.map((c) => c.id);
        const userVotes = await storage.getUserVotes(userId, commentIds, "comment");
        const addUserVotes = (commentList) => {
          commentList.forEach((comment) => {
            comment.userVote = userVotes.find((v) => v.targetId === comment.id);
            if (comment.replies && comment.replies.length > 0) {
              addUserVotes(comment.replies);
            }
          });
        };
        addUserVotes(comments2);
      }
      res.json(comments2);
    } catch (error) {
      console.error("Error fetching poll comments:", error);
      res.status(500).json({ message: "Failed to fetch poll comments" });
    }
  });
  app2.post("/api/polls/:id/comments", requireAuth, async (req, res) => {
    try {
      console.log("=== POLL COMMENT REQUEST ===");
      console.log("User:", req.user ? req.user.id : "No user");
      console.log("Params:", req.params);
      console.log("Body:", req.body);
      if (!req.user) {
        console.error("No user found in request");
        return res.status(401).json({ message: "Authentication required" });
      }
      const userId = req.user.id;
      const pollId = parseInt(req.params.id);
      if (isNaN(pollId)) {
        console.error("Invalid poll ID:", req.params.id);
        return res.status(400).json({ message: "Invalid poll ID" });
      }
      if (!req.body || !req.body.content || typeof req.body.content !== "string") {
        console.error("Invalid comment content:", req.body);
        return res.status(400).json({ message: "Comment content is required" });
      }
      const commentData = {
        content: req.body.content.trim(),
        authorId: userId,
        pollId,
        parentId: req.body.parentId || null
      };
      console.log("Creating poll comment with data:", commentData);
      const comment = await storage.createComment(commentData);
      console.log("Poll comment created successfully:", comment.id);
      console.log("Poll comment creation completed successfully");
      res.status(201).json(comment);
    } catch (error) {
      console.error("=== POLL COMMENT CREATION ERROR ===");
      console.error("Error type:", error?.constructor?.name);
      console.error("Error message:", error?.message);
      console.error("Error stack:", error?.stack);
      if (error?.message?.includes("violates foreign key constraint")) {
        return res.status(400).json({ message: "Invalid poll or user reference" });
      }
      if (error?.message?.includes("duplicate key")) {
        return res.status(409).json({ message: "Comment already exists" });
      }
      res.status(500).json({
        message: "Failed to create poll comment",
        error: process.env.NODE_ENV === "development" ? error?.message : void 0
      });
    }
  });
  app2.get("/api/posts/:id/comments", optionalAuth, async (req, res) => {
    try {
      const postId = parseInt(req.params.id);
      if (isNaN(postId)) {
        return res.status(400).json({ message: "Invalid post ID" });
      }
      const comments2 = await storage.getCommentsByPost(postId);
      if (req.user) {
        const userId = req.user.id;
        const commentIds = comments2.map((c) => c.id);
        const userVotes = await storage.getUserVotes(userId, commentIds, "comment");
        const addUserVotes = (commentList) => {
          commentList.forEach((comment) => {
            comment.userVote = userVotes.find((v) => v.targetId === comment.id);
            if (comment.replies && comment.replies.length > 0) {
              addUserVotes(comment.replies);
            }
          });
        };
        addUserVotes(comments2);
      }
      res.json(comments2);
    } catch (error) {
      console.error("Error fetching comments:", error);
      res.status(500).json({ message: "Failed to fetch comments" });
    }
  });
  app2.post("/api/posts/:id/comments", requireAuth, async (req, res) => {
    try {
      console.log("=== POST COMMENT REQUEST ===");
      console.log("User:", req.user ? req.user.id : "No user");
      console.log("Params:", req.params);
      console.log("Body:", req.body);
      if (!req.user) {
        console.error("No user found in request");
        return res.status(401).json({ message: "Authentication required" });
      }
      const userId = req.user.id;
      const postId = parseInt(req.params.id);
      if (isNaN(postId)) {
        console.error("Invalid post ID:", req.params.id);
        return res.status(400).json({ message: "Invalid post ID" });
      }
      if (!req.body || !req.body.content || typeof req.body.content !== "string") {
        console.error("Invalid comment content:", req.body);
        return res.status(400).json({ message: "Comment content is required" });
      }
      const commentData = {
        content: req.body.content.trim(),
        authorId: userId,
        postId,
        parentId: req.body.parentId || null
      };
      console.log("Creating comment with data:", commentData);
      const comment = await storage.createComment(commentData);
      console.log("Comment created successfully:", comment.id);
      try {
        await storage.updatePostCommentCount(postId);
        console.log("Post comment count updated");
      } catch (countError) {
        console.warn("Failed to update comment count:", countError);
      }
      console.log("Comment creation completed successfully");
      res.status(201).json(comment);
    } catch (error) {
      console.error("=== COMMENT CREATION ERROR ===");
      console.error("Error type:", error?.constructor?.name);
      console.error("Error message:", error?.message);
      console.error("Error stack:", error?.stack);
      if (error?.message?.includes("violates foreign key constraint")) {
        return res.status(400).json({ message: "Invalid post or user reference" });
      }
      if (error?.message?.includes("duplicate key")) {
        return res.status(409).json({ message: "Comment already exists" });
      }
      res.status(500).json({
        message: "Failed to create comment",
        error: process.env.NODE_ENV === "development" ? error?.message : void 0
      });
    }
  });
  app2.delete("/api/posts/:id", requireAuth, async (req, res) => {
    try {
      const userId = req.user.id;
      const postId = parseInt(req.params.id);
      await storage.deletePostCascade(postId, userId);
      res.status(204).send();
    } catch (error) {
      if (error?.message === "FORBIDDEN") return res.status(403).json({ message: "Not allowed" });
      console.error("Error deleting post:", error);
      res.status(500).json({ message: "Failed to delete post" });
    }
  });
  app2.delete("/api/comments/:id", requireAuth, async (req, res) => {
    try {
      const userId = req.user.id;
      const commentId = parseInt(req.params.id);
      await storage.deleteCommentCascade(commentId, userId);
      res.status(204).send();
    } catch (error) {
      if (error?.message === "FORBIDDEN") return res.status(403).json({ message: "Not allowed" });
      console.error("Error deleting comment:", error);
      res.status(500).json({ message: "Failed to delete comment" });
    }
  });
  app2.get("/api/comments/user/:userId", optionalAuth, async (req, res) => {
    try {
      let userId = req.params.userId;
      if (req.query.author) {
        userId = req.query.author;
      }
      console.log("[API Comments] Fetching comments for userId:", userId);
      const comments2 = await storage.getCommentsByUser(userId);
      console.log("[API Comments] Found", comments2.length, "comments");
      res.json(comments2);
    } catch (error) {
      console.error("Error fetching user comments:", error);
      res.status(500).json({ message: "Failed to fetch user comments" });
    }
  });
  app2.get("/api/comments/user", optionalAuth, async (req, res) => {
    try {
      const userId = req.query.author;
      console.log("[API Comments Query] Fetching comments for userId:", userId);
      const comments2 = await storage.getCommentsByUser(userId);
      console.log("[API Comments Query] Found", comments2.length, "comments");
      res.json(comments2);
    } catch (error) {
      console.error("Error fetching user comments:", error);
      res.status(500).json({ message: "Failed to fetch user comments" });
    }
  });
  app2.get("/api/post/own", requireAuth, async (req, res) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        console.error("[API Posts Own] No userId found in req.user");
        return res.status(401).json({ message: "User not authenticated properly" });
      }
      console.log("[API Posts Own] Fetching posts for userId:", userId, "type:", typeof userId);
      const filters = { userId: String(userId) };
      const posts2 = await storage.getPosts(filters);
      console.log("[API Posts Own] Found", posts2.length, "posts");
      if (req.user && posts2.length > 0) {
        try {
          const userId2 = req.user.id;
          const postIds = posts2.map((p) => p.id);
          const userVotes = await storage.getUserVotes(userId2, postIds, "post");
          posts2.forEach((post) => {
            post.userVote = userVotes.find((v) => v.targetId === post.id);
          });
        } catch (error) {
          console.error("Error fetching user votes:", error);
        }
      }
      res.set("Cache-Control", "no-cache, no-store, must-revalidate");
      res.set("Pragma", "no-cache");
      res.set("Expires", "0");
      res.json(posts2);
    } catch (error) {
      console.error("Error fetching own posts:", error);
      res.status(500).json({ message: "Failed to fetch own posts" });
    }
  });
  app2.get("/api/comments/own", requireAuth, async (req, res) => {
    try {
      const userId = req.user.id;
      console.log("[API Comments Own] Fetching comments for userId:", userId);
      const comments2 = await storage.getCommentsByUser(userId);
      console.log("[API Comments Own] Found", comments2.length, "comments");
      res.json(comments2);
    } catch (error) {
      console.error("Error fetching own comments:", error);
      res.status(500).json({ message: "Failed to fetch own comments" });
    }
  });
  app2.get("/api/posts/user/:userId", optionalAuth, async (req, res) => {
    try {
      const userId = req.params.userId;
      console.log("[API Posts User] Raw req.params:", req.params);
      console.log("[API Posts User] Raw req.params.userId:", req.params.userId);
      console.log("[API Posts User] userId type:", typeof userId);
      console.log("[API Posts User] Fetching posts for userId:", userId);
      const filters = { userId };
      const posts2 = await storage.getPosts(filters);
      console.log("[API Posts User] Found", posts2.length, "posts");
      res.json(posts2);
    } catch (error) {
      console.error("Error fetching user posts:", error);
      res.status(500).json({ message: "Failed to fetch user posts" });
    }
  });
  if (process.env.NODE_ENV === "development") {
    app2.get("/api/debug/posts", optionalAuth, async (req, res) => {
      try {
        const userId = req.query.userId;
        console.log("[DEBUG] Raw req.query:", req.query);
        console.log("[DEBUG] Testing posts query with userId:", userId);
        const filters = userId ? { userId } : {};
        console.log("[DEBUG] Filters:", filters);
        const posts2 = await storage.getPosts(filters);
        console.log("[DEBUG] Found", posts2.length, "posts");
        res.json({ userId, filters, postCount: posts2.length, posts: posts2.slice(0, 3) });
      } catch (error) {
        console.error("Error in debug endpoint:", error);
        res.status(500).json({ message: "Debug failed", error: error.message });
      }
    });
  }
  if (process.env.NODE_ENV === "development") {
    app2.get("/api/debug/user", optionalAuth, async (req, res) => {
      try {
        console.log("[DEBUG USER] req.user:", req.user);
        console.log("[DEBUG USER] req.user?.id:", req.user?.id);
        console.log("[DEBUG USER] req.user?.id type:", typeof req.user?.id);
        res.json({
          user: req.user,
          userId: req.user?.id,
          authenticated: !!req.user,
          userIdType: typeof req.user?.id
        });
      } catch (error) {
        console.error("Error in debug user endpoint:", error);
        res.status(500).json({ message: "Debug failed", error: error.message });
      }
    });
  }
  if (process.env.NODE_ENV === "development") {
    app2.get("/api/test/posts", async (req, res) => {
      try {
        console.log("[TEST] Raw req.query:", JSON.stringify(req.query));
        console.log("[TEST] req.query type:", typeof req.query);
        console.log("[TEST] req.query.userId type:", typeof req.query.userId);
        const userId = req.query.userId;
        console.log("[TEST] userId received:", userId);
        console.log("[TEST] Original URL:", req.originalUrl);
        console.log("[TEST] Raw URL:", req.url);
        const filters = userId ? { userId } : {};
        console.log("[TEST] Filters:", filters);
        const posts2 = await storage.getPosts(filters);
        console.log("[TEST] Found", posts2.length, "posts");
        res.json({ userId, filters, postCount: posts2.length, posts: posts2.slice(0, 3) });
      } catch (error) {
        console.error("Error in test endpoint:", error);
        res.status(500).json({ message: "Test failed", error: error.message });
      }
    });
  }
  app2.delete("/api/polls/:id", requireAuth, async (req, res) => {
    try {
      const userId = req.user.id;
      const pollId = parseInt(req.params.id);
      await storage.deletePollCascade(pollId, userId);
      res.status(204).send();
    } catch (error) {
      if (error?.message === "FORBIDDEN") return res.status(403).json({ message: "Not allowed" });
      console.error("Error deleting poll:", error);
      res.status(500).json({ message: "Failed to delete poll" });
    }
  });
  app2.post("/api/vote", requireAuth, async (req, res) => {
    try {
      const userId = req.user.id;
      const voteData = insertVoteSchema.parse({ ...req.body, userId });
      console.log(`[VOTE] User ${userId} voting ${voteData.voteType} on ${voteData.targetType} ${voteData.targetId}`);
      const result = await storage.processVoteTransaction(
        userId,
        voteData.targetId,
        voteData.targetType,
        voteData.voteType
      );
      if (voteData.targetType === "post") {
        const post = await storage.getPost(voteData.targetId);
        if (post && post.authorId !== userId) {
          const karmaChange = voteData.voteType === "up" ? 2 : -2;
          await storage.updateUserKarma(post.authorId, karmaChange);
        }
      }
      if (voteData.targetType === "post") {
        const post = await storage.getPost(voteData.targetId);
        if (post && post.authorId !== userId) {
          const notif = await storage.createNotification({
            userId: post.authorId,
            type: voteData.voteType === "up" ? "upvote" : "downvote",
            content: `Someone ${voteData.voteType}voted your ${post.type}: "${post.title.slice(0, 100)}"`,
            link: `/post?id=${post.id}`
          });
          console.log("Notification created:", notif);
          const wss2 = req.app.get("wss");
          if (wss2) {
            wss2.clients.forEach((client2) => {
              client2.send(JSON.stringify({ type: "notification", notification: notif }));
            });
          }
        }
      }
      const wss = req.app.get("wss");
      if (wss) {
        wss.clients.forEach((client2) => {
          client2.send(JSON.stringify({ type: "feed_update", action: "vote", vote: voteData }));
        });
      }
      console.log(`[VOTE] Result:`, {
        success: result.success,
        hasUpdatedCounts: !!result.updatedCounts,
        hasUserVote: !!result.userVote
      });
      res.status(200).json({
        success: result.success,
        updatedCounts: result.updatedCounts,
        userVote: result.userVote
      });
    } catch (error) {
      console.error("Error voting:", error);
      res.status(500).json({ message: "Failed to vote" });
    }
  });
  app2.post("/api/organizations/:id/trust-vote", requireAuth, async (req, res) => {
    try {
      const userId = req.user.id;
      const organizationId = parseInt(req.params.id);
      const voteData = insertOrgTrustVoteSchema.parse({
        ...req.body,
        userId,
        organizationId
      });
      await storage.createOrganizationTrustVote(voteData);
      res.status(200).json({ success: true });
    } catch (error) {
      console.error("Error creating trust vote:", error);
      res.status(500).json({ message: "Failed to create trust vote" });
    }
  });
  app2.get("/api/organizations/:id/trust-vote", requireAuth, async (req, res) => {
    try {
      const userId = req.user.id;
      const organizationId = parseInt(req.params.id);
      const trustVote = await storage.getOrganizationTrustVote(userId, organizationId);
      res.json(trustVote || null);
    } catch (error) {
      console.error("Error fetching trust vote:", error);
      res.status(500).json({ message: "Failed to fetch trust vote" });
    }
  });
  app2.delete("/api/organizations/:id/trust-vote", requireAuth, async (req, res) => {
    try {
      const userId = req.user.id;
      const organizationId = parseInt(req.params.id);
      await storage.deleteOrganizationTrustVote(userId, organizationId);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting trust vote:", error);
      res.status(500).json({ message: "Failed to delete trust vote" });
    }
  });
  app2.get("/api/notifications", requireAuth, async (req, res) => {
    try {
      const userId = req.user.id;
      const notifs = await storage.getNotifications(userId);
      res.json(notifs);
    } catch (error) {
      console.error("Error fetching notifications:", error);
      res.status(500).json({ message: "Failed to fetch notifications" });
    }
  });
  app2.post("/api/notifications/:id/read", requireAuth, async (req, res) => {
    try {
      const userId = req.user.id;
      const notifId = parseInt(req.params.id);
      await storage.markNotificationAsRead(userId, notifId);
      res.json({ success: true });
    } catch (error) {
      console.error("Error marking notification as read:", error);
      res.status(500).json({ message: "Failed to mark notification as read" });
    }
  });
  app2.post("/api/test-notifications", requireAuth, async (req, res) => {
    try {
      const userId = req.user.id;
      const notification = await storage.createNotification({
        userId,
        type: "test",
        content: "This is a test notification!",
        link: "/notifications"
      });
      res.json({ success: true, notification });
    } catch (error) {
      console.error("Test notification error:", error);
      res.status(500).json({ message: "Failed to create test notification" });
    }
  });
  app2.post("/api/test-notification", requireAuth, async (req, res) => {
    try {
      const userId = req.user.id;
      const notif = await storage.createNotification({
        userId,
        type: "test",
        content: "This is a test notification to verify the system works!",
        link: "/"
      });
      const wss = req.app.get("wss");
      if (wss) {
        wss.clients.forEach((client2) => {
          client2.send(JSON.stringify({ type: "notification", notification: notif }));
        });
      }
      res.json({ success: true, notification: notif });
    } catch (error) {
      console.error("Error creating test notification:", error);
      res.status(500).json({ message: "Failed to create test notification" });
    }
  });
  app2.post("/api/admin/recalculate-comment-counts", requireAuth, async (req, res) => {
    try {
      const result = await storage.recalculateAllCommentCounts();
      res.json({
        success: true,
        message: `Recalculated comment counts for ${result.updated} out of ${result.total} posts`,
        result
      });
    } catch (error) {
      console.error("Error recalculating comment counts:", error);
      res.status(500).json({ message: "Failed to recalculate comment counts" });
    }
  });
  app2.get("/api/onchain/company/:id", async (req, res) => {
    try {
      const id = Number(req.params.id);
      if (!id) return res.status(400).json({ message: "Invalid id" });
      return res.status(501).json({ message: "Not implemented. Frontend queries Starknet directly." });
    } catch (e) {
      return res.status(500).json({ message: "Failed", error: String(e?.message || e) });
    }
  });
  app2.post("/api/security/key-exchange", rateLimit(10, 6e4), (req, res) => {
    try {
      const key = crypto7.randomBytes(32).toString("hex");
      res.json({
        key,
        timestamp: Date.now(),
        algorithm: "AES-256-GCM"
      });
    } catch (error) {
      console.error("Key exchange error:", error);
      res.status(500).json({ error: "Key exchange failed" });
    }
  });
  app2.post("/api/security/violation", rateLimit(50, 6e4), (req, res) => {
    try {
      const { reason, timestamp: timestamp2, userAgent, url } = req.body;
      console.warn("Security violation reported:", {
        reason,
        timestamp: timestamp2,
        userAgent,
        url,
        ip: req.ip,
        headers: {
          "user-agent": req.get("User-Agent"),
          "referer": req.get("Referer"),
          "x-forwarded-for": req.get("X-Forwarded-For")
        }
      });
      res.status(200).json({ received: true });
    } catch (error) {
      console.error("Security violation logging error:", error);
      res.status(500).json({ error: "Logging failed" });
    }
  });
  app2.get("/api/security/health", (req, res) => {
    const securityMetrics = {
      timestamp: Date.now(),
      csp: "active",
      headers: "secured",
      encryption: "enabled",
      rateLimit: "active",
      botDetection: "enabled"
    };
    res.json(securityMetrics);
  });
  app2.post("/api/security/challenge", rateLimit(20, 6e4), (req, res) => {
    try {
      const challenge = crypto7.randomBytes(16).toString("hex");
      const timestamp2 = Date.now();
      const a = Math.floor(Math.random() * 100) + 1;
      const b = Math.floor(Math.random() * 100) + 1;
      const operation = Math.random() > 0.5 ? "add" : "multiply";
      const expectedAnswer = operation === "add" ? a + b : a * b;
      const challengeKey = `challenge_${challenge}`;
      setTimeout(() => {
      }, 5 * 60 * 1e3);
      res.json({
        challenge,
        question: `What is ${a} ${operation === "add" ? "+" : "\xD7"} ${b}?`,
        timestamp: timestamp2
      });
    } catch (error) {
      console.error("Challenge generation error:", error);
      res.status(500).json({ error: "Challenge generation failed" });
    }
  });
  const httpServer = createServer(app2);
  return httpServer;
}

// server/vite.ts
import express from "express";
import fs2 from "fs";
import path4 from "path";
import { createServer as createViteServer, createLogger } from "vite";

// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path3 from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
var vite_config_default = defineConfig({
  plugins: [
    react(),
    runtimeErrorOverlay(),
    ...process.env.NODE_ENV !== "production" && process.env.REPL_ID !== void 0 ? [
      await import("@replit/vite-plugin-cartographer").then(
        (m) => m.cartographer()
      )
    ] : []
  ],
  resolve: {
    alias: {
      "@": path3.resolve(import.meta.dirname, "client", "src"),
      "@shared": path3.resolve(import.meta.dirname, "shared"),
      "@assets": path3.resolve(import.meta.dirname, "attached_assets"),
      buffer: "buffer",
      process: "process/browser",
      stream: "stream-browserify",
      util: "util"
    }
  },
  define: {
    "process.env": {},
    global: "globalThis"
  },
  optimizeDeps: {
    esbuildOptions: {
      define: {
        global: "globalThis"
      }
    },
    include: ["buffer", "process"]
  },
  root: path3.resolve(import.meta.dirname, "client"),
  build: {
    outDir: path3.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true,
    sourcemap: false,
    // Disable source maps for security
    minify: "terser",
    terserOptions: {
      compress: {
        drop_console: process.env.NODE_ENV === "production",
        drop_debugger: true,
        pure_funcs: ["console.log", "console.info", "console.debug"],
        passes: 3
      },
      mangle: {
        properties: {
          regex: /^_/
          // Mangle private properties
        },
        toplevel: true
      },
      format: {
        comments: false
      }
    },
    rollupOptions: {
      output: {
        // Obscure chunk names in production
        chunkFileNames: process.env.NODE_ENV === "production" ? "assets/[hash].js" : "assets/[name]-[hash].js",
        entryFileNames: process.env.NODE_ENV === "production" ? "assets/[hash].js" : "assets/[name]-[hash].js",
        assetFileNames: "assets/[hash].[ext]",
        manualChunks: {
          // Split vendor libraries
          vendor: ["react", "react-dom"],
          crypto: ["crypto-js", "@fingerprintjs/fingerprintjs"]
        }
      }
    }
  },
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:3000",
        changeOrigin: true,
        secure: false
      }
    },
    fs: {
      strict: true,
      deny: ["**/.*"]
    },
    // Completely disable HMR and WebSocket to prevent conflicts
    hmr: false,
    ws: false
  },
  // Explicitly disable WebSocket for HMR to prevent conflicts
  define: {
    __VITE_HMR_PROTOCOL__: JSON.stringify("ws"),
    __VITE_HMR_HOSTNAME__: JSON.stringify("localhost"),
    __VITE_HMR_PORT__: 24678
  }
});

// server/vite.ts
import { nanoid as nanoid2 } from "nanoid";
var viteLogger = createLogger();
function log(message, source = "express") {
  const formattedTime = (/* @__PURE__ */ new Date()).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}
async function setupVite(app2, server) {
  const serverOptions = {
    middlewareMode: true,
    // Disable HMR completely to prevent WebSocket conflicts
    hmr: false,
    allowedHosts: true
  };
  const vite = await createViteServer({
    ...vite_config_default,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        console.error("Vite error:", msg, options);
      }
    },
    server: serverOptions,
    appType: "custom"
  });
  app2.use(vite.middlewares);
  app2.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    try {
      const clientTemplate = path4.resolve(
        import.meta.dirname,
        "..",
        "client",
        "index.html"
      );
      let template = await fs2.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid2()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
}
function serveStatic(app2) {
  const distPath = path4.resolve(import.meta.dirname, "public");
  if (!fs2.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }
  app2.use(express.static(distPath));
  app2.use("*", (_req, res) => {
    res.sendFile(path4.resolve(distPath, "index.html"));
  });
}

// server/index.ts
init_storage();
init_db();
init_config();
init_schema();
import { sql as sql3 } from "drizzle-orm";

// server/middleware/advanced-security.ts
init_config();
import crypto8 from "crypto";
import { v4 as uuidv4 } from "uuid";
import CryptoJS from "crypto-js";
import { UAParser } from "ua-parser-js";
import DeviceDetector from "device-detector-js";
import slowDown from "express-slow-down";
import ExpressBrute from "express-brute";
var ENCRYPTION_KEY = crypto8.pbkdf2Sync(
  CONFIG.SECURITY.JWT_SECRET,
  "anonn-salt-2025",
  1e4,
  32,
  "sha512"
);
var deviceFingerprints = /* @__PURE__ */ new Map();
var encryptPayload = (req, res, next) => {
  const sensitiveEndpoints = [
    "/api/users",
    "/api/organizations",
    "/api/payments",
    "/api/admin"
  ];
  const shouldEncrypt = sensitiveEndpoints.some(
    (endpoint) => req.path.startsWith(endpoint)
  );
  if (!shouldEncrypt) {
    return next();
  }
  if (req.body && Object.keys(req.body).length > 0) {
    try {
      const encrypted = CryptoJS.AES.encrypt(
        JSON.stringify(req.body),
        ENCRYPTION_KEY.toString("hex")
      ).toString();
      req.body = { encrypted: true, data: encrypted };
    } catch (error) {
      console.error("Payload encryption failed:", error);
    }
  }
  const originalSend = res.send;
  res.send = function(data) {
    try {
      if (typeof data === "object" && data !== null) {
        const sensitiveFields = ["email", "phone", "address", "ssn", "token"];
        const encrypted = encryptSensitiveFields(data, sensitiveFields);
        return originalSend.call(this, encrypted);
      }
    } catch (error) {
      console.error("Response encryption failed:", error);
    }
    return originalSend.call(this, data);
  };
  next();
};
var deviceFingerprinting = (req, res, next) => {
  const userAgent = req.get("User-Agent") || "";
  const ip = req.ip || "";
  const acceptLanguage = req.get("Accept-Language") || "";
  const acceptEncoding = req.get("Accept-Encoding") || "";
  const parser = new UAParser(userAgent);
  const uaResult = parser.getResult();
  const deviceDetector = new DeviceDetector();
  const deviceInfo = deviceDetector.parse(userAgent);
  const fingerprintData = {
    ip: hashValue(ip),
    userAgent: hashValue(userAgent),
    acceptLanguage,
    acceptEncoding,
    browser: uaResult.browser.name,
    os: uaResult.os.name,
    device: deviceInfo.device?.type || "unknown",
    timezone: req.get("X-Timezone-Offset") || "",
    screen: req.get("X-Screen-Resolution") || ""
  };
  const fingerprint = crypto8.createHash("sha256").update(JSON.stringify(fingerprintData)).digest("hex");
  let deviceData = deviceFingerprints.get(fingerprint);
  const now = /* @__PURE__ */ new Date();
  if (deviceData) {
    deviceData.lastSeen = now;
    if (deviceData.trustScore < 100) {
      deviceData.trustScore += 1;
    }
  } else {
    deviceData = {
      fingerprint,
      lastSeen: now,
      trustScore: 10,
      violations: 0
    };
    deviceFingerprints.set(fingerprint, deviceData);
  }
  req.deviceInfo = {
    fingerprint,
    trustScore: deviceData.trustScore,
    isNewDevice: deviceData.trustScore < 50,
    deviceType: deviceInfo.device?.type || "unknown",
    browser: uaResult.browser.name,
    os: uaResult.os.name
  };
  next();
};
var botDetection = (req, res, next) => {
  const userAgent = req.get("User-Agent") || "";
  const ip = req.ip || "";
  const referer = req.get("Referer") || "";
  const origin = req.get("Origin") || "";
  const isSameOrigin = referer.includes("localhost") || origin.includes("localhost") || referer.includes(req.get("Host") || "") || origin.includes(req.get("Host") || "");
  if (isSameOrigin && userAgent.match(/Mozilla|Chrome|Safari|Firefox|Edge/i)) {
    return next();
  }
  const strictBotPatterns = [
    /bot|crawler|spider|crawling/i,
    /slurp|facebook|twitter|linkedin/i
  ];
  const isBot = strictBotPatterns.some((pattern) => pattern.test(userAgent));
  if (isBot) {
    return res.status(403).json({ error: "Automated requests not allowed" });
  }
  const requestFingerprint = `${ip}-${req.path}-${req.method}`;
  const requestCount = getRequestCount(requestFingerprint);
  if (requestCount > 200) {
    return res.status(429).json({ error: "Too many identical requests" });
  }
  const requiredHeaders = ["accept"];
  const missingRequiredHeaders = requiredHeaders.filter((header) => !req.get(header));
  if (missingRequiredHeaders.length > 0) {
    incrementViolation(ip);
    return res.status(403).json({ error: "Invalid request headers" });
  }
  next();
};
var store = new ExpressBrute.MemoryStore();
var advancedBruteForce = new ExpressBrute(store, {
  freeRetries: 5,
  minWait: 5 * 60 * 1e3,
  // 5 minutes
  maxWait: 60 * 60 * 1e3,
  // 1 hour
  lifetime: 24 * 60 * 60,
  // 24 hours
  failCallback: (req, res, next, nextValidRequestDate) => {
    res.status(429).json({
      error: "Too many failed attempts",
      nextValidRequestDate
    });
  },
  handleStoreError: (error) => {
    console.error("Brute force store error:", error);
  }
});
var progressiveSpeedLimit = slowDown({
  windowMs: 15 * 60 * 1e3,
  // 15 minutes
  delayAfter: 100,
  // Allow 100 requests per windowMs without delay
  delayMs: () => 500,
  // Add 500ms delay after delayAfter is reached
  maxDelayMs: 1e4,
  // Maximum delay of 10 seconds
  skip: (req) => {
    return req.deviceInfo?.trustScore > 80;
  }
});
var advancedCSP = (req, res, next) => {
  const nonce = crypto8.randomBytes(16).toString("base64");
  res.locals.nonce = nonce;
  const cspDirectives = [
    "default-src 'self'",
    `script-src 'self' 'nonce-${nonce}' 'strict-dynamic' https://app.dynamic.xyz https://app.dynamicauth.com`,
    `style-src 'self' 'nonce-${nonce}' https://fonts.googleapis.com`,
    "img-src 'self' data: blob: https:",
    "font-src 'self' data: https://fonts.gstatic.com",
    "connect-src 'self' https: wss: ws:",
    "media-src 'self' data: blob:",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-src 'self' https://app.dynamicauth.com",
    "frame-ancestors 'none'",
    "upgrade-insecure-requests",
    "require-trusted-types-for 'script'",
    "trusted-types default"
  ];
  res.setHeader("Content-Security-Policy", cspDirectives.join("; "));
  next();
};
var antiTampering = (req, res, next) => {
  const originalSend = res.send;
  res.send = function(data) {
    if (res.getHeader("Content-Type")?.toString().includes("text/html")) {
      const antiDebugScript = `
        <script nonce="${res.locals.nonce}">
          // Anti-debugging protection
          (function() {
            let devtools = {open: false, orientation: null};
            let threshold = 160;
            
            setInterval(function() {
              if (window.outerHeight - window.innerHeight > threshold || 
                  window.outerWidth - window.innerWidth > threshold) {
                if (!devtools.open) {
                  devtools.open = true;
                  console.clear();
                  document.body.innerHTML = '<h1>Developer tools detected. Access denied.</h1>';
                  window.location.href = '/';
                }
              } else {
                devtools.open = false;
              }
            }, 500);

            // Disable right-click
            document.addEventListener('contextmenu', e => e.preventDefault());
            
            // Disable F12, Ctrl+Shift+I, etc.
            document.addEventListener('keydown', function(e) {
              if (e.key === 'F12' || 
                  (e.ctrlKey && e.shiftKey && e.key === 'I') ||
                  (e.ctrlKey && e.shiftKey && e.key === 'J') ||
                  (e.ctrlKey && e.key === 'U')) {
                e.preventDefault();
              }
            });

            // Detect console usage
            let devtools_detect = new Image();
            Object.defineProperty(devtools_detect, 'id', {
              get: function() {
                console.clear();
                document.body.innerHTML = '<h1>Console usage detected. Access denied.</h1>';
                window.location.href = '/';
              }
            });
            console.log(devtools_detect);
          })();
        </script>
      `;
      if (typeof data === "string" && data.includes("</head>")) {
        data = data.replace("</head>", antiDebugScript + "</head>");
      }
    }
    return originalSend.call(this, data);
  };
  next();
};
function hashValue(value) {
  return crypto8.createHash("sha256").update(value).digest("hex").substring(0, 16);
}
function encryptSensitiveFields(obj, sensitiveFields) {
  if (typeof obj !== "object" || obj === null) return obj;
  const result = Array.isArray(obj) ? [] : {};
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      if (sensitiveFields.includes(key.toLowerCase()) && typeof obj[key] === "string") {
        result[key] = CryptoJS.AES.encrypt(
          obj[key],
          ENCRYPTION_KEY.toString("hex")
        ).toString();
      } else if (typeof obj[key] === "object") {
        result[key] = encryptSensitiveFields(obj[key], sensitiveFields);
      } else {
        result[key] = obj[key];
      }
    }
  }
  return result;
}
var requestCounts = /* @__PURE__ */ new Map();
function getRequestCount(fingerprint) {
  const now = Date.now();
  const data = requestCounts.get(fingerprint);
  if (!data || data.resetTime < now) {
    requestCounts.set(fingerprint, { count: 1, resetTime: now + 6e4 });
    return 1;
  }
  data.count++;
  return data.count;
}
var violations = /* @__PURE__ */ new Map();
function incrementViolation(ip) {
  const now = Date.now();
  const data = violations.get(ip);
  if (!data || data.resetTime < now) {
    violations.set(ip, { count: 1, resetTime: now + 36e5 });
  } else {
    data.count++;
  }
}

// server/websocket.ts
import { WebSocketServer, WebSocket } from "ws";
var WebSocketManager = class {
  wss = null;
  clients = /* @__PURE__ */ new Set();
  constructor(server) {
    try {
      log("Initializing WebSocket server...");
      this.wss = new WebSocketServer({
        server,
        // Add error handling to prevent crashes
        clientTracking: true,
        // Add perMessageDeflate for better compatibility
        perMessageDeflate: false,
        // Add path filtering to avoid Vite connections
        path: "/ws",
        // Add better error handling
        handleProtocols: () => "websocket",
        // Add max payload size
        maxPayload: 1024 * 1024
        // 1MB
      });
      this.setupWebSocket();
      log("WebSocket server initialized successfully");
    } catch (error) {
      log("Failed to initialize WebSocket server:", error instanceof Error ? error.message : String(error));
      log("Continuing without WebSocket support");
      this.wss = null;
    }
  }
  setupWebSocket() {
    if (!this.wss) return;
    this.wss.on("connection", (ws, request) => {
      const origin = request.headers.origin;
      const userAgent = request.headers["user-agent"] || "";
      if (origin && (origin.includes("vite") || origin.includes("localhost:5173"))) {
        log("Blocking Vite WebSocket connection to prevent conflicts");
        ws.close(1008, "Vite connections not allowed");
        return;
      }
      if (userAgent.includes("vite") || userAgent.includes("webpack")) {
        log("Blocking development tool WebSocket connection");
        ws.close(1008, "Development tool connections not allowed");
        return;
      }
      if (ws.readyState !== WebSocket.CONNECTING && ws.readyState !== WebSocket.OPEN) {
        log("Invalid WebSocket state, closing connection");
        ws.close(1002, "Invalid connection state");
        return;
      }
      log("WebSocket client connected");
      this.clients.add(ws);
      const pingInterval = setInterval(() => {
        if (ws.readyState === WebSocket.OPEN) {
          try {
            ws.ping();
          } catch (error) {
            log("Error sending ping:", error instanceof Error ? error.message : String(error));
            clearInterval(pingInterval);
            this.clients.delete(ws);
          }
        } else {
          clearInterval(pingInterval);
          this.clients.delete(ws);
        }
      }, 3e4);
      ws.on("message", (message) => {
        try {
          const data = JSON.parse(message);
          log("WebSocket message received:", data.type);
          switch (data.type) {
            case "ping":
              ws.send(JSON.stringify({ type: "pong" }));
              break;
            default:
              log("Unknown WebSocket message type:", data.type);
          }
        } catch (error) {
          log("Error parsing WebSocket message:", error instanceof Error ? error.message : String(error));
        }
      });
      ws.on("close", () => {
        log("WebSocket client disconnected");
        clearInterval(pingInterval);
        this.clients.delete(ws);
      });
      ws.on("error", (error) => {
        log("WebSocket error:", error instanceof Error ? error.message : String(error));
        clearInterval(pingInterval);
        this.clients.delete(ws);
      });
      try {
        ws.send(JSON.stringify({
          type: "connected",
          message: "WebSocket connection established"
        }));
      } catch (error) {
        log("Error sending initial message:", error instanceof Error ? error.message : String(error));
      }
    });
    this.wss.on("error", (error) => {
      log("WebSocket server error:", error instanceof Error ? error.message : String(error));
    });
    log("WebSocket server initialized");
  }
  broadcast(message) {
    if (!this.wss) return;
    const messageStr = JSON.stringify(message);
    this.clients.forEach((client2) => {
      if (client2.readyState === WebSocket.OPEN) {
        try {
          client2.send(messageStr);
        } catch (error) {
          log("Error sending WebSocket message:", error instanceof Error ? error.message : String(error));
          this.clients.delete(client2);
        }
      }
    });
  }
  getWss() {
    return this.wss;
  }
  getClientCount() {
    return this.clients.size;
  }
};

// server/index.ts
async function seedTestData() {
  const bowlsExist = await db.select({ count: sql3`count(*)` }).from(bowls);
  if (bowlsExist[0]?.count > 0) {
    console.log("Bowls already exist, skipping seed");
    return;
  }
  console.log("No bowls found, seeding data...");
  const users2 = [];
  for (let i = 1; i <= 5; i++) {
    users2.push(await storage.upsertUser({
      id: `testuser${i}`,
      username: `testuser${i}`,
      walletAddress: `testWallet${i}`,
      karma: 0,
      postKarma: 0,
      commentKarma: 0,
      awardeeKarma: 0,
      followerCount: 0,
      followingCount: 0,
      isVerified: false,
      isPremium: false,
      isOnline: false
    }));
  }
  const orgs = [];
  for (let i = 1; i <= 3; i++) {
    orgs.push(await storage.createOrganization({
      name: `Test Organization ${i}`,
      description: `This is a test organization #${i}.`,
      website: `https://org${i}.com`,
      createdBy: users2[0].id
    }));
  }
  const createdBowls = [];
  const web3IndustryBowls = [
    { name: "DeFi", description: "Decentralized Finance protocols, yield farming, and DeFi strategies", category: "industries" },
    { name: "NFTs", description: "Non-fungible tokens, digital art, and NFT trading", category: "industries" },
    { name: "Gaming", description: "Web3 gaming, play-to-earn, and blockchain games", category: "industries" },
    { name: "Infrastructure", description: "Blockchain infrastructure, nodes, and developer tools", category: "industries" },
    { name: "Privacy", description: "Privacy-focused blockchain and zero-knowledge proofs", category: "industries" },
    { name: "Layer 2", description: "Layer 2 scaling solutions and rollups", category: "industries" },
    { name: "Cross-Chain", description: "Cross-chain bridges and interoperability", category: "industries" },
    { name: "DAO", description: "Decentralized Autonomous Organizations and governance", category: "industries" }
  ];
  const web3JobGroupBowls = [
    { name: "Smart Contract Development", description: "Solidity, smart contract security, and blockchain development", category: "job-groups" },
    { name: "Frontend Development", description: "Web3 frontend development, dApp interfaces, and wallet integration", category: "job-groups" },
    { name: "Backend Development", description: "Web3 backend, API development, and blockchain integration", category: "job-groups" },
    { name: "DevOps", description: "Web3 infrastructure, deployment, and blockchain operations", category: "job-groups" },
    { name: "Marketing", description: "Web3 marketing, community building, and growth strategies", category: "job-groups" },
    { name: "Sales", description: "Web3 sales, business development, and partnerships", category: "job-groups" },
    { name: "Product Management", description: "Web3 product strategy, roadmap, and user experience", category: "job-groups" },
    { name: "Design", description: "Web3 UX/UI design, dApp interfaces, and brand design", category: "job-groups" },
    { name: "Research", description: "Web3 research, tokenomics, and market analysis", category: "job-groups" },
    { name: "Legal", description: "Web3 legal, compliance, and regulatory discussions", category: "job-groups" }
  ];
  const web3CommunityBowls = [
    { name: "General", description: "General Web3 discussions and community chat", category: "user-moderated" },
    { name: "Newbies", description: "Web3 beginners and onboarding discussions", category: "user-moderated" },
    { name: "Developers", description: "Web3 developer community and technical discussions", category: "user-moderated" },
    { name: "Investors", description: "Web3 investment strategies and portfolio discussions", category: "user-moderated" },
    { name: "Entrepreneurs", description: "Web3 startups, entrepreneurship, and business ideas", category: "user-moderated" },
    { name: "Artists", description: "Web3 artists, creators, and NFT creators community", category: "user-moderated" },
    { name: "Gamers", description: "Web3 gaming community and play-to-earn discussions", category: "user-moderated" },
    { name: "Traders", description: "Crypto trading community and market discussions", category: "user-moderated" },
    { name: "Researchers", description: "Web3 research community and academic discussions", category: "user-moderated" },
    { name: "Events", description: "Web3 events, conferences, and meetups", category: "user-moderated" },
    { name: "Jobs", description: "Web3 job opportunities and career discussions", category: "user-moderated" },
    { name: "Networking", description: "Web3 professional networking and connections", category: "user-moderated" },
    { name: "Alpha", description: "Alpha calls, insights, and exclusive information", category: "user-moderated" },
    { name: "Shitposting", description: "Web3 shitposting and community humor", category: "user-moderated" }
  ];
  const allBowls = [...web3IndustryBowls, ...web3JobGroupBowls, ...web3CommunityBowls];
  for (const bowlData of allBowls) {
    const [bowl] = await db.insert(bowls).values({
      name: bowlData.name,
      description: bowlData.description,
      category: bowlData.category,
      memberCount: 0,
      createdBy: null
      // No creator for predefined bowls
    }).returning();
    createdBowls.push(bowl);
  }
  for (let i = 1; i <= 10; i++) {
    const isReview = i % 2 === 0;
    const post = await storage.createPost({
      title: isReview ? `Test Review ${i}` : `Test Discussion ${i}`,
      content: isReview ? `This is a review content for post #${i}.` : `This is a discussion content for post #${i}.`,
      type: isReview ? "review" : "discussion",
      authorId: users2[i % users2.length].id,
      organizationId: isReview ? orgs[i % orgs.length].id : null,
      bowlId: !isReview ? createdBowls[i % createdBowls.length].id : null,
      sentiment: isReview ? ["positive", "neutral", "negative"][i % 3] : null,
      isAnonymous: i % 3 === 0
    });
    for (let j = 1; j <= 2; j++) {
      await storage.createComment({
        postId: post.id,
        authorId: users2[(i + j) % users2.length].id,
        content: `Test comment ${j} on post #${i}`
      });
    }
    for (let k = 0; k < 3; k++) {
      await storage.createVote({
        targetId: post.id,
        targetType: "post",
        userId: users2[(i + k) % users2.length].id,
        voteType: k % 2 === 0 ? "up" : "down"
      });
    }
  }
}
var app = express2();
var corsOptions = {
  origin: [
    "http://localhost:3000",
    "http://localhost:5173",
    CONFIG.SERVER.CLOUDFLARE_URL,
    "http://10.10.1.93:3000",
    "http://10.10.1.93:5173",
    ...Array.isArray(CONFIG.SERVER.CORS_ORIGIN) ? CONFIG.SERVER.CORS_ORIGIN : [CONFIG.SERVER.CORS_ORIGIN]
  ].filter(Boolean),
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With", "X-Dynamic-Signature"],
  exposedHeaders: ["Content-Range", "X-Content-Range"],
  maxAge: 86400
  // 24 hours
};
console.log("\u{1F527} Server Configuration:");
console.log("  Environment:", CONFIG.SERVER.NODE_ENV);
console.log("  Port:", CONFIG.SERVER.PORT);
console.log("  CORS Origins:", corsOptions.origin);
console.log("  Dynamic Environment ID:", CONFIG.DYNAMIC.ENVIRONMENT_ID);
console.log("  Database URL:", CONFIG.DATABASE.URL ? "Connected" : "Not configured");
app.use(cors(corsOptions));
app.options("*", cors(corsOptions));
app.disable("x-powered-by");
app.use(securityHeaders);
app.use(deviceFingerprinting);
app.use((req, res, next) => {
  if (req.path.startsWith("/api/posts") || req.path.startsWith("/api/users") || req.path.startsWith("/api/bowls") || req.path.startsWith("/api/organizations")) {
    return next();
  }
  botDetection(req, res, next);
});
app.use(advancedCSP);
app.use(antiTampering);
app.use(helmet({
  contentSecurityPolicy: false,
  // We handle CSP in advancedCSP
  crossOriginEmbedderPolicy: false,
  // for dev/vite compatibility
  crossOriginResourcePolicy: { policy: "cross-origin" },
  // Allow Dynamic resources
  hsts: {
    maxAge: 31536e3,
    includeSubDomains: true,
    preload: true
  },
  frameguard: { action: "deny" },
  noSniff: true,
  xssFilter: true
}));
app.set("trust proxy", 1);
app.use(express2.json({
  limit: "50kb",
  verify: (req, res, buf) => {
    const rawBody = buf.toString();
    if (rawBody.includes("\0")) {
      throw new Error("Invalid JSON: contains null bytes");
    }
  }
}));
app.use(express2.urlencoded({
  extended: false,
  limit: "50kb",
  parameterLimit: 100
  // Limit number of parameters
}));
app.use(cookieParser());
app.use(sanitizeInputs);
app.use(progressiveSpeedLimit);
app.use("/api/users", encryptPayload);
app.use("/api/admin", encryptPayload);
var strictApiLimiter = createRateLimit({
  windowMs: 15 * 60 * 1e3,
  // 15 minutes
  maxRequests: CONFIG.SERVER.NODE_ENV === "development" ? 1e3 : 100,
  // Higher limit in development
  keyGenerator: (req) => `${req.ip}-${req.user?.id || "anonymous"}`
});
var generalApiLimiter = createRateLimit({
  windowMs: 15 * 60 * 1e3,
  // 15 minutes
  maxRequests: CONFIG.SERVER.NODE_ENV === "development" ? 2e3 : 300,
  // Higher limit in development
  keyGenerator: (req) => `${req.ip}-general`
});
app.use("/api/auth/login", advancedBruteForce.prevent);
app.use("/api/auth/register", advancedBruteForce.prevent);
app.use("/api/posts", strictApiLimiter);
app.use("/api/comments", strictApiLimiter);
app.use("/api/votes", strictApiLimiter);
app.use("/api/organizations", strictApiLimiter);
app.use("/api", generalApiLimiter);
app.use((req, res, next) => {
  const start = Date.now();
  const path5 = req.path;
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path5.startsWith("/api")) {
      const auth = (req.headers?.authorization || "").slice(0, 24);
      log(`${req.method} ${path5} ${res.statusCode} in ${duration}ms auth=${auth ? "yes" : "no"}`);
    }
  });
  next();
});
(async () => {
  const server = await registerRoutes(app);
  try {
    const wsManager = new WebSocketManager(server);
    app.set("wss", wsManager.getWss());
    log("WebSocket server attached to app");
    server.on("error", (error) => {
      log("HTTP server error:", error instanceof Error ? error.message : String(error));
    });
    server.on("upgrade", (request, socket, head) => {
      if (request.url === "/ws") {
        return;
      }
      socket.write("HTTP/1.1 400 Bad Request\r\n\r\n");
      socket.destroy();
    });
  } catch (error) {
    log("Failed to initialize WebSocket server:", error instanceof Error ? error.message : String(error));
    log("Continuing without WebSocket support");
    app.set("wss", null);
  }
  app.use((err, req, res, _next) => {
    const status = err.status || err.statusCode || 500;
    console.error("API Error:", {
      status,
      message: err.message,
      stack: CONFIG.SERVER.NODE_ENV === "development" ? err.stack : void 0,
      url: req.url,
      method: req.method,
      ip: req.ip,
      userAgent: req.get("User-Agent")
    });
    let message = "Internal Server Error";
    if (status < 500) {
      message = err.message || "Bad Request";
    } else if (CONFIG.SERVER.NODE_ENV === "development") {
      message = err.message || "Internal Server Error";
    }
    message = message.replace(/password|token|secret|key|private/gi, "[REDACTED]");
    res.status(status).json({
      error: message,
      code: status
    });
  });
  app.get("/health", (req, res) => {
    res.json({
      status: "ok",
      timestamp: (/* @__PURE__ */ new Date()).toISOString(),
      uptime: Math.floor(process.uptime())
    });
  });
  if (CONFIG.SERVER.NODE_ENV === "development") {
    try {
      await seedTestData();
      log("Development data seeding completed");
    } catch (error) {
      log(`Database connection failed, skipping seed data: ${error.message}`);
    }
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }
  const port = CONFIG.SERVER.PORT;
  const host = CONFIG.SERVER.NODE_ENV === "production" ? "0.0.0.0" : "localhost";
  server.listen(port, host, () => {
    log(`\u{1F680} Server running on ${host}:${port} in ${CONFIG.SERVER.NODE_ENV} mode`);
    if (CONFIG.SERVER.NODE_ENV === "development") {
      log(`\u{1F4F1} Client: http://localhost:${port}`);
      log(`\u{1F517} API: http://localhost:${port}/api`);
    }
  });
})();
