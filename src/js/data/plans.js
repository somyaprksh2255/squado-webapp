/* Mock plans (+ sample night route via .from) */

const mk = (
    id,
    c,
    type,
    title,
    desc,
    vibe,
    loc,
    dist,
    when,
    max,
    m,
    who = 'Everyone'
) => ({
    id,
    creator: c,
    type,
    title,
    desc,
    vibe,
    loc,
    dist,
    when,
    live: when == 'LIVE NOW',
    max,
    members: m,
    who,
    reqs: [],
    status: 'open',
    spot: 'Gate 2, near the main entrance',
    created: Date.now() - id.slice(1) * 6e5
});

const P0 = [
    mk(
        'p1',
        'u1',
        'garba',
        'Anyone still dancing?',
        'My friends tapped out 😭 who\'s still going?',
        ['💃 Dance till dead'],
        'Near DB Mall',
        1.2,
        '9:30 PM',
        6,
        ['u1', 'u5', 'u8']
    ),

    mk(
        'p2',
        'u2',
        'pandal',
        '3 pandals. 1 night.',
        'Starting at 8. We\'ll figure the rest out.',
        ['🪔 Pandal marathon', '🤡 We\'ll figure it out'],
        'Old City',
        3.4,
        '8:00 PM',
        8,
        ['u2', 'u3', 'u6', 'u7']
    ),

    mk(
        'p3',
        'u4',
        'outside',
        'Chai & yap?',
        'I\'m not going home yet.',
        ['☕ Chai & yap'],
        'Near Jehan Numa',
        .8,
        'LIVE NOW',
        4,
        ['u4', 'u6']
    ),

    mk(
        'p4',
        'u3',
        'garba',
        'Pics first, garba later',
        'Need people who actually stop for photos 😭',
        ['📸 Pics first'],
        'MP Nagar',
        2.1,
        '10:00 PM',
        5,
        ['u3', 'u1', 'u8'],
        'Girls only'
    ),

    mk(
        'p5',
        'u7',
        'chai',
        'Poha jalebi run',
        'Post-garba food street. Bring appetite.',
        ['🧃 Chill'],
        'Bittan Market',
        2.8,
        '11:00 PM',
        5,
        ['u7', 'u5']
    ),

    mk(
        'p6',
        'u8',
        'outside',
        'Walk by the lake?',
        'Garba\'s over, brain isn\'t.',
        ['🫠 No plans, just vibes'],
        'Shahpura Lake',
        4.5,
        'LIVE NOW',
        4,
        ['u8']
    ),

    mk(
        'p7',
        'u5',
        'bhandara',
        'Anyone wanna go to this Bhandara?',
        'Langar vibes. Heading from Arera Colony.',
        ['🧃 Chill'],
        'Arera Colony',
        3,
        '8:30 PM',
        5,
        ['u5', 'u2']
    ),

    mk(
        'p8',
        'u7',
        'food',
        'Street food crawl',
        'Bhutte, chaat, repeat.',
        ['🪩 Full send'],
        '10 No. Market',
        2.4,
        '9:15 PM',
        5,
        ['u7', 'u2'],
        'Boys only'
    )
];

P0[0].event = 'e1';
P0[3].event = 'e1';
P0[1].event = 'e2';
P0[6].event = 'e3';

P0[4].from = 'p1';
P0[7].from = 'p5';
P0[1].from = 'p8';

// sample night: Garba -> Chai -> Food -> Pandal hop

P0.push(
    mk(
        'p9',
        'u1',
        'garba',
        'Garba Night',
        'Left gate, yellow dupatta. Photos first, then we dance.',
        ['📸 Pics first', '💃 Dance till dead'],
        'Near DB Mall',
        1.2,
        '8:00 PM',
        6,
        ['u1', 'me', 'u3', 'u5', 'u8']
    ),

    mk(
        'p10',
        'u6',
        'chai',
        'Chai & yap',
        'After garba, the green-tent stall.',
        ['☕ Chai & yap'],
        'Bittan Market',
        2.8,
        '10:30 PM',
        5,
        ['u6', 'me', 'u2']
    )
);

P0.find(p => p.id == 'p10').from = 'p9';
P0.find(p => p.id == 'p9').event = 'e1';