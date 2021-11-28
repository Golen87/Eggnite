import { BaseScene } from "../scenes/BaseScene";
import { Egg } from "./Egg";

const GRAB_RANGE = 30;


export class Player extends Phaser.GameObjects.Container {
	public scene: BaseScene;

	// Input
	protected keys: any;

	// Graphics
	protected circle: Phaser.GameObjects.Ellipse;
	protected graphics: Phaser.GameObjects.Graphics;
	protected sprite: Phaser.GameObjects.Sprite;

	// Animation
	protected walkTimer: number; // Increases while moving, modulo to set frame
	public heldEgg: Egg | null;

	// Movement
	protected inputVec: Phaser.Math.Vector2; // Just used for keyboard -> vector
	public velocity: Phaser.Math.Vector2;
	public facing: Phaser.Math.Vector2; // Used to determine throwing dir
	protected border: { [key: string]: number }; 

	constructor(scene: BaseScene, x: number, y: number) {
		super(scene, x, y);
		this.scene = scene;
		scene.add.existing(this);

		// Create player sprite
		this.sprite = scene.add.sprite(0, 0, "player", 0);
		this.add(this.sprite); // Attach sprite to the Player-component

		// Animation
		this.walkTimer = 0;
		this.heldEgg = null;
		// walk 0, 1
		// lift 4, 5
		// hurt 8

		// Debug graphics
		this.graphics = scene.add.graphics();
		this.add(this.graphics);

		// Movement
		this.inputVec = new Phaser.Math.Vector2(0, 0);
		this.velocity = new Phaser.Math.Vector2(0, 0);
		this.facing = new Phaser.Math.Vector2(1, 0);
		this.border = {
			left: 8,
			right: scene.W-8,
			top: 8,
			bottom: scene.H-16,
		};

	}

	update(time: number, delta: number) {

		// Keyboard input to vector
		this.inputVec.reset();
		this.inputVec.x = (this.keys.left.isDown ? -1 : 0) + (this.keys.right.isDown ? 1 : 0);
		this.inputVec.y = (this.keys.up.isDown ? -1 : 0) + (this.keys.down.isDown ? 1 : 0);

		// Movement
		const ACCELERATION = 30;
		const MAX_SPEED = 100;

		this.inputVec.scale(ACCELERATION);
		this.velocity.scale(0.85); // Friction
		this.velocity.add(this.inputVec);
		this.velocity.limit(MAX_SPEED);

		this.x += this.velocity.x * delta/1000;
		this.y += this.velocity.y * delta/1000;

		if (this.velocity.lengthSq() > 0) {
			this.facing.copy(this.velocity);
			this.facing.normalize();
		}

		// Border collision
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


		// Animation

		// Face sprite forward
		this.sprite.flipX = (this.facing.x < 0);

		// Walking animation
		this.walkTimer += this.velocity.length() * delta/1000 / 12;
		const walkFrame = Math.floor(this.walkTimer) % 4;
		this.sprite.setFrame(walkFrame); // Walk is frame 0-1


		// Egg
		if (this.heldEgg) {
			this.heldEgg.x = this.x;
			this.heldEgg.y = this.y;
			this.heldEgg.facing.copy(this.facing);
		}


		// Debug
		this.graphics.clear();
		this.graphics.lineStyle(1, 0x00FF00, 0.5);
		this.graphics.lineBetween(0, 0, 20*this.facing.x, 20*this.facing.y);
		this.graphics.strokeEllipse(0, 0, 2*GRAB_RANGE, 2*GRAB_RANGE);
	}

	canGrab(egg: Egg) {
		let dist = Phaser.Math.Distance.BetweenPoints(this, egg);

		return (dist < GRAB_RANGE && egg.canGrab(this));
	}

	grab() {
		if (this.heldEgg) {
			this.emit("throw");
		}
		else {
			this.sprite.setFrame(4);
			this.emit("grab");
		}

		// Emitted events are catched in MainScene with "player.on"
	}
}
