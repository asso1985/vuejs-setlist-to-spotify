import Vue from 'vue';
import * as types from '../mutations';
import axios from 'axios';
import moment from 'moment';

import VueLocalStorage from 'vue-localstorage';
Vue.use(VueLocalStorage);

const state = {
  all: []
};

// getters
const getters = {
  allArtists: state => state.all,
  selectedArtistImage: state => state.selectedArtistImage
};

const actions = {
  getArtists ({ commit }, query) {
    axios.get(Vue.config.BASE_API_URL + 'setlist/artist/' + query)
    .then(function (response) {
      commit(types.GET_ARTISTS_SUCCESS, {
        data: response.data.artist
      });
    })
  },
  getSpotifyArtist ({ commit }, artistId) {
    const token = Vue.localStorage.get('token');
    axios.defaults.headers.common['Authorization'] = token;
    axios.get(Vue.config.BASE_API_URL + 'spotify/artist/'+ artistId)
    .then(function (response) {
      commit(types.GET_SPOTIFY_ARTISTS_SUCCESS, {
        data: response.data
      });
    })
  }
}

// mutations
const mutations = {
  [types.GET_ARTISTS_SUCCESS] (state, { data }) {
    state.all = data;
  },
  [types.GET_SPOTIFY_ARTISTS_SUCCESS] (state, { data }) {
    Vue.set(state, 'selectedArtistImage', data.images[0].url);
  }
}

export {
  actions
}

export default {
  state,
  getters,
  actions,
  mutations
}