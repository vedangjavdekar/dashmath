<script setup lang="ts">
import Section from "../Base/Section.vue";
import { useEditorStore } from "@/stores/editorStore";

const editorStore = useEditorStore();
</script>
<template>
	<Section>
		<template v-slot:title>Layers</template>
		<template v-slot:content>
			<ul v-show="editorStore.getAllLayers().length > 0">
				<li></li>
			</ul>
		</template>
	</Section>
</template>
