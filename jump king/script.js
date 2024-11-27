const canvas = document.getElementById('herniPlocha');
const ctx = canvas.getContext('2d');

let backgroundImage = new Image();
backgroundImage.src = 'mapa.jpeg'; // Načtení obrázku pozadí

let playerImage = new Image();
playerImage.src = 'player.png'; // Načtení obrázku hráče

let player = {
    x: 50, // Počáteční X pozice hráče
    y: 500, // Počáteční Y pozice hráče
    width: 30, // Šířka hráče
    height: 50 // Výška hráče
};

// Funkce pro vykreslení pozadí
function drawBackground() {
    ctx.drawImage(backgroundImage, 0, -8400, canvas.width, 9000);
}

// Funkce pro vykreslení hráče
function drawPlayer() {
    ctx.drawImage(playerImage, player.x, player.y, player.width, player.height); // Vykreslení hráče
}

// Hlavní herní smyčka
function update() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Vymazání plátna
    drawBackground(); // Vykreslení pozadí
    drawPlayer(); // Vykreslení hráče
    requestAnimationFrame(update); // Pokračování v animaci
}

// Spuštění hry
backgroundImage.onload = function() {
    playerImage.onload = function() {
        update(); // Spuštění aktualizace po načtení obrázků
    };
};