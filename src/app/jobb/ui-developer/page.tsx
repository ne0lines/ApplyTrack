import Link from "next/link";

const timeline = [
  { date: "5 mar 2026", event: "Ansokan skickad" },
  { date: "12 mar 2026", event: "Foljde upp via e-post" },
  { date: "15 mar 2026", event: "Intervju bokad" },
  { date: "30 apr 2026", event: "Sista ansokningsdag - 14 dagar kvar" },
];

export default function JobDetailPage() {
  return (
    <main className="page-wrap">
      <section className="phone-frame fade-in">
        <h1 className="page-title">Jobbdetaljer</h1>
        <p className="muted">Folj status, historik och nasta steg</p>

        <article className="panel stagger">
          <h2 className="job-title">UI Developer</h2>
          <p className="meta">PixelForge · Stockholm · Remote</p>
          <span className="badge">Intervju</span>
        </article>

        <article className="panel stagger">
          <h3>Ansokningsinfo</h3>
          <p>Ansokt: 5 mars 2026</p>
          <p>Kontakt: Anna Berg (rekryterare)</p>
          <a className="btn btn-primary full" href="https://jobs.acmelabs.com/roles/412">
            Besok annons
          </a>
        </article>

        <article className="panel stagger">
          <h3>Historik</h3>
          <ul className="timeline">
            {timeline.map((item) => (
              <li key={item.date}>
                <strong>{item.date}</strong>
                <span>{item.event}</span>
              </li>
            ))}
          </ul>
        </article>

        <div className="button-row stagger">
          <button className="btn btn-primary" type="button">
            Markera som foljt upp
          </button>
          <Link className="btn btn-ghost" href="/">
            Flytta till erbjudande
          </Link>
        </div>
      </section>
    </main>
  );
}
