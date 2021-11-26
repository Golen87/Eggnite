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

		this.limit.left = (1 - 0.20) * scene.W; // Set left border for player 2
	}

	// update(time: number, delta: number) {
		// super.update(time, delta);
	// }
}