import Vue from 'vue'
import baseAxios from '../api/Repository'
import Vuex from 'vuex'
import {RepositoryFactory} from "../api/RepositoryFactory";

Vue.use(Vuex);

const store = new Vuex.Store({
    state: {
        status: '',
        token: localStorage.getItem('token') || '',
        user: {},
        following: [],
        supporting: [],
    },
    mutations: {
        auth_request(state) {
            state.status = 'loading';
        },
        auth_success(state, token) {
            state.status = 'success';
            state.token = token;
        },
        auth_error(state) {
            state.status = 'error';
        },
        logout(state) {
            state.status = '';
            state.token = '';
        },
        set_user(state, user) {
            state.user = user;
        },
        set_following(state, following) {
            state.following = following;
        },
        set_supporting(state, supporting) {
            state.supporting = supporting;
        },

    },
    actions: {
        login({commit}, user) {
            const AuthRepository = RepositoryFactory.get('auth');
            return new Promise((resolve, reject) => {
                commit('auth_request');
                AuthRepository.token(user).then((response) => {
                    const token = `JWT ${response.data.token}`;
                    localStorage.setItem('token', token);
                    commit('auth_success', token);
                    baseAxios.defaults.headers.common['Authorization'] = token;
                    resolve(response);
                }, (err) => {
                    commit('auth_error');
                    localStorage.removeItem('token');
                    reject(err);
                });
            })
        },
        logout({commit}) {
            return new Promise((resolve) => {
                commit('logout');
                localStorage.removeItem('token');
                delete baseAxios.defaults.headers.common['Authorization'];
                resolve();
            })
        },
        getUser({commit}) {
            const UserRepository = RepositoryFactory.get('users');
            const FollowingRepository = RepositoryFactory.get('following');
            const SubscriptionRepository = RepositoryFactory.get('subscriptions');

            return new Promise((resolve, reject) => {
                UserRepository.me().then(async (response) => {
                    commit('set_user', response.data);
                    await FollowingRepository.getAll(response.data.id).then((res) => {
                        commit('set_following', res.data);
                    });
                    await SubscriptionRepository.getSupporting(response.data.id).then((res) => {
                        commit('set_supporting', res.data);
                    });
                    resolve(response);
                }, (err) => {
                    commit('auth_error');
                    localStorage.removeItem('token');
                    reject(err);
                });
            })
        },

    },
    getters: {
        isLoggedIn: state => !!state.token,
        authStatus: state => state.status,
        myToken: state => state.token,
        myUser: state => state.user,
        isDeveloper: state => state.user.is_developer,
        myFollowing: state => state.following,
        mySupporting: state => state.supporting,
    }
});

export default store;
