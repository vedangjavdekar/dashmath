<script setup lang="ts">
import { computed, ref, onActivated } from "vue";
import { useVuelidate } from "@vuelidate/core";
import { required, email, minLength, sameAs } from "@vuelidate/validators";
import { createUserWithEmailAndPassword, getAuth } from "@firebase/auth";
import { useUserStore } from "@/stores/userStore";

const store = useUserStore();
const signUpSuccessful = ref(false);
const signUpError = ref("");

const rules = computed(() => ({
	email: { required, email },
	password: { required, length: minLength(6) },
	confirmPassword: {
		required,
		sameAsPassword: sameAs(store.userDetails.password),
	},
}));

const v$ = useVuelidate(rules, store.userDetails);

const signUp = async () => {
	const isValidData = await v$.value.$validate();

	if (!isValidData) {
		return;
	}

	createUserWithEmailAndPassword(
		getAuth(),
		store.userDetails.email,
		store.userDetails.password
	)
		.then((_) => {
			signUpError.value = "";
			signUpSuccessful.value = true;
			setTimeout(() => {
				v$.value.$reset();
				store.clearData();
				store.setMode("Login");
			}, 1000);
		})
		.catch((err) => {
			switch (err.code) {
				case "auth/email-already-in-use": {
					signUpError.value =
						"User with this email already exists. Login or use another email address.";
					v$.value.$reset();
					store.clearData();
					break;
				}
			}
		});
};

const isDiasbled = computed(() => {
	return (
		store.userDetails.email === "" ||
		store.userDetails.password === "" ||
		store.userDetails.confirmPassword === ""
	);
});

onActivated(() => {
	v$.value.$reset();
	store.clearData();
	signUpError.value = "";
});
</script>

<template>
	<div>
		<div>
			<div class="p-4">
				<div class="text-2xl text-gray-500">Sign Up</div>
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
				<div class="form-field">
					<label for="confirmPassword">Confirm Password</label>
					<input
						id="confirmPassword"
						name="confirmPassword"
						type="password"
						v-model="store.userDetails.confirmPassword"
					/>
					<span v-if="v$.confirmPassword.$error" class="text-red-400">
						{{ v$.confirmPassword.$errors[0].$message }}
					</span>
				</div>
			</div>
			<div
				v-if="signUpError !== ''"
				class="text-red-400 w-full text-center"
			>
				{{ signUpError }}
			</div>
			<div
				v-if="signUpSuccessful"
				class="text-teal-400 w-full text-center"
			>
				Account created successfully!
			</div>
		</div>
		<div class="flex flex-col w-full">
			<button
				class="p-2 m-4 rounded border-2 border-gray-300 transition-all duration-300 hover:border-orange-300 hover:bg-orange-300 hover:text-white disabled:bg-gray-300 disabled:border-gray-300 disabled:text-gray-500 text-xl"
				id="btn_submit"
				type="submit"
				@click="signUp"
				:disabled="isDiasbled"
			>
				Sign Up
			</button>
			<div v-show="false">
				<p class="text-center font-bold">OR</p>
				<button
					class="p-2 m-4 rounded border-2 border-gray-300 transition-all duration-300 hover:border-orange-300 hover:bg-orange-300 hover:text-white"
				>
					Sign Up with Google
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
