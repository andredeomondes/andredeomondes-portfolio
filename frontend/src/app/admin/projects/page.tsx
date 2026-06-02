"use client";

import { motion } from "motion/react";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/shared/components/ui/button";

export default function AdminProjectsPage() {
  return (
    <div className="px-6 py-32">
      <div className="mx-auto max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <Link
            href="/admin"
            className="inline-flex items-center gap-1 text-sm text-[#94A3B8] transition-colors hover:text-[#8B5CF6]"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar
          </Link>
          <h1 className="mt-6 text-2xl font-semibold text-[#F8FAFC]">
            Gerenciar Projetos
          </h1>
          <p className="mt-2 text-sm text-[#94A3B8]">
            Em breve: CRUD completo de projetos com formulários Shadcn/UI.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
