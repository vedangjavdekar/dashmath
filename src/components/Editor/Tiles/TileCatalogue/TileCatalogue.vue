<script setup lang="ts">
import SectionComponent from "../../Base/SectionComponent.vue";
import { useEditorStore } from "@/stores/editorStore";
import TileCard from "../TileCard.vue";

const editorStore = useEditorStore();
</script>
<template>
	<SectionComponent>
		<template v-slot:title>Tiles</template>
		<template v-slot:content>
			<div class="inline-grid grid-cols-3">
				<div
					v-for="tile in editorStore.getTilesForCurrSelectedLayer()"
					:key="tile.id"
				>
					<TileCard :tileData="tile" />
				</div>
			</div>
		</template>
	</SectionComponent>
</template>
