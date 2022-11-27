import { ref, reactive } from "vue";
import { defineStore } from "pinia";
import { collection, getFirestore, getDocs } from "firebase/firestore";
import { useLevelStore } from "./levelStore";
import type {
	LayerDetails,
	TileDetails,
	ToolBarOption,
} from "@/types/editorTypes";

export const toolBarOptions: ToolBarOption[] = [
	{
		icon: "bi-trash",
		text: "Clear",
		selectable: false,
		actionName: "clear",
		keys: [],
	},
	{
		icon: "bi-save",
		text: "Save",
		selectable: false,
		actionName: "save",
		keys: [],
	},
	{
		icon: "bi-pencil",
		text: "Draw (D)",
		selectable: true,
		actionName: "draw",
		keys: ["D"],
	},
	{
		icon: "bi-brush",
		text: "Paint (S)",
		selectable: true,
		actionName: "paint",
		keys: ["S"],
	},
	{
		icon: "bi-gear",
		text: "Edit (E)",
		selectable: true,
		actionName: "edit",
		keys: ["E"],
	},
];

export const useEditorStore = defineStore("editorData", () => {
	const tileState = reactive<{ tiles: TileDetails[] }>({ tiles: [] });
	const layerState = reactive<{ layers: LayerDetails[] }>({ layers: [] });
	const currSelectedLayer = ref(-1);
	const currSelectedTile = ref("");
	const currSelectedTool = ref(-1);
	const isInitialized = ref(false);

	async function fetchInitialData() {
		layerState.layers = [];
		tileState.tiles = [];
		isInitialized.value = false;
		const db = getFirestore();
		const layersQuerySnapshot = await getDocs(collection(db, "/layers"));
		layersQuerySnapshot.forEach((doc) => {
			// doc.data() is never undefined for query doc snapshots
			layerState.layers.push({
				...(doc.data() as LayerDetails),
				id: doc.id,
				visible: true,
			});
		});
		const tilesQuerySnapshot = await getDocs(collection(db, "/tiles"));
		tilesQuerySnapshot.forEach((doc) => {
			// doc.data() is never undefined for query doc snapshots
			tileState.tiles.push({
				...(doc.data() as TileDetails),
				id: doc.id,
			});
		});

		if (layerState.layers.length > 0) {
			setSelectedLayer(0);
			isInitialized.value = true;

			toolBarOptions.forEach((tool, index) => {
				if (tool.selectable && currSelectedTool.value === -1) {
					handleSelectNewTool(index);
				}
			});

			const levelStore = useLevelStore();
			levelStore.initializeLayers(layerState.layers.length);
		}
	}

	function setSelectedLayer(layerIndex: number) {
		currSelectedLayer.value = layerIndex;
		layerState.layers[currSelectedLayer.value].visible = true;
		const levelStore = useLevelStore();
		levelStore.changeLayerVisibility(currSelectedLayer.value, true);
		const tiles = getTilesForCurrSelectedLayer();
		if (tiles.length > 0) {
			currSelectedTile.value = tiles[0].id;
		}
	}

	function getAllLayers() {
		return layerState.layers;
	}

	function changeLayerVisibility(layerIndex: number, newVisibility: boolean) {
		if (layerIndex < layerState.layers.length) {
			layerState.layers[layerIndex].visible = newVisibility;
		} else {
			console.error(`Layer with index ${layerIndex} doesn't exist`);
		}
	}

	function getTilesForCurrSelectedLayer() {
		return tileState.tiles.filter((tileDetails) => {
			return tileDetails.layer === currSelectedLayer.value;
		});
	}

	function setSelectedTile(id: string) {
		currSelectedTile.value = id;
	}

	function handleSelectNewTool(toolIndex: number) {
		const levelStore = useLevelStore();
		if (toolBarOptions[toolIndex].selectable) {
			currSelectedTool.value = toolIndex;
			levelStore.handleLevelToolAction(toolIndex);
		}
	}

	function getCurrentTileColor() {
		const tile = tileState.tiles.find(
			(tile) => tile.id === currSelectedTile.value
		);
		if (tile) {
			return tile.color;
		}
		return "#ffffff";
	}

	function getCurrentTile() {
		return tileState.tiles.find(
			(tile) => tile.id === currSelectedTile.value
		);
	}
	return {
		currSelectedLayer,
		currSelectedTile,
		currSelectedTool,
		// Initialization
		fetchInitialData,
		isInitialized,

		//Actions
		changeLayerVisibility,
		setSelectedLayer,
		setSelectedTile,
		handleSelectNewTool,

		// Getters
		getTilesForCurrSelectedLayer,
		getAllLayers,
		getCurrentTileColor,
		getCurrentTile,
	};
});
