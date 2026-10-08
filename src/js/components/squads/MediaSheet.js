function mediaSheet(id) {
    return `
        <h2 style="margin-top:0">
            Share something
        </h2>
        <div
            style="
                display:grid;
                grid-template-columns:repeat(3,1fr);
                gap:10px;
                margin-top:16px
            "
        >
            <button
                class="card"
                style="border:0;cursor:pointer;text-align:center"
                data-a="openMediaCamera"
                data-v="${id}"
            >
                <span style="font-size:28px">📷</span>
                <br>
                <b>Camera</b>
            </button>
            <button
                class="card"
                style="border:0;cursor:pointer;text-align:center"
                data-a="mediaGallery"
                data-v="${id}"
            >
                <span style="font-size:28px">🖼️</span>
                <br>
                <b>Gallery</b>
            </button>
            <button
                class="card"
                style="border:0;cursor:pointer;text-align:center"
                data-a="openMediaLocation"
                data-v="${id}"
            >
                <span style="font-size:28px">📍</span>
                <br>
                <b>Location</b>
            </button>
        </div>
        <button
            class="btn ghost"
            style="width:100%;margin-top:14px"
            data-a="close"
        >
            Cancel
        </button>
    `;
}
function mediaGallery(e) {
    const id = e.dataset.v;
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = () => {
        if (!input.files[0])
            return;
        mediaPhoto(input.files[0], src => {
            mediaPreview(id, src, null);
        });
    };
    input.click();
}
function openMediaCamera(e) {
    const id = e.dataset.v;
    mediaCameraStream(id);
}
function mediaCameraStream(id) {
    mediaCamera(stream => {
        const video = document.createElement('video');
        video.autoplay = true;
        video.playsInline = true;
        video.srcObject = stream;
        modal(`
            <h2 style="margin-top:0">
                Take a photo
            </h2>
            <div
                style="
                    width:100%;
                    aspect-ratio:4/3;
                    background:#000;
                    border-radius:16px;
                    overflow:hidden;
                "
            >
                ${video.outerHTML}
            </div>
            <button
                class="btn pink"
                style="width:100%;margin-top:14px"
                data-a="capturePhoto"
                data-v="${id}"
            >
                Take photo
            </button>
            <button
                class="btn ghost"
                style="width:100%;margin-top:8px"
                data-a="close"
            >
                Cancel
            </button>
        `);
        const renderedVideo = document.querySelector('#modal video');
        if (renderedVideo)
            renderedVideo.srcObject = stream;
        const modalEl = document.querySelector('#modal');
        if (modalEl)
            modalEl._cameraStream = stream;
    });
}
function capturePhoto(e) {
    const id = e.dataset.v;
    const modalEl = document.querySelector('#modal');
    const video = modalEl && modalEl.querySelector('video');
    const stream = modalEl && modalEl._cameraStream;
    if (!video)
        return toast('Camera preview isn\'t available.');
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth || 1280;
    canvas.height = video.videoHeight || 720;
    canvas
        .getContext('2d')
        .drawImage(video, 0, 0, canvas.width, canvas.height);
    if (stream)
        stream.getTracks().forEach(track => track.stop());
    const src = canvas.toDataURL('image/jpeg', .85);
    mediaPreview(id, src, null);
}
function mediaPreview(id, src, loc) {
    const encodedLoc = loc
        ? encodeURIComponent(JSON.stringify(loc))
        : '';
    modal(`
        <h2 style="margin-top:0">
            Preview
        </h2>
        <div
            style="
                width:100%;
                aspect-ratio:4/3;
                background:#000;
                border-radius:16px;
                overflow:hidden;
            "
        >
            <img
                src="${esc(src)}"
                style="width:100%;height:100%;object-fit:contain"
                alt="Photo preview"
            >
        </div>
        <div
            style="
                display:flex;
                gap:8px;
                margin-top:14px
            "
        >
            <button
                class="btn ghost"
                style="flex:1"
                data-a="mediaRetry"
                data-v="${id}"
            >
                Retake
            </button>
            <button
                class="btn pink"
                style="flex:1"
                data-a="sendMedia"
                data-k="${id}"
                data-type="${loc ? 'photo-location' : 'photo'}"
                data-src="${esc(src)}"
                ${loc ? `data-loc="${encodedLoc}"` : ''}
            >
                Send
            </button>
        </div>
        ${
            loc
                ? `<p class="mut" style="margin:10px 0 0;text-align:center">📍 Your current location will be shared with this photo.</p>`
                : `
                    <button
                        class="btn ghost"
                        style="width:100%;margin-top:10px"
                        data-a="attachLocation"
                        data-v="${id}"
                        data-src="${esc(src)}"
                    >
                        📍 Attach my current location
                    </button>
                `
        }
    `);
}
function mediaRetry(e) {
    mediaCameraStream(e.dataset.v);
}
function attachLocation(e) {
    const id = e.dataset.v;
    const src = e.dataset.src;
    if (!confirm('Share your current location with this photo?'))
        return;
    mediaLocation(loc => {
        mediaPreview(id, src, loc);
    });
}
function openMediaLocation(e) {
    const id = e.dataset.v;
    if (!confirm('Share your current location in this chat?'))
        return;
    mediaLocation(loc => {
        const encodedLoc = encodeURIComponent(JSON.stringify(loc));
        modal(`
            <h2 style="margin-top:0">
                Share location
            </h2>
            <div
                class="card"
                style="text-align:center;padding:24px 16px"
            >
                <div style="font-size:42px">
                    📍
                </div>
                <b>Current location ready</b>
                <p class="mut" style="margin:6px 0 0">
                    Your exact current location will be shared
                    with this chat.
                </p>
            </div>
            <button
                class="btn pink"
                style="width:100%;margin-top:14px"
                data-a="sendMedia"
                data-k="${id}"
                data-type="location"
                data-loc="${encodedLoc}"
            >
                Share location
            </button>
            <button
                class="btn ghost"
                style="width:100%;margin-top:8px"
                data-a="close"
            >
                Cancel
            </button>
        `);
    });
}