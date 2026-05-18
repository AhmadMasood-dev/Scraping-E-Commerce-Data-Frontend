"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useLogin } from "@/services/hooks";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") || "/";
  const login = useLogin();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login.mutate({ email, password }, { onSuccess: () => router.push(next) });
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-background p-6">
      <Card className="w-full max-w-md border shadow-soft rounded-2xl">
        <CardHeader className="space-y-3 text-center pt-10 pb-4">
          <div className="mx-auto h-12 w-12 rounded-xl bg-gradient-to-br from-sky-500 via-blue-600 to-indigo-600 text-white flex items-center justify-center font-bold text-base shadow-sm">
            P
          </div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Welcome back</h1>
          <p className="text-sm text-muted-foreground">Sign in to your PQC account.</p>
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
                className="rounded-xl h-11"
              />
            </div>
            {login.isError && (
              <p
                role="alert"
                className="text-sm text-destructive font-medium bg-destructive/10 border border-destructive/20 rounded-xl px-3 py-2"
              >
                {(login.error as Error)?.message || "Login failed"}
              </p>
            )}
            <Button
              type="submit"
              className="w-full h-11 rounded-xl gap-2"
              disabled={login.isPending}
            >
              {login.isPending && <Loader2 className="w-4 h-4 animate-spin" aria-hidden />}
              {login.isPending ? "Signing in…" : "Sign in"}
            </Button>
          </form>
          <p className="text-center text-sm text-muted-foreground mt-6">
            New here?{" "}
            <Link
              href={`/auth/register${next !== "/" ? `?next=${encodeURIComponent(next)}` : ""}`}
              className="text-primary font-medium hover:underline"
            >
              Create an account
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[80vh] flex items-center justify-center bg-background">
          <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
        </div>
      }
    >
      <LoginContent />
    </Suspense>
  );
}
