import axios from "@/utils/axios";

const state = () => ({
    users: [],
    activeUsers: [],
    notCashierUsers: []
})

const getters = {
    getUsers: state => state.users,
    getActiveUsers: state => state.activeUsers,
    getNotCashierUsers: state => state.notCashierUsers
}

const actions = {
    async fetchUser({ commit }, { search, page }) {
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
    async getAuth({ }, payload) {
        try {
            const res = await axios.get('user/auth')
            return Promise.resolve(res)
        } catch (error) {
            return Promise.reject(error)
        }
    },
    async fetchActiveUsers({commit}, payload) {
        try {
            const res = await axios.get('user/active_users')
            commit('SET_ACTIVE_USERS_DATA', {data: res.data})
            return Promise.resolve(res);
        } catch (error) {
            return Promise.reject(error)
        }
    },
    async fetchNotCashierUsers({commit}, payload) {
        try {
            const res = await axios.get('user/not_cashiers')
            commit('SET_NOT_CASHIER_USERS_DATA', {data: res.data})
            return Promise.resolve(res);
        } catch (error) {
            return Promise.reject(error)
        }
    }
}

const mutations = {
    SET_USERS_DATA: (state, { data }) => {
        state.users = data.data
    },
    SET_ACTIVE_USERS_DATA: (state, {data}) => {
        state.activeUsers = data.data
    },
    SET_NOT_CASHIER_USERS_DATA: (state, {data}) => {
        state.notCashierUsers = data.data
    }
}

export default {
    namespaced: true,
    getters,
    state,
    actions,
    mutations
}