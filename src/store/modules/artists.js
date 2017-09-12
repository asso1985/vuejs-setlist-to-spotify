import Vue from 'vue';
import * as types from '../mutations';
import axios from 'axios';
import moment from 'moment';

const state = {
  all: []
};

// getters
const getters = {
  allArtists: state => state.all,
  selectedArtist: state => state.selected
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
    state.selected = data;
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}