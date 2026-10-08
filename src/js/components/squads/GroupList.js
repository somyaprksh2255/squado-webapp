/* Groups list: every squad the user joined or created, with last message, time and unread state */

const planWhen = p =>
    p.live
        ? 'Live now'
        : (p.day && p.day != 'Today' ? p.day : 'Tonight') +
          ' · ' +
          p.when;

const planCtx = p =>
    `${esc(p.custom || T[p.type][1])} · ${planWhen(p)} · ${p.members.length} members`;

const gAvatar = (
    p,
    s = '48px'
) =>
    `<span
        class="gav"
        style="width:${s};height:${s};background:${T[p.type][2]};color:${['chai', 'food', 'bhandara'].includes(p.type) ? '#17131F' : '#fff'}"
    >
        ${T[p.type][0]}
    </span>`;

function groupItem(p, active) {
    const L = msgs(p.id).filter(
        m =>
            !m.sys &&
            (!m.by || !S.blocked.includes(m.by))
    );

    const l = L[L.length - 1];
    const u = (S.unread || {})[p.id] || 0;

    return `
        <a
            class="gi ${active ? 'on' : ''} ${u ? 'unread' : ''}"
            href="#/gc/${p.id}"
            ${active ? ' aria-current="true"' : ''}
        >
            ${gAvatar(p)}

            <div class="gm">
                <div class="gr">
                    <b>${esc(p.title)}</b>
                    <span class="gtm">
                        ${l ? l.t || '' : ''}
                    </span>
                </div>

                <div class="gctx">
                    ${planCtx(p)}
                </div>

                <div class="gr">
                    <span class="gprev">
                        ${
                            l
                                ? (l.by == 'me'
                                    ? 'You'
                                    : esc(usr(l.by).name)) +
                                  ': ' +
                                  esc(l.x)
                                : 'No messages yet'
                        }
                    </span>

                    ${
                        u
                            ? `<i
                                class="ub"
                                aria-label="${u} unread"
                            >
                                ${u}
                            </i>`
                            : ''
                    }
                </div>
            </div>
        </a>
    `;
}

function groupList(act) {
    const mine = S.plans.filter(
        p => p.members.includes('me')
    );

    const G = mine
        .filter(
            p => p.status == 'open'
        )
        .sort(
            (a, b) =>
                ((S.unread || {})[b.id] || 0) -
                    ((S.unread || {})[a.id] || 0) ||
                b.live - a.live ||
                mins(a.when) - mins(b.when)
        );

    const P = mine.filter(
        p => p.status != 'open'
    );

    const W = S.plans.filter(
        p =>
            p.status == 'open' &&
            p.reqs.some(
                r => r.u == 'me'
            )
    );

    return `
        <section
            class="glist"
            aria-label="Your groups"
        >
            <h1>Groups</h1>

            <p class="mut">
                Your squads, all in one place.
            </p>

            ${
                G.length
                    ? `
                        <div class="gis">
                            ${G
                                .map(
                                    p =>
                                        groupItem(
                                            p,
                                            p.id == act
                                        )
                                )
                                .join('')}
                        </div>
                    `
                    : empty(
                        'No squads yet',
                        'Join a plan and your squad conversations will appear here.',
                        'Discover plans',
                        '#/explore'
                    )
            }

            ${
                W.length
                    ? `
                        <h2>Waiting on the host</h2>

                        ${W
                            .map(
                                p =>
                                    `
                                        <a
                                            class="li"
                                            href="#/plan/${p.id}"
                                        >
                                            ${T[p.type][0]}

                                            <b style="flex:1">
                                                ${esc(p.title)}
                                            </b>

                                            <span class="mut">
                                                Requested
                                            </span>
                                        </a>
                                    `
                            )
                            .join('')}
                    `
                    : ''
            }

            ${
                P.length
                    ? `
                        <h2>Past squads</h2>

                        <div class="gis">
                            ${P
                                .map(
                                    p =>
                                        groupItem(
                                            p,
                                            p.id == act
                                        )
                                )
                                .join('')}
                        </div>
                    `
                    : ''
            }
        </section>
    `;
}