<template>
  <div>
    <div class="main-search">
      <div class="container">
        <div class="row">
          <div class="col-md-12 text-center">
            <div style="margin-bottom:20px;">
              <h1 id="logo">Setlist To Spotify</h1>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col-md-6 col-md-offset-3">
            <artist-search :onGetConcerts="handleGetConcerts" />
          </div>
        </div>
      </div>
    </div>
    <div class="main-setlists">
      <setlists :updateSelectedSetlist="updateSelectedSetlist" :onGetConcerts="handleGetConcerts"/>
      <selected-setlist :setlist="selectedSetlist" />
    </div>
  </div>
</template>

<script>
import Vue from 'vue';
import ArtistSearch from '@/components/ArtistSearch';
import SelectedSetlist from '@/components/SelectedSetlist';
import Setlists from '@/components/Setlists';
import { mapGetters, mapActions } from 'vuex';

import VueLocalStorage from 'vue-localstorage';
Vue.use(VueLocalStorage);

export default {
  name: 'home',
  components : { ArtistSearch, Setlists, SelectedSetlist},
  data : function() {
    return {
      setlistLoading: false,
      selectedSetlist: null
    }
  },
  created () {
    const expiry = Vue.localStorage.get('expiry', null);
    const now = Math.floor(Date.now() / 1000);
    if (!expiry || expiry < now) {
      Vue.localStorage.remove('token', null);
      Vue.localStorage.remove('expiry', null);
      Vue.localStorage.remove('userId', null);
    }
  },
  methods: {
    ...mapActions(['getConcerts']),
    updateSelectedSetlist : function (set) {
      this.selectedSetlist = set;
    },
    handleGetConcerts (artist, page) {
      this.setlistLoading = true;
      page = page || 1;
      const self = this;
      this.getConcerts(artist.mbid, page).then(()=>{
        setTimeout(() => {
          this.setlistLoading = false;
        }, 500);
      });
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1, h2 {
  font-weight: normal;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #42b983;
}
</style>
