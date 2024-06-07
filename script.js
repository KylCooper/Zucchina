// Initialisation des variables
let temps = 1500; // Par défaut, 25 minutes pour le travail
let intervalID = null; // Stocker l'identifiant de l'intervalle
let isPaused = false; // Indiquer si le minuteur est en pause ou non
let currentMode = 'default'; // Suivre le mode actuel (default, short, long)
let cycleCount = 0; // Compteur de cycles complétés
let workSessionCount = 0; // Compteur de sessions de travail complétées
let isAutoMode = false; // Variable pour suivre si le mode auto est activé

const WORK_DURATION = 1500; // 25 minutes
const SHORT_BREAK_DURATION = 300; // 5 minutes
const LONG_BREAK_DURATION = 900; // 15 minutes

// Élément HTML où afficher le minuteur
const timerElement = document.getElementById('timer');

// Boutons de contrôle du minuteur
const startTimerButton = document.getElementById('start'); // Bouton de démarrage
const defaultButton = document.getElementById('defaultButton'); // Bouton pour 25 minutes
const shortButton = document.getElementById('shortButton'); // Bouton pour 5 minutes
const longButton = document.getElementById('longButton'); // Bouton pour 15 minutes
const autoButton = document.getElementById('autoButton'); // Bouton pour le mode auto
const skipButton = document.getElementById('skipTimer'); // Bouton pour skip le timer
const resetTimerButton = document.getElementById('resetTimer'); // Bouton de réinitialisation du minuteur

// Tracking dots
const trackDots = [
    document.getElementById('trackingDot1'),
    document.getElementById('trackingDot2'),
    document.getElementById('trackingDot3'),
    document.getElementById('trackingDot4')
];

// Liste de tous les boutons de choix de temps
const timeOptionButtons = [defaultButton, shortButton, longButton, autoButton];

// Fonction pour ajouter la classe active au bouton sélectionné et la supprimer des autres
function setActiveButton(activeButton) {
    timeOptionButtons.forEach(button => {
        button.classList.remove('button-timer-active');
    });
    activeButton.classList.add('button-timer-active');
}

// Fonction pour formater le temps en minutes et secondes (mm:ss)
function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes < 10 ? '0' : ''}${minutes}:${secs < 10 ? '0' : ''}${secs}`;
}

// Fonction pour diminuer le temps du minuteur
function diminuerTemps() {
    if (temps > 0) {
        temps--;
        timerElement.innerText = formatTime(temps);
    } else {
        clearInterval(intervalID);
        intervalID = null;
        startTimerButton.innerHTML = `<i class="fa-solid fa-play"></i>`; // Affichage du bouton de démarrage

        // Gérer la fin du minuteur
        avancerCycle();
    }
}

// Fonction pour mettre à jour le tracker de cycles
function updateCycleTracker() {
    if (cycleCount < 5) {
        for (let i = 0; i < trackDots.length; i++) {
            trackDots[cycleCount - 1].classList.add('active-dot'); // Ajouter la classe active-dot au point
        }
    }
    else if (cycleCount === 5) {
        console.log(trackDots);
        for (let i = 0; i < trackDots.length; i++) {
            trackDots[i].classList.remove("active-dot");
            cycleCount = 0;
        }
    }
}

// Fonction pour avancer le cycle (appelée lors du skip ou de la fin d'un timer)
function avancerCycle() {
    if (currentMode === 'default') {
        workSessionCount++;
        if (workSessionCount < 4) {
            // Passer à une pause courte
            setTimer(SHORT_BREAK_DURATION, 'short');
        } else {
            // Passer à une pause longue après 4 sessions de travail
            setTimer(LONG_BREAK_DURATION, 'long');
            workSessionCount = 0; // Réinitialiser le compteur de sessions de travail
        }
    } else if (currentMode === 'short' || currentMode === 'long') {
        // Compléter un cycle et mettre à jour le tracker
        cycleCount++;
        updateCycleTracker();
        // Revenir au mode de travail
        setTimer(WORK_DURATION, 'default');
    }

    if (isAutoMode) {
        startTimer(); // Démarrer automatiquement le timer en mode auto
    }
}

// Fonction pour démarrer le timer
function startTimer() {
    if (intervalID === null) {
        diminuerTemps(); // Appeler diminuerTemps immédiatement après le clic sur Start
        intervalID = setInterval(diminuerTemps, 1000); // Intervalles de 1 seconde
        startTimerButton.innerHTML = `<i class="fa-solid fa-pause"></i>`; // Affichage de l'icône de pause sur le bouton
        isPaused = false;
    }
}

// Fonction pour définir le temps du minuteur en fonction du mode choisi
function setTimer(newTime, mode) {
    temps = newTime;
    currentMode = mode;
    timerElement.innerText = formatTime(temps);
    if (intervalID !== null) {
        clearInterval(intervalID);
        intervalID = null;
        startTimerButton.innerHTML = `<i class="fa-solid fa-play"></i>`; // Affichage de l'icône de démarrage sur le bouton
    }
}

// Écouteurs d'événements pour les boutons de choix de temps
defaultButton.addEventListener('click', () => {
    setTimer(WORK_DURATION, 'default'); // Définir le temps à 25 minutes
    setActiveButton(defaultButton); // Ajouter la classe active au bouton par défaut
});

shortButton.addEventListener('click', () => {
    setTimer(SHORT_BREAK_DURATION, 'short'); // Définir le temps à 5 minutes
    setActiveButton(shortButton); // Ajouter la classe active au bouton de pause courte
});

longButton.addEventListener('click', () => {
    setTimer(LONG_BREAK_DURATION, 'long'); // Définir le temps à 15 minutes
    setActiveButton(longButton); // Ajouter la classe active au bouton de pause longue
});

// Écouteur d'événement pour le bouton auto
autoButton.addEventListener('click', () => {
    setTimer(WORK_DURATION, 'default'); // Définir le temps à 25 minutes
    isAutoMode = !isAutoMode; // Basculer le mode auto
    autoButton.classList.toggle('active', isAutoMode); // Optionnel : ajouter une classe pour indiquer l'état actif
    if (isAutoMode) {
        startTimer(); // Démarrer le timer en mode auto
    }
    setActiveButton(autoButton); // Ajouter la classe active au bouton de pause longue
});

// Écouteur d'événement pour le bouton de démarrage/pause
startTimerButton.addEventListener('click', () => {
    if (intervalID === null) {
        // Démarrer le minuteur s'il n'est pas déjà en cours
        startTimer();
    } else {
        if (isPaused) {
            // Reprendre le minuteur s'il est en pause
            intervalID = setInterval(diminuerTemps, 1000); // Intervalles de 1 seconde
            startTimerButton.innerHTML = `<i class="fa-solid fa-pause"></i>`; // Affichage de l'icône de pause sur le bouton
            isPaused = false;
        } else {
            // Mettre en pause le minuteur s'il est en cours
            clearInterval(intervalID);
            intervalID = null;
            startTimerButton.innerHTML = `<i class="fa-solid fa-play"></i>`; // Affichage de l'icône de démarrage sur le bouton
            isPaused = true;
        }
    }
});

// Écouteur d'événement pour le bouton de réinitialisation du minuteur
resetTimerButton.addEventListener('click', () => {
    let newTime;
    if (currentMode === 'default') {
        newTime = WORK_DURATION;
    } else if (currentMode === 'short') {
        newTime = SHORT_BREAK_DURATION;
    } else if (currentMode === 'long') {
        newTime = LONG_BREAK_DURATION;
    }
    setTimer(newTime, currentMode);
});

// Événement pour le bouton skip 
skipButton.addEventListener('click', () => {
    avancerCycle(); // Avancer le cycle
    if (!isAutoMode) {
        startTimerButton.innerHTML = `<i class="fa-solid fa-play"></i>`; // Affichage de l'icône de démarrage sur le bouton
    }
    isPaused = false;
});



// Initialiser l'affichage du temps
timerElement.innerText = formatTime(temps);
