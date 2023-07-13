import axios from "@/utils/axios";

const state = () => ({
    reports: []
})

const getters = {
    getReports: state => state.reports
}

const actions = {
    async fetchReports({commit}, {page}){
        try {
            const res = await axios.get('report/index', {
                params: {
                    page
                }
            })
            commit('SET_REPORT_DATA', { data: res.data })
            return Promise.resolve(res)
        } catch (error) {
            return Promise.reject(error)
        }
    },
    async loadExcel({}, {dates, api}){
        try {
            const res = await axios.get(api, {
                params: {
                    dates
                }
            })
            return Promise.resolve(res)
        } catch (error) {
            return Promise.reject(error)
        }
    }
}

const mutations = {
    SET_REPORT_DATA: (state, {data}) => {
        state.reports = data.data
    }
}

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}