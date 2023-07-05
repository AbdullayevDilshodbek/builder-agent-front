import axios from "axios";

const state = {}
const getters = {};
const mutations = {};

const actions = {
    getToken(context, payload) {
        return new Promise(((resolve, reject) => {
            axios.post(process.env.VUE_APP_AUTH_URL, payload).then(response => {
                const token = response.data
                localStorage.access_token_gm = token;
                return resolve(response);
            }).catch(error => {
                return reject(error)
            })
        }))
    }
}

export default {
    namespaced: true,
    state,
    getters,
    mutations,
    actions
}