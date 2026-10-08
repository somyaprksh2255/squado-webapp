const usr = id =>
    id == 'me'
        ? S.me
        : S.users.find(u => u.id == id) || {
            name: 'Someone',
            interests: [],
            city: ''
        };

const pl = id =>
    S.plans.find(p => p.id == id);

const vis = () =>
    S.plans.filter(
        p =>
            !S.blocked.includes(p.creator) &&
            p.status == 'open'
    );

const unreadN = () =>
    (S.notifs || []).filter(n => n.u).length;

const unreadTotal = () =>
    Object.values(S.unread || {}).reduce(
        (a, b) => a + b,
        0
    );