const canvas = document.getElementById('herniPlocha');
const ctx = canvas.getContext('2d');

const velikostBunky = 20;
let skore = 0;
let had = [];
let jidlo = null;
let dx = velikostBunky;
let dy = 0;
let rychlost = 100; // Výchozí rychlost hry
let aktualniObtiznost = 'snadna'; // Výchozí obtížnost

// Funkce pro nastavení obtížnosti
function nastavObtiznost(obtiznost) {
    aktualniObtiznost = obtiznost; // Uložení aktuální obtížnosti
    if (obtiznost === 'snadna') {
        canvas.width = 300; // Šířka plátna pro snadnou obtížnost
        canvas.height = 300; // Výška plátna pro snadnou obtížnost
        rychlost = 150; // Rychlost pro snadnou obtížnost
    } else if (obtiznost === 'stredni') {
        canvas.width = 340; // Šířka plátna pro střední obtížnost
        canvas.height = 340; // Výška plátna pro střední obtížnost
        rychlost = 100; // Rychlost pro střední obtížnost
    } else if (obtiznost === 'tezka') {
        canvas.width = 380; // Šířka plátna pro těžkou obtížnost
        canvas.height = 380; // Výška plátna pro těžkou obtížnost
        rychlost = 70; // Rychlost pro těžkou obtížnost
    }
    document.getElementById('dialog').style.display = 'none'; // Skrýt menu
    document.getElementById('skore').style.display = 'block'; // Zobrazit skóre
    restartujHru(); // Spustit hru
}

// Funkce pro restartování hry
function restartujHru() {
    skore = 0; // Reset skóre
    dx = velikostBunky; // Reset směru
    dy = 0; // Reset směru
    if (aktualniObtiznost === 'snadna') {
        rychlost = 150; // Rychlost pro snadnou obtížnost
    } else if (aktualniObtiznost === 'stredni') {
        rychlost = 100; // Rychlost pro střední obtížnost
    } else if (aktualniObtiznost === 'tezka') {
        rychlost = 70; // Rychlost pro těžkou obtížnost
    }
    had = [ // Inicializace hada
        {x: 100, y: 100},
        {x: 80, y: 100},
        {x: 60, y: 100},
    ];
    jidlo = vytvorJidlo(); // Vytvoření nového jídla
    document.getElementById('skore').innerText = "Skóre: " + skore; // Aktualizace zobrazení skóre
    document.getElementById('gameOverDialog').style.display = 'none'; // Skrýt dialog po prohře
    hra(); // Spustit hru znovu
}

// Funkce pro vytvoření jídla
function vytvorJidlo() {
    let newJidlo;
    let occupied = true;

    while (occupied) {
        occupied = false; // Předpokládáme, že pozice není obsazena
        newJidlo = {
            x: Math.floor(Math.random() * (canvas.width / velikostBunky)) * velikostBunky,
            y: Math.floor(Math.random() * (canvas.height / velikostBunky)) * velikostBunky
        };

        // Kontrola, zda je nová pozice obsazena hadem
        for (let i = 0; i < had.length; i++) {
            if (had[i].x === newJidlo.x && had[i].y === newJidlo.y) {
                occupied = true; // Pozice je obsazena, hledáme novou
                break;
            }
        }
    }

    return newJidlo; // Vrátíme novou pozici jídla
}

// Funkce pro vykreslení jídla
function vykresliJidlo() {
    ctx.fillStyle = 'red'; // Barva jídla
    ctx.fillRect(jidlo.x, jidlo.y, velikostBunky, velikostBunky);
}

// Funkce pro vykreslení hada
function vykresliHada() {
    had.forEach((segment) => {
        ctx.fillStyle = 'blue'; // Barva hada
        ctx.fillRect(segment.x, segment.y, velikostBunky, velikostBunky);
    });
}

// Funkce pro posun hada
function posunHada() {
    const hlava = {x: had[0].x + dx, y: had[0].y + dy};
    had.unshift(hlava); // Přidání nové hlavy hada

    // Kontrola, zda had sežral jídlo
    if (hlava.x === jidlo.x && hlava.y === jidlo.y) {
        skore++;
        document.getElementById('skore').innerText = "Skóre: " + skore;
        jidlo = vytvorJidlo(); // Vytvoření nového jídla
    } else {
        had.pop(); // Odstranění posledního segmentu hada, pokud se jídlo nesnědlo
    }
}

// Funkce pro kontrolu kolize
function kontrolaKolize() {
    if (had.length === 0) return false; // Pokud had neexistuje, není kolize

    const hlava = had[0];
    // Kontrola kolize s hranicemi
    if (hlava.x < 0 || hlava.x >= canvas.width || hlava.y < 0 || hlava.y >= canvas.height) {
        return true; // Kolize s hranicemi
    }
    // Kontrola kolize s vlastním tělem
    for (let i = 1; i < had.length; i++) {
        if (hlava.x === had[i].x && hlava.y === had[i].y) {
            return true; // Kolize s vlastním tělem
        }
    }
    // Kontrola, zda had zabral celou plochu
    if (had.length >= (canvas.width / velikostBunky) * (canvas.height / velikostBunky)) {
        vyhraj(); // Zavolej funkci pro vítězství
        return true; // Hra je vyhraná
    }
    return false; // Žádná kolize
}

// Hlavní herní smyčka
function hra() {
    if (kontrolaKolize()) {
        prohra();
        return;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    vykresliJidlo();
    posunHada();
    vykresliHada();

    setTimeout(hra, rychlost);
}

// Funkce pro zobrazení prohry
function prohra() {
    document.getElementById('finalScore').innerText = "Skóre: " + skore + "\nProhráli jste!";
    document.getElementById('gameOverDialog').style.display = 'block'; // Zobrazit dialog
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

    // Zabránění otočení na opačný směr
    if ((klic === 37 && dx === velikostBunky) || (klic === 39 && dx === -velikostBunky)) {
        return; // Zabránit otočení vlevo, pokud se had pohybuje vpravo
    }
    if ((klic === 38 && dy === velikostBunky) || (klic === 40 && dy === -velikostBunky)) {
        return; // Zabránit otočení nahoru, pokud se had pohybuje dolů
    }
}

/*document.getElementById('restartButton').addEventListener('click', function() {
    restartujHru(); // Funkce pro restartování hry
}); */

// Funkce pro návrat do menu
function vratSeDoMenu() {
    document.getElementById('winDialog').style.display = 'none'; // Skrýt dialog vítězství
    document.getElementById('gameOverDialog').style.display = 'none'; // Skrýt dialog prohry
    document.getElementById('dialog').style.display = 'block'; // Zobrazit menu
    skore = 0; // Reset skóre
    had = []; // Reset hada
    jidlo = null; // Reset jídla
}
hra();
