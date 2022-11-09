import "../../style.css";
import { World } from './World.js';

function main() {
const container = document.querySelector('#scene-container');

  // create a new world
  const world = new World(container);

  // start the animation loop
  world.start();
}

main();