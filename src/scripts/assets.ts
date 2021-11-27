/* Interface */

interface Asset {
	key: string;
	path: string;
}


/* Backgrounds */

import pika from "../assets/images/pikadrawer.jpg";

const backgrounds: Asset[] = [
	{ key: "pika",		path: pika },
];


/* Spritesheets */

import player from "../assets/images/player.png";
import egg from "../assets/images/egg.png";

interface SpriteSheet {
	key: string;
	path: string;
	width: number;
	height: number;
	frames: number;
}
const spritesheets: SpriteSheet[] = [
	{ key: "player",	path: player,	width: 128/4,	height: 192/4,	frames: 4*4 },
	{ key: "egg",		path: egg,		width: 64/2,	height: 64/2,	frames: 2*2 },
];


/* Icons */

// import icon_reset from "../assets/icons/icon-reset.png";

const icons: Asset[] = [
	// { key: "icon-reset",				path: icon_reset },
];


/* Export */

const images: Asset[] = backgrounds.concat(icons);
const videos: Asset[] = [];

export {
	images,
	spritesheets,
	videos,
};