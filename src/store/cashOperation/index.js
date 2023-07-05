import axios from "@/utils/axios";

const state = () => ({
    operations: []
})

const getters = {
    getOperations: state => state.operations
}

const actions = {
    async fetchOperations({ commit }, { dates, page, search, type, source }) {
        try {
            const res = await axios.get('cash_operations', {
                params: {
                    dates,
                    search,
                    page,
                    type,
                    source
                }
            })
            commit('SET_OPERATION_DATA', { data: res.data })
            return Promise.resolve(res)
        } catch (error) {
            return Promise.reject(error)
        }
    },
    async createOperation({}, payload){
        try {
            const res = await axios.post('cash_operations', payload)
            return Promise.resolve(res)
        } catch (error) {
            return Promise.reject(error)
        }
    },
    async receivedMoney({}, id){
        try {
            const res = await axios.put(`cash_operation/income_other_cash/${id}`)
            return Promise.resolve(res)
        } catch (error) {
            return Promise.reject(error) 
        }
    },
    async cancelMoney({}, id){
        try {
            const res = await axios.put(`cash_operation/cancel_income_other_cash/${id}`)
            return Promise.resolve(res)
        } catch (error) {
            return Promise.reject(error) 
        }
    },
    async myCashbox({}, payload){
        try {
            const res = await axios.get('cashbox/auth')
            return Promise.resolve(res)
        } catch (error) {
            return Promise.reject(error) 
        }
    },
}

const mutations = {
    SET_OPERATION_DATA: (state, { data }) => {
        state.operations = data.data
    }
}

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}