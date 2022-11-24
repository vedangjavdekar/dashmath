import { getAuth, onAuthStateChanged } from "firebase/auth";
import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";

const router = createRouter({
	history: createWebHistory(import.meta.env.BASE_URL),
	routes: [
		{
			path: "/",
			name: "home",
			component: HomeView,
		},
		{
			path: "/authentication",
			name: "authentication",
			component: () => import("../views/Auth/AuthenticationView.vue"),
		},
		{
			path: "/editor",
			name: "editor",
			component: () => import("../views/Editor/EditorView.vue"),
			meta: {
				requiresAuth: true,
			},
		},
	],
});

const getCurrentUser = () => {
	return new Promise((resolve, reject) => {
		const removeListener = onAuthStateChanged(
			getAuth(),
			(user) => {
				removeListener();
				resolve(user);
			},
			reject
		);
	});
};

router.beforeEach(async (to, from, next) => {
	if (to.matched.some((record) => record.meta.requiresAuth)) {
		next();
		if (await getCurrentUser()) {
		} else {
			alert("Please Login or Signup to access the editor");
			next("/authentication");
		}
	} else {
		next();
	}
});

export default router;
