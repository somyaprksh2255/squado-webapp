function profile() {
    const m = S.me;
    const mine = S.plans.filter(p => p.creator == 'me').length;
    const j = S.plans.filter(p => p.members.includes('me')).length;

    return `
        <main style="max-width:640px">
            <div class="row">
                ${av('me', 72)}

                <div>
                    <h1 style="margin:0">
                        ${esc(m.name)}
                    </h1>

                    <span class="mut">
                        @${esc(m.username)} · ${esc(m.gender)} · 📍 ${esc(m.city)}
                    </span>

                    <br>

                    ${trust(m)}
                </div>
            </div>

            <p style="margin:12px 0">
                ${esc(m.bio || 'No bio yet.')}
            </p>

            <div class="row">
                <button class="btn sm" data-a="edit">
                    Edit profile
                </button>

                <a class="btn ghost sm" href="#/settings">
                    Settings
                </a>
            </div>

            <div class="row" style="margin:18px 0">
                <div class="card" style="flex:1">
                    <b style="font-size:2rem">${j}</b>
                    <br>
                    plans joined
                </div>

                <div class="card" style="flex:1">
                    <b style="font-size:2rem">${mine}</b>
                    <br>
                    plans created
                </div>
            </div>

            <h2>Into</h2>

            ${m.interests.length
                ? ''
                : '<p class="mut">Add a few for plans and pings that match you 👀</p>'}

            ${chips(INT, 'me.interests', m.interests, 1)}

            <h2>Squad feedback</h2>

            ${fbs(m)}

            <p class="mut">
                Hosted ${m.rel.hosted} · Joined ${m.rel.joined} · Completed ${m.rel.completed}
            </p>
        </main>
    `;
}