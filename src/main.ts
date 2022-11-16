import { createApp } from 'vue';
import { createPinia } from 'pinia';

import App from './App.vue';
import router from './router';
import './style.css';

import { initializeApp } from 'firebase/app';

const firebaseConfig = {
	apiKey: 'AIzaSyAzPgpieObBgyvChQPUqL1Z37Pmz8LRgjc',
	authDomain: 'dashmath-cd8eb.firebaseapp.com',
	projectId: 'dashmath-cd8eb',
	storageBucket: 'dashmath-cd8eb.appspot.com',
	messagingSenderId: '1032664042281',
	appId: '1:1032664042281:web:38934cbea97fe70fe28538',
};

initializeApp(firebaseConfig);

const app = createApp(App);

app.use(createPinia());
app.use(router);

app.mount('#app');
