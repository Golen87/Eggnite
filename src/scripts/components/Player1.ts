import { BaseScene } from "../scenes/BaseScene";
import { Player } from "./Player";

export class Player1 extends Player {
	constructor(scene: BaseScene, x: number, y: number) {
		super(scene, x, y);

		// Set up input-keys. Access with the keys-object
		this.keys = scene.input.keyboard.addKeys({
			up: 'W',
			down: 'S',
			left: 'A',
			right: 'D'
		});
	}

	// update(time: number, delta: number) {
		// super.update(time, delta);
	// }
}