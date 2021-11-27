import "phaser";
import { PreloadScene } from "./scripts/scenes/PreloadScene";
import { MainScene } from "./scripts/scenes/MainScene";

const config: Phaser.Types.Core.GameConfig = {
	type: Phaser.WEBGL,
	width: 320,
	height: 180,
	pixelArt: true,
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