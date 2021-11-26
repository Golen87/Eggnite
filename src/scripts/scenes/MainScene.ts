import { BaseScene } from "./BaseScene";
import { RoundRectangle } from "../components/RoundRectangle";


export class MainScene extends BaseScene {
	myImage: Phaser.GameObjects.Image;
	keys: any;

	constructor() {
		super({key: "MainScene"});
	}

	create(): void {
		// this.fade(false, 200, 0x000000);

		// Adding an image
		// https://rexrainbow.github.io/phaser3-rex-notes/docs/site/image/
		this.myImage = this.add.image(500, 500, "pika");


		// Input
		// https://rexrainbow.github.io/phaser3-rex-notes/docs/site/keyboardevents/
		this.keys = this.input.keyboard.addKeys({
			up: 'up',
			down: 'down',
			left: 'left',
			right: 'right'
		});
	}

	update(time: number, delta: number) {
		if (this.keys.left.isDown)
			this.myImage.x -= 5;
		if (this.keys.right.isDown)
			this.myImage.x += 5;
		if (this.keys.down.isDown)
			this.myImage.y += 5;
		if (this.keys.up.isDown)
			this.myImage.y -= 5;
	}
}