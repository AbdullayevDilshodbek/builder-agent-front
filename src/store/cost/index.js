import axios from "@/utils/axios";

const state = () => ({
    costs: []
})

const getters = {
    getCosts: state => state.costs
}

const actions = {
    async fetchCosts({ commit }, { search, page, dates }) {
        try {
            const res = await axios.get('costs', {
                params: {
                    search, page, dates
                }
            })
            commit('SET_COST_DATA', { data: res.data })
            return Promise.resolve(res)
        } catch (error) {
            return Promise.reject(error)
        }
    },
    async createCost({}, payload){
        try {
            const res = await axios.post('costs', payload)
            return Promise.resolve(res)
        } catch (error) {
            return Promise.reject(error)
        }
    },
    async payTheCost({}, {id, amount, is_cashflow}){
        try {
            const res = await axios.put(`cost/pay_the_cost/${id}`, {amount, is_cashflow})
            return Promise.resolve(res)
        } catch (error) {
            return Promise.reject(error)
        }
    },
    async loadExcel({}, {search, dates}){
        try {
            const res = await axios.get('cost/load_table_excel', {
                params: {
                    search, dates
                }
            })
            return Promise.resolve(res)
        } catch (error) {
            return Promise.reject(error)
        }
    }
}

const mutations = {
    SET_COST_DATA: (state, { data }) => {
        state.costs = data.data
    }
}

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}