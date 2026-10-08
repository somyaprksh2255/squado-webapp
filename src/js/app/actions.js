const A = {
    set(e) {
        queueMicrotask(() => O.editing && editSheet());
        const [t, k] = path(e.dataset.k);
        t[k] = e.dataset.v;
        if (e.dataset.k == 'W.size')
            O.W.size = +e.dataset.v;
    },
    osset(e) {
        const [t, k] = path(e.dataset.k);
        t[k] = k == 'size' ? +e.dataset.v : e.dataset.v;
        if (O.os.step > 0 && O.os.step < 4 && !(k == 'move' && t[k] == '✨ Custom'))
            O.os.step++;
    },
    osnext() {
        if (!(O.os.cname || '').trim())
            return toast('Name your thing first');
        O.os.step = 2;
    },
    tog(e) {
        queueMicrotask(() => O.editing && editSheet());
        const [t, k] = path(e.dataset.k);
        const a = t[k], v = e.dataset.v, i = a.indexOf(v);
        i < 0 ? a.push(v) : a.splice(i, 1);
        if (e.dataset.k == 'me.interests')
            save();
    },
    obNext() {
        const o = O.ob;
        if (!obOk())
            return;
        if (o.step == 5) {
            finishOb();
            return;
        }
        o.step++;
        o.an = 1;
    },
    obCancel() {
        S.in = true;
    },
    obPrev() {
        O.ob.step--;
        O.ob.an = 1;
    },
    osn() {
        O.os.step = 1;
    },
    geo() {
        locate(n => {
            if (!S.in) {
                O.ob.city = O.ob.city || (n ? 'Bhopal' : '');
                O.ob.locOk = 1;
            }
        });
    },
    geoOff() {
        S.geo = null;
        S.area = null;
        save();
        toast('Location off');
    },
    geoPick(e) {
        const k = e.dataset.k;
        locate(n => {
            if (!n)
                return;
            const [t, f] = path(k);
            t[f] = n;
            if (k == 'os.loc')
                O.os.step = 4;
        });
    },
    home() {
        toast('Get home safe 🫡');
    },
    post() {
        const w = O.W;
        let miss = !w.type ? 'what we\'re doing' : w.type == 'custom' && !(w.custom || '').trim() ? 'a name for it' : !w.loc ? 'where' : !w.when ? 'when' : !w.size ? 'squad size' : '';
        if (miss)
            return toast('Pick ' + miss + ' first');
        const who = w.who || 'Everyone';
        if (!hostOk(who))
            return toast(who + ' plans need a matching profile gender');
        let when = w.when;
        if (when == 'Custom') {
            const t = (w.time || '21:00').split(':'), H = +t[0];
            when = (H % 12 || 12) + ':' + t[1] + ' ' + (H >= 12 ? 'PM' : 'AM');
        }
        const live = when == 'Now',
            id = 'p' + Date.now(),
            ev = w.event && S.events.find(e => e.id == w.event),
            cr = (w.carry || []).filter(c => !S.blocked.includes(c)).slice(0, w.size - 1);
        S.plans.unshift({
            id,
            creator: 'me',
            type: w.type,
            custom: w.type == 'custom' ? w.custom.trim() : null,
            title: ev ? `Anyone going to ${ev.title}?` : {
                garba: 'Garba gang, assemble',
                pandal: 'Pandal hop, no plans',
                bhandara: 'Anyone wanna go to this Bhandara?',
                food: 'Food run?',
                chai: 'Chai & yap?',
                photo: 'Photo walk, pics first',
                shopping: 'Shopping spree?',
                city: 'City explore',
                outside: 'Still out, still down',
                custom: (w.custom || '').trim()
            }[w.type],
            desc: w.desc.trim() || 'No plans, just vibes.',
            vibe: w.vibe,
            loc: w.loc,
            dist: .5,
            when: live ? 'LIVE NOW' : when,
            live,
            max: w.size,
            members: ['me', ...cr],
            who,
            reqs: [],
            status: 'open',
            day: w.day || 'Today',
            auto: w.mode == 'Auto-accept',
            from: w.from || null,
            event: w.event || null,
            spot: 'Pin goes to the squad in the group chat',
            simAt: Date.now() + 7000,
            created: Date.now()
        });
        S.me.rel.hosted++;
        if (cr.length)
            sys(id, 'Squad carried over from the last stop 🔁');
        O.W = {
            type: '',
            vibe: [],
            loc: '',
            when: '',
            size: 0,
            desc: ''
        };
        save();
        confetti();
        goHash('#/posted/' + id);
    },
    postOut() {
        const o = O.os,
            mv = o.move.replace(/^\S+ /, ''),
            lb = mv == 'Custom' ? o.cname.trim() : mv,
            id = 'p' + Date.now(),
            who = o.who || 'Everyone';
        if (!hostOk(who))
            return toast(who + ' plans need a matching profile gender');
        S.plans.unshift({
            id,
            creator: 'me',
            type: 'outside',
            custom: 'Still out · ' + lb,
            title: {
                Chai: 'Chai & yap?',
                Food: 'Food run?',
                Garba: 'Anyone still dancing?',
                'Pandal Hopping': 'Pandal hop, right now?',
                Walk: 'Walk & talk?',
                Explore: 'Let\'s explore'
            }[mv] || lb,
            desc: o.desc.trim() || 'Friends left. I\'m not done.',
            vibe: ['🫠 No plans, just vibes'],
            loc: o.loc,
            dist: .2,
            when: 'LIVE NOW',
            live: true,
            max: o.size,
            members: ['me'],
            who,
            reqs: [],
            status: 'open',
            spot: 'Pin goes to the squad in the group chat',
            simAt: Date.now() + 7000,
            created: Date.now()
        });
        S.me.rel.hosted++;
        O.os = {
            step: 0,
            move: '',
            size: 0,
            loc: '',
            desc: '',
            cname: ''
        };
        save();
        confetti();
        goHash('#/posted/' + id);
    },
    join(e) {
        const p = pl(e.dataset.v), g = S.me.gender;
        if ((p.who == 'Girls only' && g != 'Girl') || (p.who == 'Boys only' && g != 'Boy'))
            return toast('This one\'s ' + p.who.toLowerCase() + ' 🫶');
        modal(`\<h2 style="margin-top:0">Ask to join the squad 👀\</h2>\<p>\<b>${esc(p.title)}\</b>\<br>\<span class="mut">${esc(p.loc)} · ${p.live ? 'Live now' : p.when} · ${p.members.length} / ${p.max} people${p.who != 'Everyone' ? ' · ' + p.who : ''}\</span>\</p>\<p class="mut">${esc(usr(p.creator).name)} checks your profile, then accepts or passes.\</p>\<button class="btn pink wide" data-a="cjoin" data-v="${p.id}">Send request\</button>\<p style="text-align:center">\<button class="btn ghost sm" data-a="close">Nvm\</button>\</p>`);
    },
    cjoin(e) {
        const p = pl(e.dataset.v);
        if (p.auto && p.members.length < p.max && !p.members.includes('me')) {
            p.members.push('me');
            S.me.rel.joined++;
            sys(p.id, `${S.me.name} joined the squad 👋`);
            save();
            confetti();
            return modal(`\<div class="authst">\<span class="okc">${I('check', '26px')}\</span>\<h2>You're in 🎉\</h2>\<p class="mut">This host auto-accepts. The GC is unlocked.\</p>\</div>\<a class="btn pink wide" href="#/gc/${p.id}" data-a="close">Enter the GC\</a>`);
        }
        if (!p.reqs.some(r => r.u == 'me') && !p.members.includes('me')) {
            p.reqs.push({
                u: 'me',
                at: Date.now()
            });
            if (p.creator != 'me') {
                S.notifs.unshift({
                    id: `join-${p.id}-me-${Date.now()}`,
                    type: 'join_request',
                    ic: 'user-plus',
                    c: 'pink',
                    t: `${S.me.name} wants to join your squad`,
                    b: `${p.title} · tap to review`,
                    w: 'now',
                    u: 1,
                    h: '',
                    planId: p.id,
                    userId: 'me'
                });
            }
            save();
            modal(`\<h2 style="margin-top:0">Request sent ⏳\</h2>\<p class="mut">You're not in yet. The host decides after seeing your profile.\</p>\<button class="btn pink wide" data-a="close">Cool\</button>`);
        }
    },
    unreq(e) {
        const p = pl(e.dataset.v);
        p.reqs = p.reqs.filter(r => r.u != 'me');
        save();
    },
    accept(e) {
        const parts = (e.dataset.v || '').split('|');
        const p = pl(e.dataset.k || parts[0]);
        const u = e.dataset.k ? e.dataset.v : parts[1];
        if (!p || !u)
            return toast('This join request is no longer available.');
        p.reqs = p.reqs.filter(r => r.u != u);
        if (p.members.length < p.max) {
            p.members.push(u);
            if (usr(u).rel)
                usr(u).rel.joined++;
            sys(p.id, `${usr(u).name} joined the squad 👋`);
            S.notifs.unshift({
                id: 'n' + Date.now(),
                type: 'join-approved',
                u,
                plan: p.id,
                at: Date.now(),
                read: false
            });
            if (p.members.length >= p.max) {
                sys(p.id, 'Squad full 🔥');
                confetti();
            }
            toast(usr(u).name + ' is in 🫡');
        }
        else {
            toast('Squad full 🔥');
        }
        save();
        modal('');
        render();
    },
    reject(e) {
        const parts = (e.dataset.v || '').split('|');
        const p = pl(e.dataset.k || parts[0]);
        const u = e.dataset.k ? e.dataset.v : parts[1];
        if (!p || !u)
            return toast('This join request is no longer available.');
        p.reqs = p.reqs.filter(r => r.u != u);
        S.notifs.unshift({
            id: 'n' + Date.now(),
            type: 'join-rejected',
            u,
            plan: p.id,
            at: Date.now(),
            read: false
        });
        save();
        modal('');
        toast('Passed 🫶');
        render();
    },
    going(e) {
        const ev = S.events.find(x => x.id == e.dataset.v), i = ev.going.indexOf('me');
        if (i < 0) {
            ev.going.push('me');
            confetti();
        }
        else {
            ev.going.splice(i, 1);
        }
        save();
    },
    evPlan(e) {
        const ev = S.events.find(x => x.id == e.dataset.v);
        O.W = {
            type: ev.tag,
            vibe: [],
            loc: ev.loc,
            when: '',
            size: 0,
            desc: `Anyone going to ${ev.title} tonight?`,
            event: ev.id
        };
        modal('');
        goHash('#/create');
    },
    drop(e) {
        O.W.carry = O.W.carry.filter(c => c != e.dataset.v);
    },
    nextSheet(e) {
        const id = e.dataset.v;
        modal(`\<h2 style="margin-top:0">Next stop ➜\</h2>\<p class="mut">Keep the squad together. What's next?\</p>\<div class="opt">${['garba', 'chai', 'food', 'pandal', 'city', 'photo', 'bhandara', 'custom'].map(k => `\<button class="chip" data-a="nextGo" data-k="${id}" data-v="${k}">${T[k][0]} ${T[k][1]}\</button>`).join('')}\</div>`);
    },
    nextGo(e) {
        const p = pl(e.dataset.k), ty = e.dataset.v;
        O.W = {
            type: ty,
            vibe: [],
            loc: p.loc,
            when: 'Now',
            size: p.max,
            desc: '',
            carry: p.members.filter(m => m != 'me'),
            from: p.id
        };
        sys(p.id, `Next stop: ${T[ty][1]}`);
        save();
        modal('');
        goHash('#/create');
    },
    remove(e) {
        const p = pl(e.dataset.k), m = e.dataset.v;
        p.members = p.members.filter(x => x != m);
        sys(p.id, `${usr(m).name} was removed by the host`);
        save();
        modal('');
        toast('Removed');
    },
    cancel(e) {
        const p = pl(e.dataset.v);
        p.status = 'cancelled';
        S.me.rel.cancel++;
        sys(p.id, 'Plan cancelled by the host');
        save();
        modal('');
        toast('Plan cancelled');
        goHash('#/groups');
    },
    end(e) {
        const p = pl(e.dataset.v);
        p.status = 'ended';
        p.members.forEach(m => {
            const u = usr(m);
            if (u.rel)
                u.rel.completed++;
        });
        sys(p.id, 'Plan wrapped ✅');
        save();
        confetti();
        p.members.length > 1 ? fbSheet(p.id) : modal('');
    },
    fbOpen(e) {
        fbSheet(e.dataset.v);
    },
    fbTog(e) {
        const [id, m] = e.dataset.k.split('|'),
            x = O.fb[m] = O.fb[m] || { t: [], a: '' },
            v = e.dataset.v,
            i = x.t.indexOf(v);
        i < 0 ? x.t.push(v) : x.t.splice(i, 1);
        fbSheet(id);
    },
    fbAgain(e) {
        const [id, m] = e.dataset.k.split('|'),
            x = O.fb[m] = O.fb[m] || { t: [], a: '' };
        x.a = x.a == e.dataset.v ? '' : e.dataset.v;
        fbSheet(id);
    },
    fbSend(e) {
        const p = pl(e.dataset.v);
        Object.entries(O.fb).forEach(([m, x]) => {
            const u = usr(m);
            if (!u.fb || (!x.t.length && !x.a))
                return;
            u.fb.n++;
            x.t.forEach(t => u.fb.tags[t] = (u.fb.tags[t] || 0) + 1);
            if (x.a) {
                u.fb.again[1]++;
                if (x.a == 'Yes')
                    u.fb.again[0]++;
            }
        });
        p.fbDone = true;
        O.fb = {};
        save();
        modal('');
        toast('Thanks 🫶 Anonymous, totals only');
    },
    noshow(e) {
        const u = usr(e.dataset.v);
        if (u.rel)
            u.rel.noshow++;
        save();
        toast('Noted. Reliability only changes after a few plans.');
    },
    edit() {
        const m = S.me;
        O.ed = {
            name: m.name,
            username: m.username,
            bio: m.bio || '',
            gender: m.gender,
            city: m.city,
            age: m.ageRange || '',
            photo: m.photo || '',
            interests: [...m.interests]
        };
        editSheet();
    },
    saveEd() {
        const e = O.ed, u = (e.username || '').toLowerCase();
        if (!e.name.trim())
            return toast('Name can\'t be empty');
        if (unOk(u, S.me.username) != 'ok')
            return toast('Pick a free username');
        Object.assign(S.me, {
            name: e.name.trim(),
            username: u,
            bio: e.bio.trim(),
            gender: e.gender,
            ageRange: e.age,
            city: e.city,
            photo: e.photo,
            interests: e.interests
        });
        save();
        modal('');
        toast('Profile updated ✨');
    },
    close() {
        const m = document.querySelector('#modal');
        if (m && m._cameraStream) {
            m._cameraStream.getTracks().forEach(track => track.stop());
            m._cameraStream = null;
        }
        modal('');
    },
    attachments(e) {
        modal(mediaSheet(e.dataset.v));
    },
    send(id) {
        const i = $('#mi'),
            x = (i && i.value || O.chat.draft || '').trim();
        if (!x)
            return;
        O.chat.draft = '';
        msgs(id).push({
            by: 'me',
            x,
            t: hm()
        });
        save();
        render();
        scrollTo(0, 1e6);
        const mi = $('#mi');
        mi && mi.focus();
        const o = pl(id).members.filter(m => m != 'me' && !S.blocked.includes(m));
        if (o.length)
            setTimeout(() => {
                const by = o[Math.random() * o.length | 0];
                msgs(id).push({
                    by,
                    x: ['I\'m down 🕺', 'omw 😭', 'Where exactly?', 'Full send 🔥', 'Save me a spot!'][Math.random() * 5 | 0],
                    t: hm()
                });
                save();
                if (location.hash == '#/gc/' + id) {
                    render();
                    scrollTo(0, 1e6);
                }
                else {
                    S.unread[id] = (S.unread[id] || 0) + 1;
                    save();
                    render();
                }
            }, 1300);
    },
    sendMedia(e) {
        const id = e.dataset.k;
        const type = e.dataset.type;
        const src = e.dataset.src;
        const loc = e.dataset.loc ? JSON.parse(decodeURIComponent(e.dataset.loc)) : null;
        if (!id || (type != 'location' && !src))
            return;
        const message = {
            by: 'me',
            type,
            t: hm()
        };
        if (src)
            message.src = src;
        if (loc)
            message.loc = loc;
        msgs(id).push(message);
        save();
        modal('');
        render();
        scrollTo(0, 1e6);
    },
    react(e) {
        const m = msgs(e.dataset.k)[+e.dataset.v],
            c = ['🔥', '🕺', '😭', ''],
            i = c.indexOf(m.r || '');
        m.r = c[(i + 1) % 4];
        save();
        render();
    },
    loc(e) {
        const p = pl(e.dataset.v);
        msgs(e.dataset.v).push({
            sys: 1,
            x: `${S.me.name} shared the meetup location 📍 (${p.loc} gate, exact pin soon)`
        });
        save();
        render();
    },
    img(e) {
        msgs(e.dataset.v).push({
            sys: 1,
            x: `${S.me.name} shared a photo 📷 (preview coming soon)`
        });
        save();
        render();
    },
    members(e) {
        const p = pl(e.dataset.v), h = p.creator == 'me';
        modal(`\<h2 style="margin-top:0">The squad ${p.members.length} / ${p.max}\</h2>${p.members.map(m => `\<div class="li">${av(m, 36)}\<b style="flex:1">${esc(usr(m).name)}${m == p.creator ? ' 👑' : ''}\</b>${m != 'me' ? `\<button class="btn ghost sm" data-a="user" data-v="${m}">View\</button>` : ''}${h && m != 'me' ? `\<button class="btn ghost sm" data-a="ask" data-do="remove" data-k="${p.id}" data-v="${m}">${I('user-minus')} Remove\</button>` : ''}\</div>`).join('')}${h && p.reqs.length ? `\<h3>Pending requests\</h3>${p.reqs.map(r => `\<div class="li">${av(r.u, 36)}\<b style="flex:1">${esc(usr(r.u).name)}\</b>\<button class="btn ghost sm" data-a="user" data-v="${r.u}">Profile\</button>\<button class="btn ghost sm" data-a="reject" data-k="${p.id}" data-v="${r.u}">Reject\</button>\<button class="btn pink sm" data-a="accept" data-k="${p.id}" data-v="${r.u}">Approve\</button>\</div>`).join('')}` : ''}\<div class="row">${h ? '' : `\<button class="btn ghost sm" data-a="ask" data-do="leave" data-v="${p.id}">${I('log-out')} Leave squad\</button>`}\<button class="btn ghost sm" data-a="report" data-k="plan" data-v="${p.id}">${I('flag')} Report plan\</button>${h && p.status == 'open' ? `\<button class="btn sm" data-a="end" data-v="${p.id}">Wrap it up ✅\</button>\<button class="btn ghost sm" data-a="ask" data-do="cancel" data-v="${p.id}">${I('circle-x')} Cancel plan\</button>` : ''}\</div>`);
    },
    leave(e) {
        const p = pl(e.dataset.v);
        if (p.status == 'open')
            S.me.rel.cancel++;
        p.members = p.members.filter(m => m != 'me');
        sys(p.id, `${S.me.name} left. Bro escaped 💀`);
        save();
        modal('');
        toast('You escaped successfully 💀');
        goHash('#/groups');
    },
    user(e) {
        const id = e.dataset.v,
            u = usr(id),
            r = u.rel || {
                hosted: 0,
                joined: 0,
                completed: 0
            };
        modal(`\<div class="row">${av(id, 64)}\<div>\<h2 style="margin:0">${esc(u.name)}\</h2>\<span class="mut">@${esc(u.username || '')} · ${esc(u.gender || '')} · 📍 ${esc(u.city)}\</span>\</div>\</div>\<p style="margin:12px 0">${esc(u.bio || 'No bio yet.')}\</p>\<p>${(u.interests || []).map(lbl).join(' · ')}\</p>\<div class="row">${trust(u)}\</div>\<p class="mut" style="margin:8px 0">Hosted ${r.hosted} · Joined ${r.joined} · Completed ${r.completed}\</p>\<h3>Squad feedback\</h3>${fbs(u)}${id != 'me' ? `\<div class="row" style="margin-top:12px">\<button class="btn ghost sm" data-a="report" data-k="user" data-v="${id}">${I('flag')} Report user\</button>\<button class="btn ghost sm" data-a="ask" data-do="block" data-v="${id}">${I('ban')} Block\</button>\</div>` : ''}`);
    },
    block(e) {
        const id = e.dataset.v;
        if (!S.blocked.includes(id))
            S.blocked.push(id);
        save();
        modal('');
        toast(usr(id).name + ' blocked');
        render();
    },
    unblock(e) {
        S.blocked = S.blocked.filter(b => b != e.dataset.v);
        save();
        render();
    },
    report(e) {
        O.rep = {
            k: e.dataset.k,
            id: e.dataset.v
        };
        modal(`\<h2 style="margin-top:0">Report ${e.dataset.k}\</h2>${['Fake or spam', 'Made me uncomfortable', 'Inappropriate', 'Unsafe plan or place', 'Underage or lying about age', 'Something else'].map((r, i) => `\<label class="r">\<input type="radio" name="rr" value="${r}" ${i ? '' : 'checked'}>${r}\</label>`).join('')}\<button class="btn pink wide" data-a="submitRep">Send report\</button>`);
    },
    submitRep() {
        const r = document.querySelector('input[name=rr]:checked').value,
            x = O.rep;
        S.reports.push({
            ...x,
            r,
            at: Date.now()
        });
        if (x.k == 'plan')
            pl(x.id).review = true;
        save();
        modal('');
        toast('Report sent. We\'ll take a look.');
        render();
    },
    notif() {
        S.notif = !S.notif;
        save();
    },
    theme() {
        const d = document.documentElement,
            t = d.dataset.theme == 'dark' ? 'light' : 'dark';
        d.dataset.theme = t;
        try {
            localStorage.setItem('squado-theme', t);
        }
        catch (e) { }
    },
    logout() {
        signOutUser();
    },
    reset() {
        ['squado-v5', 'squado-mock-profile', 'squado-theme'].forEach(k => localStorage.removeItem(k));
        location.hash = '';
        location.reload();
    }
};
/* ---- frontend-only extensions (confirmations, notifications, loading states) ---- */
A.ask = e => {
    O.confirm = {
        do: e.dataset.do,
        k: e.dataset.k,
        v: e.dataset.v
    };
    confirmSheet();
};
A.confirmed = () => {
    const c = O.confirm;
    modal('');
    setTimeout(() => A[c.do]({
        dataset: {
            k: c.k,
            v: c.v
        }
    }), 120);
};
A.notifs = () => {
    modal(notifSheet());
    S.notifs.forEach(n => n.u = 0);
    save();
};
{
    const _c = A.cjoin;
    A.cjoin = e => {
        modal(`\<div class="authst">\<span class="spin">\</span>\<h2>Sending your request…\</h2>\<p class="mut">Letting the host know\</p>\</div>`);
        setTimeout(() => _c(e), 700);
    };
}
{
    const _p = A.post;
    A.post = e => {
        if (O.posting)
            return;
        const m = postMissing();
        if (m)
            return toast('Pick ' + m + ' first');
        O.posting = true;
        render();
        setTimeout(() => {
            O.posting = false;
            _p(e);
        }, 650);
    };
}
A.gopts = e => modal(groupOptions(e.dataset.v));
A.ginfo = e => modal(groupInfo(e.dataset.v));
A.goPlan = e => {
    modal('');
    goHash('#/plan/' + e.dataset.v);
};
A.reviewRequest = e => reviewRequest(e);
A.openMediaCamera = e => openMediaCamera(e);
A.mediaGallery = e => mediaGallery(e);
A.capturePhoto = e => capturePhoto(e);
A.mediaRetry = e => mediaRetry(e);
A.attachLocation = e => attachLocation(e);
A.openMediaLocation = e => openMediaLocation(e);