const startButton = document.getElementById("startButton");
const home = document.getElementById("home");
const gallery = document.getElementById("gallery");
const music = document.getElementById("bgMusic");
const miniPlayer = document.getElementById("miniPlayer");
const musicToggle = document.getElementById("musicToggle");
const playerBarFill = document.getElementById("playerBarFill");

const volumeSlider = document.getElementById("volumeSlider");
const volumeButton = document.getElementById("volumeButton");
const iconVolumeOn = document.querySelector(".icon-volume-on");
const iconVolumeMute = document.querySelector(".icon-volume-mute");

let isMuted = false;
let savedVolume = 0.7;

function setPlayingState(isPlaying){
    miniPlayer.classList.toggle("is-playing", isPlaying);
    musicToggle.setAttribute("aria-label", isPlaying ? "Pausar música" : "Tocar música");
}

startButton.addEventListener("click", () => {
    home.classList.add("is-hidden");
    gallery.classList.add("is-visible");
    music.volume = volumeSlider.value / 100;

    music.play().then(() => {
        setPlayingState(true);
    }).catch(() => {
        setPlayingState(false);
    });

    setTimeout(() => {
        gallery.scrollIntoView({ behavior: "smooth" });
    }, 100);
});

musicToggle.addEventListener("click", () => {
    if (music.paused) {
        music.play();
        setPlayingState(true);
    } else {
        music.pause();
        setPlayingState(false);
    }
});

function updateVolumeUI(muteState) {
    if (muteState) {
        iconVolumeOn.style.display = "none";
        iconVolumeMute.style.display = "block";
        volumeSlider.value = 0;
    } else {
        iconVolumeOn.style.display = "block";
        iconVolumeMute.style.display = "none";
        volumeSlider.value = Math.round(music.volume * 100);
    }
}

volumeSlider.addEventListener("input", (e) => {
    const currentVal = e.target.value;
    music.volume = currentVal / 100;
    
    if (currentVal == 0) {
        isMuted = true;
        updateVolumeUI(true);
    } else {
        isMuted = false;
        savedVolume = music.volume;
        updateVolumeUI(false);
    }
});

volumeButton.addEventListener("click", (e) => {
    if(e.target === volumeSlider) return;

    if (!isMuted) {
        savedVolume = music.volume > 0 ? music.volume : 0.7;
        music.volume = 0;
        isMuted = true;
        updateVolumeUI(true);
    } else {
        music.volume = savedVolume;
        isMuted = false;
        updateVolumeUI(false);
    }
});

music.addEventListener("timeupdate", () => {
    if (!music.duration) return;
    const percent = (music.currentTime / music.duration) * 100;
    playerBarFill.style.width = percent + "%";
});

// ===== Contador de tempo juntos =====
const startDate = new Date("2023-09-23T00:00:00");
const cDays = document.getElementById("cDays");
const cHours = document.getElementById("cHours");
const cMinutes = document.getElementById("cMinutes");
const cSeconds = document.getElementById("cSeconds");

function updateCounter(){
    const now = new Date();
    let diff = Math.max(0, now - startDate) / 1000;

    const days = Math.floor(diff / 86400);
    diff -= days * 86400;
    const hours = Math.floor(diff / 3600);
    diff -= hours * 3600;
    const minutes = Math.floor(diff / 60);
    diff -= minutes * 60;
    const seconds = Math.floor(diff);

    cDays.textContent = days;
    cHours.textContent = String(hours).padStart(2, "0");
    cMinutes.textContent = String(minutes).padStart(2, "0");
    cSeconds.textContent = String(seconds).padStart(2, "0");
}
updateCounter();
setInterval(updateCounter, 1000);

// ===== Cards de motivos =====
document.querySelectorAll(".reason-card").forEach((card) => {
    card.addEventListener("click", () => {
        card.classList.toggle("is-flipped");
    });
});

// ===== LÓGICA DO MINI JOGO DO AMOR (ESTILO CUTE/COQUETTE) =====
const gameContainer = document.getElementById("gameContainer");
const player = document.getElementById("player-avatar");
const obstacle = document.getElementById("obstacle");
const scoreDisplay = document.getElementById("score");
const gameStartScreen = document.getElementById("gameStartScreen");
const gameWinScreen = document.getElementById("gameWinScreen");
const playGameButton = document.getElementById("playGameButton");
const restartGameButton = document.getElementById("restartGameButton");

let isGameRunning = false;
let score = 0;
let gameLoopInterval;
let scoreInterval;

function jump() {
    if (!player.classList.contains("jump") && isGameRunning) {
        player.classList.add("jump");
        setTimeout(() => {
            player.classList.remove("jump");
        }, 600); 
    }
}

window.addEventListener("keydown", (e) => {
    if (e.code === "Space") {
        e.preventDefault();
        jump();
    }
});

gameContainer.addEventListener("click", () => {
    jump();
});

function startGame() {
    score = 0;
    scoreDisplay.textContent = score;
    gameStartScreen.classList.add("hidden");
    gameWinScreen.classList.add("hidden");
    obstacle.classList.add("moving");
    isGameRunning = true;

    scoreInterval = setInterval(() => {
        if (isGameRunning) {
            score++;
            scoreDisplay.textContent = score;

            if (score >= 140) {
                winGame();
            }
        }
    }, 100);

    gameLoopInterval = setInterval(() => {
        const playerBottom = parseInt(window.getComputedStyle(player).getPropertyValue("bottom"));
        const obstacleLeft = obstacle.offsetLeft;

        if (obstacleLeft > 40 && obstacleLeft < 75 && playerBottom <= 35) {
            endGame();
        }
    }, 10);
}

function endGame() {
    isGameRunning = false;
    obstacle.classList.remove("moving");
    clearInterval(scoreInterval);
    clearInterval(gameLoopInterval);
    playGameButton.textContent = `Poxa! Pontos: ${score} · Tentar de Novo 🐾`;
    gameStartScreen.classList.remove("hidden");
}

function winGame() {
    isGameRunning = false;
    obstacle.classList.remove("moving");
    clearInterval(scoreInterval);
    clearInterval(gameLoopInterval);
    gameWinScreen.classList.remove("hidden");
}

playGameButton.addEventListener("click", (e) => {
    e.stopPropagation();
    startGame();
});

restartGameButton.addEventListener("click", (e) => {
    e.stopPropagation();
    startGame();
});

// ===== SISTEMA DE MENSAGENS SURPRESAS (GRANDES AUTORES) =====
const surpriseButton = document.getElementById("surpriseButton");
const surpriseMessage = document.getElementById("surpriseMessage");

// Citações literárias e filosóficas sobre o amor e a conexão profunda
const messages = [
    "\"A maior felicidade é saber que você não é amado por aquilo que faz, mas por aquilo que você é.\" — Fyodor Dostoyevsky",
    "\"No meio do inverno, aprendi por fim que havia em mim um verão invencível... Encontrado através de você.\" — Albert Camus",
    "\"O amor não consiste em olhar um para o outro, mas em olhar juntos na mesma direção.\" — Antoine de Saint-Exupéry",
    "\"Se sei o que é o amor, é por sua causa.\" — Hermann Hesse",
    "\"Tenho em mim todos os sonhos do mundo, e cada um deles se parece com o seu sorriso.\" — Fernando Pessoa",
    "\"Duvida da luz dos astros, duvida que o sol se mova, duvida da própria verdade, mas nunca duvides do meu amor.\" — William Shakespeare",
    "\"A alma reconhece a sua metade não pela aparência, mas pela paz que ela traz ao coração.\" — Platão",
    "\"Não conheço nenhuma outra razão para amar senão amar.\" — Fernando Pessoa",
    "\"Seja qual for a matéria de que as nossas almas são feitas, a minha e a dele são iguais...\" — Emily Brontë",
    "\"A medida do amor é amar sem medida.\" — Santo Agostinho"
];

let lastIndex = -1;

surpriseButton.addEventListener("click", () => {
    surpriseMessage.classList.add("is-changing");
    
    setTimeout(() => {
        let randomIndex;
        do {
            randomIndex = Math.floor(Math.random() * messages.length);
        } while (randomIndex === lastIndex);
        
        lastIndex = randomIndex;
        surpriseMessage.textContent = messages[randomIndex];
        surpriseMessage.classList.remove("is-changing");
    }, 250);
});