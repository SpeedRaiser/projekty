const ceskaSlovaList = [
    "stroj", "slovo", "kniha", "srdce", "obraz", "sport",
    "duben", "strop","karta", "zebra", "pasta", "kabel", "slina", "vlasy",
    "malba", "olovo", "sigma","kebab", "strom", "prsty", "sloup", "kotel", "lampa", "sedlo", "motor"
];

// Funkce pro náhodný výběr slova
const vyberNahodneSlovo = () => {
    const nahodnyIndex = Math.floor(Math.random() * ceskaSlovaList.length);
    return ceskaSlovaList[nahodnyIndex];
};

let word = "";
const maxWordLength = 5;
const maxTries = 6;
let solution = vyberNahodneSlovo();
let tries = 1;
let animationActive = false;

//klavesnice
document.addEventListener("keydown", (event) => {
    if(event.key === "Enter" && animationActive === false){
        submitWord()
    }
    else if(event.key === "Backspace"){
        deleteLetter()
    }
    else {
        addLetter(event.key)
    }

    
})

//funkce pro pridani, odebrani, posilani slov
const submitWord = () => {
    if (word.length !== maxWordLength) return;
    animationActive = true;
    animateTileReveal(currentRow())

    setTimeout(() => {
        judgeResult()
        animationActive = false;
    }, 1500)
}
const addLetter = (character) => {
    if (word.length >= maxWordLength) return;
    if(/^\p{L}$/u.test(character)){
        word = word + character 
        word = word.toLowerCase();
        let tile = currentTile();
        tile.innerHTML = character;
        tile.classList.remove("animate__animated", "animate__bounceIn");
        void tile.offsetWidth;
        animateTileBounce(tile);
    }

    console.log(word)
    
} 
const deleteLetter = () => {
    if (word.length <= 0) return;
    let tile = currentTile();
    tile.innerHTML = "";
    word = word.slice(0, -1);
    tile.classList.remove("is-filled")
}

const currentTile = () => {
    return currentRow().querySelector(":nth-child(" + word.length + ")");
}
const currentRow = () => {
    return document.querySelector(".row:nth-child(" + tries + ")");

}

const judgeResult = () => {
    if(word === solution){
        animateTileDance(currentRow())
        setTimeout(() => {
            zobrazVysledek("🥳 Gratuluji, uhodl jsi slovo! 🎉")
        }, 1500)
    } else if (tries >= maxTries) {
        animateTileReveal(currentRow())
        setTimeout(() => {
            zobrazVysledek("Řešení bylo: " + solution + " :(")
        }, 1500)
    }
    else {
        word = "";
        tries++;
    }
}

const zobrazVysledek = (zprava) => {
    const overlay = document.createElement('div')
    overlay.classList.add('overlay2')
    
    const modal = document.createElement('div')
    modal.classList.add('modal')
    
    const textZpravy = document.createElement('p')
    textZpravy.textContent = zprava
    
    const tlacitko = document.createElement('button')
    tlacitko.textContent = 'Hrát znovu'
    tlacitko.classList.add('tlacitko-obnovit')
    tlacitko.addEventListener('click', () => {
        location.reload()
    })
    
    modal.appendChild(textZpravy)
    modal.appendChild(tlacitko)
    overlay.appendChild(modal)
    document.body.appendChild(overlay)
}

// Nová funkce pro zobrazení tlačítka obnovení
const zobrazTlacitkoObnovit = () => {
    const tlacitko = document.createElement('button')
    tlacitko.textContent = 'Hrát znovu'
    tlacitko.classList.add('tlacitko-obnovit')
    tlacitko.addEventListener('click', () => {
        location.reload()
    })
    document.body.appendChild(tlacitko)
}

//animace
const animateTileBounce = (tile) => {
    tile.classList.remove("animate__animated", "animate__bounceIn");
    void tile.offsetWidth;
    tile.classList.add("is-filled", "animate__animated", "animate__bounceIn");
}

const animateRowShake = (row) => {
    row.classList.remove("animate__animated", "animate__shakeX");
    setTimeout(() => {
        void row.offsetWidth;
        row.classList.add("animate__animated", "animate__shakeX");
    }, 0);
}

const animateTileReveal = (row) => {
    row.querySelectorAll(".tile").forEach((tile, index) => {
        let tileLetter = word.charAt(index);
        

        if (tileLetter === solution.charAt(index)){
            tile.classList.add("correct")
        }
        else if (solution.includes(tileLetter)){
            tile.classList.add("present")
        }
        else {
            tile.classList.add("wrong")
        }
        tile.classList.remove("animate__bounceIn", "animate__flipInY")
        void tile.offsetWidth;
        tile.classList.add("animate__flipInY", `animate__delay-${index}s`) 
    });
}

const animateTileDance = (row) => {
    row.querySelectorAll(".tile").forEach((tile, index) => {
        tile.classList.remove("animate__bounceIn", "animate__flipInY")
        void tile.offsetWidth;
        tile.classList.add("animate__bounce", `animate__delay-${index}s`) 
    });
}

