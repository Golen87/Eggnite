import "phaser";
import { PreloadScene } from "./scripts/scenes/PreloadScene";
import { MainScene } from "./scripts/scenes/MainScene";

const config: Phaser.Types.Core.GameConfig = {
	type: Phaser.WEBGL,
	width: 1920,
	height: 1080,
	scale: {
		mode: Phaser.Scale.FIT
	},
	scene: [
		PreloadScene,
		MainScene,
	],
	plugins: {
		global: [
		]
	}
};

const game = new Phaser.Game(config);