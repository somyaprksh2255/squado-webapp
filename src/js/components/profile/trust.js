const trust = u => {
    const r = u.rel || {
        hosted: 0,
        joined: 0,
        completed: 0,
        cancel: 0,
        noshow: 0
    };

    const t = r.joined + r.hosted;

    return r.completed >= 3 &&
        (r.cancel + r.noshow) <= Math.max(1, t * .1)
        ? '<span class="pill" style="background:var(--lime);color:#17131F">✅ Reliable</span>'
        : '<span class="pill">🌱 New here</span>';
};

const fbs = u => {
    const f = u.fb;

    if (!f || f.n < 3)
        return '<p class="mut">Not enough feedback yet. That\'s normal 🌱</p>';

    const t = Object.entries(f.tags)
        .sort(
            (a, b) => b[1] - a[1]
        )
        .slice(0, 3);

    return `
        <div class="row">
            ${t
                .map(
                    x =>
                        `<span class="pill">
                            ${I(FI[x[0]] || 'sparkles')} ${esc(x[0])} · ${x[1]}
                        </span>`
                )
                .join('')}
        </div>

        <p class="mut">
            ${Math.round(
                f.again[0] /
                Math.max(1, f.again[1]) *
                100
            )}% would hang out again · ${f.n} anonymous reviews
        </p>
    `;
};