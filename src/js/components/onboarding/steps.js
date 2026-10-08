/* One renderer per onboarding step */

const onbStep0 = o =>
    `<h1>What should we call you?</h1>
    <input
        type="text"
        data-in="ob.name"
        value="${esc(o.name)}"
        maxlength="24"
        placeholder="Somya"
        aria-label="Name"
    >`;

const onbStep1 = o =>
    `<h1>Pick a username</h1>
    <input
        type="text"
        data-in="ob.username"
        value="${esc(o.username)}"
        maxlength="20"
        placeholder="@somya"
        autocapitalize="none"
        aria-label="Username"
    >
    <small id="un" class="mut">
        ${unMsg(o.username, '')}
    </small>`;

const onbStep2 = o =>
    `<h1>Where are you usually hanging out?</h1>
    <p>
        <button
            class="btn pink"
            data-a="geo"
        >
            📍 Use my location
        </button>
    </p>

    ${
        o.locOk && o.city
            ? `<p class="mut">
                Got it · ${esc(o.city)}. Only your rough area is used.
            </p>`
            : ''
    }

    <p
        class="mut"
        style="margin-top:14px"
    >
        Or choose city manually
    </p>

    ${chips(
        CITIES,
        'ob.city',
        o.city
    )}`;

const onbStep3 = o =>
    `<h1>What's your gender?</h1>
    ${chips(
        [
            'Girl',
            'Boy',
            'Other',
            'Prefer not to say'
        ],
        'ob.gender',
        o.gender
    )}

    <p
        class="mut"
        style="margin-top:8px"
    >
        Used for Girls only / Boys only plans. Not shown publicly.
    </p>`;

const onbStep4 = o =>
    `<h1>What's your age group?</h1>
    ${chips(
        AGES,
        'ob.age',
        o.age
    )}

    <p
        class="mut"
        style="margin-top:8px"
    >
        Squado is 18+ because people meet in person.
    </p>`;

const onbStep5 = o =>
    `<h1>What are you into? 👀</h1>
    ${chips(
        INT,
        'ob.interests',
        o.interests,
        1
    )}`;

const ONB_STEPS = [
    onbStep0,
    onbStep1,
    onbStep2,
    onbStep3,
    onbStep4,
    onbStep5
];