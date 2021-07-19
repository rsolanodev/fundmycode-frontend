import Vue from 'vue'

import Buefy from 'buefy'
Vue.use(Buefy);

import moment from "moment";
Vue.prototype.moment = moment;

import vSelect from 'vue-select'
Vue.component('v-select', vSelect);

import InfiniteLoading from 'vue-infinite-loading';
Vue.use(InfiniteLoading, { /* options */ });
