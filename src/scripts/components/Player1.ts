import { BaseScene } from "../scenes/BaseScene";
import { Player } from "./Player";

export class Player1 extends Player {
	constructor(scene: BaseScene, x: number, y: number) {
		super(scene, x, y);

		this.facing.x = 1;

		// Set right border for player 1
		this.border.right = 0.2 * scene.W;

		// Set up input-keys. Access with the keys-object
		this.keys = scene.input.keyboard.addKeys({
			up: 'W',
			down: 'S',
			left: 'A',
			right: 'D'
		});

		scene.input.keyboard.on('keydown-F', this.grab, this);
	}
}