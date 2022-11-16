<script setup lang="ts">
import { RouterLink, RouterView } from "vue-router";
import NavBar from "./components/NavBar.vue";
</script>

<template>
	<main class="mx-auto w-full">
		<div class="hidden md:block">
			<RouterView />
		</div>
		<div
			class="md:hidden flex flex-col justify-center items-center h-screen text-red-500 text-lg"
		>
			Sorry this page is not meant for devices with smaller screens.
		</div>
	</main>
</template>
