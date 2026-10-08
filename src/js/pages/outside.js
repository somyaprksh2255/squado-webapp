function outside() {
    const o = O.os;
    const s = o.step;

    const M = [
        '☕ Chai',
        '🍕 Food',
        '💃 Garba',
        '🪔 Pandal Hopping',
        '🚶 Walk',
        '🧭 Explore',
        '✨ Custom'
    ];

    const os = c => c.replace(
        /data-a="set"/g,
        'data-a="osset"'
    );

    let b = '';

    if (!s)
        b = `
            <h1>You're still out?</h1>
            <div class="row">
                <button class="btn pink" data-a="osn">
                    🫠 Yeah, I'm staying
                </button>
                <a class="btn ghost" href="#/home" data-a="home">
                    Nah, heading home
                </a>
            </div>
        `;

    if (s == 1)
        b = `
            <h1>What's the move?</h1>
            ${os(chips(M, 'os.move', o.move))}
            ${
                o.move == '✨ Custom'
                    ? `
                        <input
                            type="text"
                            style="margin-top:12px"
                            maxlength="24"
                            data-in="os.cname"
                            value="${esc(o.cname || '')}"
                            placeholder="What are we doing?"
                            aria-label="Custom"
                        >
                        <p>
                            <button class="btn pink" data-a="osnext">
                                Next
                            </button>
                        </p>
                    `
                    : ''
            }
        `;

    if (s == 2)
        b = `
            <h1>Who's down?</h1>
            <p class="mut">Max squad size</p>
            ${os(
                chips(
                    ['2', '3', '4', '5', '6'],
                    'os.size',
                    String(o.size)
                )
            )}
        `;

    if (s == 3)
        b = `
            <h1>Where are you?</h1>
            <p>
                <button
                    class="btn pink sm"
                    data-a="geoPick"
                    data-k="os.loc"
                >
                    📍 Use my location
                </button>
            </p>
            ${os(chips(LOCS, 'os.loc', o.loc))}
            <p class="mut" style="margin-top:10px">
                Shown as an area only.
            </p>
        `;

    if (s == 4) {
        const mv = o.move.replace(/^\S+ /, '');
        const ty = MT[mv];

        const mt = vis()
            .filter(
                p =>
                    !p.members.includes('me') &&
                    p.members.length < p.max &&
                    (p.type == ty || p.type == 'outside') &&
                    d(p) <= 8
            )
            .sort(
                (a, b) =>
                    b.live - a.live ||
                    d(a) - d(b)
            )
            .slice(0, 2);

        b = `
            <h1>Post it.</h1>

            <p class="mut">
                ${esc(mv == 'Custom' ? o.cname : mv)}
                · up to ${o.size}
                · ${esc(o.loc)}
            </p>

            ${
                mt.length
                    ? `
                        <h2>Already happening nearby 👀</h2>
                        <div class="grid">
                            ${mt.map(card).join('')}
                        </div>
                        <h2>Or start your own squad</h2>
                    `
                    : ''
            }

            <input
                type="text"
                maxlength="120"
                data-in="os.desc"
                value="${esc(o.desc)}"
                placeholder="Friends left. I'm not done."
                aria-label="Note"
            >

            <p>
                <b>Who can join?</b>
            </p>

            ${chips(
                ['Everyone', 'Girls only', 'Boys only'],
                'os.who',
                o.who || 'Everyone'
            )}

            <p style="margin-top:16px">
                <button class="btn pink wide" data-a="postOut">
                    🔴 Go live
                </button>
            </p>
        `;
    }

    return `
        <main style="max-width:560px">
            <a class="back" href="#/home">
                ← Back
            </a>
            ${b}
        </main>
    `;
}