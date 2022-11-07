import * as THREE from "three";

import { Train } from "./Train.js";
import { Train2 } from "./Train2.js";
import { createMeshes } from "./meshes.js";

const wheelSpeed = THREE.MathUtils.degToRad(60);
let g_currentlyPressedKeys = [];
//Input - standard Javascript / WebGL:
document.addEventListener("keyup", handleKeyUp, false);
document.addEventListener("keydown", handleKeyDown, false);

class TrainGroup extends THREE.Group {
	constructor() {
		super();

		this.train = new Train();
		this.train2 = new Train2();
        this.train2.position.y = this.train.position.x + 2;
		this.meshes = createMeshes();

		this.add(this.train, this.train2);
	}

	tick(delta) {
		if (g_currentlyPressedKeys["KeyA"]) {
			this.train.meshes.bigWheel.rotation.y += wheelSpeed * delta;
			this.train.meshes.smallWheelRear.rotation.y += wheelSpeed * delta;
			this.train.meshes.smallWheelCenter.rotation.y += wheelSpeed * delta;
			this.train.meshes.smallWheelFront.rotation.y += wheelSpeed * delta;
		}
		if (g_currentlyPressedKeys["KeyD"]) {
			this.train.meshes.bigWheel.rotation.y -= wheelSpeed * delta;
			this.train.meshes.smallWheelRear.rotation.y -= wheelSpeed * delta;
			this.train.meshes.smallWheelCenter.rotation.y -= wheelSpeed * delta;
			this.train.meshes.smallWheelFront.rotation.y -= wheelSpeed * delta;
		}
		if (g_currentlyPressedKeys["KeyQ"]) {
			this.train2.meshes.bigWheel.scale.y += wheelSpeed * delta;
			this.train2.meshes.smallWheelRear.scale.y += wheelSpeed * delta;
			this.train2.meshes.smallWheelCenter.scale.y += wheelSpeed * delta;
			this.train2.meshes.smallWheelFront.scale.y += wheelSpeed * delta;
		}
		if (g_currentlyPressedKeys["KeyE"]) {
			this.train2.meshes.bigWheel.scale.y -= wheelSpeed * delta;
			this.train2.meshes.smallWheelRear.scale.y -= wheelSpeed * delta;
			this.train2.meshes.smallWheelCenter.scale.y -= wheelSpeed * delta;
			this.train2.meshes.smallWheelFront.scale.y -= wheelSpeed * delta;
		}
        if (g_currentlyPressedKeys["KeyZ"]) {
            this.train.translateX(1.5)
			this.train.rotation.y -= wheelSpeed * delta;
            this.train.translateX(-1.5)
		}
        if (g_currentlyPressedKeys["KeyX"]) {
			this.train.translateX(1.5)
			this.train.rotation.y += wheelSpeed * delta;
            this.train.translateX(-1.5)
		}
        if (g_currentlyPressedKeys["KeyW"]) {
			this.translateX(-wheelSpeed*delta);
		}
        if (g_currentlyPressedKeys["KeyS"]) {
			this.translateX(wheelSpeed*delta);
		}
	}
}

function handleKeyUp(event) {
	g_currentlyPressedKeys[event.code] = false;
}

function handleKeyDown(event) {
	g_currentlyPressedKeys[event.code] = true;
}

export { TrainGroup };
