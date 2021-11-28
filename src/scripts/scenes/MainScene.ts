import { BaseScene } from "./BaseScene";
import { RoundRectangle } from "../components/RoundRectangle";
import { Player } from "../components/Player";
import { Player1 } from "../components/Player1";
import { Player2 } from "../components/Player2";
import { Dragon } from "../components/Dragon";
import { Egg } from "../components/Egg";


export class MainScene extends BaseScene {
	myImage: Phaser.GameObjects.Image;

	player1: Player1;
	player2: Player2;
	dragon: Dragon;
	eggs: Egg[];


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

		this.dragon = new Dragon(this, this.CX, this.CY);

		this.eggs = [];


		// Instructions
		this.createText(0, 0, 12, this.weights.regular, "#DDD", "WASD+F");
		this.createText(this.W, 0, 12, this.weights.regular, "#DDD", "Arrow+minus").setOrigin(1,0);


		// Callbacks
		this.player1.on("grab", this.onGrab.bind(this, this.player1));
		this.player2.on("grab", this.onGrab.bind(this, this.player2));
		this.player1.on("throw", this.onThrow.bind(this, this.player1));
		this.player2.on("throw", this.onThrow.bind(this, this.player2));
		this.dragon.on("shoot", this.onShootEgg.bind(this));
	}

	update(time: number, delta: number) {
		this.player1.update(time, delta);
		this.player2.update(time, delta);
		this.dragon.update(time, delta);

		this.eggs.forEach((egg: Egg, index: number) => {
			// Hack to remove egg from list when destroyed
			if (!egg.scene) {
				this.eggs.splice(index, 1);
				if (egg === this.dragon.following) {
					this.dragon.following = null;
				}
				return;
			}

			egg.update(time, delta);

			// Collision with dragon
			if (this.dragon.insideWeakSpot(egg)) {
				this.dragon.damage();
				egg.onDamage(999);
			}
			else if (this.dragon.insideHead(egg)) {
				egg.onDamage(999);
			}
		});
	}


	// On dragon egg-timer
	onShootEgg() {
		const EGG_SPEED = 150;

		let egg = new Egg(this, this.dragon.x, this.dragon.y);
		egg.velocity.x = EGG_SPEED*this.dragon.facing.x;
		egg.velocity.y = EGG_SPEED*this.dragon.facing.y;

		// egg.on("dead", () => {
			// this.eggs.splice(this.eggs.indexOf(egg), 1);
			// egg.destroy();
		// });

		this.eggs.push(egg);
		if (this.dragon.following === null) {
			this.dragon.following = egg;
		}
	}

	// On player clicking the grab-key
	onGrab(player: Player) {
		for (let egg of this.eggs) {
			// Checks proximity
			if (player.canGrab(egg)) {
				player.heldEgg = egg;
				egg.onGrab(player);
				break;
			}
		}
	}

	// On player clicking the grab-key while holding an egg
	onThrow(player: Player) {
		if (player.heldEgg) {
			player.heldEgg.onThrow(player);
			player.heldEgg = null;
		}
	}
}
