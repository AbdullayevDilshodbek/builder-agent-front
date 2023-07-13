import Vue from 'vue'
import VueRouter from 'vue-router'

const pathView = (path) => {
  return () => import(`@/views/${path}.vue`);
};

const adminPages = (pages) => {
  const user = localStorage.getItem('user')
  const status = user ? JSON.parse(localStorage.getItem('user'))['status'] : 'guest'
  return pages.filter(link => link.rules.includes(status))
}

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    component: pathView('Home'),
    children: adminPages([
      {
        path: '/',
        name: 'User',
        component: pathView('user/User'),
        rules: ['admin']
      },
      {
        path: '/location',
        name: 'Location',
        component: pathView('location/Location'),
        rules: ['admin']
      },
      {
        path: '/cost-type',
        name: 'CostType',
        component: pathView('costType/CostType'),
        rules: ['admin']
      },
      {
        path: '/cost',
        name: 'Cost',
        component: pathView('cost/Cost'),
        rules: ['admin', 'agent']
      },
      {
        path:'/cashbox',
        name: 'Cashbox',
        component: pathView('cashbox/Cashbox'),
        rules: ['admin']
      },
      {
        path: '/cash-operation',
        name: 'CashOperation',
        component: pathView('cashOperation/CashOperation'),
        rules: ['admin', 'agent']
      }
      ,
      {
        path: '/report',
        name: 'Report',
        component: pathView('report/Report'),
        rules: ['admin']
      }
    ])
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
  const session = localStorage.getItem("access_token_gm");
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
