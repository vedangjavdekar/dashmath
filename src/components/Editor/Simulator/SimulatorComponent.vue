<script setup lang="ts">
import SimulatorContainer from "./SimulatorContainer.vue";
</script>

<template>
	<Suspense>
		<SimulatorContainer />
		<template #fallback>
			<div class="text-xl">Downloading ...</div>
		</template>
	</Suspense>
</template>
