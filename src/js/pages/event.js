/* Event = something already happening. Plans = people organising around it. */

function eventPage(id) {
  const e = S.events.find((x) => x.id == id);

  if (!e) {
    return `
      <main>
        ${empty(
          "Event not found 💀",
          "It may have ended.",
          "Back to Discover",
          "#/explore",
        )}
      </main>
    `;
  }

  const g = e.going.includes("me");

  const tot = e.n + e.going.length;

  const P = S.plans.filter(
    (p) =>
      p.event == id &&
      p.status == "open" &&
      !S.blocked.includes(p.creator),
  );

  return `
    <main class="wrap">
      <a class="back" href="#/explore">← Back</a>

      <div class="dt">
        <div>
          <article class="card ev big">
            <div class="row">
              <span
                class="tag"
                style="background:var(--org);color:#fff"
              >
                ${I("ticket")} EVENT
              </span>

              <span class="pill">
                ${esc(e.date || "Tonight")}
              </span>
            </div>

            <h1 style="margin-top:12px">
              ${esc(e.title)}
            </h1>

            <div
              class="meta"
              style="font-size:1rem"
            >
              <span>🕘 ${e.when}</span>
              <span>📍 ${esc(e.loc)}</span>
              <span>👥 ${tot} people are going</span>
            </div>

            <div class="tear"></div>

            <p>
              ${esc(e.info || "")}
            </p>

            <p class="mut">
              Hosted by ${esc(e.host || "the organisers")}.
              Public event, no approval needed.
            </p>
          </article>

          <h2>Plans for this</h2>

          ${
            P.length
              ? `
                <div class="grid">
                  ${P.map(card).join("")}
                </div>
              `
              : empty(
                  "No squads yet 👀",
                  "Going alone? Start one.",
                  "Make a plan",
                  "#/create",
                )
          }
        </div>

        <div class="card">
          <h3 style="margin-top:0">
            Who's going
          </h3>

          <div
            class="stack"
            style="margin-bottom:10px"
          >
            ${e.going
              .slice(0, 8)
              .map((x) => av(x, 38))
              .join("")}
          </div>

          <p class="mut">
            ${tot} people are going
          </p>

          <button
            class="btn ${g ? "" : "pink"} wide"
            aria-pressed="${g}"
            data-a="going"
            data-v="${e.id}"
          >
            ${g ? "You're going ✓" : "I'm Going"}
          </button>

          <button
            class="btn ghost wide"
            style="margin-top:8px"
            data-a="evPlan"
            data-v="${e.id}"
          >
            ${I("users-round")} Make a plan for this
          </button>
        </div>
      </div>
    </main>
  `;
}