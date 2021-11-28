import { BaseScene } from "./BaseScene";
import { RoundRectangle } from "../components/RoundRectangle";
import { Player } from "../components/Player";
import { Player1 } from "../components/Player1";
import { Player2 } from "../components/Player2";
import { Dragon } from "../components/Dragon";
import { Egg } from "../components/Egg";


export class MainScene extends BaseScene {
	level: number;
	isRunning: boolean;

	ground: Phaser.GameObjects.Image;
	myImage: Phaser.GameObjects.Image;

	player1: Player1;
	player2: Player2;
	dragon: Dragon;
	eggs: Egg[];

	public EGG_SPEED: number;
	public EGG_HEALTH: number;


	constructor() {
		super({key: "MainScene"});
	}

	init(data): void {
		this.level = data.level;
		this.isRunning = true;
	}

	create(): void {
		this.fade(false, 500, 0x000000);

		// Adding an image
		// https://rexrainbow.github.io/phaser3-rex-notes/docs/site/image/
		this.myImage = this.add.image(this.CX, this.CY, "pika");
		this.ground = this.add.image(this.CX, this.CY, "ground");
		this.myImage.setTint(0xFF0000);
		this.containToScreen(this.ground);
		this.containToScreen(this.myImage);

		// Create Player-object and pass this/scene to it
		this.player1 = new Player1(this, 0.1*this.W, this.CY);
		this.player2 = new Player2(this, 0.9*this.W, this.CY);

		this.dragon = new Dragon(this, this.CX, this.CY, this.level);
		this.dragon.setDepth(10);

		this.eggs = [];


		// Instructions
		this.createText(0, 0, 12, this.weights.regular, "#DDD", "WASD+F");
		this.createText(this.W, 0, 12, this.weights.regular, "#DDD", "Arrow+L").setOrigin(1,0);


		// Callbacks
		this.player1.on("grab", this.onGrab.bind(this, this.player1));
		this.player2.on("grab", this.onGrab.bind(this, this.player2));
		this.player1.on("throw", this.onThrow.bind(this, this.player1));
		this.player2.on("throw", this.onThrow.bind(this, this.player2));
		this.dragon.on("shoot", this.onShootEgg.bind(this));


		// Level settings

		if (this.level == 0) {

			this.dragon.health = 2;
			this.dragon.SHOOTING_TIMER = 5.5;
			this.EGG_SPEED = 100;
			this.EGG_HEALTH = 6;
			this.dragon.following = this.player2;

		}
		else if (this.level == 1) {

			this.dragon.health = 3;
			this.dragon.SHOOTING_TIMER = 4.5;
			this.EGG_SPEED = 140;
			this.EGG_HEALTH = 5;
			this.dragon.following = this.player1;

		}
		else if (this.level == 2) {

			this.dragon.health = 4;
			this.dragon.SHOOTING_TIMER = 4.0;
			this.EGG_SPEED = 180;
			this.EGG_HEALTH = 4;
			this.dragon.following = this.player2;

		}
		else if (this.level == 3) {

			this.dragon.health = 5;
			this.EGG_SPEED = 220;
			this.EGG_HEALTH = 3;
			this.dragon.SHOOTING_TIMER = 3.0;
			this.dragon.following = this.player1;

		}

		this.dragon.shootTimer = this.dragon.SHOOTING_TIMER - 2;


		// Touch controls

		this.input.addPointer(2);

		let leftArea = this.add.rectangle(0, 0, 0.4*this.W, this.H, 0xFFFFFF).setOrigin(0).setAlpha(0.001);
		leftArea.setInteractive({ useHandCursor: true, draggable: true });
		leftArea.on('dragstart', (pointer: Phaser.Input.Pointer) => {
			this.player1.touchStart(pointer.x, pointer.y);
		});
		leftArea.on('drag', (pointer: Phaser.Input.Pointer) => {
			this.player1.touchDrag(pointer.x, pointer.y);
		});
		leftArea.on('dragend', (pointer: Phaser.Input.Pointer) => {
			this.player1.touchEnd(pointer.x, pointer.y);
		});

		let rightArea = this.add.rectangle(this.W, 0, 0.4*this.W, this.H, 0xFFFFFF).setOrigin(1,0).setAlpha(0.001);
		rightArea.setInteractive({ useHandCursor: true, draggable: true });
		rightArea.on('dragstart', (pointer: Phaser.Input.Pointer) => {
			this.player2.touchStart(pointer.x, pointer.y);
		});
		rightArea.on('drag', (pointer: Phaser.Input.Pointer) => {
			this.player2.touchDrag(pointer.x, pointer.y);
		});
		rightArea.on('dragend', (pointer: Phaser.Input.Pointer) => {
			this.player2.touchEnd(pointer.x, pointer.y);
		});

		// Skip
		this.input.keyboard.on("keydown-ESC", () => {
			this.scene.start("OverworldScene", { level: this.level+1 });
		}, this);
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
					this.followClosestTarget();
				}
				return;
			}
			if (egg === this.dragon.following && !egg.alive) {
				this.followClosestTarget();
			}

			egg.update(time, delta);

			// Collision with dragon
			if (this.dragon.insideWeakSpot(egg)) {
				this.dragon.damage();
				this.dragon.following = egg.grabOwner; // Enraged
				egg.onDamage(999);
			}
			else if (this.dragon.insideHead(egg)) {
				egg.onDamage(999);
			}
		});

		// Check if destroyed
		if (this.isRunning && !this.dragon.scene) {
			this.isRunning = false;
			this.progress();
		}


		// Smarter dragon
		if (this.level >= 2 || this.dragon.mood == "angry") {
			if (this.dragon.following == this.player1) {
				if (this.player2.heldEgg && !this.player1.heldEgg) {
					this.dragon.following = this.player2;
				}
			}
			else if (this.dragon.following == this.player2) {
				if (this.player1.heldEgg && !this.player2.heldEgg) {
					this.dragon.following = this.player1;
				}
			}
		}

	}


	// On dragon egg-timer
	onShootEgg() {
		let x = this.dragon.x + 30 * this.dragon.facing.x;
		let y = this.dragon.y + 30 * this.dragon.facing.y;
		let egg = new Egg(this, x, y, this.EGG_SPEED, this.level);
		egg.health = this.EGG_HEALTH;
		egg.grabOwner = this.dragon;
		egg.velocity.x = this.EGG_SPEED*this.dragon.facing.x;
		egg.velocity.y = this.EGG_SPEED*this.dragon.facing.y;

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
				egg.grabOwner = player;
				egg.onGrab(player);

				if (this.dragon.following == egg && this.dragon.mood == "normal") {
					this.dragon.following = player;
				}
				return;
			}
		}
	}

	// On player clicking the grab-key while holding an egg
	onThrow(player: Player) {
		if (player.heldEgg) {
			player.heldEgg.onThrow(player);

			if (this.dragon.following == player && this.dragon.mood == "angry") {
				this.dragon.following = player.heldEgg;
			}
			player.heldEgg = null;
		}
	}

	followClosestTarget() {
		// Follow nearest player
		if (this.dragon.facing.x < 0) {
			this.dragon.following = this.player1;
		}
		else {
			this.dragon.following = this.player2;
		}
	}

	progress() {
		this.fade(true, 500, 0x000000);
		this.addEvent(550, () => {
			this.scene.start("OverworldScene", { level: this.level+1 });
		});
	}
}
