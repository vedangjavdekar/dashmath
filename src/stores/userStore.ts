import { ref, reactive } from "vue";
import { defineStore } from "pinia";
import type { UserData } from "@/types/userTypes";

export const useUserStore = defineStore("userData", () => {
	const userDetails = reactive<UserData>({
		email: "",
		password: "",
		confirmPassword: "",
	});

	const currentMode = ref("Login");
	const loggedIn = ref(false);

	function setMode(newMode: string) {
		currentMode.value = newMode;
	}

	function clearData() {
		userDetails.email = "";
		userDetails.password = "";
		userDetails.confirmPassword = "";
	}

	function setLoggedIn(login: boolean) {
		loggedIn.value = login;
	}

	return {
		userDetails,
		currentMode,
		loggedIn,
		setMode,
		clearData,
		setLoggedIn,
	};
});
