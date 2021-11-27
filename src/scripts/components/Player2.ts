import { BaseScene } from "../scenes/BaseScene";
import { Player } from "./Player";

export class Player2 extends Player {
	constructor(scene: BaseScene, x: number, y: number) {
		super(scene, x, y);

		this.facing.x = -1;

		// Set left border for player 2
		this.border.left = 0.8 * scene.W;

		// Set up input-keys. Access with the keys-object
		this.keys = scene.input.keyboard.addKeys({
			up: 'up',
			down: 'down',
			left: 'left',
			right: 'right',
			grab: '-'
		});

		scene.input.keyboard.on('keydown-L', this.grab, this);
		//scene.input.keyboard.on('keydown-MINUS', this.grab, this);
	}
}
