"use client";

import { motion } from "motion/react";
import Link from "next/link";
import { FileText, Settings, User, LayoutDashboard } from "lucide-react";
import { MagicCard } from "@/shared/components/ui/magic-card";

const adminLinks = [
  {
    title: "Projects",
    description: "Gerenciar projetos do portfólio",
    href: "/admin/projects",
    icon: FileText,
  },
  {
    title: "About",
    description: "Editar seções da página About",
    href: "/admin/about",
    icon: User,
  },
  {
    title: "Settings",
    description: "Configurações gerais do site",
    href: "/admin/settings",
    icon: Settings,
  },
];

export default function AdminDashboard() {
  return (
    <div className="px-6 py-32">
      <div className="mx-auto max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="flex items-center gap-3">
            <LayoutDashboard className="h-5 w-5 text-[#8B5CF6]" />
            <h1 className="text-2xl font-semibold text-[#F8FAFC]">
              Dashboard
            </h1>
          </div>
          <p className="mt-2 text-sm text-[#94A3B8]">
            Bem-vindo ao painel administrativo.
          </p>
        </motion.div>

        <div className="mt-12 grid gap-6 sm:grid-cols-3">
          {adminLinks.map((link, i) => (
            <motion.div
              key={link.title}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.5,
                delay: 0.1 + i * 0.08,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              <Link href={link.href}>
                <MagicCard className="group cursor-pointer p-6">
                  <link.icon className="h-5 w-5 text-[#8B5CF6]" />
                  <h3 className="mt-4 text-base font-medium text-[#F8FAFC]">
                    {link.title}
                  </h3>
                  <p className="mt-1 text-sm text-[#64748B]">
                    {link.description}
                  </p>
                </MagicCard>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
