import Vue from 'vue';
import * as types from '../mutations';
import axios from 'axios';
import moment from 'moment';

import VueLocalStorage from 'vue-localstorage';
Vue.use(VueLocalStorage);

const state = {
  all: [],
  loading: false
};

// getters
const getters = {
  allArtists: state => state.all,
  searchArtistLoading : state => state.loading,
  selectedArtistImage: state => state.selectedArtistImage
};

const actions = {
  getArtists ({ commit }, query) {
    commit(types.GET_ARTISTS_REQUEST);
    axios.get(Vue.config.BASE_API_URL + 'setlist/artist/' + query)
    .then(function (response) {
      commit(types.GET_ARTISTS_SUCCESS, {
        data: response.data.artist
      });
    })
  },
  getSpotifyArtist ({ commit }, artistId) {
    const token = Vue.localStorage.get('token');
    if (token) {
      axios.defaults.headers.common['Authorization'] = token;
    }
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
  [types.GET_ARTISTS_REQUEST] (state) {
    state.loading = true;
  },
  [types.GET_ARTISTS_SUCCESS] (state, { data }) {
    state.all = data;
    state.loading = false;
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