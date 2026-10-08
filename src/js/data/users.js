/* Mock users */

const U = [
    'Aditi',
    'Arjun',
    'Riya',
    'Somya',
    'Kabir',
    'Meera',
    'Dev',
    'Naina'
].map(
    (name, i) => ({
        id: 'u' + (i + 1),
        name,
        username: name.toLowerCase(),
        gender: [
            'Girl',
            'Boy',
            'Girl',
            'Girl',
            'Boy',
            'Girl',
            'Boy',
            'Girl'
        ][i],
        bio: [
            'Garba till the dhol stops.',
            'Chai > everything.',
            'Pics first, always.',
            'Pandal map in my head.',
            'Will eat anything once.',
            'Walks, lakes, no plans.',
            'Photographer. Mostly.',
            'Stay out late. Tell no one.'
        ][i],
        city: 'Bhopal',
        ageRange: i % 2 ? '23-27' : '18-22',
        interests: [
            INT[i % 9],
            INT[(i + 3) % 9],
            INT[(i + 5) % 9]
        ],
        rel: {
            hosted: i % 3 + 1,
            joined: i + 2,
            completed: i < 4 ? i + 3 : 1,
            cancel: i == 6 ? 2 : 0,
            noshow: i == 6 ? 1 : 0
        },
        fb: {
            n: i < 4 ? 5 + i : 1,
            tags: {
                'Friendly vibe': 3 + i,
                'Respectful': 2 + i,
                'Fun to hang out with': 2 + i,
                'Good communicator': 1 + i % 2,
                'Reliable': i,
                'Felt safe': 2 + i
            },
            again: [4 + i, 5 + i]
        }
    })
);