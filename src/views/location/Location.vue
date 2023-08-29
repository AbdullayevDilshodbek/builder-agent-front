<template>
    <div>
        <!-- dialog -->
        <v-col cols="auto">
            <v-dialog transition="dialog-top-transition" max-width="600" v-model="dialog">
                <v-card>
                    <v-toolbar color="primary" dark class="text-h4 mb-4">{{ action == 'update' ? 'Yangilash' : "Qo'shish"
                    }}</v-toolbar>
                    <v-card-text>
                        <v-text-field outlined required label="Xudud" v-model="location.title"></v-text-field>
                        <v-autocomplete v-model="user.id" :items="users" dense item-value="id" item-text="full_name"
                            :clearable="true" outlined label="Masul shaxs"></v-autocomplete>
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
                    <v-text-field rounded outlined dense label="Qidirish" @keyup.enter="fetchLocation()" v-model="search" />
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
        <v-data-table :headers="headers" hide-default-footer :items="locations" disable-sort class="elevation-1"
            item-key="id" loading="true">
            <template v-slot:item.actions="{ item }">
                <v-btn v-if="auth.status == 'admin'" @click="openDialog(item)" color="success" dense icon rounded>
                    <v-icon>mdi-border-color</v-icon>
                </v-btn>
                <v-btn v-if="auth.status == 'admin'" :color="item.active ? 'success' : 'red'" icon
                    @click="changeActive(item.id)">
                    <v-icon v-text="item.active == true ? 'mdi-toggle-switch' : 'mdi-toggle-switch-off'"></v-icon>
                </v-btn>
            </template>
        </v-data-table>
        <v-pagination :length="last_page" v-model="page" total-visible="8"></v-pagination>
    </div>
</template>
<script>
import { mapGetters } from 'vuex'
export default {
    name: 'Location',
    watch: {
        page() {
            this.fetchLocation()
        }
    },
    data() {
        return {
            search: '',
            page: 1,
            last_page: 1,
            auth: JSON.parse(localStorage.getItem('user')),
            dialog: false,
            action: 'update',
            location: {},
            users: [],
            user: {},
            headers: [
                { text: '#', value: 'id' },
                { text: 'Xudud', value: 'title' },
                { text: 'Masul shaxs', value: 'attached_user.full_name' },
                { text: 'Amallar', value: 'actions' },
            ]
        }
    },
    computed: {
        ...mapGetters({
            locations: 'location/getLocations'
        })
    },
    async created() {
        await this.fetchLocation()
    },
    methods: {
        async fetchLocation() {
            try {
                const { data } = await this.$store.dispatch('location/fetchLocations', {
                    search: this.search,
                    page: this.page
                })
                this.last_page = data.meta.last_page
            } catch (error) {
                // this.$toast.error(error.response.data.message)
            }
        },
        async changeActive(id) {
            try {
                const res = await this.$store.dispatch('location/changeActive', id)
                this.$toast.success(res.data.message)
                this.fetchLocation()
            } catch (error) {
                this.$toast.error(error.response.data.message)
            }
        },
        async openDialog(location) {
            const res = await this.$store.dispatch('user/fetchActiveUsers')
            this.users = res.data.data
            if (location) {
                this.location = { ...location }
                this.action = 'update'
            } else {
                this.location = {}
                this.action = 'create'
            }
            this.dialog = true
        },
        save() {
            if (this.action == 'create') {
                this.createLocation()
            } else {
                this.updateLocation()
            }
        },
        async createLocation() {
            try {
                const payload = {
                    title: this.location.title,
                    user_id: this.user.id
                }
                await this.$store.dispatch('location/createLocation', payload)
                await this.fetchLocation()
                this.$toast.success('Amalyot bajarildi')
                this.dialog = false;
            } catch (error) {
                this.$toast.error(error.response.data.message)
            }
        },
        async updateLocation() {
            try {
                const payload = {
                    id: this.location.id,
                    title: this.location.title,
                    user_id: this.user.id
                }
                await this.$store.dispatch('location/updateLocation', payload)
                await this.fetchLocation()
                this.$toast.success('Amalyot bajarildi')
                this.dialog = false;
            } catch (error) {
                this.$toast.error(error.response.data.message)
            }
        }
    }
}
</script>