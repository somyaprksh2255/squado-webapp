function tick() {
    let ch = 0;
    const n = Date.now();

    S.plans.forEach(p => {
        if (p.status != 'open')
            return;

        p.reqs
            .filter(
                r =>
                    r.u == 'me' &&
                    p.creator != 'me' &&
                    n - r.at > 4500
            )
            .forEach(r => {
                p.reqs = p.reqs.filter(x => x != r);
                ch = 1;

                if (
                    p.members.length < p.max &&
                    Math.random() < .85
                ) {
                    p.members.push('me');
                    S.me.rel.joined++;

                    sys(
                        p.id,
                        `${S.me.name} joined the squad 👋`
                    );

                    toast('You\'re in 🫡 Host accepted you');
                    confetti();
                }
                else {
                    (p.rej = p.rej || []).push('me');
                    toast('Host passed this time. Try another plan 🫶');
                }
            });

        if (
            p.creator == 'me' &&
            p.simAt &&
            n > p.simAt
        ) {
            p.simAt = 0;

            const c = S.users.filter(
                u =>
                    !S.blocked.includes(u.id) &&
                    !p.members.includes(u.id) &&
                    (
                        p.who == 'Everyone' ||
                        (
                            p.who == 'Girls only' &&
                            u.gender == 'Girl'
                        ) ||
                        (
                            p.who == 'Boys only' &&
                            u.gender == 'Boy'
                        )
                    )
            );

            if (c.length) {
                const u = c[Math.random() * c.length | 0];

                p.reqs.push({
                    u: u.id,
                    at: n
                });

                ch = 1;
                toast(u.name + ' wants to join your squad 👀');
            }
        }
    });

    if (ch) {
        save();

        if (!/INPUT|TEXTAREA/.test(document.activeElement.tagName))
            render();
    }
}

function tick() {
    let ch = 0;
    const n = Date.now();

    S.plans.forEach(p => {
        if (p.status != 'open')
            return;

        p.reqs
            .filter(
                r =>
                    r.u == 'me' &&
                    p.creator != 'me' &&
                    n - r.at > 4500
            )
            .forEach(r => {
                p.reqs = p.reqs.filter(x => x != r);
                ch = 1;

                if (
                    p.members.length < p.max &&
                    Math.random() < .85
                ) {
                    p.members.push('me');
                    S.me.rel.joined++;

                    sys(
                        p.id,
                        `${S.me.name} joined the squad 👋`
                    );

                    toast('You\'re in 🫡 Host accepted you');
                    confetti();
                }
                else {
                    (p.rej = p.rej || []).push('me');
                    toast('Host passed this time. Try another plan 🫶');
                }
            });

        if (
            p.creator == 'me' &&
            p.simAt &&
            n > p.simAt
        ) {
            p.simAt = 0;

            const c = S.users.filter(
                u =>
                    !S.blocked.includes(u.id) &&
                    !p.members.includes(u.id) &&
                    (
                        p.who == 'Everyone' ||
                        (
                            p.who == 'Girls only' &&
                            u.gender == 'Girl'
                        ) ||
                        (
                            p.who == 'Boys only' &&
                            u.gender == 'Boy'
                        )
                    )
            );

            if (c.length) {
                const u = c[Math.random() * c.length | 0];

                p.reqs.push({
                    u: u.id,
                    at: n
                });

                ch = 1;
                toast(u.name + ' wants to join your squad 👀');
            }
        }
    });

    if (ch) {
        save();

        if (!/INPUT|TEXTAREA/.test(document.activeElement.tagName))
            render();
    }
}