/* One squad conversation: header (plan context), messages, composer */

function groupChat(id) {
    const p = pl(id);

    if (!p || !p.members.includes('me'))
        return `<section class="gpanel">${empty(
            'No access',
            'Join the plan to unlock this squad chat.',
            'See the plan',
            '#/plan/' + id
        )}</section>`;

    const L = msgs(id).filter(
        m =>
            !m.by ||
            !S.blocked.includes(m.by)
    );

    let prev = '';

    const rows = L
        .map(
            m => {
                if (m.sys) {
                    prev = '';

                    return `<div class="sys">${esc(m.x)}</div>`;
                }

                const me = m.by == 'me';
                const first = m.by != prev;

                prev = m.by;

                return `
                    <div class="m ${me ? 'mo' : ''}">
                        ${
                            me
                                ? ''
                                : (
                                    first
                                        ? av(m.by, 30)
                                        : '<span class="avs"></span>'
                                )
                        }

                        <div class="mb">
                            ${
                                !me && first
                                    ? `<small class="mn">${esc(usr(m.by).name)}</small>`
                                    : ''
                            }

                            <button
                                class="bub"
                                data-a="react"
                                data-k="${id}"
                                data-v="${msgs(id).indexOf(m)}"
                            >
                                ${esc(m.x)}
                            </button>

                            <small class="mt">${m.t || ''}</small>

                            ${
                                m.r
                                    ? `<span class="rx">${m.r}</span>`
                                    : ''
                            }
                        </div>
                    </div>
                `;
            }
        )
        .join('');

    const d = (O.chat.draft || '').trim();

    return `
        <section
            class="gpanel"
            aria-label="${esc(p.title)} chat"
        >
            <header class="ghd">
                <a
                    class="iconbtn gback"
                    href="#/groups"
                    aria-label="Back to groups"
                >
                    ${I('arrow-left', '22px')}
                </a>

                ${gAvatar(p, '42px')}

                <div class="gtx">
                    <b>${esc(p.title)}</b>
                    <span class="mut">${planCtx(p)}</span>
                </div>

                <button
                    class="iconbtn"
                    data-a="gopts"
                    data-v="${id}"
                    aria-label="Group options"
                >
                    ${I('ellipsis-vertical', '22px')}
                </button>
            </header>

            <div
                class="gmsgs"
                aria-live="polite"
            >
                ${rows}

                <p class="sys">
                    Tap a message to react
                </p>
            </div>

            <div class="comp">
                <button
                    class="chip"
                    data-a="loc"
                    data-v="${id}"
                    aria-label="Share location"
                >
                    📍
                </button>

                <button
                    class="chip"
                    data-a="img"
                    data-v="${id}"
                    aria-label="Share image"
                >
                    📷
                </button>

                <input
                    type="text"
                    id="mi"
                    data-in="chat.draft"
                    value="${esc(O.chat.draft || '')}"
                    maxlength="300"
                    placeholder="Message your squad"
                    aria-label="Message"
                >

                <button
                    id="sendbtn"
                    class="btn pink sm"
                    data-a="send"
                    data-v="${id}"
                    aria-label="Send message"
                    ${d ? '' : 'disabled'}
                >
                    ${I('send', '18px')}
                </button>
            </div>
        </section>
    `;
}

function groupOptions(id) {
    const p = pl(id);
    const host = p.creator == 'me';

    const R = (
        i,
        l,
        at
    ) =>
        `<button class="li" ${at}>
            ${I(i)}
            <b style="flex:1;text-align:left">
                ${l}
            </b>
            ${I('chevron-right')}
        </button>`;

    return `
        <h2 style="margin-top:0">
            ${esc(p.title)}
        </h2>

        ${R(
            'map-pinned',
            'View plan',
            `data-a="goPlan" data-v="${id}"`
        )}

        ${R(
            'users-round',
            'View members',
            `data-a="members" data-v="${id}"`
        )}

        ${R(
            'info',
            'Group info',
            `data-a="ginfo" data-v="${id}"`
        )}

        ${
            p.status == 'open'
                ? R(
                    'arrow-right',
                    'Next stop',
                    `data-a="nextSheet" data-v="${id}"`
                )
                : ''
        }

        ${R(
            'flag',
            'Report plan',
            `data-a="report" data-k="plan" data-v="${id}"`
        )}

        ${
            host || p.status != 'open'
                ? ''
                : R(
                    'log-out',
                    'Leave group',
                    `data-a="ask" data-do="leave" data-v="${id}"`
                )
        }
    `;
}

function groupInfo(id) {
    const p = pl(id);

    return `
        <h2 style="margin-top:0">
            Group info
        </h2>

        <div
            class="row"
            style="margin-bottom:12px"
        >
            ${gAvatar(p, '52px')}

            <div>
                <b>${esc(p.title)}</b>
                <br>
                <span class="mut">
                    ${planCtx(p)}
                </span>
            </div>
        </div>

        <p>
            ${esc(p.desc)}
        </p>

        <p class="mut">
            📍 ${esc(p.loc)} (approximate)
            · Hosted by ${esc(usr(p.creator).name)}
            ${
                p.who != 'Everyone'
                    ? ' · ' + p.who
                    : ''
            }
        </p>

        <div
            class="stack"
            style="margin:8px 0"
        >
            ${p.members
                .map(m => av(m, 38))
                .join('')}
        </div>

        <p class="mut">
            ${p.members.length} / ${p.max} people
        </p>
    `;
}