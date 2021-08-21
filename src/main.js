import Vue from 'vue'
import App from './App.vue'
import router from './router';
import ElementUI from 'element-ui'
// 默认主题
import 'element-ui/lib/theme-chalk/index.css';
import axios from 'axios'
import VueAxios from 'vue-axios'
import VueHighlightJS from 'vue-highlightjs'
// import 'highlight.js/styles/nnfx-dark.css'
// import 'highlight.js/styles/atom-one-dark.css'
// import 'highlight.js/styles/dracula.css'
// import 'highlight.js/styles/gml.css'
// import 'highlight.js/styles/gruvbox-dark.css'
// import 'highlight.js/styles/obsidian.css'
import 'highlight.js/styles/railscasts.css'



Vue.config.productionTip = false
Vue.use(ElementUI, {
    size: 'small'
});
Vue.use(VueAxios, axios)
Vue.use(VueHighlightJS)
new Vue({
    router,
    render: h => h(App),
}).$mount('#app')
