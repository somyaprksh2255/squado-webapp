let lastR = '';
const GATED = ['create', 'outside', 'groups', 'me', 'settings', 'gc', 'posted'];
function guard() {
    if (window.AUTH && AUTH.state == 'loading')
        return;
    const r = (location.hash.replace(/^#\/?/, '') || '').split('/')[0];
    if (S.in && S.me.guest && GATED.includes(r)) {
        S.intent = { hash: location.hash };
        try {
            sessionStorage.setItem('pu-intent', JSON.stringify(S.intent));
        }
        catch (e) { }
        history.replaceState(null, '', location.pathname + location.search + '#/home');
        setTimeout(() => {
            window.track && (r == 'create' || r == 'outside') && track('create_plan_click');
            authGate(r == 'create' || r == 'outside' ? 'Ready to make a plan?' : 'Sign in to continue');
        });
    }
}
function authView() {
    return AUTH.error ? `\<main style="max-width:520px;text-align:center">\<div class="empty">\<h3>Couldn't load your profile\</h3>\<p class="mut">Check your connection and try again. Your account is safe.\</p>\<button class="btn pink" data-a="authRetry">Try again\</button> \<button class="btn ghost" data-a="logout">Log out\</button>\</div>\</main>` : `\<main style="max-width:520px;text-align:center">${loader('Checking your session...')}\</main>`;
}
function render() {
    if (window.AUTH && (AUTH.state == 'loading' || AUTH.resolving || AUTH.error)) {
        $('#app').innerHTML = UI(authView());
        return;
    }
    guard();
    const [r, a] = (location.hash.replace(/^#\/?/, '') || '').split('/');
    let h = '', n = true, k = r;
    const oldChat = document.querySelector('.gmsgs');
    const oldChatAtBottom = oldChat
        ? oldChat.scrollHeight - oldChat.scrollTop - oldChat.clientHeight < 40
        : true;
    if (!S.in) {
        n = false;
        h = signup();
    }
    else {
        if (!r || r == 'signup' || r == 'login')
            k = 'home';
        if (k == 'home') {
            if (!O.loaded.home)
                setTimeout(() => { O.loaded.home = 1; render(); }, 700);
            h = home();
        }
        else if (k == 'explore') {
            if (!O.loaded.ex)
                setTimeout(() => { O.loaded.ex = 1; render(); }, 700);
            h = explore();
        }
        else if (k == 'create')
            h = create();
        else if (k == 'outside') {
            h = outside();
            n = false;
        }
        else if (k == 'posted')
            h = posted(a);
        else if (k == 'event')
            h = eventPage(a);
        else if (k == 'plan')
            h = detail(a);
        else if (k == 'gc') {
            S.unread[a] = 0;
            h = groupsPage(a);
        }
        else if (k == 'groups')
            h = groupsPage();
        else if (k == 'me')
            h = profile();
        else if (k == 'settings')
            h = settings();
        else
            h = home();
    }
    const y = scrollY, chg = lastR != location.hash;
    try {
        document.body.classList && document.body.classList.toggle('in-chat', k == 'gc');
    }
    catch (e) { }
    $('#app').innerHTML = UI(appLayout(n ? navh(k) : '', chg ? h.replace('\<main', '\<main data-pg') : h));
    if (lastR == location.hash)
        scrollTo(0, y);
    else
        scrollTo(0, k == 'gc' ? 1e6 : 0);
    lastR = location.hash;
    if (k == 'gc') {
        const m = $('#mi');
        if (m)
            m.addEventListener('keydown', e => { if (e.key == 'Enter')
                A.send(a); });
        const list = document.querySelector('.gmsgs');
        if (list && (chg || oldChatAtBottom))
            list.scrollTop = list.scrollHeight;
    }
}