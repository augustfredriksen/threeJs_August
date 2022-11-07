import * as THREE from "three";
import { HoistingCraneBottom } from "./HoistingCraneBottom/HoistingCraneBottom.js";
import { HoistingCraneMiddleMast } from "./HoistingCraneMiddleMast.js";

const wheelSpeed = THREE.MathUtils.degToRad(60);
let g_currentlyPressedKeys = [];
//Input - standard Javascript / WebGL:
document.addEventListener("keyup", handleKeyUp, false);
document.addEventListener("keydown", handleKeyDown, false);
const positionElement = document.getElementById("p1");

class HoistingCrane extends THREE.Group {
	constructor() {
		super();
		this.hoistingCraneBottom = new HoistingCraneBottom();
		this.hoistingCraneMiddleMast = new HoistingCraneMiddleMast();
		this.add(this.hoistingCraneBottom, this.hoistingCraneMiddleMast);
	}

	tick(delta) {
		if (g_currentlyPressedKeys["KeyW"]) {
			// BELTETEKSTUR ROTERER
			this.hoistingCraneBottom.meshes.beltRight.material.map.offset.x += (wheelSpeed / 3) * delta;
			this.hoistingCraneBottom.meshes.beltRight.material.map.offset.x %= 1;
			this.hoistingCraneBottom.meshes.beltLeft.material.map.offset.x += (wheelSpeed / 3) * delta;
			this.hoistingCraneBottom.meshes.beltLeft.material.map.offset.x %= 1;

			// KJØRER FRAM
			this.translateX(wheelSpeed * 2 * delta);
		}
		if (g_currentlyPressedKeys["KeyS"]) {
			// BELTETEKSTUR ROTERER
			this.hoistingCraneBottom.meshes.beltRight.material.map.offset.x -= (wheelSpeed / 3) * delta;
			this.hoistingCraneBottom.meshes.beltRight.material.map.offset.x %= 1;
			this.hoistingCraneBottom.meshes.beltLeft.material.map.offset.x -= (wheelSpeed / 3) * delta;
			this.hoistingCraneBottom.meshes.beltLeft.material.map.offset.x %= 1;

			// KJØRER BAK
			this.translateX(-wheelSpeed * 2 * delta);
		}
		if (g_currentlyPressedKeys["KeyA"]) {
			// BELTETEKSTUR ROTERER
			this.hoistingCraneBottom.meshes.beltRight.material.map.offset.x -= (wheelSpeed / 3) * delta;
			this.hoistingCraneBottom.meshes.beltRight.material.map.offset.x %= 1;
			this.hoistingCraneBottom.meshes.beltLeft.material.map.offset.x += (wheelSpeed / 3) * delta;
			this.hoistingCraneBottom.meshes.beltLeft.material.map.offset.x %= 1;

			// ROTERER BUNNPARTIET
			this.hoistingCraneBottom.translateZ(this.hoistingCraneBottom.meshes.beltLeft.position.z / 2);
			this.hoistingCraneBottom.rotation.y += wheelSpeed * delta;
			this.hoistingCraneBottom.rotation.y %= Math.PI * 2;
			this.hoistingCraneBottom.translateZ(-this.hoistingCraneBottom.meshes.beltLeft.position.z / 2);
		}
		if (g_currentlyPressedKeys["KeyD"]) {
			// BELTETEKSTUR ROTERER
			this.hoistingCraneBottom.meshes.beltRight.material.map.offset.x += (wheelSpeed / 3) * delta;
			this.hoistingCraneBottom.meshes.beltRight.material.map.offset.x %= 1;
			this.hoistingCraneBottom.meshes.beltLeft.material.map.offset.x -= (wheelSpeed / 3) * delta;
			this.hoistingCraneBottom.meshes.beltLeft.material.map.offset.x %= 1;

			// ROTERER BUNNPARTIET
			this.hoistingCraneBottom.translateZ(this.hoistingCraneBottom.meshes.beltLeft.position.z / 2);
			this.hoistingCraneBottom.rotation.y -= wheelSpeed * delta;
			this.hoistingCraneBottom.rotation.y %= Math.PI * 2;
			this.hoistingCraneBottom.translateZ(-this.hoistingCraneBottom.meshes.beltLeft.position.z / 2);
		}
		if (g_currentlyPressedKeys["KeyQ"]) {
			// ROTERER MIDTPARTIET
			this.hoistingCraneMiddleMast.translateZ(this.hoistingCraneBottom.meshes.beltLeft.position.z / 2);
			this.hoistingCraneMiddleMast.rotation.y += wheelSpeed * delta;
			this.hoistingCraneMiddleMast.rotation.y %= Math.PI * 2;
			this.hoistingCraneMiddleMast.translateZ(-this.hoistingCraneBottom.meshes.beltLeft.position.z / 2);
		}
		if (g_currentlyPressedKeys["KeyE"]) {
			// ROTERER MIDTPARTIET
			this.hoistingCraneMiddleMast.translateZ(this.hoistingCraneBottom.meshes.beltLeft.position.z / 2);
			this.hoistingCraneMiddleMast.rotation.y -= wheelSpeed * delta;
			this.hoistingCraneMiddleMast.rotation.y %= Math.PI * 2;
			this.hoistingCraneMiddleMast.translateZ(-this.hoistingCraneBottom.meshes.beltLeft.position.z / 2);
		}
		if (g_currentlyPressedKeys["KeyR"]) {
			this.hoistingCraneMiddleMast.hoistingCraneMast.translateZ(2);
			this.hoistingCraneMiddleMast.hoistingCraneMast.translateX(2.4);
			this.hoistingCraneMiddleMast.hoistingCraneMast.translateY(2.3949999999);

			if(this.hoistingCraneMiddleMast.hoistingCraneMast.rotation.z <= 0) {
				this.hoistingCraneMiddleMast.hoistingCraneMast.rotation.z += wheelSpeed * delta;
			}
			
			this.hoistingCraneMiddleMast.hoistingCraneMast.translateY(-2.3949999999);
			this.hoistingCraneMiddleMast.hoistingCraneMast.translateX(-2.4);
			this.hoistingCraneMiddleMast.hoistingCraneMast.translateZ(-2);
		}
		if (g_currentlyPressedKeys["KeyT"]) {
			this.hoistingCraneMiddleMast.hoistingCraneMast.translateZ(2);
			this.hoistingCraneMiddleMast.hoistingCraneMast.translateX(2.4);
			this.hoistingCraneMiddleMast.hoistingCraneMast.translateY(2.3949999999);

			if(this.hoistingCraneMiddleMast.hoistingCraneMast.rotation.z >= -0.8) {
				this.hoistingCraneMiddleMast.hoistingCraneMast.rotation.z -= wheelSpeed * delta;
			}

			this.hoistingCraneMiddleMast.hoistingCraneMast.translateY(-2.3949999999);
			this.hoistingCraneMiddleMast.hoistingCraneMast.translateX(-2.4);
			this.hoistingCraneMiddleMast.hoistingCraneMast.translateZ(-2);
		}
		positionElement.innerHTML =
			"X: " +
			this.hoistingCraneBottom.position.x +
			"\n" +
			"Z ROTATION: " +
			this.hoistingCraneMiddleMast.hoistingCraneMast.rotation.z +
			"\n" +
			"Z: " +
			this.hoistingCraneBottom.position.z;
			

	}
}

function handleKeyUp(event) {
	g_currentlyPressedKeys[event.code] = false;
}

function handleKeyDown(event) {
	g_currentlyPressedKeys[event.code] = true;
}

export { HoistingCrane };
