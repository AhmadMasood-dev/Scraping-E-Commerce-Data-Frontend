"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Heart } from "lucide-react";
import { useToggleWishlist } from "@/services/hooks";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";

interface WishlistButtonProps {
  productId: string;
  /** Hint that this product is already in the user's wishlist. */
  active?: boolean;
  /** Visual density. `floating` is for absolute-positioned overlays on cards. */
  variant?: "floating" | "inline";
  size?: "sm" | "md" | "lg";
  className?: string;
}

const SIZE_CLASS = {
  sm: { btn: "h-8 w-8", icon: "w-4 h-4" },
  md: { btn: "h-9 w-9", icon: "w-4 h-4" },
  lg: { btn: "h-11 w-11", icon: "w-5 h-5" },
};

/**
 * Tiny heart-toggle that drops onto any product card. Hooks into the existing
 * `useToggleWishlist` mutation (already optimistic). When unauthenticated,
 * a single click sends the user to /auth/login with a redirect back.
 */
export function WishlistButton({
  productId,
  active,
  variant = "floating",
  size = "md",
  className,
}: WishlistButtonProps) {
  const { isAuthed } = useAuth();
  const router = useRouter();
  const { mutate, isPending } = useToggleWishlist();
  const [optimistic, setOptimistic] = useState<boolean | null>(null);
  const isOn = optimistic ?? active ?? false;
  const sz = SIZE_CLASS[size];

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthed) {
      router.push(`/auth/login?next=${encodeURIComponent(window.location.pathname + window.location.search)}`);
      return;
    }
    setOptimistic(!isOn);
    mutate(productId, {
      onError: () => setOptimistic(isOn), // revert on failure
    });
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isPending}
      aria-label={isOn ? "Remove from wishlist" : "Add to wishlist"}
      aria-pressed={isOn}
      className={cn(
        "inline-flex items-center justify-center rounded-full transition-all",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
        sz.btn,
        variant === "floating"
          ? "bg-background/90 backdrop-blur shadow-soft hover:shadow-soft-hover border border-border"
          : "border border-border bg-card hover:bg-muted",
        isOn && "text-rose-500 border-rose-200",
        isPending && "opacity-60 cursor-wait",
        className
      )}
    >
      <Heart className={cn(sz.icon, isOn && "fill-rose-500")} aria-hidden />
    </button>
  );
}
