<script setup lang="ts">
import type { TileDetails } from "@/types/editorTypes";
import { useEditorStore } from "@/stores/editorStore";

const editorStore = useEditorStore();

const props = defineProps<{ tileData: TileDetails }>();
</script>

<template>
	<button
		:class="`flex flex-col justify-center items-center w-20 h-24 m-2 rounded-lg border-2 border-gray-400 text-gray-500 transition-all duration-300 ${
			editorStore.currSelectedTile === tileData.id
				? 'border-sky-400 text-sky-400'
				: 'hover:border-sky-400 hover:text-sky-400'
		}`"
		@click="editorStore.setSelectedTile(tileData.id)"
	>
		<div
			class="w-8 h-8 rounded-md mb-2"
			:style="`background-color:${props.tileData.color};`"
		></div>
		<div>{{ props.tileData.name }}</div>
	</button>
</template>
