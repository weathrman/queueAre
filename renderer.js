document.getElementById('wifi-form').addEventListener('submit', async (event) => {
    event.preventDefault();

    const ssid = document.getElementById('ssid').value;
    const password = document.getElementById('password').value;
    const authType = document.getElementById('auth-type').value;

    let wifiString = `WIFI:S:${ssid};T:${authType};`;
    if (authType !== 'nopass') {
        wifiString += `P:${password};;`;
    } else {
        wifiString += ';';
    }

    const dataURL = await window.electronAPI.generateQR(wifiString);

    if (dataURL) {
        const canvas = document.getElementById('qr-canvas');
        const ctx = canvas.getContext('2d');
        const img = new Image();
        img.onload = () => {
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0);
            document.getElementById('qr-container').style.display = 'block';
        };
        img.src = dataURL;
    } else {
        console.error('Failed to generate QR code.');
    }
});

document.getElementById('save-qr').addEventListener('click', () => {
    const canvas = document.getElementById('qr-canvas');
    const dataURL = canvas.toDataURL('image/png');
    window.electronAPI.saveDialog(dataURL);
});