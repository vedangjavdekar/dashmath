import { Scene } from "phaser";
import tile from "@/components/Editor/Game/assets/tile.png";

export default class BootScene extends Scene {
	constructor() {
		super({ key: "BootScene" });
	}

	preload() {
		this.load.image("tile", tile);
	}

	create() {
		this.scene.start("EditorScene");
	}
}
