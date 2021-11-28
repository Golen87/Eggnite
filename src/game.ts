import "phaser";
import { PreloadScene } from "./scripts/scenes/PreloadScene";
import { MenuScene } from "./scripts/scenes/MenuScene";
import { OverworldScene } from "./scripts/scenes/OverworldScene";
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
		MenuScene,
		OverworldScene,
		MainScene,
	],
	plugins: {
		global: [
		]
	}
};

const game = new Phaser.Game(config);