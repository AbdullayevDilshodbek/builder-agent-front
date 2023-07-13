<template>
    <div>
        <!-- dialog -->
        <v-col cols="auto">
            <v-dialog transition="dialog-top-transition" max-width="600" v-model="dialog">
                <v-card>
                    <v-card-title class="text-h4" style="background-color: #499C54; color: #fff;">{{ action == 'update' ?
                        'Yangilash' : "Qo'shish"
                    }}</v-card-title>
                    <v-divider></v-divider>
                    <v-card-text class="mt-2">
                        <v-autocomplete v-model="user.id" :items="users" dense item-value="id" item-text="full_name"
                            :clearable="true" outlined label="Kassir"></v-autocomplete>
                        <v-text-field dense label="Boshlang'ich summa" outlined v-model="start_value" @keypress="filter()"
                            min="0" />
                        <v-card-actions>
                            <v-spacer /><span style="color: black;" class="my-n2">{{ formatMoney.format(start_value || 0)
                            }}</span>
                        </v-card-actions>
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
                    <v-text-field rounded outlined dense label="Qidirish" @keyup.enter="fetchCashboxes()" v-model="search">
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
        <v-data-table hide-default-footer :headers="headers" :items="cashboxes" class="elevation-1" item-key="id"
            loading="true" disable-sort>
            <template v-slot:item.balance="{ item }">
                <span>{{ formatMoney.format(item.balance) }}</span>
            </template>
            <template v-slot:item.freezed_value="{ item }">
                <span>{{ formatMoney.format(item.freezed_value) }}</span>
            </template>
            <template v-slot:item.actions="{ item }">
                <!-- <v-btn v-if="auth.status == 'admin'" @click="openDialog(item)" color="success" dense icon rounded>
                    <v-icon>mdi-border-color</v-icon>
                </v-btn> -->
                <v-btn v-if="auth.status == 'admin'" :color="item.active ? 'success' : 'red'" icon
                    @click="changeActive(item.id)">
                    <v-icon v-text="item.active == true ? 'mdi-toggle-switch' : 'mdi-toggle-switch-off'"></v-icon>
                </v-btn>
            </template>
        </v-data-table>
        <v-pagination :length="last_page" v-model="page"></v-pagination>
    </div>
</template>
<script>
import { mapGetters } from 'vuex';
export default {
    name: 'Cashbox',
    watch: {
        page() {
            this.fetchCashboxes()
        }
    },
    data() {
        return {
            search: '',
            page: 1,
            last_page: 1,
            auth: JSON.parse(localStorage.getItem('user')),
            formatMoney: new Intl.NumberFormat('uz-UZ', {
                style: 'currency',
                currency: 'UZS',
            }),
            dialog: false,
            action: 'update',
            cashbox: {},
            start_value: null,
            user: {},
            headers: [
                { text: '#', value: 'id' },
                { text: 'Kassir', value: 'user.full_name' },
                { text: 'Balans', value: 'balance' },
                { text: 'Muzlatilgan', value: 'freezed_value' },
                { text: 'Amallar', value: 'actions' },
            ]
        }
    },
    computed: {
        ...mapGetters({
            cashboxes: 'cashbox/getCashboxes',
            users: 'user/getNotCashierUsers'
        })
    },
    async created() {
        await this.fetchCashboxes()
    },
    methods: {
        async fetchCashboxes() {
            const { data } = await this.$store.dispatch('cashbox/fetchCashboxes', {
                search: this.search,
                page: this.page
            })
            this.last_page = data.meta.last_page
        },
        async openDialog(cashbox) {
            await this.$store.dispatch('user/fetchNotCashierUsers')
            if (cashbox) {
                this.action = 'update'
            } else {
                this.action = 'create'
            }
            this.dialog = true
        },
        async changeActive(id) {
            try {
                const res = await this.$store.dispatch('cashbox/changeActive', id)
                this.fetchCashboxes()
                this.$toast.success(res.data.message)
            } catch (error) {
                this.$toast.error(error.response.data.message)
            }
        },
        async createCashbox() {
            try {
                const payload = {
                    user_id: this.user.id,
                    start_value: Math.abs(this.start_value)
                }
                const res = await this.$store.dispatch('cashbox/createCashbox', payload)
                this.dialog = false
                this.fetchCashboxes()
                this.$toast.success(res.data.message)
            } catch (error) {
                this.$toast.error(error.response.data.message)
            }
        },
        async save() {
            if (this.action == 'create') {
                await this.createCashbox()
            }
        },
        filter() {
            const evt = window.event;
            let expect = evt.target.value.toString() + evt.key.toString();

            if (!/^[-+]?[0-9]*\.?[0-9]*$/.test(expect)) {
                evt.preventDefault();
            } else {
                return true;
            }
        }
    }
}
</script>