const kruhy = [];
let skore = 0;
let klikIncrement = 1;
const maxUpgrades = 2;
let upgradeCount = 0;

function vykresliKruh(x, y, velikost) {
    const kruh = document.createElement('div');
    kruh.className = 'shape';
    kruh.style.width = velikost + 'px';
    kruh.style.height = velikost + 'px';
    kruh.style.left = x + 'px';
    kruh.style.top = y + 'px';
    document.getElementById('cookie').appendChild(kruh);
    kruhy.push(kruh);
}

function inicializujSusenku() {
    vykresliKruh(40, 30, 20);
    vykresliKruh(140, 30, 20);
    vykresliKruh(100, 60, 20);
    vykresliKruh(40, 140, 20);
    vykresliKruh(160, 100, 20);
    vykresliKruh(60, 160, 20);
    vykresliKruh(120, 120, 20);
    vykresliKruh(30, 80, 20);
    vykresliKruh(80, 30, 20);
    vykresliKruh(150, 150, 20);
}

document.getElementById('cookie').addEventListener('click', (udalost) => {
    skore += klikIncrement;
    document.getElementById('skore').textContent = 'cookies: ' + skore;
    aktualizujTlacitka();

    const plusJedna = document.createElement('div');
    plusJedna.className = 'plus-jedna';
    plusJedna.textContent = '+' + klikIncrement;

    const offsetX = -18;
    const offsetY = -30;
    plusJedna.style.left = (udalost.clientX + offsetX) + 'px';
    plusJedna.style.top = (udalost.clientY + offsetY) + 'px';
    document.body.appendChild(plusJedna);

    let pockej = 1000;

    setTimeout(() => {
        plusJedna.remove();
    }, pockej);
});

document.getElementById('resetBtn').addEventListener('click', () => {
    skore = 0;
    document.getElementById('skore').textContent = 'cookies: ' + skore;
    klikIncrement = 1;
    upgradeCount = 0;
    obnovStylTlacitek();
    aktualizujTlacitka();
});

function obnovStylTlacitek() {
    document.querySelectorAll('.upgrade-btn').forEach(button => {
        button.style.textDecoration = 'none';
    });
}

document.querySelectorAll('.upgrade-btn').forEach(button => {
    button.addEventListener('click', () => {
        const cost = parseInt(button.getAttribute('data-cost'));
        const increment = parseInt(button.getAttribute('data-increment'));

        if (upgradeCount < maxUpgrades && skore >= cost) {
            skore -= cost;
            klikIncrement += increment;
            upgradeCount++;
            document.getElementById('skore').textContent = 'cookies: ' + skore;
            aktualizujTlacitka();

            if (upgradeCount >= maxUpgrades) {
                button.style.backgroundColor = 'red';
                button.style.textDecoration = 'line-through';
                button.disabled = true;
            }
        } else if (skore < cost) {
            alert('Nedostatek cookies pro tento upgrade!');
        }
    });

    // Nastavení počátečního stavu tlačítka
    if (skore < parseInt(button.getAttribute('data-cost'))) {
        button.style.backgroundColor = 'gray';
        button.disabled = true;
    }
});

function aktualizujTlacitka() {
    document.querySelectorAll('.upgrade-btn').forEach(button => {
        const cost = parseInt(button.getAttribute('data-cost'));
        if (skore >= cost && upgradeCount < maxUpgrades) {
            button.style.backgroundColor = '#4CAF50';
            button.disabled = false;
        } else if (skore < cost) {
            button.style.backgroundColor = 'gray';
            button.disabled = true;
        }
    });
}

// Funkce pro náhodné kliknutí na sušenku
function randomClick() {
    const cookie = document.getElementById('cookie'); // Předpokládám, že sušenka má ID 'cookie'
    const rect = cookie.getBoundingClientRect();
    
    // Generování náhodných souřadnic uvnitř sušenky
    const x = Math.random() * rect.width + rect.left;
    const y = Math.random() * rect.height + rect.top;

    // Vytvoření a odeslání události kliknutí
    const clickEvent = new MouseEvent('click', {
        view: window,
        bubbles: true,
        cancelable: true,
        clientX: x,
        clientY: y
    });

    cookie.dispatchEvent(clickEvent);
}

// Funkce pro spuštění automatického klikání
function startAutoClicker(interval) {
    return setInterval(randomClick, interval);
}

// Příklad použití: Spustí automatické klikání každou sekundu
const autoClicker = startAutoClicker(1000);

inicializujSusenku();