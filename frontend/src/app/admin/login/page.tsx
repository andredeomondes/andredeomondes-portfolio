"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { ADMIN_EMAIL } from "@/lib/admin-user";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { BorderBeam } from "@/shared/components/ui/border-beam";

export default function AdminLoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const supabase = createClient();
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setError("Email ou senha invalidos.");
        setLoading(false);
        return;
      }

      if (data.user?.email?.toLowerCase() !== ADMIN_EMAIL.toLowerCase()) {
        await supabase.auth.signOut();
        setError("Este usuario nao tem acesso ao admin.");
        setLoading(false);
        return;
      }

      const next = searchParams.get("next");
      router.replace(next && next.startsWith("/admin") ? next : "/admin");
      router.refresh();
    } catch {
      setError("Nao foi possivel fazer login.");
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-sm"
      >
        <Card className="relative overflow-hidden border-white/[0.08] bg-white/[0.02]">
          <CardHeader className="text-center">
            <CardTitle className="text-lg text-[#F8FAFC]">Admin</CardTitle>
            <CardDescription className="text-[#94A3B8]">
              Faca login com o usuario autorizado no Supabase Auth. Nao ha criacao de conta.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm text-[#94A3B8]">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="border-white/[0.08] bg-white/[0.04] text-[#F8FAFC] placeholder:text-[#64748B]"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm text-[#94A3B8]">
                  Senha
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="border-white/[0.08] bg-white/[0.04] text-[#F8FAFC] placeholder:text-[#64748B]"
                />
              </div>
              {error && (
                <p className="text-sm text-red-400">{error}</p>
              )}
              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-[#8B5CF6] text-white hover:bg-[#7C3AED]"
              >
                {loading ? "Entrando..." : "Entrar"}
              </Button>
            </form>
          </CardContent>
          <BorderBeam duration={4} size={150} />
        </Card>
      </motion.div>
    </div>
  );
}
