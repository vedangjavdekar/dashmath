<script setup lang="ts">
import { computed, onActivated, reactive, ref } from "vue";
import { useVuelidate } from "@vuelidate/core";
import { required, email, minLength } from "@vuelidate/validators";
import { signInWithEmailAndPassword, getAuth } from "firebase/auth";
import router from "@/router";
import { useUserStore } from "@/stores/userStore";

const store = useUserStore();

const loginError = ref("");

const rules = computed(() => ({
	email: { required, email },
	password: { required, length: minLength(6) },
	confirmPassword: {},
}));

const v$ = useVuelidate(rules, store.userDetails);

const submitForm = async () => {
	const isValidLogin = await v$.value.$validate();
	// you can show some extra alert to the user or just leave the each field to show it's `$errors`.
	if (!isValidLogin) {
		return;
	}

	signInWithEmailAndPassword(
		getAuth(),
		store.userDetails.email,
		store.userDetails.password
	)
		.then((data) => {
			store.clearData();
			router.push("/editor");
		})
		.catch((err) => {
			switch (err.code) {
				case "auth/invalid-email": {
					loginError.value = "Invalid Email or Password.";
					break;
				}
				case "auth/wrong-password": {
					loginError.value = "Invalid Email or Password.";
					break;
				}
				case "auth/user-not-found": {
					loginError.value =
						"User doesn't exist with these credentials. Consider signing up.";
					break;
				}
				default: {
					loginError.value = "Something went wrong.";
					break;
				}
			}
		});
};

const isDiasbled = computed(() => {
	return store.userDetails.email === "" || store.userDetails.password === "";
});

onActivated(() => {
	v$.value.$reset();
	store.clearData();
	loginError.value = "";
});
</script>
<template>
	<div>
		<div class="p-4">
			<div class="text-2xl text-gray-500">Login</div>
			<div class="form-field">
				<label for="email">Email</label>
				<input
					id="email"
					name="email"
					type="email"
					v-model="store.userDetails.email"
				/>
				<span v-if="v$.email.$error" class="text-red-400">
					{{ v$.email.$errors[0].$message }}
				</span>
			</div>
			<div class="form-field">
				<label for="password">Password</label>
				<input
					id="password"
					name="password"
					type="password"
					v-model="store.userDetails.password"
				/>
				<span v-if="v$.password.$error" class="text-red-400">
					{{ v$.password.$errors[0].$message }}
				</span>
			</div>
			<span v-show="loginError !== ''" class="text-red-500"
				>Error: {{ loginError }}</span
			>
		</div>
		<div class="flex flex-col w-full">
			<button
				class="p-2 m-4 rounded border-2 border-gray-300 transition-all duration-300 hover:border-orange-300 hover:bg-orange-300 hover:text-white disabled:bg-gray-300 disabled:border-gray-300 disabled:text-gray-500 text-xl"
				id="btn_submit"
				type="submit"
				@click="submitForm"
				:disabled="isDiasbled"
			>
				Login
			</button>
			<div v-show="false">
				<p class="text-center font-bold">OR</p>
				<button
					class="p-2 m-4 rounded border-2 border-gray-300 transition-all duration-300 hover:border-orange-300 hover:bg-orange-300 hover:text-white"
				>
					Login with Google
				</button>
			</div>
		</div>
	</div>
</template>

<style scoped>
.form-field {
	@apply flex flex-col w-full text-gray-600 my-2;
}

.form-field input {
	@apply border-2 border-gray-600 rounded p-2 text-lg;
}
</style>
