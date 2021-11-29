import { BaseScene } from "./BaseScene";
import { images, spritesheets } from "../assets";
import { GrayScalePostFilter } from "../pipelines/GrayScalePostFilter";
import { BlurPostFilter } from "../pipelines/BlurPostFilter";
import BendWaves from "../pipelines/BendWavesPostFX";
import BendWaves2 from "../pipelines/BendWavesPostFX2";


export class PreloadScene extends BaseScene {
	constructor() {
		super({key: "PreloadScene"});
	}

	init() {
		// Load pipelines
		let renderer = (this.renderer as Phaser.Renderer.WebGL.WebGLRenderer);
		if (renderer.pipelines) {
			renderer.pipelines.addPostPipeline("GrayScalePostFilter", GrayScalePostFilter);
			renderer.pipelines.addPostPipeline("BlurPostFilter", BlurPostFilter);
			renderer.pipelines.addPostPipeline("BendWaves", BendWaves);
			renderer.pipelines.addPostPipeline("BendWaves2", BendWaves2);
		}
	}

	preload() {
		this.cameras.main.setBackgroundColor(0xFFFFFF);

		// Loading bar
		let width = 0.5 * this.W;
		let x = this.CX - width/2;
		let y = this.CY;
		let bg = this.add.rectangle(x, y, width, 2, 0x666666).setOrigin(0, 0.5);
		let bar = this.add.rectangle(x, y, 1, 4, 0x333333).setOrigin(0, 0.5);

		// Loading text
		let text = this.createText(x, y, 8, this.weights.bold, "#333", "Loading...").setOrigin(0, 1.5);

		// Listener
		this.load.on("progress", (progress) => {
			bar.width = progress * width;
		});


		// Load assets

		for (let image of images) {
			this.load.image(image.key, image.path);
		}

		for (let image of spritesheets) {
			this.load.spritesheet(image.key, image.path, { frameWidth: image.width, frameHeight: image.height });
		}
	}

	create() {
		this.fade(true, 100, 0xFFFFFF);
		this.addEvent(110, () => {
			this.scene.start("MenuScene");
		});
	}
}