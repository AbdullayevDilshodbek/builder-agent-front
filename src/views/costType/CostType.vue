<template>
    <div>
        <!-- dialog -->
        <v-col cols="auto">
            <v-dialog transition="dialog-top-transition" max-width="600" v-model="dialog">
                <v-card>
                    <v-toolbar color="primary" dark class="text-h4 mb-4">{{ action == 'update' ? 'Yangilash' : "Qo'shish"
                    }}</v-toolbar>
                    <v-card-text>
                        <v-text-field outlined label="Kod" v-model="costType.code"></v-text-field>
                        <v-text-field outlined label="Nomi" v-model="costType.title"></v-text-field>
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
                    <v-text-field rounded outlined dense label="Qidirish" @keyup.enter="fetchCostTypes()" v-model="search">
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
        <!-- card -->
        <div style="display: flex; flex-wrap: wrap;">
            <v-card v-for="(cost, index) of costTypes" :key="index" elevation="5" class="pa-1"
                style="width: 31%; height: 120px; margin: 10px; box-sizing: border-box;" outlined>
                <h2 class="ml-2" style="color: rgb(229, 156, 0);">{{ cost.code }}</h2>
                <v-divider></v-divider>
                <v-card-actions>
                    <h2 style="color: rgb(99, 98, 98);">{{ cost.title }}</h2>
                    <v-spacer></v-spacer>
                    <v-btn color="success" icon @click="openDialog(cost)">
                        <v-icon>mdi-border-color</v-icon>
                    </v-btn>
                    <v-btn :color="cost.active ? 'success' : 'red'" icon @click="changeActive(cost.id)">
                        <v-icon v-text="cost.active == true ? 'mdi-toggle-switch' : 'mdi-toggle-switch-off'"></v-icon>
                    </v-btn>
                </v-card-actions>
            </v-card>
        </div>
        <v-pagination :length="last_page" v-model="page"></v-pagination>
    </div>
</template>
<script>
import { mapGetters } from 'vuex'
export default {
    name: 'CostType',
    watch: {
        page() {
            this.fetchCostTypes()
        }
    },
    data() {
        return {
            search: '',
            page: 1,
            last_page: 1,
            costType: {},
            action: 'update',
            dialog: false,
            auth: JSON.parse(localStorage.getItem('user'))
        }
    },
    computed: {
        ...mapGetters({
            costTypes: 'costType/getCostTypes'
        })
    },
    async created() {
        await this.fetchCostTypes()
    },
    methods: {
        async fetchCostTypes() {
            try {
                const { data } = await this.$store.dispatch('costType/fetchCostTypes', {
                    search: this.search,
                    page: this.page
                })
                this.last_page = data.meta.last_page
            } catch (error) {
                this.$toast.error(error.response.data.message)
            }
        },
        async changeActive(id) {
            try {
                await this.$store.dispatch('costType/changeActive', id)
                await this.fetchCostTypes()
                this.$toast.success('Amalyot bajarildi')
            } catch (error) {
                this.$toast.error(Object.values(error.response.data.message)[0][0])
            }
        },
        openDialog(costType) {
            if (costType) {
                this.costType = { ...costType }
                this.action = 'update'
            } else {
                this.costType = {}
                this.action = 'create'
            }
            this.dialog = true
        },
        save() {
            if (this.action == 'update') {
                this.updateCostType()
            } else {
                this.createCostType()
            }
        },
        async createCostType() {
            try {
                const res = await this.$store.dispatch('costType/createCostType', this.costType)
                await this.fetchCostTypes()
                console.log(res);
                this.$toast.success(res.data.message)
                this.dialog = false
                this.costType = {}
            } catch (error) {
                this.$toast.error(Object.values(error.response.data.message)[0][0])
            }
        },
        async updateCostType() {
            try {
                const res = await this.$store.dispatch('costType/updateCostType', this.costType)
                await this.fetchCostTypes()
                this.$toast.success(res.data.message)
                this.dialog = false
                this.costType = {}
            } catch (error) {
                this.$toast.error(Object.values(error.response.data.message)[0][0])
            }
        }
    }
}
</script>