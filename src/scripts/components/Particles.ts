import { BaseScene } from "../scenes/BaseScene";

class Particle extends Phaser.GameObjects.Sprite {
	private myType: string;
	private pos: Phaser.Math.Vector2;
	private vel: Phaser.Math.Vector2;
	private acc: Phaser.Math.Vector2;
	private offset: Phaser.Math.Vector2;
	private life: number;
	private lifeTime: number;

	constructor(scene: BaseScene) {
		super(scene, 0, 0, "");

		this.setVisible(false);

		this.myType = "";
		this.pos = new Phaser.Math.Vector2(0, 0);
		this.vel = new Phaser.Math.Vector2(0, 0);
		this.acc = new Phaser.Math.Vector2(0, 0);
		this.offset = new Phaser.Math.Vector2(0, 0);
		this.life = 0;
		this.lifeTime = 0;
	}

	init(x: number, y: number, key: string) {
		this.x = x;
		this.y = y;
		this.myType = key;
		this.setTexture(key);
		this.setVisible(true);
		this.setTint(0xFFFFFF);
		this.setAngle(0);
		this.setScale(1);
		this.setOrigin(0.5);
		this.pos.set(x, y);
		this.vel.reset();
		this.acc.reset();
		this.offset.reset();
		this.life = 0;
	}

	shell(x: number, y: number, tint: number) {
		this.init(x, y, "shell");
		this.setTint(tint);

		this.setAngle(360*Math.random());
		this.setData("scale", 1 - 0.5 * Math.random());
		this.setScale(this.getData("scale"));

		this.vel.setToPolar(
			2*Math.PI*Math.random(),
			20 + 40*Math.random()
		);
		// this.vel.y -= 100 + 50*Math.random();
		// this.vel.x *= 2;
		// this.acc.set(
			// 0,
			// 400
		// );
		this.setData("airtime", 0.4 + 0.3 * Math.random());

		this.lifeTime = 1.5 + 1*Math.random();
	}

	lava(x: number, y: number) {
		this.init(x, y, "lavabubble");

		this.setFrame(0);

		this.lifeTime = 0.3 + 0.5*Math.random();
	}


	update(time: number, delta: number) {
		if (this.myType == "shell") {
			const k = this.getData("airtime");
			if (this.life > k) {
				this.vel.reset();
				this.acc.reset();
				this.offset.y = 5;
				let fade = 1 - (this.life-k) / (this.lifeTime-k);
				this.setScale(fade * this.getData("scale"));
			}
			else {
				this.offset.y = - 10 * Math.sin(this.life/k * Math.PI) + 5 * this.life/k;
			}
		}

		if (this.myType == "lavabubble") {
			let frame = Math.floor(7 * (this.life / this.lifeTime));
			this.setFrame(frame);
		}


		this.vel.x += this.acc.x * delta/1000;
		this.vel.y += this.acc.y * delta/1000;
		this.pos.x += this.vel.x * delta/1000;
		this.pos.y += this.vel.y * delta/1000;
		this.x = this.pos.x + this.offset.x;
		this.y = this.pos.y + this.offset.y;

		this.life += delta/1000;
		if (this.life > this.lifeTime) {
			this.setVisible(false);
		}
	}
}


const MAX = 1000;

export class Particles extends Phaser.GameObjects.Container {

	private particles: Particle[];
	private index: number;

	constructor(scene: BaseScene) {
		super(scene, 0, 0);
		scene.add.existing(this);

		this.particles = [];
		this.index = 0;

		// Preallocate MAX particles
		for (let i=0; i<MAX; i++) {
			let particle = new Particle(scene);
			this.add(particle);
			this.particles.push(particle);
		}
	}

	update(time: number, delta: number) {
		this.particles.forEach((particle: Particle) => {
			if (particle.visible) {
				particle.update(time, delta);
			}
		});
	}

	getFreeParticle(): Particle | null {
		// Cycle x times until a free particle is found
		for (let i=0; i<50; i++) {
			this.index = (this.index + 1) % MAX;

			let p = this.particles[this.index];
			if (!p.visible) {
				return p;
			}
		}
		return null;
	}

	getFreeParticles(amount: number): Particle[] {
		let result: Particle[] = [];
		for (let i=0; i<amount; i++) {
			let p = this.getFreeParticle();
			if (p) {
				result.push(p);
			}
		}
		return result;
	}

	createShells(x: number, y: number, amount: number, tint: number) {
		this.getFreeParticles(amount).forEach((particle) => {
			particle.shell(x, y, tint);
		});
	}

	createLava(x: number, y: number) {
		this.getFreeParticles(1).forEach((particle) => {
			particle.lava(x, y);
		});
	}
}