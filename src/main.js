import Vue from 'vue'

// import VueMeta from 'vue-meta'
// Vue.use(VueMeta);

import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'

// Install BootstrapVue
Vue.use(BootstrapVue)
// Optionally install the BootstrapVue icon components plugin
Vue.use(IconsPlugin)

//import 'bootstrap/dist/css/bootstrap.css'
//import 'bootstrap-vue/dist/bootstrap-vue.css'

//import './assets/styleTemplates/custom.scss'

import App from './App.vue'

import VueGtag from "vue-gtag";
Vue.use(VueGtag, {
  config: { id: "G-DX7FZ4Z70E" }
});

// import VueMixpanel from 'vue-mixpanel'
// Vue.use(VueMixpanel, {
//   token: ''
// })


import VueRouter from 'vue-router'
Vue.use(VueRouter);

const routes = [
  { path: '/', component: App },
]


const router = new VueRouter({
  mode: 'history',
  routes // short for `routes: routes`
})

router.beforeEach((to, from, next) => {
  if (to.fullPath.includes('?')) {
    const path = to.fullPath.substr(0, to.fullPath.indexOf('?'))
    next(path);
    return;
  }

  if (to.fullPath.substr(0, 2) === "/#") {
    const path = to.fullPath.substr(2);
    next(path);
    return;
  }
  if (to.path == '/_=_') {
    return next(false);
  }
  if (to.fullPath.substr(-1) !== "/") {
    const path = to.fullPath + "/"
    next(path);
    return;
  }
  
  next();
})

/*var vm =*/ new Vue({
  el: '#app',
  router,
  render: h => h(App),
  data () {
    return {
      gSheet: null
    }
  }
})

//global.vm = vm;