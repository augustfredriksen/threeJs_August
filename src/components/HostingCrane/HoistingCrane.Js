import * as THREE from "three";
import { HoistingCraneBottom } from "./HoistingCraneBottom/HoistingCraneBottom.js";
import { HoistingCraneMiddleMast } from "./HoistingCraneMiddleMast.js";

const wheelSpeed = THREE.MathUtils.degToRad(60);
let g_currentlyPressedKeys = [];
//Input - standard Javascript / WebGL:
document.addEventListener("keyup", handleKeyUp, false);
document.addEventListener("keydown", handleKeyDown, false);
const positionElement = document.getElementById("p1");
var target = new THREE.Vector3();

class HoistingCrane extends THREE.Group {
	constructor() {
		super();
		this.hoistingCraneBottom = new HoistingCraneBottom();
		this.hoistingCraneMiddleMast = new HoistingCraneMiddleMast();
		this.add(this.hoistingCraneBottom, this.hoistingCraneMiddleMast);
	}

	tick(delta) {
		const lineVertexPositions =
			this.hoistingCraneMiddleMast.hoistingCraneMast.meshes.line.geometry.attributes.position.array;
		lineVertexPositions[0] = this.hoistingCraneMiddleMast.hoistingCraneMast.meshes.topOfMast.position.x;
		lineVertexPositions[1] = this.hoistingCraneMiddleMast.hoistingCraneMast.meshes.topOfMast.position.y;
		lineVertexPositions[2] = this.hoistingCraneMiddleMast.hoistingCraneMast.meshes.topOfMast.position.z;
		lineVertexPositions[3] = this.hoistingCraneMiddleMast.hoistingCraneMast.meshes.hook.position.x;
		lineVertexPositions[4] = this.hoistingCraneMiddleMast.hoistingCraneMast.meshes.hook.position.y;
		lineVertexPositions[5] = this.hoistingCraneMiddleMast.hoistingCraneMast.meshes.hook.position.z;
		this.hoistingCraneMiddleMast.hoistingCraneMast.meshes.line.geometry.attributes.position.needsUpdate = true;
		this.hoistingCraneMiddleMast.hoistingCraneMast.meshes.line.geometry.computeBoundingBox();
		this.hoistingCraneMiddleMast.hoistingCraneMast.meshes.line.geometry.computeBoundingSphere();

		const lineVertexPositions2 =
		this.hoistingCraneMiddleMast.hoistingCraneMast.meshes.line2.geometry.attributes.position.array;
	lineVertexPositions2[0] = this.hoistingCraneMiddleMast.hoistingCraneMast.meshes.topOfMast.position.x;
	lineVertexPositions2[1] = this.hoistingCraneMiddleMast.hoistingCraneMast.meshes.topOfMast.position.y;
	lineVertexPositions2[2] = this.hoistingCraneMiddleMast.hoistingCraneMast.meshes.topOfMast.position.z;
	lineVertexPositions2[3] = this.hoistingCraneMiddleMast.hoistingCraneMiddle.meshes.wireDisc.position.x;
	lineVertexPositions2[4] = this.hoistingCraneMiddleMast.hoistingCraneMiddle.meshes.wireSupportDisc.position.y/2;
	lineVertexPositions2[5] = this.hoistingCraneMiddleMast.hoistingCraneMiddle.meshes.wireDisc.position.z;
	this.hoistingCraneMiddleMast.hoistingCraneMast.meshes.line2.geometry.attributes.position.needsUpdate = true;
	this.hoistingCraneMiddleMast.hoistingCraneMast.meshes.line2.geometry.computeBoundingBox();
	this.hoistingCraneMiddleMast.hoistingCraneMast.meshes.line2.geometry.computeBoundingSphere();
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

			if (this.hoistingCraneMiddleMast.hoistingCraneMast.rotation.z <= -0.3) {
				this.hoistingCraneMiddleMast.hoistingCraneMast.meshes.hook.translateX(-wheelSpeed * 5 * delta);
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

			if (this.hoistingCraneMiddleMast.hoistingCraneMast.rotation.z >= -0.8) {
				this.hoistingCraneMiddleMast.hoistingCraneMast.meshes.hook.translateX(wheelSpeed * 5 * delta);
				this.hoistingCraneMiddleMast.hoistingCraneMast.rotation.z -= wheelSpeed * delta;

				console.log(
					this.hoistingCraneMiddleMast.hoistingCraneMast.meshes.middleMast.getWorldPosition(target).x
				);
			}
			this.hoistingCraneMiddleMast.hoistingCraneMast.translateY(-2.3949999999);
			this.hoistingCraneMiddleMast.hoistingCraneMast.translateX(-2.4);
			this.hoistingCraneMiddleMast.hoistingCraneMast.translateZ(-2);
		}

		if (g_currentlyPressedKeys["KeyZ"]) {
			if (this.hoistingCraneMiddleMast.hoistingCraneMast.meshes.hook.position.y <= 11) {
				this.hoistingCraneMiddleMast.hoistingCraneMast.meshes.hook.translateY(wheelSpeed * 5 * delta);
			}
		}
		if (g_currentlyPressedKeys["KeyX"]) {
			if (this.hoistingCraneMiddleMast.hoistingCraneMast.meshes.hook.position.y >= 3.2) {
				this.hoistingCraneMiddleMast.hoistingCraneMast.meshes.hook.translateY(-wheelSpeed * 5 * delta);
			}
		}

		positionElement.innerHTML =
			"X: " +
			this.hoistingCraneMiddleMast.hoistingCraneMiddle.meshes.wireDisc.position.x +
			"\n" +
			"Z ROTATION: " +
			this.hoistingCraneMiddleMast.hoistingCraneMast.meshes.hook.position.y +
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
