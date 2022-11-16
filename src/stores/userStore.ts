import { ref, reactive, computed } from 'vue';
import { defineStore } from 'pinia';

export const useUserStore = defineStore('counter', () => {
	const userDetails = reactive({
		email: '',
		password: '',
		confirmPassword: '',
	});

	const currentMode = ref('Login');
	const loggedIn = ref(false);

	function setMode(newMode: string) {
		currentMode.value = newMode;
	}

	function clearData() {
		userDetails.email = '';
		userDetails.password = '';
		userDetails.confirmPassword = '';
	}

	return {
		userDetails,
		currentMode,
		loggedIn,
		setMode,
		clearData,
	};
});
