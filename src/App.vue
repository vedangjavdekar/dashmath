<script setup lang="ts">
import type { findProp } from "@vue/compiler-core";
import { onMounted } from "vue";
import { RouterLink, RouterView } from "vue-router";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useUserStore } from "@/stores/userStore";
import router from "./router";

const userStore = useUserStore();
let auth;
onMounted(() => {
	auth = getAuth();
	onAuthStateChanged(auth, (user) => {
		if (user) {
			userStore.setLoggedIn(true);
			router.push("/editor");
		} else {
			userStore.setLoggedIn(false);
		}
	});
});
</script>

<template>
	<main class="mx-auto w-full">
		<div class="hidden xl:block">
			<RouterView />
		</div>
		<div
			class="xl:hidden flex flex-col justify-center items-center h-screen text-red-500 text-lg"
		>
			Sorry this page is not meant for devices with smaller screens.
		</div>
	</main>
</template>
