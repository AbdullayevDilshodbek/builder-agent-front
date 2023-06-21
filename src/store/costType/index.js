import axios from "@/utils/axios";

const state = () => ({
    costTypes: []
})

const getters = {
    getCostTypes: state => state.costTypes
}

const actions = {
    async fetchCostTypes({ commit }, { search, page }) {
        try {
            const res = await axios.get('/cost_types', {
                params: {
                    search,
                    page
                }
            })
            commit('SET_COST_TYPES', { data: res.data })
            return Promise.resolve(res)
        } catch (error) {
            return Promise.reject(error)
        }
    },
    async createCostType({ }, payload) {
        try {
            const res = await axios.post('cost_types', payload)
            return Promise.resolve(res)
        } catch (error) {
            return Promise.reject(error)
        }
    },
    async updateCostType({}, payload){
        try {
            const res = axios.put(`cost_types/${payload.id}`, payload)
            return Promise.resolve(res)
        } catch (error) {
            return Promise.reject(error)
        }
    },
    async changeActive({}, id){
        try {
            const res = await axios.put(`cost_type/change_active/${id}`)
            return Promise.resolve(res)
        } catch (error) {
            return Promise.reject(error)
        }
    }
}

const mutations = {
    SET_COST_TYPES: (state, { data }) => {
        state.costTypes = data.data
    }
}

export default {
    namespaced: true,
    getters,
    state,
    actions,
    mutations
}