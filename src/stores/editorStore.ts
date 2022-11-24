import { ref, reactive } from "vue";
import { defineStore } from "pinia";
import { collection, getFirestore, getDocs } from "firebase/firestore";

export const useEditorStore = defineStore("editorData", () => {
	const tileState = reactive({ tiles: [] });
	const layerState = reactive({ layers: [] });
	const currSelectedLayer = ref(-1);
	const currSelectedTile = ref({});

	async function fetchInitialData() {
		layerState.layers = [];
		const db = getFirestore();
		const layersQuerySnapshot = await getDocs(collection(db, "/layers"));
		layersQuerySnapshot.forEach((doc) => {
			// doc.data() is never undefined for query doc snapshots
			layerState.layers.push({ id: doc.id, name: doc.data().name });
		});
		const tilesQuerySnapshot = await getDocs(collection(db, "/tiles"));
		tilesQuerySnapshot.forEach((doc) => {
			// doc.data() is never undefined for query doc snapshots
			tileState.tiles.push({ id: doc.id, ...doc.data() });
		});

		console.log(tileState);
		console.log(layerState);
	}

	function setSelectedLayer(layerIndex: number) {
		currSelectedLayer.value = layerIndex;
	}

	function getAllLayers() {
		return layerState.layers;
	}

	return {
		currSelectedLayer,
		currSelectedTile,
		fetchInitialData,
		getAllLayers,
	};
});
