import { z } from "zod";

// ─── The Feed Spec ──────────────────────────────────────
// This is the contract. Any site that serves a valid feed.json
// at their root domain is part of the network.

const profileSchema = z.object({
  name: z.string().min(1).max(100),
  domain: z.string().min(1),
  bio: z.string().max(280).optional(),
  avatar: z.string().url().startsWith("https://").optional(),
  url: z.string().url().startsWith("https://"),
});

const baseItem = {
  id: z.string().min(1).max(128),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  location: z.string().max(100).optional(),
  coords: z.tuple([z.number(), z.number()]).optional(),
  tags: z.array(z.string().max(30).toLowerCase()).max(5).optional(),
};

const essayItem = z.object({
  ...baseItem,
  type: z.literal("essay"),
  title: z.string().min(1).max(200),
  description: z.string().max(500),
  url: z.string().url(),
});

const thoughtItem = z.object({
  ...baseItem,
  type: z.literal("thought"),
  text: z.string().min(1).max(1000),
});

const imageItem = z.object({
  ...baseItem,
  type: z.literal("image"),
  src: z.string().url().startsWith("https://"),
  caption: z.string().max(300).optional(),
  aspect: z.enum(["tall", "wide", "square", "cinematic"]).optional(),
  dominantColor: z.string().max(50).optional(),
});

const quoteItem = z.object({
  ...baseItem,
  type: z.literal("quote"),
  text: z.string().min(1).max(500),
  attribution: z.string().max(100).optional(),
});

const linkItem = z.object({
  ...baseItem,
  type: z.literal("link"),
  title: z.string().min(1).max(200),
  url: z.string().url(),
  source: z.string().max(100),
});

const galleryItem = z.object({
  ...baseItem,
  type: z.literal("gallery"),
  images: z
    .array(
      z.object({
        src: z.string().url().startsWith("https://"),
        dominantColor: z.string().max(50).optional(),
      })
    )
    .min(1)
    .max(10),
  caption: z.string().max(300).optional(),
});

const repostItem = z.object({
  ...baseItem,
  type: z.literal("repost"),
  comment: z.string().min(1).max(1000),
  original: z.object({
    author: z.string().min(1).max(100),
    text: z.string().min(1).max(1000),
    handle: z.string().max(100).optional(),
    date: z.string().optional(),
    url: z.string().url().optional(),
    source: z.string().max(100).optional(),
    image: z.string().url().optional(),
  }),
});

const feedItemSchema = z.discriminatedUnion("type", [
  essayItem,
  thoughtItem,
  imageItem,
  quoteItem,
  linkItem,
  galleryItem,
  repostItem,
]);

export const feedSchema = z.object({
  version: z.literal("1.0"),
  profile: profileSchema,
  items: z.array(feedItemSchema).max(50),
});

// ─── Derived Types ──────────────────────────────────────

export type FeedJson = z.infer<typeof feedSchema>;
export type FeedProfile = z.infer<typeof profileSchema>;
export type FeedItem = z.infer<typeof feedItemSchema>;

// An item in the explore feed, with attribution
export type ExploreItem = {
  item: FeedItem;
  site: {
    domain: string;
    name: string;
    avatar?: string;
    url: string;
  };
};

// ─── Registry Types ─────────────────────────────────────

export type RegistryEntry = {
  domain: string;
  feed_url: string;
  added: string; // ISO date
};

export type Registry = {
  sites: RegistryEntry[];
};

// ─── Explore Feed (output of aggregation) ───────────────

export type ExploreFeed = {
  generated_at: string;
  items: ExploreItem[];
};

// ─── Validation Helper ──────────────────────────────────

export function validateFeed(data: unknown): {
  valid: boolean;
  errors: string[];
  feed?: FeedJson;
} {
  const result = feedSchema.safeParse(data);
  if (result.success) {
    return { valid: true, errors: [], feed: result.data };
  }
  return {
    valid: false,
    errors: result.error.issues.map(
      (i) => `${i.path.join(".")}: ${i.message}`
    ),
  };
}
