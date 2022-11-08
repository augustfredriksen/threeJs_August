import { createCamera } from "../components/camera.js";
import { createAxesHelper, createGridHelper } from "../components/helpers.js";
import { createLights } from "../components/lights.js";
import { createScene } from "../components/scene.js";
import { createControls } from "../systems/controls.js";
import { createRenderer } from "../systems/renderer.js";
import { Resizer } from "../systems/Resizer.js";
import { Loop } from "../systems/Loop.js";
import { Plane } from "../components/Plane/Plane.js";
import { HoistingCraneBottom } from "../components/HostingCrane/HoistingCraneBottom/HoistingCraneBottom.js";
import { HoistingCrane } from "../components/HostingCrane/HoistingCrane.js";
import GUI from "lil-gui";

let camera;
let renderer;
let scene;
let loop;

class World {
	constructor(container) {
		camera = createCamera();
		renderer = createRenderer();
		scene = createScene();
		loop = new Loop(camera, scene, renderer);
		container.append(renderer.domElement);

		const controls = createControls(camera, renderer.domElement);
		const { ambientLight, mainLight, mainLightHelper, mainLightCameraHelper } = createLights();
		const plane = new Plane();
		plane.receiveShadow = true;
		const hoistingCrane = new HoistingCrane();
		hoistingCrane.scale.set(0.5, 0.5, 0.5);
		mainLight.target = hoistingCrane;

		loop.updatables.push(controls, plane, hoistingCrane);
		scene.add(ambientLight, mainLight, mainLightHelper, mainLightCameraHelper, plane, hoistingCrane);
		const lilGui = new GUI();
		const directionalFolder = lilGui.addFolder("Directional Light2");
		const headlightFolder = lilGui.addFolder("Headlights");
		headlightFolder
			.add(hoistingCrane.hoistingCraneMiddleMast.hoistingCraneMiddle.meshes.headLightGroup.children[2], "visible")
			.name("On/Off");
		directionalFolder.add(mainLight, "visible").name("On/Off");
		directionalFolder.add(mainLight, "intensity").min(0).max(10).step(0.01).name("Intensity");

		const resizer = new Resizer(container, camera, renderer);

		scene.add(createAxesHelper(), createGridHelper());
	}

	render() {
		renderer.render(scene, camera);
	}

	start() {
		loop.start();
	}

	stop() {
		loop.stop();
	}
}

export { World };
