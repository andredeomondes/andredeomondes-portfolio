"use client";

import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, Download, FileDown, FileText, Loader2 } from "lucide-react";
import Link from "next/link";
import { parseResumeMarkdown } from "@/lib/resume-markdown";
import { normalizeSiteContent } from "@/lib/site-content";

async function downloadFile(format: "txt" | "docx" | "pdf") {
  const response = await fetch(`/api/resume/download?format=${format}`);

  if (!response.ok) {
    return;
  }

  const blob = await response.blob();
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download =
    format === "txt"
      ? "andre-deomondes-cv.txt"
      : format === "docx"
        ? "andre-deomondes-cv.docx"
        : "andre-deomondes-cv.pdf";
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

export default function ResumePage() {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState<"txt" | "docx" | "pdf" | null>(null);
  const [profile, setProfile] = useState(() => normalizeSiteContent({}).profile);
  const blocks = useMemo(() => parseResumeMarkdown(content), [content]);

  useEffect(() => {
    Promise.all([
      fetch("/api/resume?mode=site").then((response) => response.json()),
      fetch("/api/settings").then((response) => response.json()),
    ])
      .then(([resumeData, settings]) => {
        if (resumeData?.content) {
          setContent(resumeData.content);
        }
        setProfile(normalizeSiteContent(settings ?? {}).profile);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  async function handleDownload(format: "txt" | "docx" | "pdf") {
    setDownloading(format);
    await downloadFile(format);
    setDownloading(null);
  }

  return (
    <div className="min-h-screen bg-[#080912] text-white">
      <nav className="sticky top-0 z-50 flex items-center justify-between border-b border-white/8 bg-[#080912]/90 px-6 py-3 backdrop-blur-md sm:px-8">
        <Link href="/" className="inline-flex items-center gap-1.5 text-sm text-white/46 hover:text-violet-400">
          <ArrowLeft className="size-4" /> Início
        </Link>
        <div className="flex items-center gap-2">
          <button
            onClick={() => void handleDownload("pdf")}
            disabled={downloading !== null}
            className="inline-flex items-center gap-1.5 rounded-full border border-white/10 px-3 py-1.5 text-xs font-medium text-white/70 transition-colors hover:border-white/20 hover:text-white disabled:opacity-40"
          >
            <FileDown className="size-3.5" /> {downloading === "pdf" ? "Baixando..." : "PDF"}
          </button>
          <button
            onClick={() => void handleDownload("docx")}
            disabled={downloading !== null}
            className="inline-flex items-center gap-1.5 rounded-full border border-white/10 px-3 py-1.5 text-xs font-medium text-white/70 transition-colors hover:border-white/20 hover:text-white disabled:opacity-40"
          >
            <FileText className="size-3.5" /> {downloading === "docx" ? "Baixando..." : ".docx"}
          </button>
          <button
            onClick={() => void handleDownload("txt")}
            disabled={downloading !== null}
            className="inline-flex items-center gap-1.5 rounded-full border border-white/10 px-3 py-1.5 text-xs font-medium text-white/70 transition-colors hover:border-white/20 hover:text-white disabled:opacity-40"
          >
            <Download className="size-3.5" /> {downloading === "txt" ? "Baixando..." : ".txt"}
          </button>
        </div>
      </nav>

      <div className="mx-auto max-w-4xl px-6 py-12 sm:px-8 lg:px-12">
        {loading ? (
          <div className="flex items-center justify-center py-32">
            <Loader2 className="size-6 animate-spin text-white/40" />
          </div>
        ) : content ? (
          <div className="space-y-10">
            <header className="rounded-[2rem] border border-white/8 bg-white/[0.03] p-8">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-violet-300/70">
                Currículo
              </p>
              <h1 className="mt-4 text-4xl font-bold tracking-[-0.04em] text-white">
                {profile.name}
              </h1>
              <p className="mt-2 text-sm text-violet-300">{profile.resumeHeadline}</p>
              <p className="mt-5 max-w-2xl text-sm leading-7 text-white/56">
                Visualize o currículo completo abaixo e escolha o formato que quiser para baixar.
              </p>
            </header>

            <article className="rounded-[2rem] border border-white/8 bg-white/[0.03] p-8">
              <div className="space-y-6">
                {blocks.map((block, index) => {
                  if (block.type === "h1") {
                    return (
                      <h2 key={`${block.type}-${index}`} className="text-3xl font-semibold tracking-[-0.04em] text-white">
                        {block.text}
                      </h2>
                    );
                  }

                  if (block.type === "h2") {
                    return (
                      <div key={`${block.type}-${index}`} className="pt-4">
                        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-violet-300/78">
                          {block.text}
                        </p>
                        <div className="mt-2 h-px w-24 bg-violet-400/30" />
                      </div>
                    );
                  }

                  if (block.type === "h3") {
                    return (
                      <p key={`${block.type}-${index}`} className="text-base font-semibold text-white">
                        {block.text}
                      </p>
                    );
                  }

                  if (block.type === "ul") {
                    return (
                      <div key={`${block.type}-${index}`} className="space-y-2">
                        {block.items.map((item) => (
                          <div key={item} className="flex gap-3 text-sm leading-7 text-white/78">
                            <span className="mt-3 size-1.5 shrink-0 rounded-full bg-violet-400/80" />
                            <span>{item}</span>
                          </div>
                        ))}
                      </div>
                    );
                  }

                  return (
                    <p key={`${block.type}-${index}`} className="text-sm leading-7 text-white/72">
                      {block.text}
                    </p>
                  );
                })}
              </div>
            </article>
          </div>
        ) : (
          <div className="rounded-[2rem] border border-white/8 bg-white/[0.03] p-10 text-center">
            <p className="text-sm text-white/40">Nenhum currículo publicado no site ainda.</p>
            <Link
              href="/admin/resume"
              className="mt-4 inline-flex rounded-full bg-violet-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-violet-500"
            >
              Ir para o admin
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
