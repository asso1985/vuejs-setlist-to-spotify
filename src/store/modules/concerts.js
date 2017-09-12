import Vue from 'vue';
import * as types from '../mutations';
import axios from 'axios';
import moment from 'moment';

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
  all: []
};

// getters
const getters = {
  allConcerts: state => state.all
};

const actions = {
  getConcerts ({ commit }, artistId) {
    axios.get(Vue.config.BASE_API_URL + 'setlist/search/' + artistId)
      .then(function (response) {
        commit(types.GET_CONCERTS_SUCCESS, {
          data: response.data
        })
    })
  }
}

// mutations
const mutations = {
  [types.GET_CONCERTS_SUCCESS] (state, { data }) {
    state.all = formatDates(data.setlist);
  }
}


export default {
  state,
  getters,
  actions,
  mutations
}