// snake v JS s pouzitim OO
"use strict";

let fps = 20;
let baseFPS = 1000 / fps;
let lastUpdateTime = 0;
let snakeSpeed = 1;
let delta = 0;
const pozadi = "lightyellow";
let canvas = document.getElementById("platno");
let ctx = canvas.getContext("2d");

const Direction = {
    Up: "Up",
    Down: "Down",
    Left: "Left",
    Right: "Right",
};

class SnakeSettings {
    size = 20;
    hlavaX = 0;
    hlavaY = 0;
    smerPohybu = Direction.Right;
    upravaRychlosti = 1;
    neodebratOcas = false;
}

class Game {
    score = 0;
    fps = 60;
    intro = true;
    konec = false;
    start = false;
}

class SnakeClanek {
    x = 0;
    y = 0;
    constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y;
    }
}

class Jidlo {
    x = 0;
    y = 0;
    constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y;
    }
}

function handleKeyPress(event) {

    // Získání kódu stisknuté klávesy
    const key = event.key;

    switch (key) {
        case "Enter": // nahla smrt
            game.konec = true;
            window.requestAnimationFrame(gameLoop);
            break;
        case "Space":
        case " ":
            game.intro = false;
            document.getElementById('startButton').style.display = 'none';
            game.start = true;
            resizeCanvas();
            if (game.konec) location.reload();
            window.requestAnimationFrame(gameLoop);
            break;
        case "ArrowUp":
            // Kód pro pohyb hada nahoru
            snakeSettings.smerPohybu = Direction.Up;
            break;
        case "ArrowDown":
            // Kód pro pohyb hada dolů
            snakeSettings.smerPohybu = Direction.Down;
            break;
        case "ArrowLeft":
            // Kód pro pohyb hada doleva
            snakeSettings.smerPohybu = Direction.Left;
            break;
        case "ArrowRight":
            // Kód pro pohyb hada doprava
            snakeSettings.smerPohybu = Direction.Right;
            break;
    }
};

function handleButtonClick(event) {
    // Získání klíče tlačítka z ID
    var key = event.target.id.replace('Button', ''); // Odstraníme "Button" z ID
    if (key == "start") key = "Space";
    // Volání funkce handleKeyPress s klíčem tlačítka
    handleKeyPress({ key: key });
}

function update() {
    let distance = snakeSpeed * snakeSettings.upravaRychlosti;

    switch (snakeSettings.smerPohybu) {
        case "Right":
            hlava.x++;
            snake.unshift(
                new SnakeClanek(hlava.x, hlava.y)
            );
            break;

        case "Left":
            hlava.x--;
            snake.unshift(
                new SnakeClanek(hlava.x, hlava.y)
            );
            break;

        case "Up":
            hlava.y--;
            snake.unshift(
                new SnakeClanek(hlava.x, hlava.y)
            );
            break;

        case "Down":
            hlava.y++;
            snake.unshift(
                new SnakeClanek(hlava.x, hlava.y)
            );
            break;
    }

    if (!snakeSettings.neodebratOcas) {
        ocas = snake.pop();
    } else snakeSettings.neodebratOcas = false;
}

// Pokud je requestAnimationFrame() rychlejší nebo pomalejší
// než předpokládáme, přizpůsobíme posun tak, aby byl vždy stejný.
function upravRychlost() {
    baseFPS = 1000 / fps;
    if (lastUpdateTime) {
        delta = Date.now() - lastUpdateTime;
        snake.upravaRychlosti = delta / baseFPS;
    }
    lastUpdateTime = Date.now();
}

function delay(time) {
    return new Promise(resolve => setTimeout(resolve, time));
}

function gameLoop() {
    upravRychlost();
    if (prvniKrok) {
        snake.upravaRychlosti = 0; prvniKrok = false;
    }
    delay(100 * (1 / snake.upravaRychlosti)).then(() => {
        update();
        checkCollision()
        refreshScreen();
        if (!game.konec)
            window.requestAnimationFrame(gameLoop);
    })
}

function VlozJidlo() {
    jidlo.x = Math.floor(Math.random() * Math.floor(canvas.width / snakeSettings.size));
    jidlo.y = Math.floor(Math.random() * Math.floor(canvas.height / snakeSettings.size));
}

function refreshScreen(size = snakeSettings.size) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (game.intro) Intro();
    if (game.start) {
        ctx.fillStyle = "purple";
        for (let clanek of snake) {
            ctx.fillRect(clanek.x * size, clanek.y * size, size, size);
        }
        ctx.fillStyle = "purple";
        ctx.font = "12px Arial";
        //ctx.fillText("FPS: " + Math.round(1000 / delta), 155, 10);
        ctx.fillText("SCORE: " + game.score, 5, 10);

        ctx.fillStyle = "blue";
        ctx.fillRect(jidlo.x * snakeSettings.size, jidlo.y * snakeSettings.size, snakeSettings.size, snakeSettings.size);
    }

    if (game.konec) {      
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        var obrazek = new Image();
        obrazek.src = "snake-game-over.jpg";
        obrazek.onload = function () {
            var novaSirka = canvas.width * (0.7); // 2/3 šířky okna
            var novaVyska = (novaSirka / this.width) * this.height; // Proporčně změníme výšku

            // Vykreslíme obrázek s novými rozměry na vycentrovanou pozici
            ctx.drawImage(this, (canvas.width - novaSirka) / 2, (canvas.height - novaVyska) / 2, novaSirka, novaVyska);
            // Media queries pro skrytí textu na mobilních zařízeních

            if (window.innerWidth <= 600) {
                ctx.fillStyle = "black"; // Nastavíme barvu pozadí na černou
                ctx.fillRect(0, canvas.height - 40, canvas.width, 40); // Vykreslíme čtverec s černým pozadím

                ctx.fillStyle = "white"; // Nastavíme barvu textu na bílou
                ctx.font = "4vw Arial";
                ctx.fillText("SCORE: " + game.score, (canvas.width - novaSirka) - 20, canvas.height - 15); // Vykreslíme text bílou barvou
                ctx.fillStyle = "black"; // Nastavíme barvu pozadí na černou
                ctx.fillRect(0, 0, canvas.width, 60); // Vykreslíme čtverec s černým pozadím
                ctx.fillStyle = "YELLOW";
                ctx.font = "40px Comix sans";
                ctx.fillText("GAME OVER ", (canvas.width - novaSirka) - 20, 40);
                document.getElementById('startButton').style.display = 'block';
            } else {
                ctx.fillStyle = "black"; // Nastavíme barvu pozadí na černou
                ctx.fillRect(0, canvas.height - 60, canvas.width, 60); // Vykreslíme čtverec s černým pozadím            
                ctx.fillStyle = "black"; // Nastavíme barvu pozadí na černou
                ctx.fillRect(0, 0, canvas.width, 80); // Vykreslíme čtverec s černým pozadím
                ctx.fillStyle = "YELLOW";
                ctx.font = "40px Comix sans";
                ctx.fillText("GAME OVER ", 150, 50);

                ctx.fillStyle = "white"; // Nastavíme barvu textu na bílou
                ctx.font = "28px Arial";
                ctx.fillText("SCORE: " + game.score, 450, 50); // Vykreslíme text bílou barvou

                ctx.fillStyle = "white"; // Nastavíme barvu textu na bílou
                ctx.font = "28px Arial";
                ctx.fillText("Zmáčkněte mezerník pro start...", (canvas.width - novaSirka) - 60, canvas.height - 20); // Vykreslíme text bílou barvou
            }
        };
    }
}

function Intro() {
    var obrazek = new Image();
    obrazek.src = "intro.png";
    obrazek.onload = function () {
        var novaSirka = canvas.width * (0.7); // 2/3 šířky okna
        var novaVyska = (novaSirka / this.width) * this.height; // Proporčně změníme výšku

        // Vykreslíme obrázek s novými rozměry na vycentrovanou pozici
        ctx.drawImage(this, (canvas.width - novaSirka) / 2, (canvas.height - novaVyska) / 2, novaSirka, novaVyska);

        // Media queries pro skrytí textu na mobilních zařízeních
        if (window.innerWidth <= 600) {
            return; // Pokud je šířka obrazovky menší nebo rovna 600px, funkce se zde ukončí a text se nevykreslí
        }

        ctx.fillStyle = "black"; // Nastavíme barvu pozadí na černou
        ctx.fillRect(0, canvas.height - 60, canvas.width, 60); // Vykreslíme čtverec s černým pozadím

        ctx.fillStyle = "white"; // Nastavíme barvu textu na bílou
        ctx.font = "28px Arial";
        ctx.fillText("Zmáčkněte mezerník pro start...", (canvas.width - novaSirka) - 60, canvas.height - 20); // Vykreslíme text bílou barvou
    };
}

function checkCollision() {
    // jidlo
    if (hlava.x === jidlo.x && hlava.y === jidlo.y) {
        ctx.fillStyle = "pozadi";
        ctx.fillRect(jidlo.x * snakeSettings.size, jidlo.y * snakeSettings.size, snakeSettings.size, snakeSettings.size);
        game.score++;
        VlozJidlo();
        fps++;
        snakeSettings.neodebratOcas = true;
    }

    // had
    if (hlavaSnakeCollision() || wallSnakeCollision()) {
        game.konec = true;
        game.start = false;
    }
}

function hlavaSnakeCollision() {
    for (let i = 1; i < snake.length; i++) {
        if (hlava.x == snake[i].x && hlava.y == snake[i].y)
            return true;
    }
    return false;
}

function wallSnakeCollision() {
    if (hlava.x < 0 ||
        (hlava.x > canvas.width / snakeSettings.size) ||
        (hlava.y < 0) ||
        hlava.y > canvas.height / snakeSettings.size) return true;
    else return false;
}



function resizeCanvas() {
    //document.getElementById("info").innerHTML = "w_sirka:" + window.innerWidth + ", c_w: " + canvas.clientWidth + ", c_h: " + canvas.clientHeight;
    var screenHeight = window.innerHeight;
    canvas.width = canvas.clientWidth;
    if (window.innerWidth <= 600) // mobil
    {
        if (game.start) canvas.height = screenHeight * (0.55);
        else canvas.height = screenHeight * (0.45);
    } else canvas.height = screenHeight * (0.55);
    refreshScreen();

}

// MAIN

let snakeSettings = new SnakeSettings();
let game = new Game();
let prvniKrok = true;
let snake = [];
let jidlo = new Jidlo();
let gameBoard = [];

resizeCanvas();

for (let i = 0; i < canvas.width / snake.size; i++) {
    gameBoard[i] = [];
    for (let j = 0; j < canvas.height / snake.size; j++) {
        gameBoard[i][j] = 0;
    }
}

let hlava = new SnakeClanek(Math.floor(canvas.width / snakeSettings.size / 2), Math.floor(canvas.height / snakeSettings.size / 2));
snake.push(hlava);
let ocas = new SnakeClanek(hlava.x, hlava.y);

// Přidání event listenerů pro kliknutí na tlačítka
var buttons = document.querySelectorAll('.controls button');
buttons.forEach(function (button) {
    button.addEventListener('click', handleButtonClick);
});

VlozJidlo()
Intro();
document.addEventListener('keydown', handleKeyPress);
window.addEventListener('resize', resizeCanvas, false);

