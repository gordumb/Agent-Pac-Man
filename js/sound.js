var EATING_SOUND = new buzz.sound([
    "./sound/eating.mp3" 
]);
var GHOST_EATEN_SOUND = new buzz.sound([
	"./sound/ghost-eaten.mp3" 
]);
var EXTRA_LIFE_SOUND = new buzz.sound([
    "./sound/extra-life.mp3" 
]);
var EAT_PILL_SOUND = new buzz.sound([
    "./sound/eat-pill.mp3" 
]);
var EAT_FRUIT_SOUND = new buzz.sound([
    "./sound/eat-fruit.mp3" 
]);
var EAT_GHOST_SOUND = new buzz.sound([
    "./sound/eat-ghost.mp3" 
]);
var SIREN_SOUND = new buzz.sound([
    "./sound/siren.mp3" 
]);
var WAZA_SOUND = new buzz.sound([
    "./sound/waza.mp3" 
]);
var READY_SOUND = new buzz.sound([
    "./sound/ready.mp3" 
]);
var DIE_SOUND = new buzz.sound([
    "./sound/die.mp3" 
]);

var GROUP_SOUND = new buzz.group( [ EATING_SOUND, SIREN_SOUND, EAT_PILL_SOUND, EAT_GHOST_SOUND, READY_SOUND, DIE_SOUND, WAZA_SOUND, GHOST_EATEN_SOUND, EXTRA_LIFE_SOUND, EAT_FRUIT_SOUND ] );

var EATING_SOUND_LOOPING = false;

function isAvailableSound() { 
	return !($("#sound").css("display") === "none");
}

function loadAllSound() { 
	if ( isAvailableSound() ) GROUP_SOUND.load();
}

function playEatingSound() { 
	if (isAvailableSound()) { 
		if ( !EATING_SOUND_LOOPING ) {
			try {
				EATING_SOUND_LOOPING = true;
			
				EATING_SOUND.setSpeed(1.35);
				EATING_SOUND.loop();
				EATING_SOUND.play();
			} catch (e) {};
		}
	}
}
function stopEatingSound() { 
	if (isAvailableSound()) { 
		if ( EATING_SOUND_LOOPING ) { 
			EATING_SOUND.unloop();
			EATING_SOUND_LOOPING = false;
		}
	}
}

function playExtraLifeSound() { 
	if (isAvailableSound()) { 
		try {
			EXTRA_LIFE_SOUND.play();
		} catch (e) {};
	}
}

function playEatFruitSound() { 
	if (isAvailableSound()) { 
		try {
			EAT_FRUIT_SOUND.play();
		} catch (e) {};
	}
}
function playEatPillSound() { 
	if (isAvailableSound()) { 
		try {
			EAT_PILL_SOUND.play();
		} catch (e) {};
	}
}
function playEatGhostSound() { 
	if (isAvailableSound()) {
		try {
			EAT_GHOST_SOUND.play();
		} catch (e) {};
	}
}

function playWazaSound() { 
	if (isAvailableSound()) { 
		stopSirenSound();
		stopEatSound();
		WAZA_SOUND.loop();
		try {
			WAZA_SOUND.play();
		} catch (e) {};
	}
}
function stopWazaSound() { 
	if (isAvailableSound()) { 
		WAZA_SOUND.stop();
	}
}

function playGhostEatenSound() { 
	if (isAvailableSound()) { 
		stopSirenSound();
		stopWazaSound();
		try {
			GHOST_EATEN_SOUND.play();
		} catch (e) {};
		GHOST_EATEN_SOUND.loop();
	}
}
function stopEatSound() { 
	if (isAvailableSound()) { 
		GHOST_EATEN_SOUND.stop();
	}
}

function playSirenSound() { 
	if (isAvailableSound()) { 
		stopWazaSound();
		stopEatSound();
		try {
			SIREN_SOUND.loop();
			SIREN_SOUND.play();
		} catch (e) {};
	}
}
function stopSirenSound() { 
	if (isAvailableSound()) { 
		SIREN_SOUND.stop();
	}
}

function playReadySound() { 
	if (isAvailableSound()) { 
		try {
			READY_SOUND.play();
		} catch (e) {};
	}
}

function playDieSound() { 
	if (isAvailableSound()) { 
		GROUP_SOUND.stop();
		try {
			DIE_SOUND.play();
		} catch (e) {};
	}
}

function stopAllSound() { 
	if (isAvailableSound()) { 
		GROUP_SOUND.stop();
	}
}