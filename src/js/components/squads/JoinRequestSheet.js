function joinRequestSheet(planId, userId) {
    const p = S.plans.find(x => x.id == planId);
    const u = S.users.find(x => x.id == userId);
    if (!p || !u)
        return toast('This join request is no longer available.');
    return `
        <h2 style="margin-top:0">
            Join request
        </h2>
        <div class="card" style="display:flex;align-items:center;gap:12px">
            ${av(u, '48px')}
            <div style="flex:1;min-width:0">
                <b>${esc(u.name)}</b>
                <p class="mut" style="margin:3px 0 0">
                    wants to join <b>${esc(p.title)}</b>
                </p>
            </div>
        </div>
        <div class="card" style="margin-top:12px">
            <b>${esc(p.title)}</b>
            ${
                p.area
                    ? `<p class="mut" style="margin:5px 0 0">📍 ${esc(p.area)}</p>`
                    : ''
            }
            ${
                p.when
                    ? `<p class="mut" style="margin:5px 0 0">🕒 ${esc(p.when)}</p>`
                    : ''
            }
        </div>
        <div
            style="
                display:grid;
                grid-template-columns:1fr 1fr;
                gap:8px;
                margin-top:14px
            "
        >
            <button
                class="btn ghost"
                data-a="user"
                data-v="${u.id}"
            >
                Profile
            </button>
            <button
                class="btn ghost"
                data-a="reject"
                data-v="${p.id}|${u.id}"
            >
                Reject
            </button>
        </div>
        <button
            class="btn pink"
            style="width:100%;margin-top:8px"
            data-a="accept"
            data-v="${p.id}|${u.id}"
        >
            Approve
        </button>
    `;
}
function reviewRequest(e) {
    const planId = e.dataset.k;
    const userId = e.dataset.v;
    modal(joinRequestSheet(planId, userId));
}