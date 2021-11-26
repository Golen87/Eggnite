import { BaseScene } from "./BaseScene";
import { RoundRectangle } from "../components/RoundRectangle";


export class MainScene extends BaseScene {

	constructor() {
		super({key: "MainScene"});
	}

	create(): void {
		// this.fade(false, 200, 0x000000);
	}

	update(time: number, delta: number) {
	}
}