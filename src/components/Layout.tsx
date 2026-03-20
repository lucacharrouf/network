import { Link, Outlet, useLocation } from "react-router-dom";

const navLinks = [
  { to: "/", label: "Explore" },
  { to: "/join", label: "Join" },
  { to: "/docs", label: "Docs" },
];

export default function Layout() {
  const { pathname } = useLocation();

  return (
    <div className="min-h-screen">
      <header className="fixed top-0 inset-x-0 z-50 backdrop-blur-md bg-neutral-950/80 border-b border-white/[0.06]">
        <nav className="max-w-3xl mx-auto px-5 sm:px-6 h-14 flex items-center justify-between">
          <Link
            to="/"
            className="text-[13px] font-serif font-medium tracking-wide text-white/90 hover:text-white transition-colors"
          >
            Feel
          </Link>

          <div className="flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`text-[11px] font-sans uppercase tracking-[0.2em] transition-colors ${
                  pathname === link.to
                    ? "text-white/70"
                    : "text-white/30 hover:text-white/50"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </nav>
      </header>

      <main className="pt-14">
        <Outlet />
      </main>
    </div>
  );
}
