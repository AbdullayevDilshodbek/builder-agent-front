<template>
    <div>
        <!-- tab -->
        <v-tabs>
            <v-tab @click="moveTab(1)">Mening kassa</v-tab>
            <!-- <v-tab @click="moveTab(2)">Kassa xarakatlari</v-tab> -->
        </v-tabs>
        <!-- received dialog -->
        <v-col cols="auto" v-if="receivedDialog">
            <v-dialog transition="dialog-top-transition" max-width="600" v-model="receivedDialog">
                <v-card>
                    <v-toolbar style="text-align: center;" :color="isReceived ? 'primary' : 'error'" dark
                        class="text-h5 mb-4 pa-1">{{ isReceived == true ? 'Yuborilgan pulni oldingizmi ?' : "Yuborilgan\
                                                pulni bekoq qilmoqchimisiz ? "
                        }}</v-toolbar>
                    <v-divider></v-divider>
                    <v-card-actions class="justify-end">
                        <v-btn text :color="isReceived ? 'primary' : 'error'" @click="waitingAction()">Xa</v-btn>
                        <v-btn text color="orange" @click="receivedDialog = false">Berkitish</v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>
        </v-col>
        <!-- add dialog -->
        <v-col cols="auto" v-if="dialog">
            <v-dialog transition="dialog-top-transition" max-width="600" v-model="dialog">
                <v-card>
                    <v-toolbar color="primary" dark class="text-h4 mb-4">{{ action == 'update' ? 'Yangilash' : "Qo'shish"
                    }}</v-toolbar>
                    <v-card-text>
                        <v-combobox :items="types" @change="selectActionType()" label="Amalyot turi" hide-selected outlined
                            small-chips v-model="operation.type" append-icon='mdi-close'
                            @click:append="clearActionType()" />
                        <v-combobox :items="sources" label="Obekt turi" clearable ref="obj_type" hide-selected outlined
                            small-chips v-model="operation.source" />
                        <v-autocomplete v-model="operation.source_id" :items="otherCashboxes" item-value="id"
                            item-text="full_name" :clearable="true" outlined label="Kassir"
                            v-if="operation.source == 'Boshqa kassir'" />
                        <v-text-field outlined required label="Qiymat" v-model="operation.amount" @keypress="filter()" />
                        <v-text-field outlined required label="Izoh" v-model="operation.description" />
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
            <v-row class="ml-1 mt-1">
                <v-col cols="2" class="mt-1">
                    <v-text-field outlined dense label="Qidirish..." @keyup.enter="fetchOperations()" v-model="search">
                    </v-text-field>
                </v-col>
                <!-- <v-col cols="2" class="mt-1">
                    <v-combobox :items="types" @change="fetchOperations()" label="Tur filteri" hide-selected outlined
                            small-chips v-model="type" append-icon='mdi-close' dense
                            @click:append="clearTypeSearch()" />
                </v-col> -->
                <v-col cols="2" class="mt-1">
                    <v-combobox :items="filterBySources" @change="fetchOperations()" item-text="text"
                        label="Amalyot turi filteri" hide-selected outlined small-chips v-model="filterBySource"
                        append-icon='mdi-close' dense @click:append="clearSourceSearch()" />
                </v-col>
                <v-col cols="3" style="height: 50%; display: flex;">
                    <span style="display: flex; flex-direction: column;">
                        <span style="color: green;">Umumiy balans</span>
                        <span style="color: green; font-weight: bold; text-align: center;">{{
                            formatMoney.format(my_cashbox.balance) }}</span>
                    </span>
                    <v-spacer></v-spacer>
                    <span style="display: flex; flex-direction: column;">
                        <span style="color: rgb(72, 194, 255);">Yuborilmoqda</span>
                        <span style="color: rgb(72, 194, 255); font-weight: bold; text-align: center;">{{
                            formatMoney.format(my_cashbox.freezed_value) }}</span>
                    </span>
                </v-col>
                <v-spacer></v-spacer>
                <v-col cols="2" class="mt-1">
                    <v-btn color="success" @click="openDialog()">
                        <v-icon>
                            mdi-plus-circle
                        </v-icon>
                        Qo`shish
                    </v-btn>
                </v-col>
            </v-row>
        </div>
        <!-- table -->
        <div v-if="activeTabId == 1">
            <v-data-table hide-default-footer :headers="headers" :items="operations" class="elevation-1" item-key="id"
                loading="true" disable-sort>
                <template v-slot:item.amount="{ item }">
                    <span>{{ formatMoney.format(item.amount) }}</span>
                </template>
                <template v-slot:item.actions="{ item }">
                    <v-tooltip top>
                        <template #activator="{ on, attrs }">
                            <v-btn v-on="on" v-bind="attrs" v-if="item.open_received_btn"
                                @click="openReceivedDialog('received', item.id)" color="success" dense icon rounded>
                                <v-icon>mdi-receipt-text-clock-outline</v-icon>
                            </v-btn>
                        </template>
                        <span>O'tkazmani qabul qilish</span>
                    </v-tooltip>
                    <v-tooltip top>
                        <template #activator="{ on, attrs }">
                            <v-btn v-on="on" v-bind="attrs" v-if="item.cancel_btn"
                                @click="openReceivedDialog('cancel', item.id)" color="error" dense icon rounded>
                                <v-icon>mdi-timer-cancel-outline</v-icon>
                            </v-btn>
                        </template>
                        <span>O'tkazmani bekor qilish</span>
                    </v-tooltip>

                    <!-- <v-btn v-if="auth.status == 'admin'" @click="openDialog(item)" color="success" dense icon rounded>
                        <v-icon>mdi-border-color</v-icon>
                    </v-btn> -->
                </template>
            </v-data-table>
            <v-pagination :length="last_page" v-model="page"></v-pagination>
        </div>
    </div>
</template>
<script>
import { mapGetters } from 'vuex';
export default {
    name: 'CashboxOperation',
    watch: {
        page() {
            this.fetchOperations()
        }
    },
    data() {
        return {
            tab: null,
            dates: [],
            page: 1,
            last_page: 1,
            auth: JSON.parse(localStorage.getItem('user')),
            activeTabId: 1,
            cashbox: {},
            search: '',
            my_cashbox: {},
            operation: {},
            dialog: false,
            action: 'update',
            formatMoney: new Intl.NumberFormat('uz-UZ', {
                style: 'currency',
                currency: 'UZS',
            }),
            types: ['Kirim', 'Chiqim'],
            type: null,
            sources: ['Bir tomonlama kirim', 'Boshqa kassir'],
            filterBySources: [
                {
                    key: 'other_cashbox',
                    text: 'Boshqa kassir'
                },
                {
                    key: 'anonym',
                    text: 'Bir tomonlama kirim'
                },
                {
                    key: 'cost',
                    text: 'Xarajat'
                }
            ],
            filterBySource: null,
            isReceived: true,
            receivedDialog: false,
            formatMoney: new Intl.NumberFormat('uz-UZ', {
                style: 'currency',
                currency: 'UZS',
            }),
            headers: [
                { text: '#', value: 'id' },
                { text: 'Kassir', value: 'cashier.full_name' },
                { text: 'Tur', value: 'type' },
                { text: 'Amalyot', value: 'source' },
                { text: 'Partner', value: 'source_object.full_name' },
                { text: 'Qiymat', value: 'amount' },
                { text: 'To\'lov turi', value: 'cashflow' },
                { text: 'Status', value: 'status' },
                { text: 'Izoh', value: 'description' },
                { text: 'Sana', value: 'date' },
                { text: 'Amallar', value: 'actions' },
            ]
        }
    },
    watch: {
        page() {
            this.fetchOperations()
        }
    },
    computed: {
        ...mapGetters({
            operations: 'cashOperation/getOperations',
            otherCashboxes: 'cashbox/getOtherCashboxes'
        })
    },
    async created() {
        await this.fetchOperations()
        await this.fetchOtherCashboxes()
        await this.myCashbox()
        this.filterSources()
    },
    methods: {
        async fetchOperations() {
            try {
                const { data } = await this.$store.dispatch('cashOperation/fetchOperations', {
                    dates: this.dates,
                    page: this.page,
                    search: this.search,
                    type: this.type ?? null,
                    source: this.filterBySource ? this.filterBySource.key : null
                })
                this.last_page = data.meta.last_page
            } catch (error) {
            }
        },
        async clearTypeSearch() {
            this.type = null;
            await this.fetchOperations()
        },
        async clearSourceSearch() {
            this.filterBySource = null
            await this.fetchOperations()
        },
        async myCashbox() {
            try {
                const res = await this.$store.dispatch('cashOperation/myCashbox')
                this.my_cashbox = res.data.data;
            } catch (error) {
                this.$toast.error(error.response.data.message)
            }
        },
        async createOperation() {
            this.operation.source = this.operation.source == 'Boshqa kassir' ? 'other_cashbox' : 'anonym';
            this.operation.type = this.operation.type == 'Kirim' ? 'income' : 'output';
            try {
                const res = await this.$store.dispatch('cashOperation/createOperation', this.operation)
                this.dialog = false
                await this.fetchOperations()
                await this.myCashbox()
                this.$toast.success(res.data.message)
            } catch (error) {
                this.$toast.error(error.response.data.message)
            }
        },
        async fetchOtherCashboxes() {
            try {
                const res = await this.$store.dispatch('cashbox/fetchOtherCashboxes')
                await this.fetchOperations()
            } catch (error) {
                this.$toast.error(error.response.data.message)
            }
        },
        async save() {
            await this.createOperation()
        },
        async waitingAction() {
            const id = this.operation.id;
            if (this.isReceived) {
                this.receivedMoney(id)
            } else {
                this.cancelMoney(id)
            }
        },
        async receivedMoney(id) {
            try {
                const res = await this.$store.dispatch('cashOperation/receivedMoney', id)
                await this.fetchOperations()
                this.receivedDialog = false
                this.myCashbox()
                this.$toast.success(res.data.message)
            } catch (error) {
                this.$toast.error(error.response.data.message)
            }
        },
        async cancelMoney(id) {
            try {
                const res = await this.$store.dispatch('cashOperation/cancelMoney', id)
                await this.fetchOperations()
                this.receivedDialog = false
                this.$toast.success(res.data.message)
            } catch (error) {
                this.$toast.error(error.response.data.message)
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
        },
        selectActionType() {
            if (this.operation.type == 'Chiqim') {
                this.sources = this.sources.filter(item => item == 'Boshqa kassir')
            } else {
                this.sources = this.sources.filter(item => item == 'Bir tomonlama kirim' && auth.status == 'admin')
            }
            this.$refs.obj_type.reset()
        },
        clearActionType() {
            this.filterSources()
            this.operation = {}
        },
        openDialog(operation) {
            if (!operation) {
                this.dialog = true
                this.operation = {}
            }
        },
        openReceivedDialog(action, id) {
            this.operation.id = id
            this.receivedDialog = true
            if (action == 'received') {
                this.isReceived = true
            } else {
                this.isReceived = false
            }
        },
        filterSources() {
            if (this.auth.status == 'admin') {
                this.sources = ['Bir tomonlama kirim', 'Boshqa kassir']
            } else {
                this.sources = ['Boshqa kassir']
            }
        },
        moveTab(id) {
            this.activeTabId = id
        }
    }
}
</script>