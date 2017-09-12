import Vue from 'vue';
import Vuex from 'vuex';
import concerts from './modules/concerts';
import artists from './modules/artists';
import tracks from './modules/tracks';
import * as actions from './actions';

Vue.use(Vuex);

const debug = process.env.NODE_ENV !== 'production';

export default new Vuex.Store({
  actions,
  modules: {
    concerts,
    artists,
    tracks
  }
})