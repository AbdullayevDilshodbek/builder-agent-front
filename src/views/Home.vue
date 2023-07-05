<template>
  <v-app id="inspire">
    <v-navigation-drawer v-model="drawer" app>
      <v-sheet color="grey lighten-4" class="pa-4" style="text-align: center;">
        <img src="../assets/co-logo.png" alt="Avatar" class="avatar">
        <br>
        <div><b>{{ user.full_name }}</b></div>
      </v-sheet>

      <v-divider></v-divider>

      <v-list>
        <v-list-item :style="activePage == link.path ? 'background-color: #d7d7d7' : ''" v-for="(link, index) of links" :key="index" link @click="goPage(link.path)">
          <v-list-item-icon>
            <v-icon>{{ link.icon }}</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>{{ link.title }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>

      <div slot="append" style="text-align: center; height: 40px;">
        <v-divider style="background-color: #363d5b;" />
        <v-btn @click="logout" class="text-none mt-1" rounded small plain icon><v-icon>mdi-logout</v-icon>Chiqish</v-btn>
      </div>

    </v-navigation-drawer>

    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script>
export default {
  name: 'Home',
  data: () => ({
    drawer: null,
    activePage: '/',
    links: [
      {
        id: 1,
        icon: 'mdi-account-group',
        title: 'Foydalanuvchilar',
        path: '/',
        rule: ['admin'],
      },
      {
        id: 2,
        icon: 'mdi-city',
        title: 'Manzillar',
        path: '/location',
        rule: ['admin'],
      },
      {
        id: 3,
        icon: 'mdi-subtitles-outline',
        title: 'Xarjat turlari',
        path: '/cost-type',
        rule: ['admin']
      },
      {
        id: 4,
        icon: 'mdi-alarm-panel-outline',
        title: 'Xarjatlar',
        path: '/cost',
        rule: ['admin', 'agent']
      },
      {
        id: 5,
        icon: 'mdi-cash-register',
        title: 'Kassalar',
        path: '/cashbox',
        rule: ['admin']
      },
      {
        id: 6,
        icon: 'mdi-network-pos',
        title: 'Kassa operatsiyalari',
        path: '/cash-operation',
        rule: ['admin', 'agent']
      }
    ],
    user: {}
  }),
  created() {
    this.user = JSON.parse(localStorage.getItem('user'))
    this.links = this.links.filter(link => link.rule.includes(this.user['status']))
  },
  methods: {
    goPage(path) {
      if (window.location.pathname != path) {
        this.$router.push(path)
        this.activePage = path
      }
    },
    logout() {
      localStorage.removeItem('access_token_gm')
      this.goPage('/login')
    }
  }
}
</script>

<style>
.avatar {
  vertical-align: middle;
  display: block;
  margin-left: auto;
  margin-right: auto;
  width: 50%;
}
</style>