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
  loading : false,
  currentPage: 1,
  currentArtistId: '',
  totalPages: 0,
  lastPageLoaded : false,
  selectedConcert: {}
};

// getters
const getters = {
  allConcerts: state => state.all,
  concertsLoading: state => state.loading,
  selectedConcert: state => state.selectedConcert
};

const actions = {
  getConcerts ({ commit }, artistId) {
    commit(types.GET_CONCERTS_REQUEST);
    const page = 1;
    axios.get(Vue.config.BASE_API_URL + 'setlist/search/' + artistId + '/' + page)
      .then(function (response) {
        commit(types.GET_CONCERTS_SUCCESS, {
          data: response.data,
          artistId: artistId
        })
    })
  },
  loadMoreConcerts ({ commit }) {
    if (!state.lastPageLoaded) {
      commit(types.LOAD_MORE_CONCERTS_REQUEST);
      axios.get(Vue.config.BASE_API_URL + 'setlist/search/' + state.currentArtistId + '/' + state.currentPage)
        .then(function (response) {
          commit(types.LOAD_MORE_CONCERTS_SUCCESS, {
            data: response.data
          })
      })
    }
  },
  updateSelectedConcert ({ commit }, concertId) {
    commit(types.SET_SELECTED_CONCERT, {
      id: concertId
    })
  }
}

// mutations
const mutations = {
  [types.GET_CONCERTS_REQUEST] (state) {
    state.all = [];
    state.loading = true;
  },
  [types.GET_CONCERTS_SUCCESS] (state, { data, artistId}) {
    state.all = formatDates(data.setlist);
    state.currentArtistId = artistId;
    state.currentPage = 1;
    state.lastPageLoaded = false;
    state.totalPages = Math.ceil(data.total / data.itemsPerPage);;
    state.loading = false;
  },
  [types.LOAD_MORE_CONCERTS_REQUEST] (state) {
    state.loading = true;
  },
  [types.LOAD_MORE_CONCERTS_SUCCESS] (state, { data }) {
    let oldList = state.all;
    const newList = formatDates(data.setlist)
    newList.forEach((item)=>{
      oldList.push(item);
    })
    state.all = oldList;
    if (state.totalPages === data.page) {
      state.lastPageLoaded = true;
    }
    state.currentPage = data.page + 1;
    state.loading = false;
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