"use client";

import { motion } from "motion/react";
import Link from "next/link";
import { FileText, Settings, User, LayoutDashboard, ScrollText, Star } from "lucide-react";

const adminLinks = [
  { title: "Projetos", description: "CRUD completo + selecionar 3 em destaque para a home", href: "/admin/projects", icon: FileText, accent: "violet" },
  { title: "Currículo ATS", description: "Editar, analisar score ATS e baixar em .txt", href: "/admin/resume", icon: ScrollText, accent: "cyan" },
  { title: "About", description: "Editar seções da página Sobre", href: "/admin/about", icon: User, accent: "violet" },
  { title: "Settings", description: "Cores, título, WhatsApp e configurações gerais", href: "/admin/settings", icon: Settings, accent: "violet" },
];

const accentMap: Record<string, string> = {
  violet: "text-violet-400 bg-violet-500/10 border-violet-500/20",
  cyan: "text-cyan-400 bg-cyan-500/10 border-cyan-500/20",
};

export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-[#080912] px-6 py-12 text-white sm:px-8">
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="flex items-center gap-3">
            <LayoutDashboard className="size-5 text-violet-400" />
            <h1 className="text-2xl font-semibold tracking-[-0.04em]">Dashboard</h1>
          </div>
          <p className="mt-2 text-sm text-white/40">Painel administrativo do portfólio.</p>
        </motion.div>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {adminLinks.map((link, i) => (
            <motion.div
              key={link.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.08 + i * 0.07, ease: [0.22, 1, 0.36, 1] }}
            >
              <Link href={link.href} className="group block">
                <div className="h-full rounded-2xl border border-white/8 bg-white/[0.03] p-6 backdrop-blur-sm transition-all duration-300 hover:border-violet-500/30 hover:bg-white/[0.06]">
                  <div className={`inline-flex size-10 items-center justify-center rounded-xl border ${accentMap[link.accent]}`}>
                    <link.icon className="size-5" />
                  </div>
                  <h3 className="mt-4 font-medium">{link.title}</h3>
                  <p className="mt-1.5 text-sm leading-6 text-white/40">{link.description}</p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-8 rounded-2xl border border-violet-500/20 bg-violet-500/5 p-5"
        >
          <div className="flex items-start gap-3">
            <Star className="mt-0.5 size-4 shrink-0 text-violet-400" />
            <div>
              <p className="text-sm font-medium text-violet-300">Setup Supabase necessário</p>
              <p className="mt-1 text-xs leading-5 text-white/50">
                Adicione suas keys em <code className="rounded bg-white/8 px-1.5 py-0.5 font-mono text-violet-300">.env.local</code> e rode o SQL em <code className="rounded bg-white/8 px-1.5 py-0.5 font-mono text-violet-300">supabase-schema.sql</code> no painel Supabase → SQL Editor.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
