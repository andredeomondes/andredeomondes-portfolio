import { NextResponse } from "next/server";

const CONTACT_TO = "andredeomondes.dev@gmail.com";
const WINDOW_MS = 10 * 60 * 1000;
const MAX_REQUESTS = 5;
const attempts = new Map<string, { count: number; resetAt: number }>();

type ContactPayload = {
  name?: unknown;
  email?: unknown;
  phone?: unknown;
  company?: unknown;
  projectType?: unknown;
  currentStage?: unknown;
  objective?: unknown;
  projectDetails?: unknown;
  audience?: unknown;
  integrations?: unknown;
  deadline?: unknown;
  budget?: unknown;
  preferredContact?: unknown;
  website?: unknown;
  consent?: unknown;
};

function clean(value: unknown, maxLength = 2500) {
  return typeof value === "string" ? value.trim().slice(0, maxLength) : "";
}

function escapeHtml(value: string) {
  return value.replace(/[&<>'"]/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    "'": "&#39;",
    '"': "&quot;",
  })[character] ?? character);
}

function isRateLimited(key: string) {
  const now = Date.now();
  if (attempts.size > 500) {
    for (const [attemptKey, value] of attempts) if (value.resetAt <= now) attempts.delete(attemptKey);
  }
  const current = attempts.get(key);
  if (!current || current.resetAt <= now) {
    attempts.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return false;
  }
  current.count += 1;
  attempts.set(key, current);
  return current.count > MAX_REQUESTS;
}

export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
  if (isRateLimited(ip)) {
    return NextResponse.json({ message: "Muitas tentativas em pouco tempo. Aguarde alguns minutos e tente novamente." }, { status: 429 });
  }

  let payload: ContactPayload;
  try {
    payload = (await request.json()) as ContactPayload;
  } catch {
    return NextResponse.json({ message: "O briefing enviado não está em um formato válido." }, { status: 400 });
  }

  if (clean(payload.website, 200)) return NextResponse.json({ message: "Briefing recebido." });

  const fields = {
    name: clean(payload.name, 120),
    email: clean(payload.email, 160),
    phone: clean(payload.phone, 60),
    company: clean(payload.company, 120),
    projectType: clean(payload.projectType, 100),
    currentStage: clean(payload.currentStage, 100),
    objective: clean(payload.objective, 300),
    projectDetails: clean(payload.projectDetails),
    audience: clean(payload.audience, 300),
    integrations: clean(payload.integrations, 500),
    deadline: clean(payload.deadline, 100),
    budget: clean(payload.budget, 100),
    preferredContact: clean(payload.preferredContact, 60),
  };

  const required = [fields.name, fields.email, fields.phone, fields.projectType, fields.currentStage, fields.objective, fields.projectDetails, fields.deadline, fields.budget, fields.preferredContact];
  if (required.some((value) => !value) || payload.consent !== true) {
    return NextResponse.json({ message: "Preencha os campos obrigatórios antes de enviar." }, { status: 400 });
  }
  if (!/^\S+@\S+\.\S+$/.test(fields.email) || fields.phone.replace(/\D/g, "").length < 10 || fields.projectDetails.length < 30) {
    return NextResponse.json({ message: "Revise o e-mail, o telefone e a descrição do projeto." }, { status: 400 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ message: "O envio está temporariamente indisponível. A configuração de e-mail ainda não foi concluída." }, { status: 503 });
  }

  const rows = [
    ["Nome", fields.name], ["E-mail", fields.email], ["Telefone", fields.phone], ["Empresa", fields.company || "Não informada"],
    ["Tipo de projeto", fields.projectType], ["Momento atual", fields.currentStage], ["Objetivo", fields.objective],
    ["Público", fields.audience || "Não informado"], ["Integrações", fields.integrations || "Não informadas"],
    ["Prazo", fields.deadline], ["Investimento", fields.budget], ["Contato preferido", fields.preferredContact],
  ];
  const htmlRows = rows.map(([label, value]) => `<tr><td style="padding:10px 14px;border-bottom:1px solid #242424;color:#f4f4f0;font:600 12px Arial;text-transform:uppercase;letter-spacing:.08em">${escapeHtml(label)}</td><td style="padding:10px 14px;border-bottom:1px solid #242424;color:#f4f4f0;font:15px Arial">${escapeHtml(value)}</td></tr>`).join("");
  const text = `${rows.map(([label, value]) => `${label}: ${value}`).join("\n")}\n\nContexto e funcionalidades:\n${fields.projectDetails}`;
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(JSON.stringify(fields)));
  const idempotencyKey = `contact-${Array.from(new Uint8Array(digest)).slice(0, 16).map((byte) => byte.toString(16).padStart(2, "0")).join("")}`;

  let resendResponse: Response;
  try {
    resendResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json", "Idempotency-Key": idempotencyKey },
      signal: AbortSignal.timeout(12_000),
      body: JSON.stringify({
        from: process.env.CONTACT_FROM_EMAIL || "Portfolio Andre Deomondes <onboarding@resend.dev>",
        to: [CONTACT_TO],
        reply_to: fields.email,
        subject: `Novo briefing — ${fields.projectType} — ${fields.name}`,
        text,
        html: `<div style="background:#050505;padding:32px;color:#f4f4f0"><div style="max-width:720px;margin:auto"><p style="color:#f4f4f0;font:600 12px Arial;text-transform:uppercase;letter-spacing:.12em">andredeomondes.dev / novo briefing</p><h1 style="font:600 32px Arial;margin:18px 0 28px">${escapeHtml(fields.objective)}</h1><table style="width:100%;border-collapse:collapse;background:#0c0c0c">${htmlRows}</table><div style="margin-top:24px;padding:20px;border:1px solid #242424"><strong style="color:#f4f4f0;font:600 12px Arial;text-transform:uppercase">Contexto e funcionalidades</strong><p style="font:15px/1.7 Arial;white-space:pre-wrap">${escapeHtml(fields.projectDetails)}</p></div></div></div>`,
      }),
    });
  } catch {
    return NextResponse.json({ message: "O serviço de e-mail não respondeu a tempo. Tente novamente em alguns minutos." }, { status: 504 });
  }

  if (!resendResponse.ok) {
    console.error("Resend contact error", resendResponse.status, await resendResponse.text());
    return NextResponse.json({ message: "O e-mail não pôde ser enviado agora. Tente novamente em alguns minutos." }, { status: 502 });
  }

  return NextResponse.json({ message: "Briefing enviado com sucesso." });
}
