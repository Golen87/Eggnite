import { BaseScene } from "../scenes/BaseScene";
import { Egg } from "./Egg";
import { interpolateColor } from "../utils";

const HURT_DURATION = 0.7;
const DEATH_DURATION = 3; // Seconds
const ANGRY_DURATION = 12; // Seconds


export class Dragon extends Phaser.GameObjects.Container {
	public scene: BaseScene;
	public level: number;

	// Graphics
	private sprite: Phaser.GameObjects.Sprite;
	private gem: Phaser.GameObjects.Sprite;
	private light: Phaser.GameObjects.PointLight;
	private graphics: Phaser.GameObjects.Graphics;

	// Movement
	public velocity: Phaser.Math.Vector2;
	public facing: Phaser.Math.Vector2; // Used to determine throwing dir
	public following: any = null;
	private border: { [key: string]: number };

	// Shooting
	public SHOOTING_TIMER: number;
	public shootTimer: number;
	public health: number;
	public sustained: number; // Just used for animation
	private hurtTimer: number;
	private deathTimer: number;

	public mood: string;
	public moodTimer: number;
	public moveTimer: number;

	// Collision
	private headAreas: Phaser.Geom.Circle[];
	private weakAreas: Phaser.Geom.Circle[];

	private goalPoints: Phaser.Math.Vector2[];

	constructor(scene: BaseScene, x: number, y: number, level: number) {
		super(scene, x, y);
		this.scene = scene;
		this.level = level;
		scene.add.existing(this);


		// Create player sprite
		const size = 80;
		this.sprite = scene.add.sprite(0, 0, "dragon", 2*level);
		this.add(this.sprite); // Attach sprite to the Player-component

		this.gem = scene.add.sprite(0, 0, "gem", 2*level);
		// this.gem.setBlendMode(Phaser.BlendModes.SCREEN);
		this.add(this.gem); // Attach sprite to the Player-component

		const colors = [0xde7c70, 0x63c446, 0x8987ff, 0xe070b2];
		this.light = scene.add.pointlight(-28, 0, colors[level], 30, 1.0, 0.05);
		this.add(this.light);

		// Animation
		// idle 0
		// charge 4

		// Debug graphics
		this.graphics = scene.add.graphics();
		this.graphics.setVisible(false);
		this.add(this.graphics);

		// Movement
		this.velocity = new Phaser.Math.Vector2(0, 0);
		this.facing = new Phaser.Math.Vector2(0, 1);
		this.border = {
			left: 0.2*scene.W + size/2,
			right: 0.8*scene.W + size/2,
			top: size/2,
			bottom: scene.H - size/2,
		};

		this.SHOOTING_TIMER = 0;
		this.shootTimer = 0;
		this.health = 5;
		this.sustained = 0;
		this.hurtTimer = 0;
		this.deathTimer = 0;

		this.mood = "normal";
		this.moodTimer = 0;
		this.moveTimer = 8;

		this.headAreas = [
			new Phaser.Geom.Circle( -5,   0, 25), // Head
			new Phaser.Geom.Circle( 35,   0, 15), // Nose
			new Phaser.Geom.Circle(-30, -22, 10), // Left Horn Bottom
			new Phaser.Geom.Circle(-45, -25,  5), // Left Horn Mid
			// new Phaser.Geom.Circle(-55, -20,  5), // Left Horn Top
			new Phaser.Geom.Circle(-30,  22, 10), // Right Horn Bottom
			new Phaser.Geom.Circle(-45,  25,  5), // Right Horn Mid
			// new Phaser.Geom.Circle(-55,  20,  5), // Right Horn Bottom
		];
		this.weakAreas = [
			new Phaser.Geom.Circle(-30, 0, 15), // Back of head
		];

		const k = 35;
		this.goalPoints = [];
		for (let i=-1; i<2; i++) {
			for (let j=-1; j<2; j++) {
				this.goalPoints.push(
					new Phaser.Math.Vector2(this.x + i*k, this.y + j*k)
				);
			}
		}
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

		if (this.alive) {

			let target = new Phaser.Math.Vector2();
			if (this.following) {
				target.add(this.following);
				target.subtract(this);
			}
			target.normalize();

			let dot = this.facing.dot(target);
			let boost = -0.05 * Math.min(dot, 0);
			const speed = (this.mood == "angry") ? 0.04 : 0.02;
			target.scale(speed + boost);

			this.facing.add(target)
			this.facing.normalize()

			// Set direction
			this.setAngle(this.facing.angle() * Phaser.Math.RAD_TO_DEG);

			// Set direction
			//this.setAngle(target.angle() * Phaser.Math.RAD_TO_DEG - 90);
			//this.setAngle(this.facing.angle() * Phaser.Math.RAD_TO_DEG - 90);


			// Shooting eggs
			this.shootTimer += delta/1000;
			if (this.shootTimer > this.SHOOTING_TIMER) {
				this.shootTimer = 0;
				this.emit("shoot");
			}

			const k = 0.8;
			let squish = 1;
			if (this.SHOOTING_TIMER - this.shootTimer < 1.0) {
				this.sprite.setFrame(2*this.level + 1);
				squish = k + (1-k) * (this.SHOOTING_TIMER - this.shootTimer);
			}
			else {
				this.sprite.setFrame(2*this.level);
			}
			this.scaleX = squish;


			// AI State

			this.moodTimer -= delta/1000; // Set on mood change
			this.light.intensity = 1.0;

			if (this.mood == "angry") {
				this.light.intensity = 1.5;

				if (this.moodTimer <= 0) {
					this.mood = "normal";
				}

			}


			this.moveTimer -= delta/1000;
			if (this.moveTimer <= 0) {
				this.moveTimer = 4 + 8 * Math.random();

				let goal = Phaser.Math.RND.pick(this.goalPoints);
				// goal.copy(this.goal);

				this.scene.tweens.add({
					targets: this,
					x: { from: this.x, to: goal.x },
					y: { from: this.y, to: goal.y },
					ease: 'Cubic.InOut',
					duration: 3000 + 1000 * (this.moveTimer-3) * Math.random()
				});
			}
		}

		// Hurt animation
		this.hurtTimer -= delta/1000;
		if (this.hurtTimer > 0 || !this.alive) {
			let blink = (Math.sin(50*time/1000) > 0);
			this.sprite.setTint(blink ? 0xFF0000 : 0xFFFFFF);
			this.gem.setTint(blink ? 0xFFFFFF : 0xFF0000);
			this.sprite.setAlpha(0.75);
			this.gem.setAlpha(0.75);
			this.sprite.setOrigin(0.5, 0.5 + 0.02 * Math.sin(35*time/1000));
			this.gem.setOrigin(0.5, 0.5 + 0.02 * Math.sin(35*time/1000));
		}
		else {
			this.sprite.setTint(this.mood == "normal" ? 0xFFFFFF : 0xFFCCCC);
			this.sprite.setAlpha(1);
			this.sprite.setOrigin(0.5, 0.5);

			const k = Math.pow(0.5 + 0.5 * Math.sin(6*time/1000), 2);
			this.gem.setTint(interpolateColor(0xFFFFFF, 0xAAAAAA, k));
			// this.gem.setScale(1.0 + 0.05 * k);
			this.gem.setAlpha(1.0 + 0.4*k);
			this.gem.setOrigin(0.5, 0.5);

			this.light.setVisible(Math.random() < 1.0 - 0.02 * this.sustained);

			if (this.mood == "angry") {
				this.sprite.setOrigin(0.5, 0.5 + 0.005 * Math.sin(35*time/1000));
				this.gem.setOrigin(0.5, 0.5 + 0.005 * Math.sin(35*time/1000));
			}
		}

		// Check if dead
		if (!this.alive) {
			this.deathTimer += delta/1000;
			this.gem.setVisible(false);
			this.light.setVisible(false);
			this.setScale(1 - 0.5 * this.deathTimer / DEATH_DURATION);
			this.setAlpha(1 - this.deathTimer / DEATH_DURATION);
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
		this.sustained += 1;
		this.hurtTimer = HURT_DURATION;

		this.mood = "angry";
		this.moodTimer = ANGRY_DURATION;

		// if (this.health <= 0) {
			// this.scene.createText(this.scene.CX, this.scene.CY, 25, this.scene.weights.bold, "#DDD", "DEFEATED").setOrigin(0.5);
		// }
	}

	get alive() {
		return this.health > 0;
	}
}
