import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import Components from './components'; // 引入全局组件
import Public from './assets/css/public.css'; // 引入公共样式

Vue.use(Components); // 注册全局组件
Vue.use(Public);

Vue.config.productionTip = false;

new Vue({
    router,
    store,
    render: h => h(App),
}).$mount('#app');
