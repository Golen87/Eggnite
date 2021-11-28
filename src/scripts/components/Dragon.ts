import { BaseScene } from "../scenes/BaseScene";
import { Egg } from "./Egg";

const SHOOTING_TIMER = 5;
const HURT_DURATION = 0.5;
const DEATH_DURATION = 5; // Seconds


export class Dragon extends Phaser.GameObjects.Container {
	public scene: BaseScene;

	// Graphics
	private sprite: Phaser.GameObjects.Sprite;
	private graphics: Phaser.GameObjects.Graphics;

	// Movement
	public velocity: Phaser.Math.Vector2;
	public facing: Phaser.Math.Vector2; // Used to determine throwing dir
	public following: Egg | null = null;
	private border: { [key: string]: number };

	// Shooting
	private shootTimer: number;
	private health: number;
	private hurtTimer: number;
	private deathTimer: number;

	// Collision
	private headAreas: Phaser.Geom.Circle[];
	private weakAreas: Phaser.Geom.Circle[];

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

		this.shootTimer = SHOOTING_TIMER - 1;
		this.health = 5;
		this.hurtTimer = 0;
		this.deathTimer = 0;

		this.headAreas = [
			new Phaser.Geom.Circle( -5,   0, 25), // Head
			new Phaser.Geom.Circle( 35,   0, 15), // Nose
			new Phaser.Geom.Circle(-30, -22, 10), // Left Horn Bottom
			new Phaser.Geom.Circle(-45, -25,  5), // Left Horn Mid
			new Phaser.Geom.Circle(-55, -20,  5), // Left Horn Top
			new Phaser.Geom.Circle(-30,  22, 10), // Right Horn Bottom
			new Phaser.Geom.Circle(-45,  25,  5), // Right Horn Mid
			new Phaser.Geom.Circle(-55,  20,  5), // Right Horn Bottom
		];
		this.weakAreas = [
			new Phaser.Geom.Circle(-25, 0, 10), // Back of head
		];
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
		//this.facing.rotate(-0.3*Math.PI * delta/1000);

		let target = new Phaser.Math.Vector2();
		if (this.following) {
			target.add(this.following);
			target.subtract(this);
		}
		target.normalize();
		target.scale(0.01);

		this.facing.add(target)
		this.facing.normalize()

		// Set direction
		this.setAngle(this.facing.angle() * Phaser.Math.RAD_TO_DEG);

		// Set direction
		//this.setAngle(target.angle() * Phaser.Math.RAD_TO_DEG - 90);
		//this.setAngle(this.facing.angle() * Phaser.Math.RAD_TO_DEG - 90);


		// Shooting eggs
		this.shootTimer += delta/1000;
		if (this.shootTimer > SHOOTING_TIMER) {
			this.shootTimer = 0;
			this.emit("shoot");
		}

		// Hurt animation
		this.hurtTimer -= delta/1000;
		if (this.hurtTimer > 0 || !this.alive) {
			let blink = (Math.sin(50*time/1000) > 0);
			this.sprite.setTint(blink ? 0xFF0000 : 0xFFFFFF);
			this.sprite.setAlpha(0.75);
			this.sprite.setOrigin(0.5 + 0.02 * Math.sin(35*time/1000), 0.5);
		}
		else {
			this.sprite.setTint(0xFFFFFF);
			this.sprite.setAlpha(1);
			this.sprite.setOrigin(0.5, 0.5);
		}

		// Check if dead
		if (!this.alive) {
			this.deathTimer += delta/1000;
			this.setScale(1 - this.deathTimer / DEATH_DURATION);
			if (this.deathTimer > DEATH_DURATION) {
				this.destroy();
			}
		}

		// Debug
		this.graphics.clear();
		this.headAreas.forEach((circle: Phaser.Geom.Circle) => {
			this.graphics.lineStyle(1, 0x00FF00, 0.5);
			this.graphics.strokeCircleShape(circle);
		});
		this.weakAreas.forEach((circle: Phaser.Geom.Circle) => {
			this.graphics.lineStyle(1, 0x0000FF, 0.5);
			this.graphics.strokeCircleShape(circle);
		});
	}

	insideHead(egg: Egg): boolean {
		return this.headAreas.some((circle: Phaser.Geom.Circle) => {
			return this.checkCollision(circle, egg);
		});
	}

	insideWeakSpot(egg: Egg): boolean {
		return this.weakAreas.some((circle: Phaser.Geom.Circle) => {
			return this.checkCollision(circle, egg);
		});
	}

	checkCollision(circle: Phaser.Geom.Circle, egg: Egg): boolean {
		let point = new Phaser.Math.Vector2(circle.x, circle.y);
		point.rotate(this.angle * Phaser.Math.DEG_TO_RAD);
		point.add(this);

		let dist = Phaser.Math.Distance.BetweenPoints(point, egg);
		return (dist < circle.radius && egg.canGrab(this));
	}


	damage() {
		this.health -= 1;
		this.hurtTimer = HURT_DURATION;

		if (this.health <= 0) {
			this.scene.createText(this.scene.CX, this.scene.CY, 25, this.scene.weights.bold, "#DDD", "DEFEATED").setOrigin(0.5);
		}
	}

	get alive() {
		return this.health > 0;
	}
}
