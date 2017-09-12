import Vue from 'vue';
import * as types from '../mutations';
import artists from './artists';
import axios from 'axios';
import moment from 'moment';
import _ from 'lodash';

const state = {
  all: []
};

// getters
const getters = {
  allTracks: state => state.all,
  tracksNotFound: state => state.tracksNotFound
};

const actions = {
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
          dispatch('getSpotifyArtist', response.data.artists[0].id);
        }
      })
  }
}

// mutations
const mutations = {
  [types.GET_TRACK_SUCCESS] (state, { data, order, track }) {
    data.playlist_order = order;
    if (!data.error) {
      //self.tracks.push(response.data);
      state.all.push(data);
      state.all = _.orderBy(state.all, 'playlist_order', 'asc');
    } else {
      state.all.push({
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
      state.tracksNotFound = state.tracksNotFound + 1;
    }
  }
}


export default {
  state,
  getters,
  actions,
  mutations
}