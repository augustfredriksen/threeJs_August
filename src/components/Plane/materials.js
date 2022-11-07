import * as THREE from "three";

function createMaterials() {
	const textureLoader = new THREE.TextureLoader();
	const texture = textureLoader.load("../../../assets/textures/plastic.jpg");

	const body = new THREE.MeshStandardMaterial({
		flatShading: true,
		map: texture,
        side: THREE.DoubleSide,
	});

	return { body };
}

export { createMaterials };
