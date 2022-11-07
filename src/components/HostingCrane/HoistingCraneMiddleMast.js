import * as THREE from "three";
import { HoistingCraneMiddle } from "./HoistingCraneMiddle/HoistingCraneMiddle.js";
import { HoistingCraneMast } from "./HoistingCraneMast/HoistingCraneMast.js";

class HoistingCraneMiddleMast extends THREE.Group {
	constructor() {
		super();
		this.hoistingCraneMiddle = new HoistingCraneMiddle();
		this.hoistingCraneMast = new HoistingCraneMast();
/* 		this.hoistingCraneMast.translateX(2.4);
		this.hoistingCraneMast.translateY(2.3949999999);
		this.hoistingCraneMast.translateZ(2);
		this.hoistingCraneMast.rotation.y = Math.PI / 4;
		this.hoistingCraneMast.translateX(-2.4);
		this.hoistingCraneMast.translateY(-2.3949999999);
		this.hoistingCraneMast.translateZ(-2); */

		this.add(this.hoistingCraneBottom, this.hoistingCraneMiddle, this.hoistingCraneMast);
	}
}

export { HoistingCraneMiddleMast };
