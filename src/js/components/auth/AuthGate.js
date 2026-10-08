/* Frontend-only auth UI: prompt, loading, success (no real OAuth) */

function authGate(t) {
    modal(
        `<h2 style="margin-top:0">
            ${t || 'Want to join the squad?'}
        </h2>

        <p class="mut">
            One tap. No passwords.
        </p>

        <button
            class="btn wide gbtn"
            data-a="gGoogle"
        >
            <img
                src="assets/google-g.svg"
                alt=""
                width="18"
                height="18"
            >
            Continue with Google
        </button>

        <p
            class="mut"
            style="font-size:.8rem;margin-top:10px"
        >
            Prototype: first time you set up your profile, after that it's one tap.
        </p>

        <p style="text-align:center">
            <button
                class="btn ghost sm"
                data-a="close"
            >
                Not now
            </button>
        </p>`
    );
}

const authLoading = () =>
    `<div class="authst">
        <span class="spin"></span>

        <h2>
            Signing in with Google…
        </h2>

        <p class="mut">
            Just a sec
        </p>
    </div>`;

const authSuccess = pr =>
    `<div class="authst">
        <span class="okc">
            ${I('check', '26px')}
        </span>

        <h2>
            ${
                pr
                    ? 'Welcome back, ' + esc(pr.name)
                    : 'You\'re signed in'
            }
        </h2>

        <p class="mut">
            ${
                pr
                    ? 'Taking you in…'
                    : 'Let\'s set up your profile'
            }
        </p>
    </div>`;