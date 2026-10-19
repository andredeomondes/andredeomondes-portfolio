/** Shared inner-page header: strong line + muted continuation, optional lead and actions. */
export function PageIntro({
  title,
  muted,
  lead,
  children,
}: {
  title: string;
  muted?: string;
  lead?: string;
  children?: React.ReactNode;
}) {
  return (
    <header className="page-intro rail-cell">
      <h1 className="page-intro__title">
        {title}
        {muted ? <span className="muted">{muted}</span> : null}
      </h1>
      {lead ? <p className="page-intro__lead">{lead}</p> : null}
      {children ? <div className="page-intro__extra">{children}</div> : null}
    </header>
  );
}

/** Two-column section: sticky heading on the left, content scrolling on the right. */
export function SplitSection({ id, title, muted, children }: { id?: string; title: string; muted?: string; children: React.ReactNode }) {
  return (
    <section className="split rail-cell" aria-labelledby={id}>
      <div className="split__aside">
        <h2 id={id} className="split__title">
          {title}
          {muted ? <span className="muted">{muted}</span> : null}
        </h2>
      </div>
      <div className="split__body">{children}</div>
    </section>
  );
}
