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
            <artist-search :search-artist="getArtists" :search-setlists="searchSetlists" :artists="artists" />
          </div>
        </div>
      </div>
    </div>
    <div class="main-setlists">
      <div class="setlists-container">
        <setlists :loading="setlistLoading" :setlists="setlists" :updateSelectedSetlist="updateSelectedSetlist" />
      </div>
      <selected-setlist :setlist="selectedSetlist" />
    </div>
  </div>
</template>

<script>
import ArtistSearch from '@/components/ArtistSearch';
import SelectedSetlist from '@/components/SelectedSetlist';
import Setlists from '@/components/Setlists';
import Vue from 'vue';
import moment from 'moment';
import axios from 'axios';

function formatDates (setlist) {
  setlist.map(function(item) {
    item.eventDateObj = {};
    item.eventDateObj['day'] = moment(item.eventDate, 'DD-MM-YYYY', true).format('DD');
    item.eventDateObj['month'] = moment(item.eventDate, 'DD-MM-YYYY', true).format('MMM');
    item.eventDateObj['year'] = moment(item.eventDate, 'DD-MM-YYYY', true).format('YYYY');
  });

  return setlist;
}
export default {
  name: 'home',
  components : { ArtistSearch, Setlists, SelectedSetlist},
  data : function() {
    return {
      setlistLoading: false,
      artists : [],
      setlists: [],
      selectedSetlist: null
    }
  },
  methods: {
    updateSelectedSetlist : function (set) {
      this.selectedSetlist = set;
    },
    getArtists: function (query) {
      var self = this;
      axios.get(Vue.config.BASE_API_URL + 'setlist/artist/' + query)
      .then(function (response) {
        self.artists = response.data.artist;
      })
    },
    searchSetlists: function(artistId) {
      this.setlistLoading = true;
      var self = this;
      axios.get(Vue.config.BASE_API_URL + 'setlist/search/' + artistId)
      .then(function (response) {
        self.setlists = formatDates(response.data.setlist);
        self.setlistLoading = false;
      })
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
