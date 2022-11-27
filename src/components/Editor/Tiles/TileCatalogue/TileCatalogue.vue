<script setup lang="ts">
import Section from "../../Base/Section.vue";
import { useEditorStore } from "@/stores/editorStore";
import TileCard from "../TileCard.vue";

const editorStore = useEditorStore();
</script>
<template>
	<Section>
		<template v-slot:title>Tiles</template>
		<template v-slot:content>
			<div class="inline-grid grid-cols-3">
				<div
					v-for="(
						tile, index
					) in editorStore.getTilesForCurrSelectedLayer()"
					:key="tile.id"
				>
					<TileCard :tileData="tile" />
				</div>
			</div>
		</template>
	</Section>
</template>
