<script setup lang="ts">
import type { ToolBarOption } from "@/types/toolBarOptionType";
import { useEditorStore } from "@/stores/editorStore";

const editorStore = useEditorStore();

const props = defineProps<{ toolBarOption: ToolBarOption; index: number }>();

const handleButtonClick = () => {
	editorStore.handleSelectNewTool(props.index);
};
</script>
<template>
	<li>
		<button
			@click="handleButtonClick"
			:class="`p-2 mr-2 bg-gray-300 text-gray-500 border-b-4 transition-all duration-300 ${
				editorStore.currSelectedTool !== props.index
					? 'hover:bg-gray-500 hover:text-white border-b-transparent'
					: 'border-b-sky-400'
			}`"
		>
			<v-icon :name="props.toolBarOption.icon" />
			{{ props.toolBarOption.text }}
		</button>
	</li>
</template>
