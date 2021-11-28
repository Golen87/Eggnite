import { BaseScene } from "../scenes/BaseScene";
import { Player } from "./Player";

const GRAB_COOLDOWN = 0.5; // Seconds
const DEATH_DURATION = 2; // Seconds


export class Egg extends Phaser.GameObjects.Container {
	public scene: BaseScene;
	public speed: number;

	private sprite: Phaser.GameObjects.Sprite;

	public velocity: Phaser.Math.Vector2;
	public boost: number;
	public facing: Phaser.Math.Vector2;
	private border: { [key: string]: number }; 

	private health: number;
	private isHeld: boolean;
	private grabTimer: number; // To prevent spam-grabbing
	public grabOwner: any; // To prevent spam-grabbing
	private deathTimer: number; // To prevent spam-grabbing

	constructor(scene: BaseScene, x: number, y: number, speed: number) {
		super(scene, x, y);
		this.scene = scene;
		this.speed = speed;
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
		this.boost = 1;

		this.health = 5;
		this.isHeld = false;
		this.grabTimer = 0;
		this.grabOwner = null;
		this.deathTimer = 0;

		this.border = {
			left: 8,
			right: scene.W-8,
			top: 8,
			bottom: scene.H-8,
		};
	}

	update(time: number, delta: number) {
		if (this.alive) {

			if (!this.isHeld) {
				// Movement
				let speed = this.velocity.clone();
				speed.scale(1 + 0.7 * this.boost);
				this.x += speed.x * delta/1000;
				this.y += speed.y * delta/1000;
				this.boost *= 0.95;

				// Border collision
				if (this.x < this.border.left && this.velocity.x < 0) {
					this.x = this.border.left;
					this.velocity.x *= -1;
					this.onDamage();
				}
				if (this.x > this.border.right && this.velocity.x > 0) {
					this.x = this.border.right;
					this.velocity.x *= -1;
					this.onDamage();
				}
				if (this.y < this.border.top && this.velocity.y < 0) {
					this.y = this.border.top;
					this.velocity.y *= -1;
					this.onDamage();
				}
				if (this.y > this.border.bottom && this.velocity.y > 0) {
					this.y = this.border.bottom;
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

	canGrab(requester: any) {
		return (this.health > 0 && (this.grabTimer > GRAB_COOLDOWN || requester != this.grabOwner));
	}

	onGrab(player: Player) {
		this.x = player.x;
		this.y = player.y;
		this.velocity.reset();
		this.isHeld = true;
	}

	onThrow(player: Player) {
		this.isHeld = false;
		this.grabTimer = 0;
		this.boost = 1;
		this.velocity.x = 1.25 * this.speed * player.facing.x;
		this.velocity.y = 1.25 * this.speed * player.facing.y;
	}

	onDamage(amount: number=1) {
		this.health -= amount;
	}

	get alive() {
		return this.health > 0;
	}
}
