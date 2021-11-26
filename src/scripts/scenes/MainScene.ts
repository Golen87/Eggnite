import { BaseScene } from "./BaseScene";
import { RoundRectangle } from "../components/RoundRectangle";
import { Player1 } from "../components/Player1";
import { Player2 } from "../components/Player2";


export class MainScene extends BaseScene {
	myImage: Phaser.GameObjects.Image;

	player1: Player1;
	player2: Player2;


	constructor() {
		super({key: "MainScene"});
	}

	create(): void {
		this.fade(false, 200, 0x000000);

		// Adding an image
		// https://rexrainbow.github.io/phaser3-rex-notes/docs/site/image/
		this.myImage = this.add.image(500, 500, "pika");

		// Create Player-object and pass this/scene to it
		this.player1 = new Player1(this, 700, 400);
		this.player2 = new Player2(this, 1400, 800);
	}

	update(time: number, delta: number) {
		this.player1.update(time, delta);
		this.player2.update(time, delta);
	}
}