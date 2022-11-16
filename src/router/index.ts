import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';

const router = createRouter({
	history: createWebHistory(import.meta.env.BASE_URL),
	routes: [
		{
			path: '/',
			name: 'home',
			component: HomeView,
		},
		{
			path: '/authentication',
			name: 'authentication',
			component: () => import('../views/Auth/AuthenticationView.vue'),
		},
		{
			path: '/editor',
			name: 'editor',
			component: () => import('../views/Editor/EditorView.vue'),
		},
	],
});

export default router;
