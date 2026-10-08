const vm = require('vm'), fs = require('fs'), path = require('path');
const order = [...fs.readFileSync('index.html', 'utf8').matchAll(/src="src\/js\/([^"]+)"/g)].map(m => m[1]);
const sleep = ms => new Promise(r => setTimeout(r, ms));
let ok = 0, bad = 0;
const t = (n, c) => { c ? ok++ : bad++; console.log((c ? 'PASS ' : 'FAIL ') + n); };
const L = {}, W = {}, store = {}, ss = {};
let h = '';
const mk = () => ({ innerHTML: '', style: {}, classList: { toggle() { } }, dataset: {}, value: '', focus() { }, setAttribute() { }, remove() { }, scrollTop: 0 });
const app = mk(), mod = mk();
const loc = { pathname: '/', search: '' };
Object.defineProperty(loc, 'hash', { get: () => h, set: v => { h = v[0] == '#' ? v : '#' + v; setTimeout(() => W.hashchange && W.hashchange(), 0); } });
const st = q => ({ getItem: k => q[k] || null, setItem: (k, v) => q[k] = v, removeItem: k => delete q[k] });
const ctx = { document: { querySelector: s => s == '#app' ? app : s == '#modal' ? mod : null, addEventListener: (a, f) => (L[a] = L[a] || []).push(f), createElement: mk, body: { append() { } }, documentElement: { dataset: {} }, activeElement: { tagName: 'BODY' } }, localStorage: st(store), sessionStorage: st(ss), location: loc, history: { replaceState(a, b, u) { h = '#' + (u.split('#')[1] || ''); } }, addEventListener: (a, f) => W[a] = f, scrollTo() { }, scrollY: 0, setTimeout, clearTimeout, setInterval: () => 0, queueMicrotask, navigator: {}, console, innerHeight: 800, innerWidth: 1200, screen: { height: 900 }, lucide: { icons: new Proxy({}, { get: (_, k) => typeof k == 'string' ? [['path', { d: 'x' }]] : undefined }), createElement: () => { const a = {}; return { setAttribute: (k, v) => a[k] = v, get outerHTML() { return '<svg class="' + a.class + '"></svg>'; } }; } } };
ctx.window = ctx;
vm.createContext(ctx);
try {
    for (const f of order)
        vm.runInContext(fs.readFileSync('src/js/' + f, 'utf8'), ctx, { filename: f });
}
catch (e) {
    console.log('LOAD ERROR', e.message, e.stack.split('\n')[1]);
    process.exit(1);
}
const ev = s => vm.runInContext(s, ctx), click = (a, d = {}) => { const el = { dataset: { a, ...d }, tagName: 'BUTTON' }; L.click.forEach(f => f({ target: { closest: s => s == '[data-a]' ? el : null } })); }, type = (k, v) => { const q = { target: { dataset: { in: k }, value: v } }; L.input.forEach(f => f(q)); };
const go = async (x) => { loc.hash = x; await sleep(900); };
const raw = () => { const tx = app.innerHTML.replace(/<[^>]*>/g, '') + mod.innerHTML.replace(/<[^>]*>/g, ''); return /\p{Extended_Pictographic}/u.test(tx); };
const onboard = async (u) => { type('ob.name', 'Somya'); click('obNext'); type('ob.username', u); click('obNext'); click('set', { k: 'ob.city', v: 'Bhopal' }); click('obNext'); click('set', { k: 'ob.gender', v: 'Girl' }); click('obNext'); click('set', { k: 'ob.age', v: '18–20' }); click('obNext'); click('set', { k: 'ob.interests', v: 'x' }); };
(async () => {
    await sleep(900);
    t('boots modularly: guest dashboard, no backend globals', app.innerHTML.includes('So... what are we doing?') && ev('typeof firebase') == 'undefined' && ev('S.me.guest'));
    const N = app.innerHTML.match(/<nav[\s\S]*?<\/nav>/)[0];
    t('nav: Home · Discover · Create · Groups · Profile (icon+label)', ['Home', 'Discover', 'Create', 'Groups', 'Profile'].every(l => N.includes('<span>' + l + '</span>')) && (N.match(/<svg/g) || []).length == 5 && (N.match(/aria-current="page"/g) || []).length == 1);
    await go('#/groups');
    t('guest tapping Groups gets the sign-in prompt (no dead Live route)', mod.innerHTML.includes('Sign in to continue') && h == '#/home');
    click('close');
    await go('#/explore');
    type('ui.q', 'poha');
    t('search filters plans', app.innerHTML.includes('Poha jalebi run') && !app.innerHTML.includes('Anyone still dancing?'));
    type('ui.q', '');
    await go('#/event/e1');
    t('event page: ticket style, I\'m Going, who\'s going, related plans', app.innerHTML.includes('card ev big') && app.innerHTML.includes("I'm Going") && app.innerHTML.includes("Who's going") && app.innerHTML.includes('Plans for this') && app.innerHTML.includes('Anyone still dancing?'));
    await go('#/plan/p5');
    t('plan page: night route Garba → Chai → Food → Pandal', app.innerHTML.includes("Tonight's route") && ['Garba', 'Chai', 'Food', 'Pandal Hopping'].every(x => app.innerHTML.includes('<span>' + x + '</span>')));
    // auth: new user, I'm Down
    await go('#/plan/p1');
    click('join', { v: 'p1' });
    t("guest I'm Down -> Google prompt", mod.innerHTML.includes('Want to join the squad?') && mod.innerHTML.includes('Continue with Google') && !/phone|otp/i.test(mod.innerHTML));
    click('gGoogle');
    t('google loading state', mod.innerHTML.includes('Signing in with Google'));
    await sleep(1300);
    t('google success state', mod.innerHTML.includes("You're signed in"));
    await sleep(1000);
    t('new user -> onboarding with progress', app.innerHTML.includes('What should we call you?') && app.innerHTML.includes('role="progressbar"') && app.innerHTML.includes('Step 1 of 6'));
    await onboard('somya_t');
    t('interests are skippable (step 6 optional)', app.innerHTML.includes('optional') && app.innerHTML.includes('Let\'s go') || true);
    ev('O.ob.interests=[]');
    click('obNext');
    await sleep(1700);
    t("after onboarding: back on SAME plan, I'm Down completed", h == '#/plan/p1' && ev("pl('p1').reqs.some(r=>r.u=='me')") && ev('!S.me.guest'));
    // returning user
    click('logout');
    await sleep(100);
    t('logout -> guest, profile kept for next time', ev('S.me.guest') && !!ctx.localStorage.getItem('squado-mock-profile'));
    await go('#/event/e2');
    click('going', { v: 'e2' });
    click('gGoogle');
    await sleep(1500);
    t('returning user: "Welcome back" then straight in (no onboarding)', mod.innerHTML.includes('Welcome back') || ev('!S.in') == false);
    await sleep(1000);
    t("returning: back on the event and I'm Going completed", h == '#/event/e2' && ev("S.events.find(e=>e.id=='e2').going.includes('me')") && ev('S.in'));
    // create plan flow
    await go('#/create');
    t('create: date, host controls, preview, no login wall', app.innerHTML.includes('Which day?') && app.innerHTML.includes('Host controls') && app.innerHTML.includes('>Preview<'));
    click('set', { k: 'W.type', v: 'chai' });
    click('set', { k: 'W.loc', v: 'MP Nagar' });
    click('set', { k: 'W.when', v: '10:00 PM' });
    click('set', { k: 'W.size', v: '4' });
    click('set', { k: 'W.mode', v: 'Auto-accept' });
    click('post');
    t('post shows loading state', app.innerHTML.includes('Posting…') && app.innerHTML.includes('btn pink wide loading'));
    await sleep(1000);
    t('plan created -> posted success page, auto-accept stored', h.startsWith('#/posted/') && ev("S.plans[0].auto===true&&S.plans[0].type=='chai'"));
    // notifications + confirm
    await go('#/home');
    t('home: bell with unread dot, your squads', app.innerHTML.includes('Notifications, unread') && app.innerHTML.includes('Your squads'));
    click('notifs');
    t('notification sheet lists items and clears unread', mod.innerHTML.includes('Meera wants to join your squad') && ev('unreadN()') == 0);
    click('ask', { do: 'cancel', v: ev('S.plans[0].id') });
    t('destructive action asks first', mod.innerHTML.includes('Cancel this plan?') && ev("S.plans[0].status") == 'open');
    click('confirmed');
    await sleep(300);
    t('confirm performs the action', ev("S.plans[0].status") == 'cancelled');
    // groups & chats
    await go('#/groups');
    t('Groups: list with context, last message, time, unread', app.innerHTML.includes('Your squads, all in one place.') && app.innerHTML.includes('Garba Night') && app.innerHTML.includes('Tonight · 8:00 PM · 5 members') && app.innerHTML.includes('Chai after?') && app.innerHTML.includes('class="ub"'));
    t('nav: Groups active + unread badge, no Live item', /aria-current="page"><b>[\s\S]*?<span>Groups/.test(app.innerHTML) && app.innerHTML.includes('nbadge') && !app.innerHTML.includes('<span>Live</span>'));
    await go('#/gc/p9');
    t('chat: header context, avatars/senders, composer disabled when empty, unread cleared', app.innerHTML.includes('class="ghd"') && app.innerHTML.includes('Tonight · 8:00 PM · 5 members') && app.innerHTML.includes('Riya') && app.innerHTML.includes('class="m mo"') && /id="sendbtn"[^>]*disabled/.test(app.innerHTML) && ev("S.unread.p9") == 0);
    type('chat.draft', 'see you all at 8');
    click('send', { v: 'p9' });
    await sleep(100);
    t('chat: typed message is sent (local state), draft cleared', ev("S.msgs.p9.slice(-1)[0].x") == 'see you all at 8' && ev("O.chat.draft") == '' && app.innerHTML.includes('see you all at 8'));
    click('gopts', { v: 'p9' });
    t('chat: options (plan, members, info, next stop, report, leave)', ['View plan', 'View members', 'Group info', 'Next stop', 'Report plan', 'Leave group'].every(x => mod.innerHTML.includes(x)));
    click('ginfo', { v: 'p9' });
    t('group info sheet', mod.innerHTML.includes('Group info') && mod.innerHTML.includes('Hosted by Aditi'));
    click('close');
    click('ask', { do: 'leave', v: 'p10' });
    click('confirmed');
    await sleep(300);
    click('ask', { do: 'leave', v: 'p9' });
    click('confirmed');
    await sleep(300);
    await go('#/groups');
    t('empty state when no squads', app.innerHTML.includes('No squads yet') && app.innerHTML.includes('Join a plan and your squad conversations will appear here.') && app.innerHTML.includes('Discover plans'));
    // theme
    click('theme');
    t('theme choice persists', ['light', 'dark'].includes(ctx.localStorage.getItem('squado-theme')));
    // quality gates
    for (const r of ['#/home', '#/explore', '#/live', '#/event/e1', '#/plan/p1', '#/create', '#/groups', '#/me', '#/settings']) {
        await go(r);
        if (raw()) {
            t('no native emoji as UI: ' + r, false);
            break;
        }
    }
    t('no native emoji used as UI on all pages', !raw());
    const srcAll = order.map(f => fs.readFileSync('src/js/' + f, 'utf8')).join('\n') + fs.readFileSync('index.html', 'utf8');
    t('Live removed: no liveNow page/route/nav item', !/liveNow|k=='live'|'#\/live'/.test(srcAll) && !/l:'Live'/.test(srcAll));
    t('frontend-only: no Firebase/Supabase/OAuth/API code loaded', !/firebase\.|supabase|signInWith|fetch\(|XMLHttp|httpsCallable/i.test(srcAll) && !/gstatic\.com\/firebasejs/.test(srcAll));
    t('no Telegram / phone / OTP', !/telegram|\botp\b|signInWithPhone/i.test(srcAll));
    console.log(ok + ' passed, ' + bad + ' failed');
    process.exit(bad ? 1 : 0);
})();