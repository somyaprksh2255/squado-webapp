function tick() {
    let ch = 0;
    const n = Date.now();
    S.plans.forEach(p => {
        if (p.status != 'open')
            return;
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
                    !(p.reqs || []).some(r => r.u == u.id) &&
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
                S.notifs.unshift({
                    id: `join-${p.id}-${u.id}-${n}`,
                    type: 'join_request',
                    ic: 'user-plus',
                    c: 'pink',
                    t: `${u.name} wants to join your squad`,
                    b: `${p.title} · tap to review`,
                    w: 'now',
                    u: 1,
                    h: '',
                    planId: p.id,
                    userId: u.id
                });
                ch = 1;
                toast(u.name + ' wants to join your squad 👀');
            }
        }
    });
    if (ch) {
        save();
        if (
            document.activeElement &&
            !/INPUT|TEXTAREA/.test(document.activeElement.tagName)
        )
            render();
    }
}