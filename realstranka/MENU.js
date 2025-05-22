//scripty pro menu (zanry a nastaveni)
const menuIcon = document.querySelector('.menu-icon');
const settingsIcon = document.querySelector('.settings-icon');
const menu = document.getElementById('menu');
const settingsMenu = document.querySelector('.settings-menu');
const overlay = document.createElement('div');
overlay.classList.add('overlay');
document.body.appendChild(overlay);

menuIcon.addEventListener('click', () => {
    menu.classList.toggle('show');
    //posuvnik 
    document.body.classList.toggle('no-scroll');
});

settingsIcon.addEventListener('click', () => {
    settingsMenu.classList.toggle('show');
    overlay.style.display = settingsMenu.classList.contains('show') ? 'block' : 'none';
});

overlay.addEventListener('click', () => {
    settingsMenu.classList.remove('show');
    overlay.style.display = 'none';
});


//NOCNI REZIM A MENU PRO ZANRY UKLADANI A NACITANI 

// Načtení stavu nočního režimu při načtení stránky
window.onload = function() {
    const nightMode = localStorage.getItem('nightMode') === 'true';
    document.getElementById('night-mode').checked = nightMode; // Nastavení checkboxu
    setNightMode(nightMode); // Aplikace nočního režimu

    const menuOpen = localStorage.getItem('menuOpen') === 'true';
    setMenuOpen(menuOpen); // Aplikace stavu menu
};

// Funkce pro nastavení nočního režimu
function setNightMode(isNightMode) {
    localStorage.setItem('nightMode', isNightMode);
    document.body.classList.toggle('night-mode', isNightMode); // Přidání třídy pro noční režim
}

// Přidání události pro checkbox nočního režimu
document.getElementById('night-mode').addEventListener('change', function() {
    setNightMode(this.checked);
});

// Funkce pro nastavení otevřeného menu
function setMenuOpen(isOpen) {
    localStorage.setItem('menuOpen', isOpen);
    if (menu) {
        menu.classList.toggle('show', isOpen); // Přidání třídy pro zobrazení menu
    }
}

// Přidání události pro ikonu menu
document.querySelector('.menu-icon').addEventListener('click', function() {
    const currentMenuState = localStorage.getItem('menuOpen') === 'true';
    setMenuOpen(!currentMenuState); // Přepnutí stavu menu
});

