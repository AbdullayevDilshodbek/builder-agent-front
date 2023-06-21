import Vue from 'vue'
import VueRouter from 'vue-router'

const pathView = (path) => {
  return () => import(`@/views/${path}.vue`);
};

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    component: pathView('Home'),
    children: [
      {
        path: '/',
        name: 'User',
        component: pathView('user/User')
      },
      {
        path: '/location',
        name: 'Location',
        component: pathView('location/Location')
      },
      {
        path: '/cost-type',
        name: 'CostType',
        component: pathView('costType/CostType')
      },
      {
        path:'/cashbox',
        name: 'Cashbox',
        component: pathView('cashbox/Cashbox')
      }
    ]
  },
  {
    path: '/login',
    name: 'login',
    component: function () {
      return import('../views/Login.vue')
    }
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router

router.beforeEach((to, from, next) => {
  const session = localStorage.getItem("access_token");
  const publicPages = ["/login"];
  const notPublicPages = !publicPages.includes(to.path);
  let logged = false;
  if (session) {
    logged = true;
  }
  if (logged && !notPublicPages) {
    next("/");
  } else if (!logged && notPublicPages) {
    next("/login");
  } else {
    next();
  }
});
