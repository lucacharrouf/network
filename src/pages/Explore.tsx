import { useEffect, useState } from "react";
import type { ExploreItem } from "../lib/schema";
import FeedCard from "../components/FeedCard";

const CONTENT_TYPES = [
  { value: "all", label: "All" },
  { value: "essay", label: "Essays" },
  { value: "thought", label: "Thoughts" },
  { value: "image", label: "Images" },
  { value: "quote", label: "Quotes" },
  { value: "link", label: "Links" },
  { value: "repost", label: "Reposts" },
] as const;

export default function Explore() {
  const [items, setItems] = useState<ExploreItem[]>([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/explore-feed.json")
      .then((res) => {
        if (!res.ok) throw new Error("Feed not available");
        return res.json();
      })
      .then((data) => {
        setItems(data.items || []);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const filtered =
    filter === "all" ? items : items.filter((i) => i.item.type === filter);

  return (
    <section className="max-w-3xl mx-auto px-5 sm:px-6 md:px-12 py-16 sm:py-24">
      {/* Header */}
      <div className="mb-20">
        <h1 className="text-4xl sm:text-5xl font-serif font-medium leading-tight">
          Explore
        </h1>
        <p className="mt-4 text-white/35 font-light text-[15px] leading-relaxed max-w-md">
          A distributed feed from personal websites. No algorithms, no
          ads — just people sharing from their own corner of the internet.
        </p>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-6 mb-16">
        <div className="flex items-center gap-1 flex-wrap">
          {CONTENT_TYPES.map((type) => (
            <button
              key={type.value}
              onClick={() => setFilter(type.value)}
              className={`text-[10px] font-sans uppercase tracking-[0.2em] px-3 py-1.5 transition-all duration-300 ${
                filter === type.value
                  ? "text-white/70 bg-white/[0.06]"
                  : "text-white/25 hover:text-white/40"
              }`}
            >
              {type.label}
            </button>
          ))}
        </div>
        <div className="flex-1 h-px bg-gradient-to-r from-white/[0.06] to-transparent" />
      </div>

      {/* Content */}
      {loading && (
        <div className="space-y-16">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="animate-pulse space-y-4">
              <div className="h-3 w-24 bg-white/[0.06] rounded" />
              <div className="h-6 w-3/4 bg-white/[0.04] rounded" />
              <div className="h-4 w-1/2 bg-white/[0.03] rounded" />
            </div>
          ))}
        </div>
      )}

      {error && (
        <div className="text-center py-20">
          <p className="text-white/30 text-sm">
            The explore feed isn't available yet.
          </p>
          <p className="text-white/15 text-xs mt-2">
            It gets generated every 30 minutes once sites are registered.
          </p>
        </div>
      )}

      {!loading && !error && filtered.length === 0 && (
        <div className="text-center py-20">
          <p className="text-white/30 text-sm">
            No {filter === "all" ? "items" : filter + "s"} yet.
          </p>
        </div>
      )}

      {!loading && !error && filtered.length > 0 && (
        <div>
          {filtered.map((exploreItem, index) => (
            <div key={`${exploreItem.site.domain}-${exploreItem.item.id}`}>
              <FeedCard {...exploreItem} />
              {index < filtered.length - 1 && (
                <div className="h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />
              )}
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
