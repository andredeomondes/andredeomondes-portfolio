"use client";

import { ArrowUpRight } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import { LightSweep } from "@/shared/components/layout/light-sweep";
import { Magnetic } from "@/shared/components/fx/magnetic";
import { useSite } from "@/shared/components/shell/site-provider";
import { useSalvadorTime } from "@/shared/components/shell/contact-launcher";
import { topicMessage, whatsappUrl } from "@/shared/components/shell/contact-actions";

/** Home-only closing moment: one big line, live status and two direct actions. */
export function Finale() {
  const { index, setContactOpen } = useSite();
  const time = useSalvadorTime();

  return (
    <section id="contato" className="finale rail-cell" aria-labelledby="finale-title">
      <LightSweep />
      <p className="finale__status">
        <span className="contact-sheet__dot" aria-hidden="true" />
        {index.contact.availability}
        {time ? <span className="tabular"> · {time} em Salvador</span> : null}
      </p>
      <h2 id="finale-title" className="finale__title">
        Vamos construir algo
        <span className="finale__muted">que roda em produção.</span>
      </h2>
      <div className="finale__actions">
        <Magnetic>
          <a className="btn btn--primary finale__cta" href={whatsappUrl(index.contact, topicMessage("freela"))} target="_blank" rel="noreferrer">
            <FaWhatsapp aria-hidden="true" /> Chamar no WhatsApp
          </a>
        </Magnetic>
        <Magnetic>
          <button type="button" className="btn finale__cta" onClick={() => setContactOpen(true)}>
            Outras formas de contato <ArrowUpRight size={16} aria-hidden="true" />
          </button>
        </Magnetic>
      </div>
    </section>
  );
}
