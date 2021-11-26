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

		this.limit.right = 0.20 * scene.W; // Set right border for player 1
	}

	// update(time: number, delta: number) {
		// super.update(time, delta);
	// }
}