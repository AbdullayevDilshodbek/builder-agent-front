import axios from "@/utils/axios"

const state = () => ({
    locations: []
})

const getters = {
    getLocations: state => state.locations
}

const actions = {
    async fetchLocations({ commit }, { search, page }) {
        try {
            const res = await axios.get('/locations', {
                params: { search, page }
            })
            commit('SET_LOCATION_DATA', { data: res.data })
            return Promise.resolve(res)
        } catch (error) {
            return Promise.reject(error)
        }
    },
    async changeActive({ }, location_id) {
        try {
            const res = await axios.put(`location/change_active/${location_id}`)
            return Promise.resolve(res.data)
        } catch (error) {
            return Promise.reject(error)
        }
    },
    async createLocation({}, payload){
        try {
            const res = await axios.post('locations', payload)
            return Promise.resolve(res)
        } catch (error) {
            return Promise.reject(error)
        }
    },
    async updateLocation({}, payload){
        try {
            const res = await axios.put(`locations/${payload.id}`, payload)
            return Promise.resolve(res)
        } catch (error) {
            return Promise.reject(error)
        }
    }
}

const mutations = {
    SET_LOCATION_DATA: (state, { data }) => {
        state.locations = data.data
    }
}

export default {
    namespaced: true,
    getters,
    state,
    actions,
    mutations
}