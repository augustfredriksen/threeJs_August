import * as THREE from "three";

function createMaterials() {
	const textureLoader = new THREE.TextureLoader();
	const texture = textureLoader.load("../../../assets/textures/dirt.jpg");
	const normalMap = textureLoader.load("../../../assets/textures/normal.jpg");

	texture.encoding = THREE.sRGBEncoding;
	texture.repeat.set(1.5, 1.5,);
	texture.wrapS = THREE.RepeatWrapping;
	texture.wrapT = THREE.RepeatWrapping;

	normalMap.repeat.set(1.5, 1.5,);
	normalMap.wrapS = THREE.RepeatWrapping;
	normalMap.wrapT = THREE.RepeatWrapping;


	const body = new THREE.MeshStandardMaterial({
		flatShading: true,
		map: texture,
		normalMap: normalMap,
        side: THREE.DoubleSide,
	});

	return { body };
}

export { createMaterials };
