/**
 * Aggregation script — run by GitHub Actions on a cron schedule.
 *
 * Reads registry.json, fetches each site's feed.json, validates it,
 * merges all items into a single explore-feed.json sorted by date.
 */

import { readFileSync, writeFileSync } from "fs";
import { resolve } from "path";

// We can't import from src/ directly (different tsconfig),
// so we inline the validation logic here using the same Zod schema.
// In production, you'd share the schema as a package.

import { z } from "zod";

const profileSchema = z.object({
  name: z.string().min(1).max(100),
  domain: z.string().min(1),
  bio: z.string().max(280).optional(),
  avatar: z.string().url().optional(),
  url: z.string().url(),
});

const baseItem = {
  id: z.string().min(1).max(128),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  location: z.string().max(100).optional(),
  coords: z.tuple([z.number(), z.number()]).optional(),
  tags: z.array(z.string().max(30)).max(5).optional(),
};

const feedItemSchema = z.discriminatedUnion("type", [
  z.object({ ...baseItem, type: z.literal("essay"), title: z.string(), description: z.string(), url: z.string().url() }),
  z.object({ ...baseItem, type: z.literal("thought"), text: z.string().max(1000) }),
  z.object({ ...baseItem, type: z.literal("image"), src: z.string().url(), caption: z.string().optional(), aspect: z.enum(["tall", "wide", "square", "cinematic"]).optional(), dominantColor: z.string().optional() }),
  z.object({ ...baseItem, type: z.literal("quote"), text: z.string(), attribution: z.string().optional() }),
  z.object({ ...baseItem, type: z.literal("link"), title: z.string(), url: z.string().url(), source: z.string() }),
  z.object({
    ...baseItem,
    type: z.literal("gallery"),
    images: z.array(z.object({ src: z.string().url(), dominantColor: z.string().optional() })).min(1).max(10),
    caption: z.string().optional(),
  }),
  z.object({
    ...baseItem,
    type: z.literal("repost"),
    comment: z.string(),
    original: z.object({
      author: z.string(), text: z.string(),
      handle: z.string().optional(), date: z.string().optional(),
      url: z.string().url().optional(), source: z.string().optional(),
      image: z.string().url().optional(),
    }),
  }),
]);

const feedSchema = z.object({
  version: z.literal("1.0"),
  profile: profileSchema,
  items: z.array(feedItemSchema).max(50),
});

type RegistryEntry = {
  domain: string;
  feed_url: string;
  added: string;
};

type ExploreItem = {
  item: z.infer<typeof feedItemSchema>;
  site: {
    domain: string;
    name: string;
    avatar?: string;
    url: string;
  };
};

async function fetchFeed(entry: RegistryEntry): Promise<ExploreItem[]> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10_000);

  try {
    console.log(`  Fetching ${entry.feed_url}...`);
    const res = await fetch(entry.feed_url, { signal: controller.signal });

    if (!res.ok) {
      console.error(`  ✗ ${entry.domain}: HTTP ${res.status}`);
      return [];
    }

    const json = await res.json();
    const result = feedSchema.safeParse(json);

    if (!result.success) {
      console.error(`  ✗ ${entry.domain}: Invalid feed.json`);
      for (const issue of result.error.issues.slice(0, 5)) {
        console.error(`    - ${issue.path.join(".")}: ${issue.message}`);
      }
      return [];
    }

    const feed = result.data;

    // Verify domain matches
    if (feed.profile.domain !== entry.domain) {
      console.error(`  ✗ ${entry.domain}: profile.domain mismatch (got "${feed.profile.domain}")`);
      return [];
    }

    console.log(`  ✓ ${entry.domain}: ${feed.items.length} items`);

    return feed.items.map((item) => ({
      item,
      site: {
        domain: feed.profile.domain,
        name: feed.profile.name,
        avatar: feed.profile.avatar,
        url: feed.profile.url,
      },
    }));
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(`  ✗ ${entry.domain}: ${message}`);
    return [];
  } finally {
    clearTimeout(timeout);
  }
}

async function main() {
  const registryPath = resolve(import.meta.dirname ?? ".", "../registry.json");
  const outputPath = resolve(import.meta.dirname ?? ".", "../public/explore-feed.json");

  console.log("Feel Network — Aggregation\n");

  const registry = JSON.parse(readFileSync(registryPath, "utf-8")) as {
    sites: RegistryEntry[];
  };

  console.log(`Found ${registry.sites.length} registered site(s)\n`);

  // Fetch all feeds in parallel (max 10 concurrent)
  const allItems: ExploreItem[] = [];
  const batchSize = 10;

  for (let i = 0; i < registry.sites.length; i += batchSize) {
    const batch = registry.sites.slice(i, i + batchSize);
    const results = await Promise.allSettled(batch.map(fetchFeed));

    for (const result of results) {
      if (result.status === "fulfilled") {
        allItems.push(...result.value);
      }
    }
  }

  // Sort by date, newest first
  allItems.sort((a, b) => b.item.date.localeCompare(a.item.date));

  const exploreFeed = {
    generated_at: new Date().toISOString(),
    item_count: allItems.length,
    site_count: new Set(allItems.map((i) => i.site.domain)).size,
    items: allItems,
  };

  writeFileSync(outputPath, JSON.stringify(exploreFeed, null, 2));

  console.log(`\nDone! ${allItems.length} items from ${exploreFeed.site_count} site(s)`);
  console.log(`Written to ${outputPath}`);
}

main().catch((err) => {
  console.error("Aggregation failed:", err);
  process.exit(1);
});
