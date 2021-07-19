import Vue from 'vue'
import axios from "axios";
import store from "../store/index";
import VueAxios from 'vue-axios'

Vue.use(VueAxios, axios);

const baseDomain = "http://127.0.0.1:8000";
const baseURL = `${baseDomain}/api/v1`;

const baseAxios = axios.create({
    baseURL,
    headers: {
        common: {
            'Authorization': store.getters.myToken
        }
    }
});

export default baseAxios;
