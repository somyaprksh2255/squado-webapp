/* Anonymous social feedback after a plan */

function fbSheet(id) {
    const p = pl(id);
    const o = p.members.filter(
        m => m != 'me'
    );

    modal(
        `<h2 style="margin-top:0">How was the squad?</h2>
        <p class="mut">
            Optional. Anonymous. Only totals are ever shown.
        </p>
        ${o
            .map(
                m => {
                    const x = O.fb[m] || {
                        t: [],
                        a: ''
                    };

                    return `
                        <div style="margin-bottom:16px">
                            <div class="row">
                                ${av(m, 32)}
                                <b>${esc(usr(m).name)}</b>

                                ${
                                    p.creator == 'me'
                                        ? `
                                            <button
                                                class="chip"
                                                style="padding:2px 10px"
                                                data-a="noshow"
                                                data-k="${id}"
                                                data-v="${m}"
                                            >
                                                Didn't show
                                            </button>
                                        `
                                        : ''
                                }
                            </div>

                            <div
                                class="chips"
                                style="margin:8px 0"
                            >
                                ${FT
                                    .map(
                                        t =>
                                            `
                                                <button
                                                    class="chip"
                                                    style="padding:4px 10px;font-size:.8rem"
                                                    aria-pressed="${x.t.includes(t)}"
                                                    data-a="fbTog"
                                                    data-k="${id}|${m}"
                                                    data-v="${t}"
                                                >
                                                    ${I(FI[t])} ${t}
                                                </button>
                                            `
                                    )
                                    .join('')}
                            </div>

                            <p
                                class="mut"
                                style="margin:0 0 4px"
                            >
                                Would you hang out with ${esc(usr(m).name)} again?
                            </p>

                            <div class="chips">
                                ${['Yes', 'Maybe', 'Not really']
                                    .map(
                                        a =>
                                            `
                                                <button
                                                    class="chip"
                                                    style="padding:4px 12px"
                                                    aria-pressed="${x.a == a}"
                                                    data-a="fbAgain"
                                                    data-k="${id}|${m}"
                                                    data-v="${a}"
                                                >
                                                    ${a}
                                                </button>
                                            `
                                    )
                                    .join('')}
                            </div>
                        </div>
                    `;
                }
            )
            .join('')}

        <button
            class="btn pink wide"
            data-a="fbSend"
            data-v="${id}"
        >
            Send feedback
        </button>

        <p style="text-align:center">
            <button
                class="btn ghost sm"
                data-a="close"
            >
                Skip
            </button>
        </p>`
    );
}