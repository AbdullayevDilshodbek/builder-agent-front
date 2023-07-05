import axios from "@/utils/axios";

const state = () => ({
    cashboxes: [],
    otherCashboxes: []
})

const getters = {
    getCashboxes: state => state.cashboxes,
    getOtherCashboxes: state => state.otherCashboxes
}

const actions = {
    async fetchCashboxes({ commit }, { search, page }) {
        try {
            const res = await axios.get('cashboxes', {
                params: {
                    search, page
                }
            })
            commit('SET_CASHBOXES_DATA', { data: res.data })
            return Promise.resolve(res)
        } catch (error) {
            return Promise.reject(error)
        }
    },
    async changeActive({ }, id) {
        try {
            const res = await axios.put(`cashbox/change_active/${id}`)
            return Promise.resolve(res.data)
        } catch (error) {
            return Promise.reject(error)
        }
    },
    async createCashbox({ }, payload) {
        try {
            const res = await axios.post('cashboxes', payload)
            return Promise.resolve(res);
        } catch (error) {
            return Promise.reject(error)
        }
    },
    async fetchOtherCashboxes({ commit }, payload) {
        try {
            const res = await axios.get('cashbox/active_cashboxes')
            commit('SET_OTHER_CASHBOXES_DATA', { data: res.data })
            return Promise.resolve(res)
        } catch (error) {
            return Promise.reject(error)
        }
    }
}

const mutations = {
    SET_CASHBOXES_DATA: (state, { data }) => {
        state.cashboxes = data.data
    },
    SET_OTHER_CASHBOXES_DATA: (state, { data }) => {
        state.otherCashboxes = data.data
    }
}

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}