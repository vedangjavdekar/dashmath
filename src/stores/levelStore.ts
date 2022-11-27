import { ref, reactive } from "vue";
import { defineStore } from "pinia";
import { toolBarOptions } from "./editorStore";
import type { LevelTileData } from "@/types/levelTypes";

export const useLevelStore = defineStore("levelData", () => {
	const levelTiles = reactive<{ tiles: LevelTileData[][] }>([]);
	const currMode = ref("");

	function initializeLayers(layerCount: number) {
		levelTiles.tiles = [];
		for (var i = 0; i < layerCount; ++i) {
			levelTiles.tiles.push([]);
		}
	}

	function handleLevelToolAction(toolIndex: number) {
		currMode.value = toolBarOptions[toolIndex].actionName;
	}

	function changeLayerVisibility(layerIndex: number, visible: boolean) {
		if (!levelTiles.tiles) {
			return;
		}

		if (
			levelTiles.tiles.length > 0 &&
			layerIndex < levelTiles.tiles.length
		) {
			levelTiles.tiles[layerIndex].forEach((tileData) => {
				tileData.tileImage.setVisible(visible);
			});
		}
	}

	function addTile(
		image: Phaser.GameObjects.Image,
		layerIndex: number,
		gridX: number,
		gridY: number,
		hasValue: boolean,
		value?: number
	) {
		levelTiles.tiles[layerIndex].push({
			tileImage: image,
			gridX,
			gridY,
			hasValue,
			value: value ? value : 0,
		});
	}

	function removeTile(layerIndex: number, gridX: number, gridY: number) {
		if (!levelTiles.tiles) {
			return true;
		}

		const tile = levelTiles.tiles[layerIndex].find((tileObj) => {
			return tileObj.gridX === gridX && tileObj.gridY === gridY;
		});
		if (layerIndex === 0) {
			for (let i = 1; i < levelTiles.tiles.length; i++) {
				const index = levelTiles.tiles[i].findIndex((tileObj) => {
					return tileObj.gridX === gridX && tileObj.gridY === gridY;
				});
				if (index !== -1) {
					return undefined;
				}
			}
		}

		levelTiles.tiles[layerIndex] = levelTiles.tiles[layerIndex].filter(
			(tileObj) => {
				return tileObj.gridX !== gridX || tileObj.gridY !== gridY;
			}
		);
		return tile?.tileImage;
	}

	function checkForTileAt(layerIndex: number, gridX: number, gridY: number) {
		if (!levelTiles.tiles) {
			return true;
		}
		if (layerIndex > 0) {
			const groundTileIndex = levelTiles.tiles[0].findIndex((tileObj) => {
				return tileObj.gridX === gridX && tileObj.gridY === gridY;
			});

			if (groundTileIndex === -1) {
				return true;
			}
		}

		const tileIndex = levelTiles.tiles[layerIndex].findIndex((tileObj) => {
			return tileObj.gridX === gridX && tileObj.gridY === gridY;
		});
		return tileIndex !== -1;
	}

	return {
		currMode,
		initializeLayers,
		handleLevelToolAction,
		addTile,
		removeTile,
		changeLayerVisibility,
		checkForTileAt,
	};
});
