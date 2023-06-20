<template>
    <div>
        <!-- dialog -->
        <v-col cols="auto">
            <v-dialog transition="dialog-top-transition" max-width="600" v-model="dialog">
                <v-card>
                    <v-toolbar color="primary" dark class="text-h4 mb-4">{{ action == 'update' ? 'Yangilash' : "Qo'shish"
                    }}</v-toolbar>
                    <v-card-text>
                        <v-text-field outlined required label="F.I.SH" v-model="user.full_name"></v-text-field>
                        <v-text-field outlined label="Telefon raqam" v-model="user.phone" v-mask="'+998-##-###-##-##'"
                            placeholder="+998-"></v-text-field>
                        <v-text-field outlined label="Login" v-model="user.username"></v-text-field>
                        <v-text-field outlined label="Parol" v-model="user.password" :type="password ? 'password' : 'text'"
                            :append-icon="password ? 'mdi-eye' : 'mdi-eye-off'" @click:append="password = !password" />
                    </v-card-text>
                    <v-divider></v-divider>
                    <v-card-actions class="justify-end">
                        <v-btn text color="primary" @click="save()">Saqlash</v-btn>
                        <v-btn text color="red" @click="dialog = false">Berkitish</v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>
        </v-col>
        <!-- app bar -->
        <div>
            <v-row>
                <v-col cols="2" class="ml-10">
                    <v-text-field rounded outlined dense label="Qidirish" @keyup.enter="fetchUser()" v-model="search">
                    </v-text-field>
                </v-col>
                <v-spacer></v-spacer>
                <v-col cols="2">
                    <v-btn v-if="auth.status == 'admin'" color="success" @click="openDialog()">
                        <v-icon>
                            mdi-plus-circle
                        </v-icon>
                        Qo`shish
                    </v-btn>
                </v-col>
            </v-row>
        </div>
        <!-- table -->
        <v-data-table hide-default-footer :headers="headers" :items="users" class="elevation-1" item-key="id" loading="true"
            disable-sort>
            <template v-slot:item.actions="{ item }">
                <v-btn v-if="auth.status == 'admin'" @click="openDialog(item)" color="success" dense icon rounded>
                    <v-icon>mdi-border-color</v-icon>
                </v-btn>
                <v-btn v-if="auth.status == 'admin'" :color="item.active ? 'success' : 'red'" icon @click="changeActive(item.id)">
                    <v-icon v-text="item.active == true ? 'mdi-toggle-switch' : 'mdi-toggle-switch-off'"></v-icon>
                </v-btn>
            </template>
        </v-data-table>
        <v-pagination :length="last_page" v-model="page"></v-pagination>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
    name: 'User',
    watch: {
        page() {
            this.fetchUser()
        }
    },
    data() {
        return {
            page: 1,
            last_page: 1,
            dialog: false,
            action: 'update',
            search: '',
            user: {
                id: '',
                full_name: '',
                username: '',
                password: '',
                phone: '',
                status: 'agent'
            },
            auth: JSON.parse(localStorage.getItem('user')),
            password: true,
            headers: [
                { text: "#", value: 'id' },
                { text: "Login", value: 'username' },
                { text: "F.I.O", value: 'full_name' },
                { text: "Telefon raqam", value: 'phone' },
                { text: 'Status', value: 'status' },
                { text: "Amalllar", value: 'actions' }
            ]
        }
    },
    computed: {
        ...mapGetters({
            users: 'user/getUsers'
        })
    },
    async created() {
        await this.fetchUser()
    },
    methods: {
        async fetchUser() {
            try {
                const { data } = await this.$store.dispatch('user/fetchUser', {
                    search: this.search,
                    page: this.page
                })
                this.last_page = data.meta.last_page
            } catch (error) {
                console.log(error);
            }
        },
        async changeActive(id) {
            try {
                const res = await this.$store.dispatch('user/changeActive', id)
                this.$toast.success(res.message)
                this.fetchUser()
            } catch (error) {

            }
        },
        openDialog(user = null) {
            if (user) {
                this.user = { ...user }
                this.action = 'update'
            } else {
                this.user = {}
                this.action = 'create'
            }
            this.dialog = true
        },
        save() {
            if (this.action == 'update') {
                this.updateUser()
            } else {
                this.createUser()
            }
            this.fetchUser()
        },
        async updateUser() {
            try {
                const res = await this.$store.dispatch(`user/updateUser`, this.user)
                this.$toast.success(res.message)
                this.dialog = false
                this.user = {}
            } catch (error) {
                this.$toast.error(error.response.data.message)
            }
        },
        async createUser() {
            try {
                this.user.status = 'agent'
                const res = await this.$store.dispatch('user/createUser', this.user)
                this.dialog = false
                this.user = {}
                this.$toast.success(res.message)
            } catch (error) {
                this.$toast.error(error.response.data.message)
            }
        }
    }
}
</script>