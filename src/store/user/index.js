import axios from "@/utils/axios";

const state = () => ({
    users: []
})

const getters = {
    getUsers: state => state.users,
}

const actions = {
    async fetchUser({ commit }, {search, page}) {
        try {
            const response = await axios.get('/users', {
                params: {
                    search,
                    page
                }
            });
            commit('SET_USERS_DATA', { data: response.data })
            return Promise.resolve(response)
        } catch (error) {
            return Promise.reject(error)
        }
    },
    async changeActive({ }, id) {
        try {
            const res = await axios.put(`user/change_active/${id}`)
            return Promise.resolve(res.data)
        } catch (error) {
            return Promise.reject(error)
        }
    },
    async updateUser({ }, payload) {
        try {
            const res = await axios.put(`users/${payload.id}`, payload)
            return Promise.resolve(res)
        } catch (error) {
            return Promise.reject(error)
        }
    },
    async createUser({ }, payload) {
        try {
            const res = await axios.post('users', payload)
            return Promise.resolve(res)
        } catch (error) {
            return Promise.reject(error)
        }
    },
    async getAuth({}, payload){
        try {
            const res = axios.get('user/auth')
            return Promise.resolve(res)
        } catch (error) {
            return Promise.reject(error)
        }
    }
}

const mutations = {
    SET_USERS_DATA: (state, { data }) => {
        state.users = data.data
    },
    SET_CURRENT_PAGE(state, data) {
        state.users.meta['current_page'] = data;
    },
}

export default {
    namespaced: true,
    getters,
    state,
    actions,
    mutations
}