let word = "";
const maxWordLength = 5;
const maxTries = 6;
let solution = "hello";
let tries = 1;

//klavesnice
document.addEventListener("keydown", (event) => {
    if(event.key === "Enter"){
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

    animateTileReveal(currentRow())

    setTimeout(() => {
        judgeResult()
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
            alert("Gratuluji, uhodl jsi slovo!")
        }, 1000)
    } else if (tries >= maxTries) {
        alert("řešení bylo: " + solution + " :(")
    }
    else {
        word = "";
        tries++;
    }
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