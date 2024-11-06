const canvas = document.getElementById('herniPlocha');
const ctx = canvas.getContext('2d');

const velikostBunky = 20;
let had = [
    {x: 200, y: 200},
    {x: 180, y: 200},
    {x: 160, y: 200},
];
let dx = velikostBunky;
let dy = 0;

let jidlo = vytvorJidlo();
let skore = 0;

function vytvorJidlo() {
    return {
        x: Math.floor(Math.random() * (canvas.width / velikostBunky)) * velikostBunky,
        y: Math.floor(Math.random() * (canvas.height / velikostBunky)) * velikostBunky
    }
}

function vykresliHada() {
    had.forEach(segment => {
        ctx.fillStyle = 'green';
        ctx.fillRect(segment.x, segment.y, velikostBunky, velikostBunky);
    });
}

function vykresliJidlo() {
    ctx.fillStyle = 'red';
    ctx.fillRect(jidlo.x, jidlo.y, velikostBunky, velikostBunky);
}

function posunHada() {
    const hlava = {x: had[0].x + dx, y: had[0].y + dy};
    had.unshift(hlava);
    if (hlava.x === jidlo.x && hlava.y === jidlo.y) {
        skore++;
        document.getElementById('skore').innerText = `Skóre: ${skore}`;
        jidlo = vytvorJidlo();
    } else {
        had.pop();
    }
}

function kontrolaKolize() {
    const hlava = had[0];
    if (hlava.x < 0 || hlava.x >= canvas.width || hlava.y < 0 || hlava.y >= canvas.height) {
        return true;
    }
    for (let i = 1; i < had.length; i++) {
        if (had[i].x === hlava.x && had[i].y === hlava.y) {
            return true;
        }
    }
    return false;
}

function hra() {
    if (kontrolaKolize()) {
        alert(`Hra skončila! Vaše skóre je ${skore}`);
        document.location.reload();
        return;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    vykresliJidlo();
    posunHada();
    vykresliHada();

    setTimeout(hra, 100);
}

document.addEventListener('keydown', zmenSmer);

function zmenSmer(event) {
    const klic = event.keyCode;
    if (klic === 37 && dx === 0) { dx = -velikostBunky; dy = 0; }      // Vlevo (šipka)
    else if (klic === 38 && dy === 0) { dx = 0; dy = -velikostBunky; } // Nahoru (šipka)
    else if (klic === 39 && dx === 0) { dx = velikostBunky; dy = 0; }  // Vpravo (šipka)
    else if (klic === 40 && dy === 0) { dx = 0; dy = velikostBunky; }  // Dolů (šipka)
    else if (klic === 65 && dx === 0) { dx = -velikostBunky; dy = 0; } // Vlevo (A)
    else if (klic === 87 && dy === 0) { dx = 0; dy = -velikostBunky; } // Nahoru (W)
    else if (klic === 68 && dx === 0) { dx = velikostBunky; dy = 0; }  // Vpravo (D)
    else if (klic === 83 && dy === 0) { dx = 0; dy = velikostBunky; }  // Dolů (S)
}

hra();