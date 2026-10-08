const K = 'squado-v5';
const $ = s => document.querySelector(s);

const GUEST = () => ({
    id: 'me',
    guest: 1,
    name: 'friend',
    username: '',
    gender: '',
    city: 'Bhopal',
    interests: [],
    rel: {
        hosted: 0,
        joined: 0,
        completed: 0,
        cancel: 0,
        noshow: 0
    },
    fb: {
        n: 0,
        tags: {},
        again: [0, 0]
    }
});

let S;

try {
    S = JSON.parse(
        localStorage.getItem(K)
    );
}
catch (e) {
}

S = S || {
    in: true,
    me: GUEST(),
    users: U,
    plans: P0,
    events: E0,
    notifs: NOTIFS0,
    msgs: JSON.parse(
        JSON.stringify(CHATS0)
    ),
    unread: {
        ...UNREAD0
    },
    blocked: [],
    reports: [],
    notif: true
};

if (!S.me || S.me.guest)
    S.in = true;

if (!S.notifs)
    S.notifs = NOTIFS0;

if (!S.unread)
    S.unread = {
        ...UNREAD0
    };

const save = () => {
    try {
        localStorage.setItem(
            K,
            JSON.stringify(S)
        );
    }
    catch (e) {
    }
};

const O = {
    W: {
        type: '',
        vibe: [],
        loc: '',
        when: '',
        size: 0,
        desc: ''
    },

    ob: {
        step: 0,
        name: '',
        username: '',
        city: '',
        locOk: 0,
        gender: '',
        age: '',
        interests: []
    },

    os: {
        step: 0,
        move: '',
        size: 0,
        loc: '',
        desc: '',
        cname: ''
    },

    ui: {
        f: 'All',
        s: 'For you',
        q: ''
    },

    chat: {
        draft: ''
    },

    loaded: {},

    rep: null,

    fb: {},

    ed: {},

    unRemote: ''
};