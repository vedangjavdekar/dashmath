import { ref, reactive } from "vue";
import { defineStore } from "pinia";
import { collection, getFirestore, getDocs } from "firebase/firestore";
import type { LayerDetails, TileDetails } from "@/types/editorTypes";

export const useEditorStore = defineStore("editorData", () => {
	const tileState = reactive<{ tiles: TileDetails[] }>({ tiles: [] });
	const layerState = reactive<{ layers: LayerDetails[] }>({ layers: [] });
	const currSelectedLayer = ref(-1);
	const currSelectedTile = ref("");

	async function fetchInitialData() {
		layerState.layers = [];
		const db = getFirestore();
		const layersQuerySnapshot = await getDocs(collection(db, "/layers"));
		layersQuerySnapshot.forEach((doc) => {
			// doc.data() is never undefined for query doc snapshots
			layerState.layers.push({
				...doc.data(),
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

		console.log(tileState);
		console.log(layerState);
	}

	function setSelectedLayer(layerIndex: number) {
		currSelectedLayer.value = layerIndex;
		layerState.layers[currSelectedLayer.value].visible = true;
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

	return {
		currSelectedLayer,
		currSelectedTile,
		fetchInitialData,
		changeLayerVisibility,
		getTilesForCurrSelectedLayer,
		getAllLayers,
		setSelectedLayer,
		setSelectedTile,
	};
});
