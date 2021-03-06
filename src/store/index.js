import Vue from "vue";
import Vuex from "vuex";

import authActions from "./actions/authActions";
import postActions from "./actions/postActions";
import settingsActions from "./actions/settingsActions";

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    userProfile: {},
    posts: [],
  },
  mutations: {
    setUserProfile(state, val) {
      state.userProfile = val;
    },
    setPosts(state, val) {
      state.posts = val;
    },
  },
  actions: { ...authActions, ...postActions, ...settingsActions },
  modules: {},
});

export default store;
