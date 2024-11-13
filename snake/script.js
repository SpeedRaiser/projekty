const canvas = document.getElementById('herniPlocha');
const ctx = canvas.getContext('2d');

const velikostBunky = 20;
let skore = 0;
let had = [];
let jidloX = null;
let jidloY = null;
let dx = velikostBunky;
let dy = 0;
let rychlost = 100; // Výchozí rychlost hry
let aktualniObtiznost = ''; // Výchozí obtížnost
let hadX = 100; // Nová proměnná pro X pozici hlavy hada
let hadY = 100; // Nová proměnná pro Y pozici hlavy hada

// Inicializace obrázku
const jidloObrazek = new Image();
jidloObrazek.src = 'jablko.png'; // Změněno na jablko.jpg

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
    hadX = 100; // Reset X pozice hlavy hada
    hadY = 100; // Reset Y pozice hlavy hada
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
        {x: hadX, y: hadY},
        {x: hadX - velikostBunky, y: hadY},
        {x: hadX - 2 * velikostBunky, y: hadY},
    ];
    vytvorJidlo(); // Vytvoření nového jídla
    document.getElementById('skore').innerText = "Skóre: " + skore; // Aktualizace zobrazení skóre
    document.getElementById('gameOverDialog').style.display = 'none'; // Skrýt dialog po prohře
    hra(); // Spustit hru znovu
}

// Funkce pro vytvoření jídla
function vytvorJidlo() {
    let occupied = true;

    while (occupied) {
        occupied = false; // Předpokládáme, že pozice není obsazena
        jidloX = Math.floor(Math.random() * (canvas.width / velikostBunky)) * velikostBunky;
        jidloY = Math.floor(Math.random() * (canvas.height / velikostBunky)) * velikostBunky;

        // Kontrola, zda je nová pozice obsazena hadem
        for (let i = 0; i < had.length; i++) {
            if (had[i].x === jidloX && had[i].y === jidloY) {
                occupied = true; // Pozice je obsazena, hledáme novou
                break;
            }
        }
    }
}

// Funkce pro vykreslení jídla
function vykresliJidlo() {
    ctx.drawImage(jidloObrazek, jidloX, jidloY, velikostBunky, velikostBunky); // Vykreslení obrázku jídla
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
    hadX += dx; // Aktualizace X pozice hlavy hada
    hadY += dy; // Aktualizace Y pozice hlavy hada

    // Kontrola, zda had sežral jídlo
    if (hadX === jidloX && hadY === jidloY) {
        skore++;
        document.getElementById('skore').innerText = "Skóre: " + skore;
        vytvorJidlo(); // Vytvoření nového jídla
    } else {
        had.pop(); // Odstranění posledního segmentu hada, pokud se jídlo nesnědlo
    }

    had.unshift({x: hadX, y: hadY}); // Přidání nové hlavy hada
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
    document.getElementById('finalScore').innerText = "Skóre: " + skore;
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
    // Nové podmínky pro zabránění otočení na opačný směr
    if ((klic === 37 && had.length > 0 && dx !== 0) || (klic === 39 && had.length > 0 && dx !== 0)) {
        return; // Zabránit otočení vlevo nebo vpravo, pokud had již není v pohybu
    }
    if ((klic === 38 && had.length > 0 && dy !== 0) || (klic === 40 && had.length > 0 && dy !== 0)) {
        return; // Zabránit otočení nahoru nebo dolů, pokud had již není v pohybu
    }
}

// Funkce pro návrat do menu
function vratSeDoMenu() {
    document.getElementById('winDialog').style.display = 'none'; // Skrýt dialog vítězství
    document.getElementById('gameOverDialog').style.display = 'none'; // Skrýt dialog prohry
    document.getElementById('dialog').style.display = 'block'; // Zobrazit menu
    skore = 0; // Reset skóre
    had = []; // Reset hada
    jidloX = null; // Reset jídla X
    jidloY = null; // Reset jídla Y
}

