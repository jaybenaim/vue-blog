import Vue from "vue";
import Vuex from "vuex";

import authActions from "./authActions";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    userProfile: {},
  },
  mutations: {
    setUserProfile(state, val) {
      state.userProfile = val;
    },
  },
  actions: authActions,
  modules: {},
});
