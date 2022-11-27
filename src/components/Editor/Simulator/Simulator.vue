<script setup lang="ts">
import SimContainer from "./SimContainer.vue";
</script>

<template>
	<Suspense>
		<SimContainer />
		<template #fallback>
			<div class="text-xl">Downloading ...</div>
		</template>
	</Suspense>
</template>
