<script setup lang="ts">
import Section from "../Base/Section.vue";
import { useEditorStore } from "@/stores/editorStore";
import { useLevelStore } from "@/stores/levelStore";

const editorStore = useEditorStore();
const levelStore = useLevelStore();

const handleChangeVisibility = (index: number, newVisibility: boolean) => {
	editorStore.changeLayerVisibility(index, newVisibility);
	levelStore.changeLayerVisibility(index, newVisibility);
};
</script>
<template>
	<Section>
		<template v-slot:title>Layers</template>
		<template v-slot:content>
			<ul v-show="editorStore.getAllLayers().length > 0">
				<li
					v-for="(layer, index) in editorStore
						.getAllLayers()
						.filter((layer) => !layer.disabled)"
					:key="layer.id"
					:class="`flex justify-start items-center p-2 border-l-4 ${
						editorStore.currSelectedLayer == index
							? 'border-l-sky-400 bg-gray-300'
							: 'border-l-transparent bg-transparent'
					}`"
				>
					<div class="relative ml-2 mr-4 p-2">
						<button
							class="text-gray-500 transition-all duration-300 -translate-x-1/2 -translate-y-1/2 absolute left-1/2 top-1/2"
							:class="`${
								editorStore.currSelectedLayer !== index
									? 'hover:scale-110'
									: ''
							}`"
							@click="
								handleChangeVisibility(index, !layer.visible)
							"
						>
							<v-icon
								v-show="
									layer.visible &&
									editorStore.currSelectedLayer !== index
								"
								name="bi-eye-fill"
							/>
							<v-icon
								v-show="
									!layer.visible &&
									editorStore.currSelectedLayer !== index
								"
								name="bi-eye-slash-fill"
							/>
						</button>
					</div>

					<button
						:class="`w-full p-2 uppercase text-left text-gray-500 text-lg transition-all duration-300 ${
							editorStore.currSelectedLayer !== index
								? 'hover:bg-sky-300 hover:text-white'
								: ''
						}`"
						@click="editorStore.setSelectedLayer(index)"
					>
						{{ layer.name }}
					</button>
				</li>
			</ul>
		</template>
	</Section>
</template>
