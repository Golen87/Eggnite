import { BaseScene } from "../scenes/BaseScene";

const SHOOTING_TIMER = 5;


export class Dragon extends Phaser.GameObjects.Container {
	public scene: BaseScene;

	// Graphics
	private sprite: Phaser.GameObjects.Sprite;
	private graphics: Phaser.GameObjects.Graphics;

	// Movement
	public velocity: Phaser.Math.Vector2;
	public facing: Phaser.Math.Vector2; // Used to determine throwing dir
	private border: { [key: string]: number };

	// Shooting
	private timer: number;

	constructor(scene: BaseScene, x: number, y: number) {
		super(scene, x, y);
		this.scene = scene;
		scene.add.existing(this);

		// Create player sprite
		const size = 80;
		this.sprite = scene.add.sprite(0, 0, "dragon", 0);
		this.add(this.sprite); // Attach sprite to the Player-component

		// Animation
		// idle 0
		// charge 4

		// Debug graphics
		this.graphics = scene.add.graphics();
		this.add(this.graphics);

		// Movement
		this.velocity = new Phaser.Math.Vector2(0, 0);
		this.facing = new Phaser.Math.Vector2(1, 0);
		this.border = {
			left: 0.2*scene.W + size/2,
			right: 0.8*scene.W + size/2,
			top: size/2,
			bottom: scene.H - size/2,
		};

		this.timer = SHOOTING_TIMER - 1;
	}

	update(time: number, delta: number) {
		// Movement
		/*
		const speed = 25;

		this.x += this.velocity.x * delta/1000;
		this.y += this.velocity.y * delta/1000;
		this.velocity.scale(0.9);

		if (this.velocity.lengthSq() > 0) {
			this.facing.copy(this.velocity);
			this.facing.normalize();
		}

		if (this.x < this.border.left) {
			this.x = this.border.left;
		}
		if (this.x > this.border.right) {
			this.x = this.border.right;
		}
		if (this.y < this.border.top) {
			this.y = this.border.top;
		}
		if (this.y > this.border.bottom) {
			this.y = this.border.bottom;
		}
		*/

		// Simple rotation test
		this.facing.rotate(0.3*Math.PI * delta/1000);

		// Set direction
		this.sprite.setAngle(this.facing.angle() * Phaser.Math.RAD_TO_DEG - 90);


		// Shooting eggs
		this.timer += delta/1000;
		if (this.timer > SHOOTING_TIMER) {
			this.timer = 0;
			this.emit("shoot");
		}


		// Debug
		this.graphics.clear();
		this.graphics.lineStyle(1, 0x00FF00, 0.5);
		this.graphics.lineBetween(0, 0, 20*this.facing.x, 20*this.facing.y);
		this.graphics.strokeEllipse(10*this.facing.x, 10*this.facing.y, 80, 80);
		this.graphics.strokeEllipse(-30*this.facing.x, -30*this.facing.y, 30, 30);
	}
}
