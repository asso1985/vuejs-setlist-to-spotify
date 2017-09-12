import Vue from 'vue';
import * as types from '../mutations';
import store from '../index';
import axios from 'axios';
import moment from 'moment';
import _ from 'lodash';

const state = {
  all: []
};

// getters
const getters = {
  allTracks: state => state.all,
  tracksNotFound: state => _.filter(state.all, function(t) { return t.notFound; }).length,
  playlist: state => state.playlist
};

const actions = {
  emptyTracks ({ dispatch, commit }, params) {
    commit(types.EMPTY_TRACKS);
  },
  getTrack ({ dispatch, commit }, params) {
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
        tracksId.push(item.uri);
      })
      return tracksId;
    }

    const tracks = getTracksId();

    axios.post(Vue.config.BASE_API_URL + 'spotify/save-playlist', {
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
  },
  [types.SAVE_PLAYLIST_SUCCESS] (state, {data}) {
    state.playlist = data;
  }
}


export default {
  state,
  getters,
  actions,
  mutations
}