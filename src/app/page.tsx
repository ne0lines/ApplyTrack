import Link from "next/link";

export default function Home() {
  return (
    <main className="page-wrap">
      <section className="phone-frame fade-in">
        <div className="header-row">
          <div>
            <h1 className="brand">ApplyTrack</h1>
            <p className="muted">Oversikt over sokta jobb</p>
          </div>
          <Link className="btn btn-primary" href="/jobb/ny">
            Lagg till ansokan
          </Link>
        </div>

        <h2 className="section-title">Pipeline</h2>
        <div className="pipeline-grid stagger">
          <article className="column-card">
            <h3>Ansokt</h3>
            <Link className="job-card" href="/jobb/ui-developer">
              <strong>UI Developer</strong>
              <span>PixelForge</span>
            </Link>
          </article>

          <article className="column-card column-card-active">
            <h3>Intervju</h3>
            <div className="job-card">
              <strong>Product Designer</strong>
              <span>Craft Studio</span>
            </div>
          </article>
        </div>

        <article className="panel stagger">
          <h3>Paminnelse</h3>
          <p>Ingen aterkoppling fran PixelForge efter 7 dagar. Folj upp idag.</p>
        </article>

        <h2 className="section-title">Statistik</h2>
        <div className="stats-grid stagger">
          <article className="stat-card stat-neutral">
            <strong>23</strong>
            <span>Ansokt</span>
          </article>
          <article className="stat-card stat-cyan">
            <strong>4</strong>
            <span>Intervjuer</span>
          </article>
          <article className="stat-card stat-green">
            <strong>1</strong>
            <span>Jobberbjudanden</span>
          </article>
          <article className="stat-card stat-sand">
            <strong>17%</strong>
            <span>Framgang</span>
          </article>
        </div>

        <article className="panel chart-panel stagger">
          <h3>Ansokningar per dag (senaste 30 dagar)</h3>
          <svg
            viewBox="0 0 336 190"
            role="img"
            aria-label="Ansokningstrend de senaste 30 dagarna"
            className="chart"
          >
            <defs>
              <linearGradient id="area" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#7f43ff" stopOpacity="0.5" />
                <stop offset="100%" stopColor="#7f43ff" stopOpacity="0.08" />
              </linearGradient>
            </defs>
            <path
              d="M0 132 C20 112, 45 100, 70 104 C95 108, 118 130, 140 150 C155 164, 174 156, 190 128 C210 92, 228 38, 248 52 C270 66, 292 124, 336 110 L336 190 L0 190 Z"
              fill="url(#area)"
            />
            <path
              d="M0 132 C20 112, 45 100, 70 104 C95 108, 118 130, 140 150 C155 164, 174 156, 190 128 C210 92, 228 38, 248 52 C270 66, 292 124, 336 110"
              fill="none"
              stroke="#6c37e8"
              strokeWidth="2.5"
            />
          </svg>
          <div className="chart-axis">
            <span>1 apr</span>
            <span>6 apr</span>
            <span>11 apr</span>
            <span>16 apr</span>
            <span>21 apr</span>
            <span>26 apr</span>
            <span>30 apr</span>
          </div>
        </article>
      </section>
    </main>
  );
}
