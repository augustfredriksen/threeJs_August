import '../../style.css';
//Threejs-biblioteket (importert via package.json):
import * as THREE from "three";
//Globale variabler:
let g_scene, g_renderer;
//STARTER!
main();
export function main() {
	const canvas = document.createElement('canvas');
	document.body.appendChild(canvas);
	// Renderer:
	g_renderer = new THREE.WebGLRenderer({canvas: canvas, antialias: true});
	g_renderer.setSize(window.innerWidth, window.innerHeight);
	// Scene
	g_scene = new THREE.Scene();
	g_scene.background = new THREE.Color( 0xdddddd );
	// Kuben:
	let geometry = new THREE.BoxGeometry(1, 1, 1);
	let material = new THREE.MeshBasicMaterial({color: 0xffff00});
	let cube = new THREE.Mesh(geometry, material);
	g_scene.add(cube);

	// Kamera:
	const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
	camera.position.x = 0;
	camera.position.y = 0;
	camera.position.z = 7;
	// Start animasjonsløkka:
	animate(0, camera);
}

function animate(currentTime, camera) {
	window.requestAnimationFrame((currentTime) => {
		animate(currentTime, camera);
	});
	g_renderer.render(g_scene, camera);
}
