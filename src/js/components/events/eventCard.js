const evCard = e => {
    const g = e.going.includes('me');

    return `
        <article class="card ev">
            <a
                class="cl"
                href="#/event/${e.id}"
                aria-label="${esc(e.title)}"
            ></a>

            <div class="row">
                <span
                    class="tag"
                    style="background:var(--org);color:#fff"
                >
                    ${e.emoji} EVENT
                </span>

                <span class="pill">
                    ${esc(e.date || 'Tonight')}
                </span>
            </div>

            <h3>
                ${esc(e.title)}
            </h3>

            <div class="meta">
                <span>
                    🕘 ${e.when}
                </span>

                <span>
                    📍 ${esc(e.loc)}
                </span>
            </div>

            <div class="tear"></div>

            <div class="row sp">
                <div class="stack">
                    ${e.going
                        .slice(0, 4)
                        .map(x => av(x, 28))
                        .join('')}

                    <b
                        style="margin-left:10px;font-size:.85rem;align-self:center"
                    >
                        ${e.n + e.going.length} going
                    </b>
                </div>

                <button
                    class="btn sm ${g ? '' : 'pink'}"
                    aria-pressed="${g}"
                    data-a="going"
                    data-v="${e.id}"
                >
                    ${g ? 'You\'re going ✓' : 'I\'m Going'}
                </button>
            </div>
        </article>
    `;
};
