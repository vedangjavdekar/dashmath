<script setup lang="ts">
import Section from "../../Base/Section.vue";
import { useLevelStore } from "@/stores/levelStore";
import { onMounted, ref } from "vue";
import { computed } from "@vue/reactivity";

const levelStore = useLevelStore();

const tileValue = computed({
	get: () => {
		if (levelStore.currEditTile !== undefined) {
			return levelStore.currEditTile.value;
		} else {
			return 0;
		}
	},
	set: (newValue) => {
		if (levelStore.currEditTile !== undefined) {
			levelStore.currEditTile.value = newValue;
		}
	},
});
</script>
<template>
	<Section>
		<template v-slot:title>Tile Properties</template>
		<template v-slot:content>
			<div
				v-if="
					levelStore.currEditTileDetails !== undefined &&
					levelStore.currEditTile !== undefined &&
					levelStore.currEditTile.hasValue
				"
				class="text-gray-400 text-lg flex flex-col justify-start items-start"
			>
				<div class="text-xl">
					{{
						levelStore.currEditTileDetails &&
						levelStore.currEditTileDetails.boardName.replace(
							"{value}",
							levelStore.currEditTile.value.toString()
						)
					}}
				</div>
				<label for="tileValueRange">Value: </label>
				<input
					v-if="levelStore.currEditTileDetails?.minValue"
					type="range"
					id="tileValueRange"
					name="tileValue"
					v-model="tileValue"
					:min="levelStore.currEditTileDetails.minValue"
					:max="levelStore.currEditTileDetails.maxValue"
				/>
				<input
					v-else
					type="number"
					id="tileValueNumber"
					name="tileValue"
					v-model="tileValue"
				/>
			</div>
		</template>
	</Section>
</template>
