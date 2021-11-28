import { BaseScene } from "./BaseScene";
import { RoundRectangle } from "../components/RoundRectangle";


export interface Point {
	x: number;
	y: number;
	radius: number;
}


export class OverworldScene extends BaseScene {
	level: number;

	clouds1: Phaser.GameObjects.Image;
	clouds2: Phaser.GameObjects.Image;
	player: Phaser.GameObjects.Image;
	flags: Phaser.GameObjects.Image[];
	points: any;
	curves: any;
	graphics: Phaser.GameObjects.Graphics;
	timer: number;

	constructor() {
		super({key: "OverworldScene"});
	}

	init(data: any) {
		this.level = data.level;
	}

	create(): void {
		this.fade(false, (this.level == 0) ? 2000 : 500, 0x000000);


		// Images

		this.clouds1 = this.add.image(0, 0, "clouds");
		this.clouds2 = this.add.image(0, 0, "clouds");
		this.clouds1.setOrigin(0);
		this.clouds2.setOrigin(0);
		let volcano = this.add.image(this.CX, this.CY, "volcano");
		this.fitToScreen(this.clouds1);
		this.fitToScreen(this.clouds2);
		this.fitToScreen(volcano);

		this.player = this.add.image(this.CX, this.CY, "mapplayer");
		this.player.setOrigin(0.5, 0.7);
		this.player.setDepth(10);

		this.graphics = this.add.graphics();
		this.graphics.setBlendMode(Phaser.BlendModes.ADD);
		this.graphics.lineStyle(1, 0xFFFFFF, 0.6);
		this.graphics.fillStyle(0xFFFFFF, 0.6);

		this.flags = [];


		let levels = [
			{ x:2*74, y:2*78 },
			{ x:2*37, y:2*60 },
			{ x:2*101, y:2*45 },
			{ x:2*73, y:2*21 },
		];
		this.points = {};
		this.curves = {};

		levels.forEach((point: any, index: number) => {
			this.points[index] = [];

			// Large level dot
			this.points[index].push({ x: point.x, y: point.y, radius: 5 });

			// Smaller path dots
			if (index > 0) {
				let other = levels[index-1];
				let curve = new Phaser.Curves.CubicBezier(
					new Phaser.Math.Vector2(point.x, point.y),
					new Phaser.Math.Vector2(point.x, point.y+60),
					new Phaser.Math.Vector2(other.x, other.y-60),
					new Phaser.Math.Vector2(other.x, other.y)
				);
				this.curves[index] = curve;
				// curve.draw(this.graphics);

				let L = curve.getLength();
				let ls = curve.getLengths(1000);
				let ps = curve.getPoints(1000);
				let t = 12;
				for (let i=0; i<ls.length; i++) {
					let fac = ls[i];
					if (fac > t) {
						this.points[index].push({
							x: Math.floor(ps[i].x),
							y: Math.floor(ps[i].y),
							radius: 2
						});
						t += 12;
					}
				}
			}

			this.points[index].reverse();
		});


		if (this.level > 0) {
			this.player.x = levels[this.level-1].x;
			this.player.y = levels[this.level-1].y;
		}
		else {
			this.player.x = levels[this.level].x;
			this.player.y = levels[this.level].y + 30;
		}

		// Instantly draw
		for (let i=0; i<this.level; i++) {
			// let flag = this.add.image(levels[i].x, levels[i].y, "mapflag")
			// flag.setOrigin(0.5, 0.8);
			// this.flags.push(flag);

			this.points[i].forEach((point: any, index: number) => {
				this.graphics.fillCircle(point.x, point.y, point.radius);
			});
		}

		// Animate
		this.addEvent((this.level == 0) ? 2000 : 1000, () => {
			this.points[this.level].forEach((point: any, index: number) => {
				this.addEvent(200*index, () => {
					this.graphics.fillCircle(point.x, point.y, point.radius);
				})
			});

			const wait = 200 * this.points[this.level].length;

			let curve = this.curves[this.level];
			if (curve) {

				// Animate player
				let tween = this.tweens.add({
					targets: this,
					timer: { from: 0, to: 1 },
					duration: wait,
					delay: wait,
				});

				// Move player
				tween.on('update', (tween, key, target, current, previous) => {
					let p = curve.getPoint(1-current);
					this.player.x = p.x;
					this.player.y = p.y;
				}, this);

				// Trigger next level
				tween.on('complete', this.progress, this);
			}
			else {
				// Animate player
				let tween = this.tweens.add({
					targets: this.player,
					y: "-=30",
					duration: 1000,
					delay: wait + 1000,
				});
				tween.on('complete', this.progress, this);
			}
		}, this);

	}

	update(time: number, delta: number) {
		const anim = Math.sin(10*time/1000) > 0;

		this.clouds1.x = (20 * time/1000) % this.W;
		this.clouds2.x = this.clouds1.x - this.W;

		this.player.flipX = anim;

		// this.flags.forEach(flag => {
			// flag.setFrame(anim ? 0 : 1);
		// });
	}

	progress() {
		this.addEvent(1000, () => {
			this.fade(true, 500, 0x000000);
			this.addEvent(550, () => {
				this.scene.start("MainScene");
			});
		});
	}
}