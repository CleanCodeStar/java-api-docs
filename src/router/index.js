import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

export default new Router({
    routes: [
        {
            path: '/',
            component: () => import(/* webpackChunkName: "home" */ '../components/Index'),
            meta: { title: '首页' },
            children: []
        }
    ]
});
