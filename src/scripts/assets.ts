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
import volcano from "../assets/images/volcano.png";
import clouds from "../assets/images/clouds.png";
import mapplayer from "../assets/images/mapplayer.png";

const images: Asset[] = [
	{ key: "pika",		path: pika },
	{ key: "volcano",	path: volcano },
	{ key: "clouds",	path: clouds },
	{ key: "mapplayer",	path: mapplayer },
];


/* Spritesheets */

import player from "../assets/images/player.png";
import egg from "../assets/images/egg.png";
import dragon from "../assets/images/dragon.png";

const spritesheets: SpriteSheet[] = [
	{ key: "player",	path: player,	width: 128/4,	height: 192/4 },
	{ key: "egg",		path: egg,		width: 64/2,	height: 64/2 },
	{ key: "dragon",	path: dragon,	width: 512/4,	height: 512/4 },
];


/* Export */

export {
	images,
	spritesheets
};