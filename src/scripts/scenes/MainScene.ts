import { BaseScene } from "./BaseScene";
import { RoundRectangle } from "../components/RoundRectangle";


export class MainScene extends BaseScene {

	constructor() {
		super({key: "MainScene"});
	}

	create(): void {
		// this.fade(false, 200, 0x000000);

		this.add.image(this.CX, this.CY, "pika");
	}

	update(time: number, delta: number) {
	}
}