<template>
  <v-app id="inspire">
    <v-navigation-drawer v-model="drawer" app>
      <v-sheet color="grey lighten-4" class="pa-4">
        <v-avatar class="mb-4" color="grey darken-1" size="64"></v-avatar>

        <div>john@vuetifyjs.com</div>
      </v-sheet>

      <v-divider></v-divider>

      <v-list>
        <v-list-item v-for="(link, index) of links" :key="index" link @click="goPage(link.path)">  

          <v-list-item-icon>
              <v-icon>{{ link.icon }}</v-icon>
            </v-list-item-icon>

            <v-list-item-content>
              <v-list-item-title>{{ link.title }}</v-list-item-title>
            </v-list-item-content>
        </v-list-item>
      </v-list>
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
    links: [
      {
        id: 1,
        icon: 'mdi-account-group',
        title: 'Foydalanuvchilar',
        path: '/',
        rule: 'admin',
      },
      {
        id: 2,
        icon: 'mdi-city',
        title: 'Manzillar',
        path: '/location',
        rule: 'admin'
      },
      {
        id: 3, 
        icon: 'mdi-subtitles-outline',
        title: 'Xarjat turlari',
        path: '/cost-type',
        rule: 'admin'
      },
      {
        id: 4, 
        icon: 'mdi-account-cash-outline',
        title: 'Kassalar',
        path: '/cashbox',
        rule: 'admin'
      }
    ],
  }),
  created(){
    const status = JSON.parse(localStorage.getItem('user'))['status']
      this.links = this.links.filter(link => link.rule == status)
  },
  methods: {
    goPage(path) {
      if (window.location.pathname != path) {
        this.$router.push(path)
      }
    }
  }
}
</script>