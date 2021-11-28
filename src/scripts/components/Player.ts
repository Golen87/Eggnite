import { BaseScene } from "../scenes/BaseScene";
import { Egg } from "./Egg";
import { interpolateColor } from "../utils";

const GRAB_RANGE = 40;
const THROW_DURATION = 0.3;


export class Player extends Phaser.GameObjects.Container {
	public scene: BaseScene;

	// Input
	protected keys: any;
	protected isTouched: boolean;

	// Graphics
	protected circle: Phaser.GameObjects.Ellipse;
	protected graphics: Phaser.GameObjects.Graphics;
	protected sprite: Phaser.GameObjects.Sprite;

	// Animation
	protected walkTimer: number; // Increases while moving, modulo to set frame
	protected throwTimer: number;
	public heldEgg: Egg | null;
	public holdTimer: number;

	// Movement
	protected inputVec: Phaser.Math.Vector2; // Just used for keyboard -> vector
	protected touchPos: Phaser.Math.Vector2;
	public velocity: Phaser.Math.Vector2;
	public facing: Phaser.Math.Vector2; // Used to determine throwing dir
	protected border: { [key: string]: number }; 

	public HOLD_DURATION: number = 10;

	constructor(scene: BaseScene, x: number, y: number) {
		super(scene, x, y);
		this.scene = scene;
		scene.add.existing(this);

		// Create player sprite
		this.sprite = scene.add.sprite(0, 0, "player", 0);
		// this.sprite.setOrigin(0.5, 0.2);
		this.add(this.sprite); // Attach sprite to the Player-component

		// Animation
		this.isTouched = false;
		this.walkTimer = 0;
		this.throwTimer = 0;
		this.heldEgg = null;
		this.holdTimer = 0;
		// walk 0, 1
		// lift 4, 5
		// hurt 8

		// Debug graphics
		this.graphics = scene.add.graphics();
		this.graphics.setVisible(false);
		this.add(this.graphics);

		// Movement
		this.inputVec = new Phaser.Math.Vector2(0, 0);
		this.touchPos = new Phaser.Math.Vector2(0, 0);
		this.velocity = new Phaser.Math.Vector2(0, 0);
		this.facing = new Phaser.Math.Vector2(1, 0);
		this.border = {
			left: 8,
			right: scene.W-8,
			top: 12,
			bottom: scene.H-20,
		};

	}

	update(time: number, delta: number) {

		// Keyboard input to vector
		if (!this.isTouched) {
			this.inputVec.reset();
			this.inputVec.x = (this.keys.left.isDown ? -1 : 0) + (this.keys.right.isDown ? 1 : 0);
			this.inputVec.y = (this.keys.up.isDown ? -1 : 0) + (this.keys.down.isDown ? 1 : 0);
		}
		// Touch to input vector
		else {
			this.inputVec.copy(this.touchPos);
			this.inputVec.x -= this.x;
			this.inputVec.y -= this.y;
			if (this.inputVec.length() < 8) {
				this.inputVec.reset();
			}
		}

		// Movement
		const ACCELERATION = 30;
		const MAX_SPEED = 100;

		this.inputVec.normalize();
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
		if (this.isTouched && this.inputVec.lengthSq() > 0) {
			this.facing.copy(this.inputVec);
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

		// Walking animation
		this.walkTimer += this.velocity.length() * delta/1000 / 12;
		let walkFrame = Math.floor(this.walkTimer) % 4;
		if (this.inputVec.lengthSq() == 0) {
			walkFrame = 0;
		}
		if (this.heldEgg) {
			walkFrame += 4;
		}
		this.sprite.setFrame(walkFrame); // Walk is frame 0-1

		this.throwTimer -= delta/1000;
		if (this.throwTimer > 0) {
			this.sprite.setFrame(8);
		}
		else {
			// Face sprite forward
			this.sprite.flipX = (this.facing.x < 0);
		}


		// Egg
		if (this.heldEgg) {
			this.heldEgg.x = this.x;
			this.heldEgg.y = this.y - 15;
			this.heldEgg.facing.copy(this.facing);

			this.holdTimer = Math.min(this.holdTimer + delta/1000, this.HOLD_DURATION);
		}
		else {
			this.holdTimer = Math.max(this.holdTimer - delta/1000, 0);
		}


		// Heat
		let heatFactor = this.holdTimer / this.HOLD_DURATION;
		this.sprite.setTint(interpolateColor(0xFFFFFF, 0xFF3333, heatFactor));
		if (this.heldEgg && this.holdTimer >= this.HOLD_DURATION) {
			this.grab();
		}
		if (this.holdTimer >= this.HOLD_DURATION - 5) {
			let fac = (this.holdTimer - this.HOLD_DURATION + 5) / (this.HOLD_DURATION);
			if (Math.random() < 0.1 + 0.3 * fac) {
				this.emit("sweat");
			}
		}


		// Debug
		this.graphics.clear();
		this.graphics.lineStyle(1, 0x00FF00, 0.5);
		this.graphics.lineBetween(0, 20, 20*this.facing.x, 20*this.facing.y);
		this.graphics.strokeEllipse(0, 20, 2*GRAB_RANGE, 2*GRAB_RANGE);
	}

	canGrab(egg: Egg) {
		let point = new Phaser.Math.Vector2(this.x, this.y);
		let dist = Phaser.Math.Distance.BetweenPoints(point, egg);

		return (dist < GRAB_RANGE && egg.canGrab(this));
	}

	grab() {
		if (this.heldEgg) {
			this.heldEgg.x = this.x;
			this.heldEgg.y = this.y - 5;
			this.emit("throw");
			this.throwTimer = THROW_DURATION;
		}
		else {
			this.emit("grab");
		}

		// Emitted events are catched in MainScene with "player.on"
	}


	touchStart(x: number, y: number) {
		this.isTouched = true;
		this.emit("grab");
	}

	touchDrag(x: number, y: number) {
		this.touchPos.x = x;
		this.touchPos.y = y;
	}

	touchEnd(x: number, y: number) {
		this.isTouched = false;
		this.emit("throw");
	}
}
