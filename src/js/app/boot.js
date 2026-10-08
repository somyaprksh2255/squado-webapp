try {
    const th = localStorage.getItem('squado-theme');
    if (th)
        document.documentElement.dataset.theme = th;
}
catch (e) { }
addEventListener('hashchange', () => { modal(''); render(); });
setInterval(() => { if (S.in && S.me)
    tick(); }, 2000);
render();
