import { BaseScene } from "../scenes/BaseScene";

export class Egg extends Phaser.GameObjects.Container {
	public scene: BaseScene;

	private circle: Phaser.GameObjects.Ellipse;

	public velocity: Phaser.Math.Vector2;

	constructor(scene: BaseScene, x: number, y: number) {
		super(scene, x, y);
		this.scene = scene;
		scene.add.existing(this);

		// Create player sprite
		const size = 32;
		this.circle = scene.add.ellipse(0, 0, size, size, 0xFFFF00);
		this.add(this.circle);

		this.velocity = new Phaser.Math.Vector2(0, 0);
	}

	update(time: number, delta: number) {
		this.x += this.velocity.x * delta/1000;
		this.y += this.velocity.y * delta/1000;

		if (this.x < 0 && this.velocity.x < 0) {
			this.x = 0;
			this.velocity.x *= -1;
		}
		if (this.x > this.scene.W && this.velocity.x > 0) {
			this.x = this.scene.W;
			this.velocity.x *= -1;
		}
		if (this.y < 0 && this.velocity.y < 0) {
			this.y = 0;
			this.velocity.y *= -1;
		}
		if (this.y > this.scene.H && this.velocity.y > 0) {
			this.y = this.scene.H;
			this.velocity.y *= -1;
		}
	}

	setVelocity(vx: number, vy: number) {
		this.velocity.x = vx;
		this.velocity.y = vy;
	}
}