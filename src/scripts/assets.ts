/* Interface */

interface Asset {
	key: string;
	path: string;
}

interface SpriteSheet {
	key: string;
	path: string;
	width: number;
	height: number;
}


/* Images */

import pika from "../assets/images/pikadrawer.jpg";
import ground from "../assets/images/ground.png";
import lava from "../assets/images/lava.png";
import volcano from "../assets/images/volcano.png";
import clouds from "../assets/images/clouds.png";

const images: Asset[] = [
	{ key: "pika",		path: pika },
	{ key: "ground",	path: ground },
	{ key: "lava",		path: lava },
	{ key: "volcano",	path: volcano },
	{ key: "clouds",	path: clouds },
];


/* Spritesheets */

import player from "../assets/images/player.png";
import player2 from "../assets/images/player2.png";
import egg from "../assets/images/egg.png";
import dragon from "../assets/images/dragon.png";
import gem from "../assets/images/gem.png";
import mapplayer from "../assets/images/mapplayer.png";
import shell from "../assets/images/shell.png";
import sweat from "../assets/images/sweat.png";
import lavabubble from "../assets/images/lava_bubble.png";

const spritesheets: SpriteSheet[] = [
	{ key: "player",	path: player,		width: 128/4,	height: 192/4 },
	{ key: "player2",	path: player2,		width: 128/4,	height: 192/4 },
	{ key: "egg",		path: egg,			width: 64/2,	height: 64/2 },
	{ key: "dragon",	path: dragon,		width: 256/2,	height: 512/4 },
	{ key: "gem",		path: gem,			width: 256/2,	height: 512/4 },
	{ key: "mapplayer",	path: mapplayer,	width: 32/2,	height: 16/1 },
	{ key: "shell",		path: shell,		width: 64/4,	height: 16/1 },
	{ key: "sweat",		path: sweat,		width: 64/4,	height: 16/1 },
	{ key: "lavabubble",path: lavabubble,	width: 16,		height: 16 },
];


/* Export */

export {
	images,
	spritesheets
};