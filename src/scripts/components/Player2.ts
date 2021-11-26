import { BaseScene } from "../scenes/BaseScene";
import { Player } from "./Player";

export class Player2 extends Player {
	constructor(scene: BaseScene, x: number, y: number) {
		super(scene, x, y);

		// Set up input-keys. Access with the keys-object
		this.keys = scene.input.keyboard.addKeys({
			up: 'up',
			down: 'down',
			left: 'left',
			right: 'right'
		});
	}

	// update(time: number, delta: number) {
		// super.update(time, delta);
	// }
}