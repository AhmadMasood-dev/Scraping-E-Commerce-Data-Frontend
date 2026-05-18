"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Search, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
// AUTH-DISABLED: keeping the imports commented so re-enabling is a one-line flip.
// import { Heart, LogOut, User } from "lucide-react";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuLabel,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
// import { useAuth } from "@/hooks/useAuth";
// import { clearAuthUser } from "@/lib/auth";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

interface NavLink {
  href: string;
  label: string;
  match: (pathname: string) => boolean;
}

const NAV_LINKS: NavLink[] = [
  { href: "/",                  label: "Home",       match: (p) => p === "/" },
  { href: "/products",          label: "Catalog",    match: (p) => p === "/products" },
  { href: "/categories/Mobile", label: "Mobiles",    match: (p) => p.startsWith("/categories/Mobile") },
  { href: "/categories/Laptop", label: "Laptops",    match: (p) => p.startsWith("/categories/Laptop") },
  { href: "/zameen",            label: "Real Estate", match: (p) => p.startsWith("/zameen") },
  { href: "/pakwheels",         label: "Vehicles",   match: (p) => p.startsWith("/pakwheels") },
];

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname() || "";
  // AUTH-DISABLED: const { user, isAuthed } = useAuth();
  const [query, setQuery] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
      setMobileOpen(false);
    }
  };

  // AUTH-DISABLED:
  // const handleSignOut = () => {
  //   clearAuthUser();
  //   router.push("/");
  // };

  return (
    <nav className="w-full sticky top-0 z-50 border-b border-border bg-background/85 backdrop-blur-xl supports-backdrop-filter:bg-background/70">
      <div className="max-w-[1440px] mx-auto px-4 md:px-8 h-16 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group shrink-0">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-sky-500 via-blue-600 to-indigo-600 text-white flex items-center justify-center font-bold text-sm shadow-sm transition-transform group-hover:scale-105">
            P
          </div>
          <span className="font-semibold text-base tracking-tight hidden sm:block">PQC</span>
        </Link>

        {/* Desktop nav links */}
        <div className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "px-3 py-1.5 rounded-full text-sm font-medium transition-colors",
                link.match(pathname)
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-accent hover:text-foreground"
              )}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Right cluster: search + auth */}
        <div className="flex items-center gap-2 md:gap-3">
          <form
            onSubmit={handleSearch}
            className="hidden sm:flex items-center bg-card border border-border rounded-xl focus-within:ring-2 focus-within:ring-primary/30 focus-within:border-primary/40 transition-all overflow-hidden"
          >
            <div className="flex items-center pl-3 pr-2 text-muted-foreground">
              <Search className="w-4 h-4" aria-hidden />
            </div>
            <Input
              type="text"
              placeholder="Search products…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="bg-transparent border-none focus-visible:ring-0 focus-visible:ring-offset-0 rounded-none h-10 w-44 md:w-56 lg:w-72 text-sm"
            />
          </form>

          {/* AUTH-DISABLED: account dropdown / sign-in / sign-up controls hidden until auth is re-enabled.
              Re-enable by restoring the original block:

              {isAuthed && user ? (
                <DropdownMenu> ... </DropdownMenu>
              ) : (
                <div className="hidden sm:flex items-center gap-2">
                  <Button asChild variant="ghost" size="sm" className="rounded-xl">
                    <Link href="/auth/login">Sign in</Link>
                  </Button>
                  <Button asChild size="sm" className="rounded-xl">
                    <Link href="/auth/register">Sign up</Link>
                  </Button>
                </div>
              )}
          */}

          {/* Mobile drawer */}
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden rounded-xl" aria-label="Menu">
                <Menu className="w-5 h-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[280px] p-0">
              <SheetHeader className="px-5 pt-5">
                <SheetTitle className="text-base font-semibold">Navigate</SheetTitle>
              </SheetHeader>
              <form
                onSubmit={handleSearch}
                className="mx-5 mt-4 flex items-center bg-card border border-border rounded-xl"
              >
                <div className="flex items-center pl-3 pr-2 text-muted-foreground">
                  <Search className="w-4 h-4" aria-hidden />
                </div>
                <Input
                  type="text"
                  placeholder="Search products…"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="bg-transparent border-none focus-visible:ring-0 focus-visible:ring-offset-0 rounded-none h-10 text-sm"
                />
              </form>
              <div className="flex flex-col gap-1 px-3 mt-4">
                {NAV_LINKS.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      "px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                      link.match(pathname)
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:bg-accent hover:text-foreground"
                    )}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
              {/* AUTH-DISABLED: mobile sign-in / sign-up buttons hidden until auth is re-enabled.
                  {!isAuthed && (
                    <div className="px-5 mt-6 pt-4 border-t flex flex-col gap-2">
                      <Button asChild variant="outline" className="w-full rounded-xl">
                        <Link href="/auth/login" onClick={() => setMobileOpen(false)}>Sign in</Link>
                      </Button>
                      <Button asChild className="w-full rounded-xl">
                        <Link href="/auth/register" onClick={() => setMobileOpen(false)}>Sign up</Link>
                      </Button>
                    </div>
                  )}
              */}
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}
