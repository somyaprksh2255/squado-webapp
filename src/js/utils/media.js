function mediaPhoto(file, cb) {
    if (!file || !file.type.startsWith('image/'))
        return toast('Please choose an image.');
    const r = new FileReader();
    r.onload = () => cb && cb(r.result);
    r.onerror = () =>
        toast('Couldn\'t load that image. Try another one.');
    r.readAsDataURL(file);
}
function mediaCamera(cb) {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia)
        return toast('Camera isn\'t available here. Try Gallery instead.');
    navigator.mediaDevices.getUserMedia({
        video: {
            facingMode: 'environment'
        },
        audio: false
    })
        .then(stream => cb && cb(stream))
        .catch(e => {
            if (e.name == 'NotAllowedError' || e.name == 'PermissionDeniedError')
                toast('Camera blocked. Allow camera access in your browser and try again.');
            else
                toast('Couldn\'t open the camera. Try Gallery instead.');
        });
}
function mediaLocation(cb) {
    if (!navigator.geolocation)
        return toast('Location isn\'t available here.');
    toast('Getting your current location... 📍');
    navigator.geolocation.getCurrentPosition(
        p => {
            const loc = {
                lat: p.coords.latitude,
                lng: p.coords.longitude
            };
            cb && cb(loc);
        },
        e =>
            toast(
                e.code == 1
                    ? 'Location blocked. Allow it in your browser and try again.'
                    : 'Couldn\'t get your location. Try again.'
            ),
        {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0
        }
    );
}