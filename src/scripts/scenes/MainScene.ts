import { BaseScene } from "./BaseScene";
import { RoundRectangle } from "../components/RoundRectangle";
import { Player1 } from "../components/Player1";
import { Player2 } from "../components/Player2";
import { Egg } from "../components/Egg";


export class MainScene extends BaseScene {
	myImage: Phaser.GameObjects.Image;

	player1: Player1;
	player2: Player2;
	egg: Egg;


	constructor() {
		super({key: "MainScene"});
	}

	create(): void {
		this.fade(false, 200, 0x000000);

		// Adding an image
		// https://rexrainbow.github.io/phaser3-rex-notes/docs/site/image/
		this.myImage = this.add.image(this.CX, this.CY, "pika");
		this.myImage.setTint(0xFF0000);
		this.containToScreen(this.myImage);

		// Create Player-object and pass this/scene to it
		this.player1 = new Player1(this, 0.1*this.W, this.CY);
		this.player2 = new Player2(this, 0.9*this.W, this.CY);

		this.egg = new Egg(this, this.CX, this.CY);
		this.egg.setVelocity(140, 90);
	}

	update(time: number, delta: number) {
		this.player1.update(time, delta);
		this.player2.update(time, delta);
		this.egg.update(time, delta);
	}
}