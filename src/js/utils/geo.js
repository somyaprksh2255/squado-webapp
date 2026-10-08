const LC = {
    'Near DB Mall': [23.2335, 77.433],
    'MP Nagar': [23.235, 77.434],
    'Old City': [23.2599, 77.401],
    'Near Jehan Numa': [23.209, 77.429],
    'Bittan Market': [23.216, 77.435],
    '10 No. Market': [23.237, 77.429],
    'Shahpura Lake': [23.198, 77.435],
    'New Market': [23.233, 77.401],
    'Arera Colony': [23.215, 77.434]
};

const hv = (a, b) => {
    const r = Math.PI / 180;
    const x = (b[0] - a[0]) * r;
    const y = (b[1] - a[1]) * r;

    const q =
        Math.sin(x / 2) ** 2 +
        Math.cos(a[0] * r) *
        Math.cos(b[0] * r) *
        Math.sin(y / 2) ** 2;

    return 12742 * Math.asin(Math.sqrt(q));
};

const d = p =>
    S.geo && LC[p.loc]
        ? Math.max(
              .1,
              Math.round(hv(S.geo, LC[p.loc]) * 10) / 10
          )
        : p.dist;

const near = () => {
    let b = null;
    let m = 1e9;

    for (const k in LC) {
        const x = hv(S.geo, LC[k]);

        if (x < m) {
            m = x;
            b = k;
        }
    }

    return m < 40 ? b : null;
};

function locate(cb) {
    if (!navigator.geolocation)
        return toast('Location isn\'t available here. Pick an area.');

    toast('Finding you... 📍');

    navigator.geolocation.getCurrentPosition(
        p => {
            S.geo = [
                Math.round(p.coords.latitude * 100) / 100,
                Math.round(p.coords.longitude * 100) / 100
            ];

            const n = near();

            S.area = n;
            save();

            toast(
                n
                    ? 'Location on. Showing plans near you 📍'
                    : 'You seem far from the listed areas. Pick one manually.'
            );

            cb && cb(n);
            render();
        },
        e =>
            toast(
                e.code == 1
                    ? 'Location blocked. Allow it in your browser, or pick an area.'
                    : 'Couldn\'t get location. Pick an area instead.'
            ),
        {
            timeout: 10000,
            maximumAge: 6e5
        }
    );
}

const geoBar = () =>
    S.geo
        ? `<p class="mut" style="margin:12px 0">📍 Plans sorted near ${esc(S.area || 'you')} · rough area only <button class="chip" style="padding:2px 10px" data-a="geoOff">Turn off</button></p>`
        : `<div class="card" style="margin:14px 0"><b>Want plans near you?</b><p class="mut" style="margin:4px 0 10px">We only use your rough area (about 1 km). Nobody else ever sees it.</p><button class="btn sm pink" data-a="geo">📍 Use my location</button></div>`;