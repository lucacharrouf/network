import { useState } from "react";

const EXAMPLE_FEED = `{
  "version": "1.0",
  "profile": {
    "name": "Your Name",
    "domain": "yourdomain.com",
    "bio": "A short bio about yourself",
    "avatar": "https://yourdomain.com/avatar.jpg",
    "url": "https://yourdomain.com"
  },
  "items": [
    {
      "id": "my-first-thought",
      "type": "thought",
      "date": "2026-03-20",
      "text": "Hello from my corner of the internet."
    }
  ]
}`;

export default function Join() {
  const [domain, setDomain] = useState("");
  const [step, setStep] = useState<"enter" | "instructions" | "checking" | "success" | "error">("enter");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleaned = domain
      .replace(/^https?:\/\//, "")
      .replace(/\/.*$/, "")
      .toLowerCase()
      .trim();
    setDomain(cleaned);
    setStep("instructions");
  };

  const handleVerify = async () => {
    setStep("checking");
    try {
      const res = await fetch(`https://${domain}/feed.json`, {
        signal: AbortSignal.timeout(10_000),
      });

      if (!res.ok) {
        setErrorMsg(`Could not reach https://${domain}/feed.json (HTTP ${res.status})`);
        setStep("error");
        return;
      }

      const json = await res.json();

      if (!json.version || !json.profile || !json.items) {
        setErrorMsg("Your feed.json is missing required fields (version, profile, items).");
        setStep("error");
        return;
      }

      if (json.profile.domain !== domain) {
        setErrorMsg(`profile.domain is "${json.profile.domain}" but should be "${domain}".`);
        setStep("error");
        return;
      }

      setStep("success");
    } catch {
      setErrorMsg(`Could not reach https://${domain}/feed.json. Make sure the file exists and is publicly accessible.`);
      setStep("error");
    }
  };

  const copyExample = () => {
    const personalized = EXAMPLE_FEED.replace("yourdomain.com", domain).replace(
      /https:\/\/yourdomain\.com/g,
      `https://${domain}`
    );
    navigator.clipboard.writeText(personalized);
  };

  return (
    <section className="max-w-3xl mx-auto px-5 sm:px-6 md:px-12 py-16 sm:py-24">
      <div className="mb-16">
        <h1 className="text-4xl sm:text-5xl font-serif font-medium leading-tight">
          Join
        </h1>
        <p className="mt-4 text-white/35 font-light text-[15px] leading-relaxed max-w-md">
          Add your site to the network. All you need is a domain and one JSON
          file.
        </p>
      </div>

      {/* Step 1: Enter domain */}
      {step === "enter" && (
        <form onSubmit={handleSubmit} className="max-w-md">
          <label className="block text-[11px] font-sans uppercase tracking-[0.2em] text-white/30 mb-3">
            Your domain
          </label>
          <div className="flex gap-3">
            <input
              type="text"
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              placeholder="yoursite.com"
              className="flex-1 bg-transparent border border-white/[0.1] rounded-sm px-4 py-3 text-[15px] text-white/80 placeholder:text-white/15 focus:outline-none focus:border-white/25 transition-colors"
              required
            />
            <button
              type="submit"
              className="px-6 py-3 bg-white/[0.08] text-white/70 text-[12px] font-sans uppercase tracking-[0.15em] hover:bg-white/[0.12] hover:text-white/90 transition-all rounded-sm"
            >
              Next
            </button>
          </div>
        </form>
      )}

      {/* Step 2: Instructions */}
      {step === "instructions" && (
        <div className="space-y-10 max-w-xl">
          <div className="space-y-4">
            <h2 className="text-xl font-serif font-medium">
              1. Create your feed.json
            </h2>
            <p className="text-white/40 text-[14px] leading-relaxed">
              Add a file at{" "}
              <code className="text-white/60 bg-white/[0.06] px-1.5 py-0.5 text-[13px]">
                https://{domain}/feed.json
              </code>{" "}
              with this structure:
            </p>

            <div className="relative">
              <pre className="bg-white/[0.03] border border-white/[0.06] rounded-sm p-5 text-[13px] text-white/50 overflow-x-auto leading-relaxed">
                {EXAMPLE_FEED.replace("yourdomain.com", domain).replace(
                  /https:\/\/yourdomain\.com/g,
                  `https://${domain}`
                )}
              </pre>
              <button
                onClick={copyExample}
                className="absolute top-3 right-3 text-[10px] font-sans uppercase tracking-[0.15em] text-white/25 hover:text-white/50 transition-colors px-2 py-1 bg-white/[0.04] rounded"
              >
                Copy
              </button>
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-serif font-medium">
              2. Open a pull request
            </h2>
            <p className="text-white/40 text-[14px] leading-relaxed">
              Once your feed.json is live, open a PR to add your domain to{" "}
              <a
                href="https://github.com/feel-network/registry"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/60 underline underline-offset-4 decoration-white/20 hover:text-white/80 hover:decoration-white/40 transition-colors"
              >
                registry.json
              </a>
              . Add your entry to the sites array:
            </p>
            <pre className="bg-white/[0.03] border border-white/[0.06] rounded-sm p-5 text-[13px] text-white/50 overflow-x-auto leading-relaxed">
              {`{
  "domain": "${domain}",
  "feed_url": "https://${domain}/feed.json",
  "added": "${new Date().toISOString().split("T")[0]}"
}`}
            </pre>
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-serif font-medium">
              3. Verify your feed
            </h2>
            <p className="text-white/40 text-[14px] leading-relaxed">
              Before opening the PR, you can check that your feed.json is
              reachable and valid:
            </p>
            <button
              onClick={handleVerify}
              className="px-6 py-3 bg-white/[0.08] text-white/70 text-[12px] font-sans uppercase tracking-[0.15em] hover:bg-white/[0.12] hover:text-white/90 transition-all rounded-sm"
            >
              Verify feed.json
            </button>
          </div>
        </div>
      )}

      {/* Checking */}
      {step === "checking" && (
        <div className="py-20 text-center">
          <p className="text-white/40 text-sm animate-pulse">
            Checking https://{domain}/feed.json...
          </p>
        </div>
      )}

      {/* Success */}
      {step === "success" && (
        <div className="max-w-md space-y-6">
          <div className="border border-white/[0.1] rounded-sm p-8 bg-white/[0.02]">
            <p className="text-[11px] font-sans uppercase tracking-[0.2em] text-emerald-400/60 mb-3">
              Valid
            </p>
            <p className="text-white/70 text-[15px] leading-relaxed">
              Your feed.json at <strong>{domain}</strong> looks good.
              Now open a PR to add your domain to the registry, and you'll
              appear on Explore once it's merged.
            </p>
          </div>
          <a
            href="https://github.com/feel-network/registry"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-6 py-3 bg-white/[0.08] text-white/70 text-[12px] font-sans uppercase tracking-[0.15em] hover:bg-white/[0.12] hover:text-white/90 transition-all rounded-sm"
          >
            Open Pull Request &rarr;
          </a>
        </div>
      )}

      {/* Error */}
      {step === "error" && (
        <div className="max-w-md space-y-6">
          <div className="border border-red-400/20 rounded-sm p-8 bg-red-400/[0.03]">
            <p className="text-[11px] font-sans uppercase tracking-[0.2em] text-red-400/60 mb-3">
              Issue Found
            </p>
            <p className="text-white/60 text-[14px] leading-relaxed">
              {errorMsg}
            </p>
          </div>
          <button
            onClick={() => setStep("instructions")}
            className="text-[12px] font-sans uppercase tracking-[0.15em] text-white/30 hover:text-white/50 transition-colors"
          >
            &larr; Back to instructions
          </button>
        </div>
      )}
    </section>
  );
}
