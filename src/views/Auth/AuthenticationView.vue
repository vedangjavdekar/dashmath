<script setup lang="ts">
import LoginComponent from '@/components/Auth/LoginComponent.vue';
import SignupComponent from '@/components/Auth/SignupComponent.vue';

import { useUserStore } from '@/stores/userStore';
import { computed } from 'vue';

const store = useUserStore();

const components = [LoginComponent, SignupComponent];

const currentComponent = computed(() => {
	if (store.currentMode === 'Login') {
		return LoginComponent;
	} else if (store.currentMode === 'SignUp') {
		return SignupComponent;
	}
});

const changeMode = (newMode: string) => {
	store.clearData();
	store.currentMode = newMode;
};
</script>

<template>
	<div
		class="w-full mx-auto flex flex-col justify-start items-center text-gray-600"
	>
		<div>
			<div class="mx-auto flex justify-around items-center">
				<img src="../../assets/logo.svg" alt="" class="w-8 mr-2" />
				<p class="text-[48px] font-bold flex justify-center">
					Welcome to DashMath Editor!
				</p>
				<img src="../../assets/logo.svg" alt="" class="w-8 mr-2" />
			</div>
			<div class="w-full text-center">
				Please login or create a new account to proceed to an exciting level
				editor
			</div>
		</div>
		<div class="my-6 w-1/3">
			<div class="w-full flex">
				<button
					class="w-full p-2 rounded mr-2 transition-all duration-300"
					@click="changeMode('Login')"
					:class="
						store.currentMode === 'Login'
							? 'bg-sky-400 text-white'
							: 'border-2 border-gray-400 text-gray-400'
					"
				>
					Login
				</button>
				<button
					class="w-full p-2 rounded transition-all duration-300"
					@click="changeMode('SignUp')"
					:class="
						store.currentMode === 'SignUp'
							? 'bg-sky-400 text-white'
							: 'border-2 border-gray-400 text-gray-400'
					"
				>
					Signup
				</button>
			</div>
			<div class="bg-white mt-4 bg-white rounded-lg shadow-md">
				<transition mode="out-in" name="fade">
					<keep-alive>
						<component v-bind:is="currentComponent"></component>
					</keep-alive>
				</transition>
			</div>
		</div>
	</div>
</template>

<style scoped>
.fade-enter-from {
	opacity: 0;
}

.fade-enter-active {
	transition: all 0.3s ease-out;
}

.fade-leave-to {
	opacity: 0;
}

.fade-leave-active {
	transition: all 0.3s ease-in;
}
</style>
