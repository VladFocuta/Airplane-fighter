let asteroidsContainer = document.getElementById("asteroidsSummon");
let rocket = document.getElementById("rocket");
let asteroids = document.getElementsByClassName("asteroid");
let message = document.getElementById("messages");
let ammo = document.getElementById("ammo");
let gameOver = false;

document.addEventListener("keydown", handleKeys)
let charLeftAdd = 50, charUpAdd = 0;
function handleKeys(e) {
    if (!gameOver) {
        let pressedKey = e.code;
        if (pressedKey === "ArrowRight" && charLeftAdd < 94) {
            charLeftAdd += 3;
            rocket.style.left = charLeftAdd + "%";
        }

        if (pressedKey === "ArrowLeft" && charLeftAdd > 1) {
            charLeftAdd -= 3;
            rocket.style.left = charLeftAdd + "%";
        }

        if (pressedKey === "ArrowUp" && charUpAdd <= 30) {
            charUpAdd += 4;
            rocket.style.bottom = charUpAdd + "%";
        }

        if (pressedKey === "ArrowDown" && charUpAdd > 0) {
            charUpAdd -= 4;
            rocket.style.bottom = charUpAdd + "%";
        }

        if (pressedKey === "Space") {
            fireAmmo();
        }
    }
}

function fireAmmo() {
    let trajectory = 0;
    let ammonition = document.createElement("div");
    ammonition.id = "firstAmmo";
    ammonition.className = "ammo";
    let rocketLeft = parseFloat(rocket.style.left);
    let ammoMoveInterval = setInterval(function () {

        trajectory += 5;
        ammonition.style.bottom = trajectory + "%";
        ammonition.style.left = rocketLeft - 7 + "%";
        ammo.appendChild(ammonition);

        if (trajectory >= 90) {
            clearInterval(ammoMoveInterval);
            ammo.removeChild(ammonition);
        }

        if (destroyAsteroid(ammonition)) {
            clearInterval(ammoMoveInterval);
            ammo.removeChild(ammonition);
        }

    }, 30);
}

function destroyAsteroid(ammo) {
    for (let i = 0; i < asteroids.length; ++i) {
        let asteroid = asteroids[i];
        let asteroidRect = asteroid.getBoundingClientRect();
        let ammoRect = ammo.getBoundingClientRect();
        if (ammoRect.left + 100 < asteroidRect.right &&
            ammoRect.right > asteroidRect.left &&
            ammoRect.top + 70 < asteroidRect.bottom) {
            asteroid.remove();
            extraScore += 5;
            return true;
        }
    }
    return false;
}

function createAsteroids() {
    for (let i = 0; i < 1; ++i) {
        let asteroid = document.createElement("div");
        asteroid.className = "asteroid";
        let left = Math.floor(Math.random() * 80) + 10;
        asteroid.style.left = left + "%";
        asteroidsContainer.appendChild(asteroid);
    }
}

let asteroidsDelay = setInterval(startGame, 45);

function startGame() {
    if (!gameOver) {
        if (asteroids.length < 8) {
            createAsteroids();
        }
        for (let i = 0; i < asteroids.length; i++) {
            let asteroid = asteroids[i];
            let top = parseFloat(asteroid.style.top) || 0;
            let asteroidRect = asteroid.getBoundingClientRect();
            let rocketRect = rocket.getBoundingClientRect();
            top += 2;
            asteroid.style.top = top + "%";
            if (top >= 87) {
                let left = Math.floor(Math.random() * 80) + 10;
                asteroid.style.left = left + "%";
                asteroid.style.top = 0 + "%";
            }

            if (rocketRect.left + 15 < asteroidRect.right - 15 &&
                rocketRect.right - 15 > asteroidRect.left + 15 &&
                rocketRect.top < asteroidRect.bottom &&
                rocketRect.bottom > asteroidRect.top) {
                clearInterval(asteroidsDelay);
                clearInterval(increaseSpeed);
                showScore();
                gameOver = true;
            }
        }
    }
}

let timer = 0, extraScore = 0, finalScore;
function score() {
    asteroidsDelay = setInterval(function () {
        timer++;
        message.innerHTML = "Score: " + timer + " Extra Points: " + extraScore;
        finalScore = timer + extraScore;
    }, 1000);
}

score();

function showScore() {
    message.innerHTML = "Your score is: " + finalScore;
    message.className = "finalScore";
}

let increaseSpeed;
function levelUp() {
    increaseSpeed = setInterval(function () {
        if (timer > 15 && timer < 17) {
            setInterval(startGame, 37);
        }
    }, 16000);
}

levelUp();
