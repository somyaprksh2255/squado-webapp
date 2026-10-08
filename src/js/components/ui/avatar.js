const av = (
    id,
    z = 36
) => {
    const u = usr(id);
    const i = id == 'me' ? 0 : +id.slice(1);
    const c = AVC[i % 5];

    return u.photo
        ? `<img
            class="av"
            alt="${esc(u.name)}"
            src="${u.photo}"
            style="width:${z}px;height:${z}px;object-fit:cover"
        >`
        : `<span
            class="av"
            title="${esc(u.name)}"
            style="width:${z}px;height:${z}px;background:${c};color:${c == '#C6F432' ? '#17131F' : '#fff'};font-size:${z * .42}px"
        >
            ${esc((u.name || '?')[0])}
        </span>`;
};