/* Frontend-only authentication states. No OAuth, no backend: "Google" is simulated and the account is a mock profile in localStorage.
   Flow: Continue with Google -> loading -> success -> (new: onboarding | returning: straight in) -> back to the action the user started. */
const AUTH = window.AUTH = { state: S.me && !S.me.guest ? 'authenticated' : 'unauthenticated', user: null, resolving: false, error: false };
const PROF_K = 'squado-mock-profile';
const loadProfile = () => { try {
    return JSON.parse(localStorage.getItem(PROF_K));
}
catch (e) {
    return null;
} };
const saveProfile = p => { try {
    localStorage.setItem(PROF_K, JSON.stringify(p));
}
catch (e) { } };
function startOb(n) { O.ob = { step: 0, name: n || '', username: '', city: '', locOk: 0, gender: '', age: '', interests: [] }; O.unRemote = ''; S.in = false; render(); }
function replay() {
    let it = S.intent;
    if (!it) {
        try {
            it = JSON.parse(sessionStorage.getItem('pu-intent') || 'null');
        }
        catch (e) { }
    }
    S.intent = null;
    try {
        sessionStorage.removeItem('pu-intent');
    }
    catch (e) { }
    if (!it)
        return false;
    if (it.hash && location.hash != it.hash)
        location.hash = it.hash;
    else
        render();
    setTimeout(() => { if (it.a == 'join') {
        const p = pl(it.v);
        if (p && ((p.who == 'Girls only' && S.me.gender != 'Girl') || (p.who == 'Boys only' && S.me.gender != 'Boy')))
            return toast('This one\'s ' + p.who.toLowerCase() + ' 🫶');
        A.cjoin({ dataset: { v: it.v } });
    }
    else if (it.a)
        A[it.a]({ dataset: { k: it.k, v: it.v } }); }, 500);
    return true;
}
A.gGoogle = () => {
    const pr = loadProfile();
    modal(authLoading());
    setTimeout(() => {
        modal(authSuccess(pr));
        setTimeout(() => { modal(''); AUTH.state = 'authenticated'; if (pr) {
            S.me = pr;
            S.in = true;
            save();
            replay() || goHash('#/home');
        }
        else
            startOb(''); }, 800);
    }, 1100);
};
window.finishOb = () => { const o = O.ob; S.me = { id: 'me', name: o.name.trim(), username: o.username, gender: o.gender, ageRange: o.age, city: o.city, bio: '', photo: '', interests: o.interests, rel: { hosted: 0, joined: 0, completed: 0, cancel: 0, noshow: 0 }, fb: { n: 0, tags: {}, again: [0, 0] } }; saveProfile(S.me); S.in = true; AUTH.state = 'authenticated'; save(); confetti(); toast('You\'re in, ' + S.me.name + ' 🎉'); replay() || goHash('#/home'); };
window.signOutUser = () => { S.me = GUEST(); S.in = true; AUTH.state = 'unauthenticated'; save(); goHash('#/home'); render(); toast('Logged out. Your profile is saved for next time.'); };
/* one central guard for every action that needs an account */
window.requireAuth = (intent, fn, title) => { if (!S.me.guest)
    return fn(); S.intent = intent; try {
    sessionStorage.setItem('pu-intent', JSON.stringify(intent));
}
catch (x) { } authGate(title); };
['join', 'going', 'nextSheet', 'edit', 'fbOpen', 'report', 'block', 'post', 'postOut'].forEach(n => { const o = A[n]; if (!o)
    return; A[n] = e => { const d = (e && e.dataset) || {}; requireAuth({ a: n, k: d.k, v: d.v, hash: location.hash }, () => o(e), n == 'join' ? 'Want to join the squad?' : n == 'going' ? 'Want to mark yourself going?' : 'Quick sign in to continue'); }; });
{
    const oc = A.close;
    A.close = e => { if (S.me.guest) {
        S.intent = null;
        try {
            sessionStorage.removeItem('pu-intent');
        }
        catch (x) { }
    } oc(e); };
}
{
    const oo = A.obCancel;
    A.obCancel = () => { AUTH.state = 'unauthenticated'; oo(); };
}
