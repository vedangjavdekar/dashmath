import { ref, reactive } from "vue";
import { defineStore } from "pinia";
import { useEditorStore } from "./editorStore";
import type { LevelTileData } from "@/types/levelTypes";
import type { TileDetails } from "@/types/editorTypes";
import { toolBarOptions } from "./toolBarOptions";

export const useLevelStore = defineStore("levelData", () => {
	const levelTiles = reactive<{ tiles: Array<LevelTileData[]> }>({
		tiles: [],
	});
	const currMode = ref("");
	const layerGroup = ref<Phaser.GameObjects.Group>();
	const debugText = ref<Phaser.GameObjects.Text>();
	const currEditTile = ref<LevelTileData>();
	const currEditTileDetails = ref<TileDetails>();

	function initializeLayers(layerCount: number) {
		levelTiles.tiles = [];
		for (var i = 0; i < layerCount; ++i) {
			levelTiles.tiles.push([]);
		}
	}

	function setLayerGroup(group: Phaser.GameObjects.Group) {
		layerGroup.value = group;
	}

	function setDebugText(text: Phaser.GameObjects.Text) {
		debugText.value = text;
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
			if (levelTiles.tiles[layerIndex].length > 0) {
				layerGroup.value?.getChildren().forEach((gameObj) => {
					if ((gameObj.getData("layer") as number) === layerIndex) {
						(gameObj as Phaser.GameObjects.Image).setVisible(
							visible
						);
					}
				});
			}
		}
	}

	function addTile(
		tileId: string,
		layerIndex: number,
		gridX: number,
		gridY: number,
		hasValue: boolean,
		value?: number
	) {
		levelTiles.tiles[layerIndex].push({
			gridX,
			gridY,
			tileId,
			hasValue,
			value: value ? value : 0,
		});

		const tile = layerGroup.value?.getFirstDead(
			true,
			gridX,
			gridY,
			"tile"
		) as Phaser.GameObjects.Image;

		tile.setData("layer", layerIndex);
		tile.setData("gridPosition", { gridX, gridY });
		tile.setDepth(layerIndex);
		tile.setActive(true);
		tile.setVisible(true);

		return tile;
	}

	function removeTile(layerIndex: number, gridX: number, gridY: number) {
		if (!levelTiles.tiles) {
			return true;
		}

		const tile = layerGroup.value?.getChildren().find((gameObj) => {
			const layer = gameObj.getData("layer");
			const gridPosition = gameObj.getData("gridPosition");
			return (
				layer === layerIndex &&
				gridPosition.gridX === gridX &&
				gridPosition.gridY === gridY
			);
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

		return tile;
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

	function setTileForEdit(gridX: number, gridY: number) {
		let editTile = undefined;
		for (let i = levelTiles.tiles.length - 1; i >= 0; i--) {
			const tile = levelTiles.tiles[i].find((tileObj) => {
				return tileObj.gridX === gridX && tileObj.gridY === gridY;
			});
			if (tile !== undefined) {
				editTile = tile;
				break;
			}
		}

		if (editTile !== undefined) {
			currEditTile.value = editTile;
			const editorStore = useEditorStore();
			currEditTileDetails.value = editorStore.getTileById(
				currEditTile.value.tileId
			);
		} else {
			currEditTile.value = undefined;
			currEditTileDetails.value = undefined;
		}
	}

	function clearLevel() {
		console.log("clear level");
		const layers = levelTiles.tiles.length;
		for (let i = 0; i < layers; i++) {
			levelTiles.tiles[i] = [];
		}

		layerGroup.value?.getChildren().forEach((child) => {
			layerGroup.value?.killAndHide(child);
		});
	}

	function validate() {
		const editorStore = useEditorStore();

		const playerStart = editorStore.getTileByName("PlayerStart");
		const goal = editorStore.getTileByName("Goal");

		let playerStartFound = false;
		let goalFound = false;
		if (playerStart) {
			playerStartFound = hasTile(1, playerStart.id);
		}

		if (goal) {
			goalFound = hasTile(1, goal.id);
		}

		if (!playerStartFound) {
			debugText.value
				?.setText("Player Start Missing")
				.setColor("#ff6b66");
		} else if (!goalFound) {
			debugText.value
				?.setText("Level should have at least one goal")
				.setColor("#ff6b66");
		} else {
			debugText.value?.setText("All Good!").setColor("#69c99b");
		}
	}

	function hasTile(layerIndex: number, tileId: string) {
		return (
			levelTiles.tiles[layerIndex].findIndex(
				(tile) => tile.tileId === tileId
			) !== -1
		);
	}

	return {
		currMode,
		currEditTile,
		currEditTileDetails,
		debugText,
		initializeLayers,
		setLayerGroup,
		setDebugText,
		handleLevelToolAction,
		addTile,
		removeTile,
		changeLayerVisibility,
		checkForTileAt,
		setTileForEdit,
		clearLevel,
		validate,
	};
});
