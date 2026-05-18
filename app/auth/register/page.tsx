"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useRegister } from "@/services/hooks";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

function RegisterContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") || "/";
  const register = useRegister();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    register.mutate({ email, password }, { onSuccess: () => router.push(next) });
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-background p-6">
      <Card className="w-full max-w-md border shadow-soft rounded-2xl">
        <CardHeader className="space-y-3 text-center pt-10 pb-4">
          <div className="mx-auto h-12 w-12 rounded-xl bg-gradient-to-br from-sky-500 via-blue-600 to-indigo-600 text-white flex items-center justify-center font-bold text-base shadow-sm">
            P
          </div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Create your account</h1>
          <p className="text-sm text-muted-foreground">
            Track wishlists and get notified about price drops.
          </p>
        </CardHeader>
        <CardContent className="px-8 pb-10">
          <form onSubmit={onSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-xs font-medium text-muted-foreground">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="rounded-xl h-11"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="password" className="text-xs font-medium text-muted-foreground">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 6 characters"
                className="rounded-xl h-11"
              />
            </div>
            {register.isError && (
              <p
                role="alert"
                className="text-sm text-destructive font-medium bg-destructive/10 border border-destructive/20 rounded-xl px-3 py-2"
              >
                {(register.error as Error)?.message || "Registration failed"}
              </p>
            )}
            <Button
              type="submit"
              className="w-full h-11 rounded-xl gap-2"
              disabled={register.isPending}
            >
              {register.isPending && <Loader2 className="w-4 h-4 animate-spin" aria-hidden />}
              {register.isPending ? "Creating…" : "Create account"}
            </Button>
          </form>
          <p className="text-center text-sm text-muted-foreground mt-6">
            Already have an account?{" "}
            <Link
              href={`/auth/login${next !== "/" ? `?next=${encodeURIComponent(next)}` : ""}`}
              className="text-primary font-medium hover:underline"
            >
              Sign in
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[80vh] flex items-center justify-center bg-background">
          <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
        </div>
      }
    >
      <RegisterContent />
    </Suspense>
  );
}
