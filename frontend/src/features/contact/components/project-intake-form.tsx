"use client";

import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, Check, LoaderCircle, Send } from "lucide-react";

type IntakeData = {
  name: string;
  email: string;
  phone: string;
  company: string;
  projectType: string;
  currentStage: string;
  objective: string;
  projectDetails: string;
  audience: string;
  integrations: string;
  deadline: string;
  budget: string;
  preferredContact: string;
  website: string;
  consent: boolean;
};

const initialData: IntakeData = {
  name: "",
  email: "",
  phone: "",
  company: "",
  projectType: "",
  currentStage: "",
  objective: "",
  projectDetails: "",
  audience: "",
  integrations: "",
  deadline: "",
  budget: "",
  preferredContact: "WhatsApp",
  website: "",
  consent: false,
};

const stepFields: Array<Array<keyof IntakeData>> = [
  ["name", "email", "phone"],
  ["projectType", "currentStage", "objective", "projectDetails"],
  ["deadline", "budget", "preferredContact", "consent"],
];

const stepNames = ["Contato", "Projeto", "Escopo"];

function validateField(name: keyof IntakeData, value: string | boolean) {
  if (name === "consent") return value ? "" : "Confirme o uso dos dados para responder ao briefing.";
  const text = String(value).trim();
  if (["name", "email", "phone", "projectType", "currentStage", "objective", "projectDetails", "deadline", "budget", "preferredContact"].includes(name) && !text) {
    return "Este campo é necessário para entender o projeto.";
  }
  if (name === "email" && !/^\S+@\S+\.\S+$/.test(text)) return "Informe um e-mail válido.";
  if (name === "phone" && text.replace(/\D/g, "").length < 10) return "Inclua DDD e número para contato.";
  if (name === "projectDetails" && text.length < 30) return "Conte um pouco mais — use pelo menos 30 caracteres.";
  return "";
}

export function ProjectIntakeForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [step, setStep] = useState(0);
  const [data, setData] = useState<IntakeData>(initialData);
  const [errors, setErrors] = useState<Partial<Record<keyof IntakeData, string>>>({});
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const progress = useMemo(() => `${Math.round(((step + 1) / stepNames.length) * 100)}%`, [step]);

  useEffect(() => {
    if (step === 0) return;
    formRef.current?.querySelector<HTMLElement>("legend")?.focus();
  }, [step]);

  function update(name: keyof IntakeData, value: string | boolean) {
    setData((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: "" }));
    if (status === "error") setStatus("idle");
  }

  function validateStep(index: number) {
    const nextErrors: Partial<Record<keyof IntakeData, string>> = {};
    stepFields[index].forEach((field) => {
      const error = validateField(field, data[field]);
      if (error) nextErrors[field] = error;
    });
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      requestAnimationFrame(() => formRef.current?.querySelector<HTMLElement>("[aria-invalid='true']")?.focus());
    }
    return Object.keys(nextErrors).length === 0;
  }

  function advance() {
    if (!validateStep(step)) return;
    setStep((current) => Math.min(current + 1, stepNames.length - 1));
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!validateStep(step)) return;

    setStatus("sending");
    setMessage("");
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = (await response.json()) as { message?: string };
      if (!response.ok) throw new Error(result.message || "Não foi possível enviar o briefing.");
      setStatus("success");
      setMessage("Briefing enviado. Vou analisar o contexto e responder pelo canal escolhido.");
      setData(initialData);
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "O envio falhou. Revise os dados e tente novamente.");
    }
  }

  if (status === "success") {
    return (
      <div className="intake-success" role="status" aria-live="polite">
        <span><Check aria-hidden="true" /></span>
        <div>
          <h3>Recebi o contexto.</h3>
          <p>{message}</p>
          <button type="button" onClick={() => { setStatus("idle"); setStep(0); }}>Enviar outro briefing</button>
        </div>
      </div>
    );
  }

  return (
    <form ref={formRef} className="project-intake" onSubmit={submit} noValidate>
      <div className="project-intake__progress" aria-label={`Etapa ${step + 1} de ${stepNames.length}: ${stepNames[step]}`}>
        <div>
          <span>Briefing de projeto</span>
          <strong>0{step + 1} / 0{stepNames.length}</strong>
        </div>
        <i style={{ "--intake-progress": progress } as React.CSSProperties} />
        <ol>
          {stepNames.map((name, index) => <li key={name} data-current={index === step} data-complete={index < step}>{name}</li>)}
        </ol>
      </div>

      {step === 0 ? (
        <fieldset>
          <legend tabIndex={-1}>Primeiro, como posso falar com você?</legend>
          <p className="project-intake__intro">Seus dados servem somente para responder esta conversa. Nada é publicado ou compartilhado.</p>
          <div className="project-intake__grid">
            <Field label="Nome" name="name" value={data.name} error={errors.name} onChange={update} autoComplete="name" />
            <Field label="E-mail" name="email" type="email" value={data.email} error={errors.email} onChange={update} autoComplete="email" />
            <Field label="Telefone / WhatsApp" name="phone" type="tel" value={data.phone} error={errors.phone} onChange={update} autoComplete="tel" placeholder="(71) 99999-9999" />
            <Field label="Empresa ou marca (opcional)" name="company" value={data.company} error={errors.company} onChange={update} autoComplete="organization" />
          </div>
        </fieldset>
      ) : null}

      {step === 1 ? (
        <fieldset>
          <legend tabIndex={-1}>O que precisa sair do papel?</legend>
          <p className="project-intake__intro">Não precisa escrever um documento técnico. Explique o problema, o momento atual e o resultado que espera.</p>
          <div className="project-intake__grid">
            <SelectField label="Tipo de projeto" name="projectType" value={data.projectType} error={errors.projectType} onChange={update} options={["Site ou portfólio", "E-commerce", "SaaS ou plataforma", "Automação", "IA aplicada", "API ou backend", "Aplicação mobile", "Outro"]} />
            <SelectField label="Momento atual" name="currentStage" value={data.currentStage} error={errors.currentStage} onChange={update} options={["Só existe a ideia", "Já tenho requisitos", "Já existe um produto", "Preciso corrigir ou escalar", "Preciso integrar sistemas"]} />
            <Field label="Objetivo principal" name="objective" value={data.objective} error={errors.objective} onChange={update} placeholder="Ex.: vender online, reduzir trabalho manual, validar um SaaS" wide />
            <TextAreaField label="Contexto e funcionalidades" name="projectDetails" value={data.projectDetails} error={errors.projectDetails} onChange={update} placeholder="Quem usa, como funciona hoje e o que o produto precisa permitir?" />
            <Field label="Público ou usuários (opcional)" name="audience" value={data.audience} error={errors.audience} onChange={update} wide />
          </div>
        </fieldset>
      ) : null}

      {step === 2 ? (
        <fieldset>
          <legend tabIndex={-1}>Agora, limites e prioridades.</legend>
          <p className="project-intake__intro">Essas respostas ajudam a propor um caminho realista, sem transformar a primeira conversa em orçamento genérico.</p>
          <div className="project-intake__grid">
            <SelectField label="Prazo desejado" name="deadline" value={data.deadline} error={errors.deadline} onChange={update} options={["Até 1 mês", "1 a 3 meses", "3 a 6 meses", "Sem prazo definido"]} />
            <SelectField label="Faixa de investimento" name="budget" value={data.budget} error={errors.budget} onChange={update} options={["Até R$ 5 mil", "R$ 5 mil a R$ 15 mil", "R$ 15 mil a R$ 30 mil", "Acima de R$ 30 mil", "Quero definir após o diagnóstico"]} />
            <SelectField label="Prefere receber a resposta por" name="preferredContact" value={data.preferredContact} error={errors.preferredContact} onChange={update} options={["WhatsApp", "E-mail", "Ligação"]} />
            <Field label="Integrações ou tecnologias importantes (opcional)" name="integrations" value={data.integrations} error={errors.integrations} onChange={update} placeholder="Ex.: Stripe, WhatsApp, AWS, sistema atual" wide />
          </div>
          <label className="project-intake__consent">
            <input type="checkbox" checked={data.consent} onChange={(event) => update("consent", event.target.checked)} aria-describedby={errors.consent ? "consent-error" : undefined} />
            <span>Autorizo o uso destes dados somente para Andre responder sobre este projeto.</span>
          </label>
          {errors.consent ? <p id="consent-error" className="project-intake__error">{errors.consent}</p> : null}
          <div className="sr-only" aria-hidden="true"><label>Site<input name="website" tabIndex={-1} autoComplete="off" value={data.website} onChange={(event) => update("website", event.target.value)} /></label></div>
        </fieldset>
      ) : null}

      <div className="project-intake__actions">
        {step > 0 ? <button type="button" className="project-intake__back" onClick={() => setStep((current) => current - 1)}><ArrowLeft aria-hidden="true" /> Voltar</button> : <span />}
        {step < stepNames.length - 1 ? (
          <button type="button" className="project-intake__next" onClick={advance}>Continuar <ArrowRight aria-hidden="true" /></button>
        ) : (
          <button type="submit" className="project-intake__next" disabled={status === "sending"}>
            {status === "sending" ? <><LoaderCircle className="animate-spin" aria-hidden="true" /> Enviando</> : <>Enviar briefing <Send aria-hidden="true" /></>}
          </button>
        )}
      </div>
      <p className="project-intake__status" role="status" aria-live="polite" data-error={status === "error"}>{message}</p>
    </form>
  );
}

type FieldProps = {
  label: string;
  name: keyof IntakeData;
  value: string;
  error?: string;
  onChange: (name: keyof IntakeData, value: string) => void;
  type?: string;
  autoComplete?: string;
  placeholder?: string;
  wide?: boolean;
};

function Field({ label, name, value, error, onChange, type = "text", autoComplete, placeholder, wide }: FieldProps) {
  const errorId = `${name}-error`;
  return (
    <label className={wide ? "project-intake__field project-intake__field--wide" : "project-intake__field"}>
      <span>{label}</span>
      <input name={name} type={type} value={value} onChange={(event) => onChange(name, event.target.value)} autoComplete={autoComplete} placeholder={placeholder} maxLength={name === "email" ? 160 : 120} aria-invalid={Boolean(error)} aria-describedby={error ? errorId : undefined} />
      {error ? <small id={errorId}>{error}</small> : null}
    </label>
  );
}

function SelectField({ label, name, value, error, onChange, options }: FieldProps & { options: string[] }) {
  const errorId = `${name}-error`;
  return (
    <label className="project-intake__field">
      <span>{label}</span>
      <select name={name} value={value} onChange={(event) => onChange(name, event.target.value)} aria-invalid={Boolean(error)} aria-describedby={error ? errorId : undefined}>
        <option value="">Selecione uma opção</option>
        {options.map((option) => <option key={option} value={option}>{option}</option>)}
      </select>
      {error ? <small id={errorId}>{error}</small> : null}
    </label>
  );
}

function TextAreaField({ label, name, value, error, onChange, placeholder }: FieldProps) {
  const errorId = `${name}-error`;
  return (
    <label className="project-intake__field project-intake__field--wide">
      <span>{label}</span>
      <textarea name={name} value={value} onChange={(event) => onChange(name, event.target.value)} placeholder={placeholder} maxLength={2500} rows={5} aria-invalid={Boolean(error)} aria-describedby={error ? errorId : undefined} />
      <em>{value.length}/2500</em>
      {error ? <small id={errorId}>{error}</small> : null}
    </label>
  );
}
