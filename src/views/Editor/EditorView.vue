<script setup lang="ts">
import { getAuth, signOut } from "firebase/auth";
import router from "../../router";
import LayerView from "@/components/Editor/Layers/LayerView.vue";
import TileCatalogue from "@/components/Editor/Tiles/TileCatalogue/TileCatalogue.vue";
import TileProperties from "@/components/Editor/Tiles/TileProperties/TileProperties.vue";
import { onMounted } from "vue";
import { useEditorStore } from "@/stores/editorStore";

let auth;
const SignOutUser = () => {
	auth = getAuth();
	signOut(auth);
	router.push("/");
};

const editorStore = useEditorStore();
onMounted(() => {
	editorStore.fetchInitialData();
});
</script>

<template>
	<div class="grid grid-rows-[auto_minmax(0,1fr)] w-full h-screen">
		<div class="row-span-1 col-span-9">
			<div class="flex justify-between items-center">
				<div class="flex justify-start items-center">
					<img
						src="@/assets/logo.svg"
						alt="Logo"
						class="w-16 mr-2 p-2"
					/>
					<div class="text-6xl font-light text-gray-300 uppercase">
						Editor
					</div>
					<hr />
				</div>
				<div class="mr-4">
					<button
						@click="SignOutUser"
						class="px-4 py-2 rounded bg-gray-200 text-black font-medium transition-all duration-300 hover:bg-sky-400 hover:text-white"
					>
						Sign Out
					</button>
				</div>
			</div>
		</div>
		<div class="row-span-5">
			<TileProperties />
		</div>
		<div class="row-span-5 col-span-6"></div>
		<div
			class="row-span-5 col-span-2 flex flex-col justify-start items-center w-full"
		>
			<div class="h-1/2 w-full">
				<LayerView />
			</div>
			<div class="h-1/2 w-full">
				<TileCatalogue />
			</div>
		</div>
	</div>
</template>
