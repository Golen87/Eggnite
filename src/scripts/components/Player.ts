import { BaseScene } from "../scenes/BaseScene";

export class Player extends Phaser.GameObjects.Container {
	public scene: BaseScene;

	protected keys: any;

	// private sprite: Phaser.GameObjects.Sprite;
	private circle: Phaser.GameObjects.Ellipse;

	constructor(scene: BaseScene, x: number, y: number) {
		super(scene, x, y);
		this.scene = scene;
		scene.add.existing(this);

		// Create player sprite
		// this.sprite = scene.add.sprite(0, 0, "pika");
		this.circle = scene.add.ellipse(0, 0, 200, 200, 0xFF0000);
		this.add(this.circle); // Attach sprite to the Player-component
	}

	update(time: number, delta: number) {
		// Movement
		if (this.keys) {
			if (this.keys.left.isDown) {
				this.x -= 5;
			}
			if (this.keys.right.isDown) {
				this.x += 5;
			}
			if (this.keys.down.isDown) {
				this.y += 5;
			}
			if (this.keys.up.isDown) {
				this.y -= 5;
			}
		}
	}
}