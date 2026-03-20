export default function Docs() {
  return (
    <section className="max-w-3xl mx-auto px-5 sm:px-6 md:px-12 py-16 sm:py-24">
      <div className="mb-16">
        <h1 className="text-4xl sm:text-5xl font-serif font-medium leading-tight">
          The Spec
        </h1>
        <p className="mt-4 text-white/35 font-light text-[15px] leading-relaxed max-w-lg">
          Feel is a distributed feed protocol. Each participating site serves a
          single JSON file. No accounts, no APIs, no databases — just a file on
          your website.
        </p>
      </div>

      <div className="space-y-16 text-[15px] leading-[1.85]">
        {/* How it works */}
        <div className="space-y-4">
          <h2 className="text-2xl font-serif font-medium">How it works</h2>
          <ol className="list-decimal list-inside space-y-2 text-white/50 font-light">
            <li>
              You create a{" "}
              <code className="text-white/60 bg-white/[0.06] px-1.5 py-0.5 text-[13px]">
                feed.json
              </code>{" "}
              file at the root of your website
            </li>
            <li>
              You open a PR to add your domain to the{" "}
              <code className="text-white/60 bg-white/[0.06] px-1.5 py-0.5 text-[13px]">
                registry.json
              </code>
            </li>
            <li>
              A GitHub Action fetches all registered feeds every 30 minutes
            </li>
            <li>Your content appears on the Explore page</li>
          </ol>
        </div>

        {/* Feed Structure */}
        <div className="space-y-4">
          <h2 className="text-2xl font-serif font-medium">Feed structure</h2>
          <p className="text-white/40 font-light">
            Your{" "}
            <code className="text-white/60 bg-white/[0.06] px-1.5 py-0.5 text-[13px]">
              feed.json
            </code>{" "}
            must follow this structure:
          </p>

          <pre className="bg-white/[0.03] border border-white/[0.06] rounded-sm p-6 text-[13px] text-white/50 overflow-x-auto leading-relaxed">
            {`{
  "version": "1.0",
  "profile": {
    "name": "Your Name",                    // required
    "domain": "yourdomain.com",             // required, must match your domain
    "bio": "A short description",           // optional, max 280 chars
    "avatar": "https://yourdomain.com/me.jpg", // optional, must be HTTPS
    "url": "https://yourdomain.com"         // required
  },
  "items": [...]                            // max 50 items, newest first
}`}
          </pre>
        </div>

        {/* Content Types */}
        <div className="space-y-6">
          <h2 className="text-2xl font-serif font-medium">Content types</h2>
          <p className="text-white/40 font-light">
            Every item must have an{" "}
            <code className="text-white/60 bg-white/[0.06] px-1.5 py-0.5 text-[13px]">
              id
            </code>
            ,{" "}
            <code className="text-white/60 bg-white/[0.06] px-1.5 py-0.5 text-[13px]">
              type
            </code>
            , and{" "}
            <code className="text-white/60 bg-white/[0.06] px-1.5 py-0.5 text-[13px]">
              date
            </code>
            . Optional on all:{" "}
            <code className="text-white/60 bg-white/[0.06] px-1.5 py-0.5 text-[13px]">
              location
            </code>
            ,{" "}
            <code className="text-white/60 bg-white/[0.06] px-1.5 py-0.5 text-[13px]">
              coords
            </code>
            ,{" "}
            <code className="text-white/60 bg-white/[0.06] px-1.5 py-0.5 text-[13px]">
              tags
            </code>{" "}
            (max 5, lowercase).
          </p>

          <div className="space-y-8">
            <ContentTypeDoc
              type="thought"
              description="A short text post — a note, observation, or musing."
              example={`{
  "id": "thought-001",
  "type": "thought",
  "date": "2026-03-15",
  "text": "Personal websites are underrated."
}`}
            />

            <ContentTypeDoc
              type="essay"
              description="A link to a longer written piece on your site."
              example={`{
  "id": "essay-tableswap",
  "type": "essay",
  "date": "2026-01-01",
  "title": "Building the best concierge service",
  "description": "My journey from hackathon to company.",
  "url": "https://yourdomain.com/blog/my-essay"
}`}
            />

            <ContentTypeDoc
              type="image"
              description="A photograph or visual. Aspect ratio controls layout."
              example={`{
  "id": "img-sf-morning",
  "type": "image",
  "date": "2026-02-10",
  "src": "https://yourdomain.com/photos/sf.jpg",
  "caption": "San Francisco, early morning",
  "aspect": "wide",
  "dominantColor": "210, 30%, 45%"
}`}
            />

            <ContentTypeDoc
              type="quote"
              description="A quote you find meaningful, with optional attribution."
              example={`{
  "id": "quote-alan-kay",
  "type": "quote",
  "date": "2026-02-20",
  "text": "The best way to predict the future is to invent it.",
  "attribution": "Alan Kay"
}`}
            />

            <ContentTypeDoc
              type="link"
              description="A bookmark — something worth sharing."
              example={`{
  "id": "link-tableswap",
  "type": "link",
  "date": "2026-01-28",
  "title": "Why the future of dining is concierge-first",
  "url": "https://tableswap.app",
  "source": "tableswap.app"
}`}
            />

            <ContentTypeDoc
              type="repost"
              description="Sharing someone else's words with your own commentary."
              example={`{
  "id": "repost-maeda",
  "type": "repost",
  "date": "2026-03-17",
  "comment": "This is the right mindset.",
  "original": {
    "author": "John Maeda",
    "handle": "@johnmaeda",
    "text": "The best technology disappears.",
    "url": "https://x.com/johnmaeda",
    "source": "X"
  }
}`}
            />

            <ContentTypeDoc
              type="gallery"
              description="A collection of images (2-10)."
              example={`{
  "id": "gallery-trip",
  "type": "gallery",
  "date": "2026-03-01",
  "images": [
    { "src": "https://yourdomain.com/1.jpg" },
    { "src": "https://yourdomain.com/2.jpg" }
  ],
  "caption": "Weekend trip"
}`}
            />
          </div>
        </div>

        {/* Rules */}
        <div className="space-y-4">
          <h2 className="text-2xl font-serif font-medium">Rules</h2>
          <ul className="space-y-2 text-white/50 font-light">
            <li className="flex gap-3">
              <span className="text-white/20 shrink-0">&mdash;</span>
              Maximum 50 items per feed
            </li>
            <li className="flex gap-3">
              <span className="text-white/20 shrink-0">&mdash;</span>
              All image URLs must be absolute HTTPS
            </li>
            <li className="flex gap-3">
              <span className="text-white/20 shrink-0">&mdash;</span>
              <code className="text-white/60 bg-white/[0.06] px-1.5 py-0.5 text-[13px]">
                profile.domain
              </code>{" "}
              must match the domain your feed is served from
            </li>
            <li className="flex gap-3">
              <span className="text-white/20 shrink-0">&mdash;</span>
              Feeds are re-fetched every 30 minutes
            </li>
            <li className="flex gap-3">
              <span className="text-white/20 shrink-0">&mdash;</span>
              If your feed becomes unreachable or invalid, your items are dropped
              from Explore until it's fixed
            </li>
          </ul>
        </div>

        {/* Philosophy */}
        <div className="space-y-4 pb-16">
          <h2 className="text-2xl font-serif font-medium">Philosophy</h2>
          <div className="text-white/40 font-light space-y-4">
            <p>
              Feel has no likes, no comments, no followers, no DMs. Your website
              is your profile. Your content lives on your server. If you want to
              respond to someone, do it on your own site.
            </p>
            <p>
              The network is intentionally small. Joining requires a pull
              request that gets reviewed. This isn't a platform — it's a
              neighborhood.
            </p>
            <p>
              The entire protocol is one JSON file. The entire infrastructure is
              a GitHub Action. That's it. No vendor lock-in, no API keys, no
              accounts. Fork it, run your own, or just read the feed.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function ContentTypeDoc({
  type,
  description,
  example,
}: {
  type: string;
  description: string;
  example: string;
}) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        <span className="text-[10px] font-sans uppercase tracking-[0.25em] text-white/25 border border-white/[0.08] px-3 py-1">
          {type}
        </span>
        <span className="text-white/40 font-light text-[14px]">
          {description}
        </span>
      </div>
      <pre className="bg-white/[0.03] border border-white/[0.06] rounded-sm p-5 text-[12px] text-white/40 overflow-x-auto leading-relaxed">
        {example}
      </pre>
    </div>
  );
}
