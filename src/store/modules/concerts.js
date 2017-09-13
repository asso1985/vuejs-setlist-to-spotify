import Vue from 'vue';
import * as types from '../mutations';
import axios from 'axios';
import moment from 'moment';
import _ from 'lodash';

function formatDates (setlist) {
  setlist.map(function(item) {
    item.eventDateObj = {};
    item.eventDateObj['day'] = moment(item.eventDate, 'DD-MM-YYYY', true).format('DD');
    item.eventDateObj['month'] = moment(item.eventDate, 'DD-MM-YYYY', true).format('MMM');
    item.eventDateObj['year'] = moment(item.eventDate, 'DD-MM-YYYY', true).format('YYYY');
  });

  return setlist;
}

const state = {
  all: [],
  selectedConcert: {}
};

// getters
const getters = {
  allConcerts: state => state.all,
  selectedConcert: state => state.selectedConcert
};

const actions = {
  getConcerts ({ commit }, artistId) {
    axios.get(Vue.config.BASE_API_URL + 'setlist/search/' + artistId)
      .then(function (response) {
        commit(types.GET_CONCERTS_SUCCESS, {
          data: response.data
        })
    })
  },
  updateSelectedConcert ({ commit }, concertId) {
    commit(types.SET_SELECTED_CONCERT, {
      id: concertId
    })
  }
}

// mutations
const mutations = {
  [types.GET_CONCERTS_SUCCESS] (state, { data }) {
    state.all = formatDates(data.setlist);
  },
  [types.SET_SELECTED_CONCERT] (state, { id }) {
    const selectedConcert = _.filter(state.all, function(c) { return c.id === id; });
    state.selectedConcert = selectedConcert[0];
  }
}


export default {
  state,
  getters,
  actions,
  mutations
}