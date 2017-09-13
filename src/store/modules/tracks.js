import Vue from 'vue';
import * as types from '../mutations';
import store from '../index';
import axios from 'axios';
import moment from 'moment';
import _ from 'lodash';

import VueLocalStorage from 'vue-localstorage';
Vue.use(VueLocalStorage);

const state = {
  all: [],
  savedPlaylist : {},
  tracksNotFound: 0
};

// getters
const getters = {
  allTracks: state => state.all,
  tracksNotFound: state => _.filter(state.all, function(t) { return t.notFound; }).length,
  savedPlaylist: state => state.savedPlaylist
};

const actions = {
  emptyTracks ({ dispatch, commit }, params) {
    commit(types.EMPTY_TRACKS);
  },
  getTrack ({ dispatch, commit }, params) {
    const token = Vue.localStorage.get('token');
    if (token) {
      axios.defaults.headers.common['Authorization'] = token;
    }
    axios.get(Vue.config.BASE_API_URL + 'spotify/search/track/'+params.artist+'/' + params.track)
      .then(function (response) {
        const order = params.order;
        const track = params.track;
        commit(types.GET_TRACK_SUCCESS, {
          data: response.data,
          order,
          track
        });

        if (order===1 && response.data.artists[0].id) {
          store.dispatch('getSpotifyArtist', response.data.artists[0].id)
        }
      })
  },
  savePlaylist ({ commit }, params) {
    function getTracksId() {
      const tracksId = [];
      state.all.map(function(item){
        if (item.uri) {
          tracksId.push(item.uri);
        }
      })
      return tracksId;
    }

    const tracks = getTracksId();
    const token = Vue.localStorage.get('token');
    if (token) {
      axios.defaults.headers.common['Authorization'] = token;
    }
    axios.post(Vue.config.BASE_API_URL + 'spotify/save-playlist',
    {
      ...params,
      "tracks": tracks
    })
    .then(function (response) {
      commit(types.SAVE_PLAYLIST_SUCCESS, {
        response: response.data
      });
    })
  }
}

let tracks = [];

// mutations
const mutations = {
  [types.GET_TRACK_SUCCESS] (state, { data, order, track }) {
    data.playlist_order = order;
    if (!data.error) {
      tracks.push(data);
      tracks = _.orderBy(tracks, 'playlist_order', 'asc');
    } else {
      tracks.push({
        notFound: true,
        playlist_order: order,
        name: track,
        album : {
          name: '',
          images : [{}, {}, {
            url: ''
          }]
        }
      });
    }

    state.all = tracks;
  },
  [types.EMPTY_TRACKS] (state) {
    tracks = [];
    state.all = tracks;
    state.savedPlaylist = {};
  },
  [types.SAVE_PLAYLIST_SUCCESS] (state, {response}) {
    state.savedPlaylist = response.data;
  }
}


export default {
  state,
  getters,
  actions,
  mutations
}