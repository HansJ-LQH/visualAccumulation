import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';

// 引入公共样式
import Public from './assets/css/public.css';

Vue.use(Public);

Vue.config.productionTip = false;

new Vue({
    router,
    store,
    render: h => h(App),
}).$mount('#app');
