<template>
    <div>
        <!-- app bar -->
        <div>
            <v-row class="ml-1 mt-1">
                <v-col cols="2">
                    <v-menu v-model="menu" :close-on-content-click="false" :nudge-right="40" transition="scale-transition"
                        offset-y>
                        <template v-slot:activator="{ on }">
                            <v-text-field v-model="selectedRange" :append-icon="menu ? 'mdi-calendar' : ''" outlined dense
                                placeholder="Vaqt oralig'ini tanlang..." :clearable="!menu" readonly
                                v-on="on"></v-text-field>
                        </template>
                        <v-date-picker v-model="selectedRange" range
                            @input="selectedRange.length == 2 ? selectCalendar() : null"></v-date-picker>
                    </v-menu>
                </v-col>
            </v-row>
        </div>
        <!-- Excel dialog -->
        <v-col cols="auto" v-if="excelDialog">
            <v-dialog transition="dialog-top-transition" max-width="600" v-model="excelDialog">
                <v-card>
                    <v-toolbar style="text-align: center;" color="primary" dark class="text-h5 mb-4 pa-1">Ma'lumot yuklashga
                        tayyor</v-toolbar>
                    <v-divider></v-divider>
                    <v-card-actions class="justify-end">
                        <v-btn text color="primary" @click="downloadExcelFile()">Yuklash</v-btn>
                        <v-btn text color="orange" @click="excelDialog = false">Berkitish</v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>
        </v-col>
        <!-- card -->
        <div style="display: flex; flex-wrap: wrap;">
            <v-card v-for="(report, index) of reports" :key="index" elevation="5" class="pa-1"
                style="width: 20%; height: 120px; margin: 10px; box-sizing: border-box;" outlined>
                <v-card-title style="background-color: #499C54; color: #fff"><v-icon
                        color="white">mdi-microsoft-excel</v-icon>
                    <h4>Xisobot</h4>
                </v-card-title>
                <v-divider></v-divider>
                <v-card-actions>
                    <h2 style="color: #499C54;">{{ report.title }}</h2>
                    <v-spacer></v-spacer>
                    <v-btn color="success" icon @click="loadExcel(report.url)">
                        <v-icon>mdi-download-circle-outline</v-icon>
                    </v-btn>
                </v-card-actions>
            </v-card>
        </div>
        <v-pagination :length="last_page" v-model="page" total-visible="8"></v-pagination>
    </div>
</template>
<script>
import { mapGetters } from 'vuex'
export default {
    name: 'Report',
    watch: {
        page() {
            this.fetchReports()
        }
    },
    data() {
        return {
            page: 1,
            last_page: 1,
            selectedRange: null,
            menu: false,
            report: {},
            dialog: false,
            excelUrl: '',
            excelDialog: false,
            auth: JSON.parse(localStorage.getItem('user'))
        }
    },
    computed: {
        ...mapGetters({
            reports: 'report/getReports'
        })
    },
    async created() {
        await this.fetchReports()
    },
    methods: {
        async fetchReports() {
            try {
                const { data } = await this.$store.dispatch('report/fetchReports', {
                    page: this.page
                })
                this.last_page = data.meta.last_page
            } catch (error) {
                this.$toast.error(error.response.data.message)
            }
        },
        openDialog(report) {
            if (report) {
                this.report = { ...report }
                this.action = 'update'
            } else {
                this.report = {}
                this.action = 'create'
            }
            this.dialog = true
        },
        async selectCalendar() {
            if (this.selectedRange.length == 2) {
                let firstDay = this.selectedRange[0];
                let presentDay = this.selectedRange[1];
                if (firstDay > presentDay) {
                    this.selectedRange[0] = presentDay;
                    this.selectedRange[1] = firstDay;
                }
                this.menu = false
            }
        },
        async loadExcel(api) {
            try {
                const res = await this.$store.dispatch('report/loadExcel', {
                    api,
                    dates: this.selectedRange
                })
                this.excelUrl = res.data.url_
                this.excelDialog = true
            } catch (error) {
                this.$toast.error(error.response.data.message)
            }
        },
        async downloadExcelFile() {
            try {
                const fileUrl = process.env.VUE_APP_NATIVE_URL + this.excelUrl;
                window.location.href = fileUrl
                this.excelDialog = false;
            } catch (error) {
                this.$toast.error(error.response.data.message)
            }
        }
    }
}
</script>