import { createCamera } from '../components/camera.js';
import {
  createAxesHelper,
  createGridHelper,
} from '../components/helpers.js';
import { createLights } from '../components/lights.js';
import { createScene } from '../components/scene.js';
import { createControls } from '../systems/controls.js';
import { createRenderer } from '../systems/renderer.js';
import { Resizer } from '../systems/Resizer.js';
import { Loop } from '../systems/Loop.js';
import { Plane } from '../components/Plane/Plane.js';
import { HoistingCraneBottom } from '../components/HostingCrane/HoistingCraneBottom/HoistingCraneBottom.js';
import { HoistingCrane } from '../components/HostingCrane/HoistingCrane.js';

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
    const {  ambientLight, mainLight, mainLightHelper, mainLightCameraHelper } = createLights();
    const plane = new Plane();
    plane.receiveShadow = true;
    const hoistingCrane = new HoistingCrane();
    mainLight.target = hoistingCrane;

    loop.updatables.push(controls, plane, hoistingCrane);
    scene.add( ambientLight, mainLight, mainLightHelper, mainLightCameraHelper, plane, hoistingCrane);

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
