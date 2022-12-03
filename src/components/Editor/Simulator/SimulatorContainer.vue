<script setup lang="ts">
import { onMounted, onUnmounted } from "vue";
import type { Game } from "phaser";
let gameInstance: Game | null = null;
const game = await import("@/components/Editor/Game/game");
const containerId = "game-container";
onMounted(() => {
	gameInstance = game.launch(containerId);
});
onUnmounted(() => {
	gameInstance?.destroy(false);
});
</script>

<template>
	<div :id="containerId" />
</template>
