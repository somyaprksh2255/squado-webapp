function notifSheet() {
    const L = S.notifs || [];

    return `
        <h2 style="margin-top:0">
            Notifications
        </h2>

        ${
            L.length
                ? L
                    .map(
                        n =>
                            `
                                <a
                                    class="li"
                                    href="${n.h}"
                                    data-a="close"
                                >
                                    <span
                                        class="nic"
                                        style="background:var(--ic-${n.c})"
                                    >
                                        ${I(n.ic, '18px')}
                                    </span>

                                    <div
                                        style="flex:1;min-width:0"
                                    >
                                        <b>
                                            ${esc(n.t)}
                                        </b>

                                        ${
                                            n.u
                                                ? ' <i class="dotb inl"></i>'
                                                : ''
                                        }

                                        <br>

                                        <span
                                            class="mut"
                                            style="font-size:.85rem"
                                        >
                                            ${esc(n.b)} · ${n.w}
                                        </span>
                                    </div>
                                </a>
                            `
                    )
                    .join('')
                : '<p class="mut">You\'re all caught up 🎉</p>'
        }
    `;
}