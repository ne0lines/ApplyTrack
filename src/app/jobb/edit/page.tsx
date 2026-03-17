import { Btn } from "@/components/ui/btn";

const timeline = [
  { date: "5 mar 2026", event: "Ansökan skickad" },
  { date: "12 mar 2026", event: "Följde upp via e-post" },
  { date: "15 mar 2026", event: "Intervju bokad" },
  { date: "30 apr 2026", event: "Sista ansökningsdag - 14 dagar kvar" },
];

export default function JobDetailPage() {
  return (
    <main className="min-h-screen p-4 sm:p-5">
      <section className="flex flex-col gap-4 w-full max-w-3xl p-5 sm:p-8">
        <h1 className="font-display text-5xl sm:text-6xl">Jobbdetaljer</h1>
        <p className="text-lg text-app-muted">Följ status, historik och nästa steg</p>

        <article className="rounded-2xl border border-app-stroke bg-app-card p-4">
          <h2 className="font-display text-xl">UI Developer</h2>
          <p className="mt-1 text-base text-app-muted"><strong>Företag:</strong> PixelForge</p>
          <p className="mt-1 text-base text-app-muted"><strong>Plats:</strong> Stockholm / Remote</p>
          <h3 className="mt-3 font-display text-xl">Kontaktperson</h3>
          <p className="mt-1 text-base text-app-muted">Anna Berg (rekryterare)</p>
          <p className="mt-1 text-base text-app-muted"><strong>E-post:</strong> anna.berg@pixelforge.com</p>
          <p className="mt-1 text-base text-app-muted"><strong>Telefon:</strong> 070-123 45 67</p>
          <Btn
            className="mt-3"
            fullWidth
            href="https://jobs.acmelabs.com/roles/412"
            rel="noreferrer"
            target="_blank"
          >
            Besök annons
          </Btn>
        </article>

        <article className="rounded-2xl border border-app-stroke bg-app-card p-4">
          <h3 className="mb-2 text-xl font-display">Historik</h3>
          <div className="relative mt-2">
            <div aria-hidden="true" className="absolute top-2 bottom-2 left-1.25 w-px bg-app-stroke" />
            <ul className="space-y-4">
              {timeline.map((item) => (
                <li key={item.date} className="relative flex gap-3 items-center">
                  <span className="mt-1 h-3 w-3 shrink-0 rounded-full bg-app-primary-strong ring-3 ring-app-card" />
                  <div>
                  <strong className="block text-sm text-app-muted">{item.date}</strong>
                  <span className="text-lg">{item.event}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </article>

        <div className="flex w-full gap-3">
          <Btn type="button" className="w-full">Markera som uppföljt</Btn>
          <Btn href="/" variant="tertiary" className="w-full">Flytta till erbjudande</Btn>
        </div>
      </section>
    </main>
  );
}
