import Phaser from "phaser";

let eventEmitter: Phaser.Events.EventEmitter | null = null;

export default class DashMathEventEmitter extends Phaser.Events.EventEmitter {
	constructor() {
		super();
	}

	static getInstance() {
		if (eventEmitter === null) {
			eventEmitter = new DashMathEventEmitter();
		}

		return eventEmitter;
	}
}
