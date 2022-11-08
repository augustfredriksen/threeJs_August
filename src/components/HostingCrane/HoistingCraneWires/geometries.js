import * as THREE from "three";
import { PlaneGeometry } from "three";
import { Reflector } from "three/examples/jsm/objects/Reflector";

function createGeometries() {
	const wireSupport = new THREE.BoxGeometry(1, 1, 1);
	const hook = new THREE.TorusGeometry( .3, .1, 16, 100, -Math.PI);
	return {
		wireSupport,
	};
}

export { createGeometries };
