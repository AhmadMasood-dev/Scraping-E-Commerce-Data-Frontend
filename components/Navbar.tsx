"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [query, setQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <nav className="w-full sticky top-0 z-50 border-b border-border/70 bg-background/85 backdrop-blur-xl supports-backdrop-filter:bg-background/70">
      <div className="max-w-360 mx-auto px-4 md:px-10 h-20 flex items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-3 group shrink-0">
          <div className="h-10 w-10 rounded-xl bg-linear-to-br from-sky-500 via-blue-600 to-indigo-600 text-white flex items-center justify-center font-black text-sm tracking-widest shadow-sm shadow-blue-300/40 transition-transform group-hover:scale-105">
            PQC
          </div>
          <span className="font-black text-lg md:text-xl tracking-wider uppercase hidden sm:block text-foreground">
            System
          </span>
        </Link>

        <div className="flex items-center gap-2 md:gap-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          <Link
            href="/"
            className={cn(
              "hidden lg:block px-3 py-1.5 rounded-full transition-colors",
              pathname === "/"
                ? "bg-sky-100 text-sky-800"
                : "hover:bg-accent hover:text-foreground",
            )}
          >
            Home
          </Link>
          <Link
            href="/products"
            className={cn(
              "hidden lg:block px-3 py-1.5 rounded-full transition-colors",
              pathname === "/products"
                ? "bg-sky-100 text-sky-800"
                : "hover:bg-accent hover:text-foreground",
            )}
          >
            Gear
          </Link>
          <Link
            href="/categories/Mobile"
            className={cn(
              "hidden md:block px-3 py-1.5 rounded-full transition-colors",
              pathname?.startsWith("/categories/Mobile")
                ? "bg-sky-100 text-sky-800"
                : "hover:bg-accent hover:text-foreground",
            )}
          >
            Mobiles
          </Link>
          <Link
            href="/categories/Laptop"
            className={cn(
              "hidden md:block px-3 py-1.5 rounded-full transition-colors",
              pathname?.startsWith("/categories/Laptop")
                ? "bg-sky-100 text-sky-800"
                : "hover:bg-accent hover:text-foreground",
            )}
          >
            Laptops
          </Link>
          <Link
            href="/zameen"
            className={cn(
              "hidden md:block px-3 py-1.5 rounded-full transition-colors",
              pathname?.startsWith("/zameen")
                ? "bg-emerald-100 text-emerald-800"
                : "hover:bg-accent hover:text-foreground",
            )}
          >
            Zameen.pk
          </Link>

          <form
            onSubmit={handleSearch}
            className="ml-1 md:ml-3 flex items-center bg-card border border-border rounded-xl focus-within:ring-2 focus-within:ring-sky-200 focus-within:border-sky-300 transition-all"
          >
            <div className="flex items-center px-3">
              <Search className="w-4 h-4 text-muted-foreground" />
            </div>
            <Input
              type="text"
              placeholder="Search products..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="bg-transparent border-none text-foreground placeholder:text-muted-foreground focus-visible:ring-0 focus-visible:ring-offset-0 rounded-none h-10 w-34 sm:w-48 md:w-64"
            />
          </form>
        </div>
      </div>
    </nav>
  );
}
