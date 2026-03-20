import type { ExploreItem } from "../lib/schema";

const formatDate = (date: string) =>
  new Date(date).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

function Attribution({ site }: { site: ExploreItem["site"] }) {
  return (
    <a
      href={site.url}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-3 mb-5 group/attr"
    >
      {site.avatar && (
        <img
          src={site.avatar}
          alt=""
          className="w-6 h-6 rounded-full object-cover opacity-70 group-hover/attr:opacity-100 transition-opacity"
        />
      )}
      <span className="text-[12px] font-sans tracking-wide text-white/40 group-hover/attr:text-white/60 transition-colors">
        {site.name}
      </span>
      <span className="text-[10px] font-sans text-white/20 group-hover/attr:text-white/35 transition-colors">
        {site.domain}
      </span>
    </a>
  );
}

function DateStamp({ date }: { date: string }) {
  return (
    <time className="block text-[11px] font-sans uppercase tracking-[0.2em] text-white/25">
      {formatDate(date)}
    </time>
  );
}

export default function FeedCard({ item, site }: ExploreItem) {
  return (
    <div className="py-12 md:py-16">
      <Attribution site={site} />
      <DateStamp date={item.date} />

      <div className="mt-5">
        {item.type === "thought" && <ThoughtContent text={item.text} />}
        {item.type === "image" && <ImageContent item={item} />}
        {item.type === "essay" && <EssayContent item={item} />}
        {item.type === "quote" && <QuoteContent item={item} />}
        {item.type === "link" && <LinkContent item={item} />}
        {item.type === "repost" && <RepostContent item={item} />}
      </div>

      {item.tags && item.tags.length > 0 && (
        <div className="mt-5 flex gap-2">
          {item.tags.map((tag) => (
            <span
              key={tag}
              className="text-[10px] font-sans uppercase tracking-[0.15em] text-white/20 border border-white/[0.06] px-2 py-1"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Content Components ─────────────────────────────────

function ThoughtContent({ text }: { text: string }) {
  return (
    <div className="relative">
      <span className="absolute -top-8 -left-4 text-[120px] font-serif text-white/[0.03] leading-none select-none pointer-events-none">
        &ldquo;
      </span>
      <p className="text-lg sm:text-xl md:text-2xl font-light leading-[1.75] max-w-xl text-white/80 relative z-10">
        {text}
      </p>
    </div>
  );
}

function ImageContent({
  item,
}: {
  item: { src: string; caption?: string; aspect?: string; dominantColor?: string };
}) {
  const isCinematic = item.aspect === "cinematic";

  return (
    <>
      <div
        className={`overflow-hidden rounded-sm ${
          isCinematic ? "-mx-5 sm:-mx-6 md:-mx-12" : ""
        }`}
      >
        <div
          className={`relative overflow-hidden bg-white/5 ${
            isCinematic
              ? "aspect-[4/3] sm:aspect-[16/9] md:aspect-[2.35/1]"
              : item.aspect === "tall"
              ? "aspect-[3/4] max-w-[min(24rem,100%)]"
              : item.aspect === "square"
              ? "aspect-square max-w-[min(28rem,100%)]"
              : "aspect-[16/10]"
          }`}
        >
          <img
            src={item.src}
            alt={item.caption || ""}
            className="w-full h-full object-cover"
            loading="lazy"
          />
          {isCinematic && (
            <>
              <div className="absolute inset-x-0 top-0 h-1/6 bg-gradient-to-b from-neutral-950/60 to-transparent pointer-events-none" />
              <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-neutral-950/80 via-neutral-950/30 to-transparent pointer-events-none" />
            </>
          )}
        </div>
      </div>
      {item.caption && (
        <p
          className={`mt-5 text-[13px] font-serif italic text-white/35 leading-relaxed ${
            isCinematic ? "max-w-lg" : ""
          }`}
        >
          {item.caption}
        </p>
      )}
    </>
  );
}

function EssayContent({
  item,
}: {
  item: { title: string; description: string; url: string };
}) {
  return (
    <a
      href={item.url}
      target="_blank"
      rel="noopener noreferrer"
      className="block group/essay"
    >
      <div className="space-y-4">
        <span className="inline-block text-[10px] font-sans uppercase tracking-[0.25em] text-white/20 border border-white/[0.08] px-3 py-1.5 transition-colors group-hover/essay:border-white/20 group-hover/essay:text-white/35">
          Essay
        </span>
        <h3 className="text-2xl sm:text-3xl md:text-4xl font-serif font-medium leading-[1.15] max-w-xl transition-all duration-700 group-hover/essay:translate-x-2">
          {item.title}
        </h3>
        <p className="text-white/40 leading-[1.8] font-light max-w-lg text-[15px] transition-all duration-700 group-hover/essay:translate-x-2 group-hover/essay:text-white/55">
          {item.description}
        </p>
        <span className="inline-flex items-center gap-2 text-[11px] font-sans uppercase tracking-[0.2em] text-white/25 transition-all duration-500 group-hover/essay:text-white/50 group-hover/essay:gap-3">
          Read on their site
          <span className="inline-block transition-transform duration-500 group-hover/essay:translate-x-1">
            &rarr;
          </span>
        </span>
      </div>
    </a>
  );
}

function QuoteContent({
  item,
}: {
  item: { text: string; attribution?: string };
}) {
  return (
    <div className="py-10 md:py-14 flex items-center justify-center">
      <div className="text-center max-w-lg space-y-5">
        <div className="mx-auto w-8 h-px bg-white/15" />
        <blockquote className="text-xl sm:text-2xl md:text-3xl font-serif italic leading-[1.5] text-white/55">
          &ldquo;{item.text}&rdquo;
        </blockquote>
        {item.attribution && (
          <cite className="block text-[11px] font-sans uppercase tracking-[0.25em] text-white/25 not-italic">
            &mdash; {item.attribution}
          </cite>
        )}
        <div className="mx-auto w-8 h-px bg-white/15" />
      </div>
    </div>
  );
}

function LinkContent({
  item,
}: {
  item: { title: string; url: string; source: string };
}) {
  return (
    <a
      href={item.url}
      target="_blank"
      rel="noopener noreferrer"
      className="block group/link"
    >
      <div className="border border-white/[0.07] rounded-sm p-7 md:p-10 transition-all duration-700 hover:border-white/15 hover:bg-white/[0.02] relative overflow-hidden">
        <p className="text-[11px] font-sans uppercase tracking-[0.2em] text-white/25 mb-3">
          {item.source}
        </p>
        <h3 className="text-lg md:text-xl font-serif font-medium leading-snug text-white/65 transition-colors duration-500 group-hover/link:text-white/90">
          {item.title}
          <span className="inline-block ml-2 transition-transform duration-500 group-hover/link:translate-x-1 group-hover/link:-translate-y-1">
            &nearr;
          </span>
        </h3>
      </div>
    </a>
  );
}

function RepostContent({
  item,
}: {
  item: {
    comment: string;
    original: {
      author: string;
      text: string;
      handle?: string;
      date?: string;
      url?: string;
      source?: string;
    };
  };
}) {
  const { original } = item;

  return (
    <div className="space-y-5">
      <div>
        <div className="flex items-center gap-2 mb-3">
          <svg
            className="w-3.5 h-3.5 text-white/25"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="17 1 21 5 17 9" />
            <path d="M3 11V9a4 4 0 0 1 4-4h14" />
            <polyline points="7 23 3 19 7 15" />
            <path d="M21 13v2a4 4 0 0 1-4 4H3" />
          </svg>
          <span className="text-[10px] font-sans uppercase tracking-[0.25em] text-white/25">
            Repost
          </span>
        </div>
        <p className="text-lg sm:text-xl font-light leading-[1.75] max-w-xl text-white/75">
          {item.comment}
        </p>
      </div>

      <div className="border border-white/[0.08] rounded-sm p-6 md:p-8 bg-white/[0.015]">
        {original.url ? (
          <a
            href={original.url}
            target="_blank"
            rel="noopener noreferrer"
            className="block group/repost"
          >
            <OriginalContent original={original} linked />
          </a>
        ) : (
          <OriginalContent original={original} />
        )}
      </div>
    </div>
  );
}

function OriginalContent({
  original,
  linked,
}: {
  original: {
    author: string;
    text: string;
    handle?: string;
    date?: string;
    source?: string;
  };
  linked?: boolean;
}) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        <div className="flex flex-col">
          <span
            className={`text-[13px] font-medium text-white/60 ${
              linked
                ? "group-hover/repost:text-white/90 transition-colors duration-500"
                : ""
            }`}
          >
            {original.author}
          </span>
          <div className="flex items-center gap-2">
            {original.handle && (
              <span className="text-[11px] font-sans text-white/25">
                {original.handle}
              </span>
            )}
            {original.source && (
              <span className="text-[10px] font-sans uppercase tracking-[0.15em] text-white/15">
                {original.source}
              </span>
            )}
            {original.date && (
              <span className="text-[10px] font-sans text-white/15">
                {formatDate(original.date)}
              </span>
            )}
          </div>
        </div>
        {linked && (
          <span className="ml-auto text-white/15 transition-all duration-500 group-hover/repost:text-white/40">
            &nearr;
          </span>
        )}
      </div>
      <p className="text-[15px] leading-[1.8] text-white/45 font-light">
        {original.text}
      </p>
    </div>
  );
}
