import type { SiteIndex } from "@/lib/site-index";

export const CONTACT_TOPICS = [
  { id: "freela", label: "Projeto freelance", message: "Oi, Andre! Vi seu portfólio e tenho um projeto para conversar." },
  { id: "vaga", label: "Vaga", message: "Oi, Andre! Tenho uma vaga que combina com o seu perfil e queria conversar." },
  { id: "consultoria", label: "Consultoria", message: "Oi, Andre! Queria uma consultoria em backend e IA aplicada." },
  { id: "oi", label: "Só dizer oi", message: "Oi, Andre! Passei pelo seu site e quis dizer oi." },
] as const;

export type ContactTopicId = (typeof CONTACT_TOPICS)[number]["id"];

export function topicMessage(id: ContactTopicId) {
  return CONTACT_TOPICS.find((topic) => topic.id === id)?.message ?? CONTACT_TOPICS[0].message;
}

export function whatsappUrl(contact: SiteIndex["contact"], message: string) {
  return `https://wa.me/${contact.whatsapp.replace(/\D/g, "")}?text=${encodeURIComponent(message)}`;
}

export function mailtoUrl(contact: SiteIndex["contact"], message: string) {
  return `mailto:${contact.email}?subject=${encodeURIComponent("Contato pelo site")}&body=${encodeURIComponent(message)}`;
}

export async function copyText(value: string) {
  try {
    await navigator.clipboard.writeText(value);
    return true;
  } catch {
    return false;
  }
}
