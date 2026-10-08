document.addEventListener('click', e => {
    const b = e.target.closest('[data-a]');
    if (!b)
        return;
    const a = b.dataset.a;
    if (a == 'close' && b.tagName == 'A') {
        modal('');
        return;
    }
    if (A[a]) {
        A[a](b.dataset.a == 'send' ? b.dataset.v : b);
        if (
            ![
                'send',
                'join',
                'report',
                'members',
                'user',
                'close',
                'submitRep',
                'leave',
                'cjoin',
                'block',
                'postOut',
                'post',
                'login',
                'img',
                'loc',
                'react',
                'home',
                'attachments',
                'sendMedia',
                'reviewRequest'
            ].includes(a) ||
            ['react', 'img', 'loc', 'block', 'unblock'].includes(a) && 0
        )
            render();
        if (['home'].includes(a))
            return;
    }
});
document.addEventListener('input', e => {
    const el = e.target,
        k = el.dataset.in;
    if (!k)
        return;
    const [t, f] = path(k);
    if (f == 'username')
        el.value = el.value.toLowerCase().replace(/[^a-z0-9_]/g, '');
    t[f] = el.value;
    if (k == 'chat.draft') {
        const sb = document.querySelector('#sendbtn');
        if (sb)
            sb.disabled = !el.value.trim();
    }
    if (k == 'ui.q') {
        render();
        const i = document.querySelector('[data-in="ui.q"]');
        if (i) {
            i.focus();
            try {
                i.setSelectionRange(99, 99);
            }
            catch (x) { }
        }
    }
    if (f == 'username') {
        const u = $('#un');
        if (u)
            u.textContent = unMsg(
                el.value,
                k == 'ed.username' ? S.me.username : ''
            );
    }
    const b = document.querySelector('[data-a=obNext]');
    if (b && k.startsWith('ob.'))
        b.disabled = !obOk();
});
document.addEventListener('change', e => {
    const i = e.target;
    if (i.dataset.photo && i.files[0])
        photo(i.files[0], u => {
            if (i.dataset.photo == 'ob') {
                O.ob.photo = u;
                render();
            }
            else {
                O.ed.photo = u;
                editSheet();
            }
        });
});