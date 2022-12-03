import { ref, reactive } from "vue";
import { defineStore } from "pinia";
import { useEditorStore } from "./editorStore";
import type { LevelTileData } from "@/types/levelTypes";
import type { TileDetails } from "@/types/editorTypes";
import { toolBarOptions } from "./toolBarOptions";
import DashMathEventEmitter from "@/components/Editor/Game/events/DashMathEventEmitter";
import { DashMathEvents } from "@/components/Editor/Game/events/eventConstants";
import type { OnValidateParameters } from "@/components/Editor/Game/events/eventParameters";

export const useLevelStore = defineStore("levelData", () => {
	const levelTiles = reactive<{ tiles: Array<LevelTileData[]> }>({
		tiles: [],
	});
	const currMode = ref("");
	const currEditTile = ref<LevelTileData>();
	const currEditTileDetails = ref<TileDetails>();

	function initializeLayers(layerCount: number) {
		levelTiles.tiles = [];
		for (let i = 0; i < layerCount; ++i) {
			levelTiles.tiles.push([]);
		}
	}

	function handleLevelToolAction(toolIndex: number) {
		currMode.value = toolBarOptions[toolIndex].actionName;
		if (currMode.value !== "edit") {
			currEditTile.value = undefined;
			currEditTileDetails.value = undefined;
		}
		const eventEmitter = DashMathEventEmitter.getInstance();
		eventEmitter.emit(DashMathEvents.TOOL_MODE_CHANGED);
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
				console.log("Change visibility Event emitted");
				const eventEmitter = DashMathEventEmitter.getInstance();
				eventEmitter.emit(DashMathEvents.CHANGE_LAYER_VISIBILITY, {
					layerIndex,
					visible,
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
		const newSize = levelTiles.tiles[layerIndex].push({
			gridX,
			gridY,
			tileId,
			hasValue,
			value: value ? value : 0,
		});

		return levelTiles.tiles[layerIndex][newSize - 1];
	}

	function removeTile(layerIndex: number, gridX: number, gridY: number) {
		if (!levelTiles.tiles) {
			return false;
		}

		if (layerIndex === 0) {
			for (let i = 1; i < levelTiles.tiles.length; i++) {
				const index = levelTiles.tiles[i].findIndex((tileObj) => {
					return tileObj.gridX === gridX && tileObj.gridY === gridY;
				});
				if (index !== -1) {
					return false;
				}
			}
		}

		levelTiles.tiles[layerIndex] = levelTiles.tiles[layerIndex].filter(
			(tileObj) => {
				return tileObj.gridX !== gridX || tileObj.gridY !== gridY;
			}
		);

		return true;
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

	function editCurrentTileValue(newValue: number) {
		if (currEditTile.value !== undefined) {
			currEditTile.value.value = newValue;
			const eventEmitter = DashMathEventEmitter.getInstance();
			eventEmitter.emit(DashMathEvents.ON_TILE_VALUE_CHANGED);
		}
	}

	function clearLevel() {
		console.log("clear level");
		const layers = levelTiles.tiles.length;
		for (let i = 0; i < layers; i++) {
			levelTiles.tiles[i] = [];
		}

		currEditTile.value = undefined;
		currEditTileDetails.value = undefined;

		const eventEmitter = DashMathEventEmitter.getInstance();
		eventEmitter.emit(DashMathEvents.CLEAR_LEVEL);
	}

	function validate() {
		const editorStore = useEditorStore();

		const playerStart = editorStore.getTileByName("PlayerStart");
		const goal = editorStore.getTileByName("Goal");

		let playerStartFound = false;
		let goalFound = false;
		if (playerStart) {
			playerStartFound = hasTile(1, playerStart.id) === 1;
		}

		if (goal) {
			goalFound = hasTile(1, goal.id) > 0;
		}

		const eventEmitter = DashMathEventEmitter.getInstance();
		const eventParams: OnValidateParameters = {
			message: "",
			color: "",
		};
		if (!playerStartFound) {
			eventParams.message =
				"Make sure there's only one player start in the level";
			eventParams.color = "#ff6b66";
		} else if (!goalFound) {
			eventParams.message = "Level should have at least one goal";
			eventParams.color = "#ff6b66";
		} else {
			eventParams.message = "All Good!";
			eventParams.color = "#69c99b";
		}
		eventEmitter.emit(DashMathEvents.ON_VALIDATE, eventParams);
	}

	function hasTile(layerIndex: number, tileId: string) {
		return levelTiles.tiles[layerIndex].filter(
			(tile) => tile.tileId === tileId
		).length;
	}

	return {
		currMode,
		currEditTile,
		currEditTileDetails,
		initializeLayers,
		handleLevelToolAction,
		addTile,
		removeTile,
		changeLayerVisibility,
		checkForTileAt,
		setTileForEdit,
		clearLevel,
		validate,
		editCurrentTileValue,
	};
});
