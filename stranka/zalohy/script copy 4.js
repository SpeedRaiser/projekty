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
let canChangeDirection = true; // Nová proměnná pro sledování cooldownu

// Inicializace obrázku
const jidloObrazek = new Image();
jidloObrazek.src = 'jablko.png'; // Změněno na jablko.jpg

window.onload = function(){
    vykresliPozadi();
}

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
    vykresliJidlo(); // Vytvoření nového jídla
    document.getElementById('skore').innerText = "Skóre: " + skore; // Aktualizace zobrazení skóre
    document.getElementById('gameOverDialog').style.display = 'none'; // Skrýt dialog po prohře
    hra(); // Spustit hru znovu
}

let jidlo1 = { x:  Math.floor(Math.random() * (canvas.width / velikostBunky)) * velikostBunky, y: Math.floor(Math.random() * (canvas.height / velikostBunky)) * velikostBunky }; // První kus jídla
let jidlo2 = { x:  Math.floor(Math.random() * (canvas.width / velikostBunky)) * velikostBunky, y: Math.floor(Math.random() * (canvas.height / velikostBunky)) * velikostBunky }; // Druhý kus jídla
let jidlo3 = { x:  Math.floor(Math.random() * (canvas.width / velikostBunky)) * velikostBunky, y: Math.floor(Math.random() * (canvas.height / velikostBunky)) * velikostBunky }; // Třetí kus jídla

// Funkce pro vykreslení jídla
function vykresliJidlo() {
    ctx.drawImage(jidloObrazek, jidlo1.x, jidlo1.y, velikostBunky, velikostBunky); // Vykreslení obrázku jídla
    ctx.drawImage(jidloObrazek, jidlo2.x, jidlo2.y, velikostBunky, velikostBunky);
    ctx.drawImage(jidloObrazek, jidlo3.x, jidlo3.y, velikostBunky, velikostBunky);
}

// Funkce pro vykreslení hada
function vykresliHada() {
    had.forEach((segment) => {
        ctx.fillStyle = 'blue'; // Barva hada
        ctx.fillRect(segment.x, segment.y, velikostBunky, velikostBunky);
    });
}

function generateFood() {
    let newFood;
    do {
        newFood = {
            x: Math.floor(Math.random() * (canvas.width / velikostBunky)) * velikostBunky,
            y: Math.floor(Math.random() * (canvas.height / velikostBunky)) * velikostBunky
        };
    } while (checkOccupied(newFood)); // Opakuj, dokud není pozice volná
    return newFood;
}

// Funkce pro kontrolu obsazenosti
function checkOccupied(food) {
    // Kontrola, zda je jídlo na pozici hada
    for (let i = 0; i < had.length; i++) {
        if (had[i].x === food.x && had[i].y === food.y) {
            return true; // Pozice obsazena hadem
        }
    }
    // Kontrola, zda je jídlo na pozici jiného jídla
    if ((food.x === jidlo1.x && food.y === jidlo1.y) ||
        (food.x === jidlo2.x && food.y === jidlo2.y) ||
        (food.x === jidlo3.x && food.y === jidlo3.y)) {
        return true; // Pozice obsazena jiným jídlem
    }
    return false; // Pozice není obsazena
}

function vytvorJidlo() {
    // Generování pozic pro jídlo
    jidlo1 = generateFood();
    jidlo2 = generateFood();
    jidlo3 = generateFood();

    // Zajištění, že jídlo není na pozici hada
    while (checkOccupied(jidlo1)) {
        jidlo1 = generateFood();
    }
    while (checkOccupied(jidlo2)) {
        jidlo2 = generateFood();
    }
    while (checkOccupied(jidlo3)) {
        jidlo3 = generateFood();
    }
}
// Funkce pro posun hada
function posunHada() {
    hadX += dx; // Aktualizace X pozice hlavy hada
    hadY += dy; // Aktualizace Y pozice hlavy hada

    // Kontrola, zda had sežral jídlo
    if (hadX === jidlo1.x && hadY === jidlo1.y) {
        skore++;
        document.getElementById('skore').innerText = "Skóre: " + skore;
        vytvorJidlo1(); // Vytvoření nového jídla pro jidlo1
    } else if (hadX === jidlo2.x && hadY === jidlo2.y) {
        skore++;
        document.getElementById('skore').innerText = "Skóre: " + skore;
        vytvorJidlo2(); // Vytvoření nového jídla pro jidlo2
    } else if (hadX === jidlo3.x && hadY === jidlo3.y) {
        skore++;
        document.getElementById('skore').innerText = "Skóre: " + skore;
        vytvorJidlo3(); // Vytvoření nového jídla pro jidlo3
    } else {
        had.pop(); // Odstranění posledního segmentu hada, pokud se jídlo nesnědlo
    }

    had.unshift({ x: hadX, y: hadY }); // Přidání nové hlavy hada
}

// Funkce pro vytvoření nového jídla pro jidlo1
function vytvorJidlo1() {
    jidlo1 = generateFood();
}

// Funkce pro vytvoření nového jídla pro jidlo2
function vytvorJidlo2() {
    jidlo2 = generateFood();
}

// Funkce pro vytvoření nového jídla pro jidlo3
function vytvorJidlo3() {
    jidlo3 = generateFood();
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

    vykresliPozadi(); // Vykreslení pozadí
    vykresliJidlo(); // Vytvoření nového jídla
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
    if (!canChangeDirection) return; // Pokud není možné změnit směr, ukonči funkci

    const klic = event.key;

    if (klic === 'ArrowLeft' && dx === 0) { dx = -velikostBunky; dy = 0; }  
    else if (klic === 'ArrowUp' && dy === 0) { dx = 0; dy = -velikostBunky; } 
    else if (klic === 'ArrowRight' && dx === 0) { dx = velikostBunky; dy = 0; }  
    else if (klic === 'ArrowDown' && dy === 0) { dx = 0; dy = velikostBunky; }  
    else if (klic === 'a' && dx === 0) { dx = -velikostBunky; dy = 0; } 
    else if (klic === 'w' && dy === 0) { dx = 0; dy = -velikostBunky; } 
    else if (klic === 'd' && dx === 0) { dx = velikostBunky; dy = 0; }  
    else if (klic === 's' && dy === 0) { dx = 0; dy = velikostBunky; }  

    // Zabránění otočení na opačný směr
    if ((klic === 'ArrowLeft' && dx === velikostBunky) || (klic === 'ArrowRight' && dx === -velikostBunky)) {
        return; // Zabránit otočení vlevo, pokud se had pohybuje vpravo
    }
    if ((klic === 'ArrowUp' && dy === velikostBunky) || (klic === 'ArrowDown' && dy === -velikostBunky)) {
        return; // Zabránit otočení nahoru, pokud se had pohybuje dolů
    }
    // Nové podmínky pro zabránění otočení na opačný směr
    if ((klic === 'ArrowLeft' && had.length > 0 && dx !== 0) || (klic === 'ArrowRight' && had.length > 0 && dx !== 0)) {
        return; // Zabránit otočení vlevo nebo vpravo, pokud had již není v pohybu
    }
    if ((klic === 'ArrowUp' && had.length > 0 && dy !== 0) || (klic === 'ArrowDown' && had.length > 0 && dy !== 0)) {
        return; // Zabránit otočení nahoru nebo dolů, pokud had již není v pohybu
    }

    let wait = 100;
    if (obtiznost === 'stredni'){
        wait = 50;
    } else if(aktualniObtiznost === 'tezka'){
        wait = 25;
    }
    canChangeDirection = false; // Nastavit cooldown
    setTimeout(() => {
        canChangeDirection = true; // Po 0,1 s povolit změnu směru
    }, wait); // 100 ms = 0,1 s
}

// Funkce pro návrat do menu
function vratSeDoMenu() {
    document.getElementById('winDialog').style.display = 'none'; // Skrýt dialog vítězství
    document.getElementById('gameOverDialog').style.display = 'none'; // Skrýt dialog prohry
    document.getElementById('dialog').style.display = 'block'; // Zobrazit menu
    skore = 0; // Reset skóre
    had = []; // Reset hada
    vykresliJidlo();
}

function vykresliPozadi() {
    for (let y = 0; y < canvas.height; y += velikostBunky) {
        for (let x = 0; x < canvas.width; x += velikostBunky) {
            ctx.fillStyle = (x / velikostBunky + y / velikostBunky) % 2 === 0 ? '#4CAF50' : '#A5D6A7';
            ctx.fillRect(x, y, velikostBunky, velikostBunky);
        }
    }
}

