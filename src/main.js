import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import VueAuthenticate from 'vue-authenticate'
import './external'

Vue.use(VueAuthenticate, {
    baseUrl: 'http://localhost:3000', // Your API domain

    providers: {
        github: {
            clientId: '3be3b858bdbd88ab010f',
            redirectUri: 'http://127.0.0.1:8000/api/v1/auth/oauth/complete/github/'
        }
    }
});

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app');
