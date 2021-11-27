import { BaseScene } from "../scenes/BaseScene";
import { Player } from "./Player";

const GRAB_COOLDOWN = 0.5; // Seconds
const DEATH_DURATION = 2; // Seconds


export class Egg extends Phaser.GameObjects.Container {
	public scene: BaseScene;

	private sprite: Phaser.GameObjects.Sprite;

	public velocity: Phaser.Math.Vector2;
	public facing: Phaser.Math.Vector2;

	private health: number;
	private isHeld: boolean;
	private grabTimer: number; // To prevent spam-grabbing
	private deathTimer: number; // To prevent spam-grabbing

	constructor(scene: BaseScene, x: number, y: number) {
		super(scene, x, y);
		this.scene = scene;
		scene.add.existing(this);


		// Create egg sprite
		this.sprite = scene.add.sprite(0, 0, "egg", 0);
		this.sprite.setOrigin(0.5, 0.7); // Center pivot, for rotation
		this.add(this.sprite); // Attach sprite to the Egg-component

		// Animation
		// normal 0
		// broken 2

		this.velocity = new Phaser.Math.Vector2(0, 0);
		this.facing = new Phaser.Math.Vector2(0, 0);

		this.health = 5;
		this.isHeld = false;
		this.grabTimer = 0;
		this.deathTimer = 0;
	}

	update(time: number, delta: number) {
		if (this.alive) {

			if (!this.isHeld) {
				// Movement
				this.x += this.velocity.x * delta/1000;
				this.y += this.velocity.y * delta/1000;

				// Border collision
				if (this.x < 0 && this.velocity.x < 0) {
					this.x = 0;
					this.velocity.x *= -1;
					this.onDamage();
				}
				if (this.x > this.scene.W && this.velocity.x > 0) {
					this.x = this.scene.W;
					this.velocity.x *= -1;
					this.onDamage();
				}
				if (this.y < 0 && this.velocity.y < 0) {
					this.y = 0;
					this.velocity.y *= -1;
					this.onDamage();
				}
				if (this.y > this.scene.H && this.velocity.y > 0) {
					this.y = this.scene.H;
					this.velocity.y *= -1;
					this.onDamage();
				}
			}

			if (this.velocity.lengthSq() > 0) {
				this.facing.copy(this.velocity);
				this.facing.normalize();
			}

			// Set direction
			this.sprite.setAngle(this.facing.angle() * Phaser.Math.RAD_TO_DEG - 90);

			// Grab cooldown
			this.grabTimer += delta/1000;
		}

		// Check if dead
		if (!this.alive) {
			this.velocity.reset();
			this.sprite.setFrame(2);
			this.sprite.setAngle(0);

			this.deathTimer += delta/1000;
			this.setScale(1 - this.deathTimer / DEATH_DURATION);
			if (this.deathTimer > DEATH_DURATION) {
				this.destroy();
			}
		}
	}

	canGrab() {
		return (this.health > 0 && this.grabTimer > GRAB_COOLDOWN);
	}

	onGrab(player: Player) {
		this.x = player.x;
		this.y = player.y;
		this.velocity.reset();
		this.isHeld = true;
	}

	onThrow(player: Player) {
		const THROW_SPEED = 200;

		this.isHeld = false;
		this.grabTimer = 0;
		this.velocity.x = THROW_SPEED * player.facing.x;
		this.velocity.y = THROW_SPEED * player.facing.y;
	}

	onDamage(amount: number=1) {
		this.health -= amount;
	}

	get alive() {
		return this.health > 0;
	}
}
