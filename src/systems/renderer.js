import * as THREE from "three";

function createRenderer() {
	const renderer = new THREE.WebGLRenderer({ antialias: true });
	renderer.shadowMap.enabled = true;
	renderer.shadowMap.type = THREE.PCFSoftShadowMap; // default THREE.PCFShadowMap

	renderer.physicallyCorrectLights = true;

	return renderer;
}

export { createRenderer };
