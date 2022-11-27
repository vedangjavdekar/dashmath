import type Phaser from "phaser";

export interface LevelTileData {
	tileImage: Phaser.GameObjects.Image;
	gridX: number;
	gridY: number;
	hasValue: boolean;
	value: number;
}
