import { BaseScene } from "../scenes/BaseScene";

export class Player extends Phaser.GameObjects.Container {
	public scene: BaseScene;

	// Input
	protected keys: any;

	// Graphics
	protected circle: Phaser.GameObjects.Ellipse;
	protected graphics: Phaser.GameObjects.Graphics;
	protected sprite: Phaser.GameObjects.Sprite;

	// Movement
	protected velocity: Phaser.Math.Vector2;
	protected facing: Phaser.Math.Vector2; // Used to determine throwing dir
	protected limit: { [key: string]: number }; 

	constructor(scene: BaseScene, x: number, y: number) {
		super(scene, x, y);
		this.scene = scene;
		scene.add.existing(this);

		// Create player sprite
		this.sprite = scene.add.sprite(0, 0, "player", 0);
		this.add(this.sprite); // Attach sprite to the Player-component

		// Debug graphics
		this.graphics = scene.add.graphics();
		this.add(this.graphics);

		this.velocity = new Phaser.Math.Vector2(0, 0);
		this.facing = new Phaser.Math.Vector2(1, 0);
		this.limit = {
			left: 16,
			right: scene.W-16,
			top: 16,
			bottom: scene.H-16,
		};
	}

	update(time: number, delta: number) {
		// Movement
		const speed = 25;
		if (this.keys) {
			if (this.keys.left.isDown) {
				this.velocity.x -= speed;
			}
			if (this.keys.right.isDown) {
				this.velocity.x += speed;
			}
			if (this.keys.down.isDown) {
				this.velocity.y += speed;
			}
			if (this.keys.up.isDown) {
				this.velocity.y -= speed;
			}
		}

		this.x += this.velocity.x * delta/1000;
		this.y += this.velocity.y * delta/1000;
		this.velocity.scale(0.9);

		if (this.velocity.lengthSq() > 0) {
			this.facing.copy(this.velocity);
			this.facing.normalize();
		}

		if (this.x < this.limit.left) {
			this.x = this.limit.left;
		}
		if (this.x > this.limit.right) {
			this.x = this.limit.right;
		}
		if (this.y < this.limit.top) {
			this.y = this.limit.top;
		}
		if (this.y > this.limit.bottom) {
			this.y = this.limit.bottom;
		}


		// Debug
		this.graphics.clear();
		this.graphics.lineStyle(4, 0xFF7700, 1.0);
		this.graphics.lineBetween(0, 0, 20*this.facing.x, 20*this.facing.y);
	}
}
