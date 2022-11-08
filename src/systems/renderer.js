import * as THREE from "three";

function createRenderer() {
	const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.physicallyCorrectLights = true
  renderer.outputEncoding = THREE.sRGBEncoding
  renderer.toneMapping = THREE.CineonToneMapping
  renderer.toneMappingExposure = 1.75
  renderer.shadowMap.enabled = true
  renderer.shadowMap.type = THREE.PCFSoftShadowMap
  renderer.setClearColor('#211d20')
  renderer.setSize(window.innerWidth, window.innerHeight)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

	renderer.physicallyCorrectLights = true;

	return renderer;
}

export { createRenderer };
