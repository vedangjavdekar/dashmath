<script setup lang="ts">
import gsap from 'gsap';
import { RouterLink } from 'vue-router';
import { onMounted } from 'vue';

onMounted(() => {
	gsap.fromTo(
		'#title',
		{
			opacity: 0,
		},
		{
			duration: 1.5,
			opacity: 1,
			delay: 0.2,
		}
	);

	gsap.fromTo(
		'#details',
		{
			opacity: 0,
			y: 50,
		},
		{
			duration: 1.5,
			opacity: 1,
			y: 0,
			delay: 0.8,
		}
	);
});
</script>

<template>
	<div
		class="grid grid-cols-1 md:grid-cols-2 place-content-around h-screen mx-auto w-full"
	>
		<div class="flex flex-col justify-center items-start p-8">
			<div class="flex flex-col justify-start items-start" id="title">
				<div
					class="grid grid-cols-4 gap-2 place-content-start items-start md:mx-1 xl:mx-2"
				>
					<img src="../assets/add.svg" alt="" class="w-6 lg:w-8" />

					<img src="../assets/subtract.svg" alt="" class="w-6 lg:w-8" />

					<img src="../assets/multiply.svg" alt="" class="w-6 lg:w-8" />

					<img src="../assets/divide.svg" alt="" class="w-6 lg:w-8" />
				</div>
				<div
					class="text-[48px] md:text-[56px] lg:text-[64px] xl:text-[96px] font-medium m-0 p-0 -mt-4"
				>
					Dash Math
				</div>
			</div>
			<div id="details">
				<div
					class="font-light text-[12px] md:text-[14px] lg:text-[18px] xl:text-[24px] -mt-4 mb-4 mx-1 lg:mx-2"
				>
					A math based puzzle game you can design levels for
				</div>

				<RouterLink
					to="authentication"
					class="px-4 py-2 rounded bg-gray-200 text-black font-medium transition-all duration-300 hover:bg-sky-400 hover:text-white"
				>
					Get Started
				</RouterLink>
			</div>
		</div>
		<div>
			<img src="../assets/graphic.png" alt="" class="w-2/3 mx-auto" />
		</div>
	</div>
</template>
