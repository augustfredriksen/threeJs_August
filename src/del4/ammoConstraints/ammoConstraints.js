import '../../style.css';
import * as THREE from "three";
import {
	createThreeScene,
	handleKeys,
	onWindowResize,
	renderScene,
	updateThree
} from "./myThreeHelper.js";

import {
	createAmmoWorld,
	updatePhysics
} from "./myAmmoHelper.js";

import {createHingedArm} from "./hingedarm.js";
import {createXZPlane} from "./xzplane.js";
import {createMovable} from "./movable.js";
import {createSpring} from "./spring.js";
import {createP2P} from "./point2point.js";

//Globale variabler:
let g_clock;
const g_currentlyPressedKeys = []
const XZPLANE_SIDELENGTH = 100;

//STARTER!
//Ammojs Initialization
Ammo().then( async function( AmmoLib ) {
	Ammo = AmmoLib;
	await main();
} );

export async function main() {
	//Input - standard Javascript / WebGL:
	document.addEventListener('keyup', handleKeyUp, false);
	document.addEventListener('keydown', handleKeyDown, false);

	// three:
	createThreeScene();

	// ammo
	createAmmoWorld(true);  //<<=== MERK!

	// three/ammo-objekter:
	addAmmoSceneObjects();

	// Klokke for animasjon
	g_clock = new THREE.Clock();

	//Håndterer endring av vindusstørrelse:
	window.addEventListener('resize', onWindowResize, false);
	//Input - standard Javascript / WebGL:
	document.addEventListener('keyup', handleKeyUp, false);
	document.addEventListener('keydown', handleKeyDown, false);

	// Start animasjonsløkka:
	animate(0);
}

function handleKeyUp(event) {
	g_currentlyPressedKeys[event.code] = false;
}

function handleKeyDown(event) {
	g_currentlyPressedKeys[event.code] = true;
}

function addAmmoSceneObjects() {
	createXZPlane(XZPLANE_SIDELENGTH);
	//screateSpheres(20);
	createHingedArm();
	createMovable();
	createSpring();
	createP2P();
}

function animate(currentTime, myThreeScene, myAmmoPhysicsWorld) {
	window.requestAnimationFrame((currentTime) => {
		animate(currentTime, myThreeScene, myAmmoPhysicsWorld);
	});
	let deltaTime = g_clock.getDelta();

	//Oppdaterer grafikken:
	updateThree(deltaTime);

	//Oppdaterer fysikken:
	updatePhysics(deltaTime);

	//Sjekker input:
	handleKeys(deltaTime, g_currentlyPressedKeys);

	//Tegner scenen med gitt kamera:
	renderScene();
}
