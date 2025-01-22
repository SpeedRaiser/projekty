const kruhy = [];
let skore = 0;
let klikIncrement = 1;
let upgradeCountX2 = 0; // Počet zakoupených x2 upgradů
let x2UpgradePurchased = false; // Flag pro sledování, zda byl upgrade x2 zakoupen

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
    upgradeCountX2 = 0; // Reset počtu x2 upgradů
    x2UpgradePurchased = false; // Reset flagu pro upgrade x2
    obnovStylTlacitek();
    aktualizujTlacitka();
});

function obnovStylTlacitek() {
    document.querySelectorAll('.upgrade-btn').forEach(button => {
        button.style.textDecoration = 'none';
    });
}

function aktualizujTlacitka() {
    document.querySelectorAll('.upgrade-btn').forEach(button => {
        const cost = parseInt(button.getAttribute('data-cost'));
        if (skore >= cost) {
            button.style.backgroundColor = '#4CAF50'; // Zelená pro dostupné upgrady
            button.disabled = false;
        } else {
            button.style.backgroundColor = 'gray'; // Šedá pro nedostupné upgrady
            button.disabled = true;
        }

        // Pokud byl upgrade x2 zakoupen, nastavte červenou barvu a přeškrtnutí
        if (button.getAttribute('data-increment') === '2' && x2UpgradePurchased) {
            button.style.backgroundColor = 'red'; // Změna barvy na červenou
            button.style.textDecoration = 'line-through'; // Přeškrtnutí
            button.disabled = true; // Deaktivace tlačítka
        }
    });
}

// Přidání událostí pro upgrady
document.querySelectorAll('.upgrade-btn').forEach(button => {
    button.addEventListener('click', () => {
        const cost = parseInt(button.getAttribute('data-cost'));
        const increment = parseInt(button.getAttribute('data-increment'));
        const autoClicker = button.getAttribute('data-auto-clicker') === 'true';

        // Kontrola, zda byl upgrade x2 již zakoupen
        if (increment === 2 && x2UpgradePurchased) {
            return; // Pokud byl upgrade zakoupen, neprovádějte nic
        }

        if (skore >= cost) {
            skore -= cost;
            if (autoClicker) {
                startAutoClicker(1000); // Spustí automatické klikání
            } else {
                if (increment === 1) {
                    klikIncrement += increment; // Zvyšuje o 1
                } else if (increment === 2) {
                    klikIncrement *= 2; // Dvojnásobek
                    x2UpgradePurchased = true; // Označte, že upgrade byl zakoupen
                }
            }
            document.getElementById('skore').textContent = 'cookies: ' + skore;

            // Zvyšte cenu upgradu po zakoupení
            const newCost = Math.floor(cost * 1.5); // Zvyšte cenu o 50%
            button.setAttribute('data-cost', newCost);
            button.textContent = `${button.textContent.split(' (cena:')[0]} (cena: ${newCost} cookies)`;

            // Změna barvy a přeškrtnutí tlačítka, pokud byl maximální počet dosažen
            if (increment === 2) {
                button.style.backgroundColor = 'red'; // Změna barvy na červenou
                button.style.textDecoration = 'line-through'; // Přeškrtnutí
                button.disabled = true; // Deaktivace tlačítka
            }

            aktualizujTlacitka();
        }
    });
});

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
inicializujSusenku();