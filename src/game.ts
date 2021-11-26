import "phaser";
import { PreloadScene } from "./scripts/scenes/PreloadScene";
import { MainScene } from "./scripts/scenes/MainScene";
import { UIScene } from "./scripts/scenes/UIScene";

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
		UIScene
	],
	plugins: {
		global: [
		]
	}
};

const game = new Phaser.Game(config);