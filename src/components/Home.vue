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
            <artist-search :onGetConcerts="handleGetConcerts"/>
          </div>
        </div>
      </div>
    </div>
    <div class="main-setlists">
      <div class="setlists-container">
        <setlists :loading="setlistLoading" :updateSelectedSetlist="updateSelectedSetlist" />
      </div>
      <selected-setlist :setlist="selectedSetlist" />
    </div>
  </div>
</template>

<script>
import ArtistSearch from '@/components/ArtistSearch';
import SelectedSetlist from '@/components/SelectedSetlist';
import Setlists from '@/components/Setlists';
import { mapGetters, mapActions } from 'vuex';

export default {
  name: 'home',
  components : { ArtistSearch, Setlists, SelectedSetlist},
  data : function() {
    return {
      setlistLoading: false,
      selectedSetlist: null
    }
  },
  methods: {
    ...mapActions(['getConcerts']),
    updateSelectedSetlist : function (set) {
      this.selectedSetlist = set;
    },
    handleGetConcerts: function(artist) {
      const self = this;
      this.setlistLoading = true;
      this.getConcerts(artist.mbid).then(()=>{
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
