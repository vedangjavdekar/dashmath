<script setup lang="ts">
import SectionComponent from "../../Base/SectionComponent.vue";
import { useLevelStore } from "@/stores/levelStore";
import { computed } from "vue";

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
		levelStore.editCurrentTileValue(newValue);
	},
});
</script>
<template>
	<SectionComponent>
		<template v-slot:title>Tile Properties</template>
		<template v-slot:content>
			<div
				v-if="
					levelStore.currEditTileDetails !== undefined &&
					levelStore.currEditTile !== undefined
				"
				class="text-gray-400 text-lg flex flex-col justify-start items-start"
			>
				<div class="my-4">
					<div class="text-xl text-gray-600 uppercase">
						{{ levelStore.currEditTileDetails.name }} Tile
					</div>
					<hr />

					<div class="mt-4">
						{{ levelStore.currEditTileDetails.description }}
					</div>
				</div>
				<div
					v-if="levelStore.currEditTileDetails.hasValue"
					class="flex flex-col"
				>
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
			</div>
		</template>
	</SectionComponent>
</template>
