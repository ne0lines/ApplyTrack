import Link from "next/link";

export default function NewJobPage() {
  return (
    <main className="page-wrap">
      <section className="phone-frame fade-in">
        <h1 className="page-title">Lagg till jobb</h1>
        <p className="muted">Fyll i uppgifterna kort och tydligt for smidigare uppfoljning.</p>

        <form className="form-layout stagger" action="#">
          <label>
            Jobbtitel
            <input defaultValue="Senior produktdesigner" type="text" />
          </label>

          <label>
            Foretag
            <input defaultValue="Acme Labs" type="text" />
          </label>

          <label>
            Annonslank
            <input defaultValue="https://jobs.acmelabs.com/roles/412" type="url" />
          </label>

          <label>
            Datum for ansokan
            <input defaultValue="2026-03-05" type="date" />
          </label>

          <label>
            Sista ansokningsdag
            <input defaultValue="2026-04-30" type="date" />
          </label>

          <label>
            Kontaktperson (valfritt)
            <input placeholder="Namn pa rekryterare eller anstallande chef" type="text" />
          </label>

          <label>
            Noteringar (valfritt)
            <textarea
              rows={4}
              placeholder="Rollfokus, intervjusignaler, referensvag och nasta steg."
            />
          </label>

          <div className="button-row">
            <Link className="btn btn-ghost" href="/">
              Avbryt
            </Link>
            <button className="btn btn-primary" type="submit">
              Lagg till jobb
            </button>
          </div>
        </form>
      </section>
    </main>
  );
}
