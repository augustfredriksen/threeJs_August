import { createCamera } from '../../components/camera.js';
import {
  createAxesHelper,
  createGridHelper,
} from '../../components/helpers.js';
import { createLights } from '../../components/lights.js';
import { createScene } from '../../components/scene.js';
import { Train } from '../../components/Train/Train.js';
import { Train2 } from '../../components/Train/Train2.js';
import { TrainGroup } from '../../components/Train/TrainGroup.js';

import { createControls } from '../../systems/controls.js';
import { createRenderer } from '../../systems/renderer.js';
import { Resizer } from '../../systems/Resizer.js';
import { Loop } from '../../systems/Loop.js';

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
    const { ambientLight, mainLight } = createLights();
    //const train = new Train();
    //const train2 = new Train2();
    const traingroup = new TrainGroup();
    //train2.position.z = 3;

    loop.updatables.push(controls, traingroup);
    scene.add(ambientLight, mainLight, traingroup);

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
