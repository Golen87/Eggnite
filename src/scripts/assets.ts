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

import x from "../assets/images/x.png";

interface SpriteSheet {
	key: string;
	path: string;
	width: number;
	height: number;
	frames: number;
}
const spritesheets: SpriteSheet[] = [
	// { key: "x",		path: x,	width: 1000/10,	height: 1000/10,	frames: 10*10 },
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