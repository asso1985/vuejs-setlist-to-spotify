<template>
  <div class="selected-setlist-container" v-if="selectedConcert.artist">
      <div v-if="loading" class="loading"><img width="60" src="../assets/spinner.svg"></div>
      <div v-if="!loading">
        <div class="selected-setlist-header">
          <div class="row">
            <div class="col-md-12">
              <h3>{{playlistName}}</h3>
            </div>
          </div>
        </div>
        <div class="selected-setlist-body">
          <div class="row">
            <div class="col-md-6">
              <ul>
                <li v-for="track in allTracks" v-bind:class="{'track  not-found' : track.notFound, 'track' : !track.notFound}">
                  <div class="album-img">
                    <div>{{track.playlist_order + 1}}</div>
                    <img height="50" :src="track.album.images[2].url">
                  </div>
                  <div>
                    <h5>{{track.name}}</h5>
                    <h6>{{track.album.name}}</h6>
                  </div>
                </li>
              </ul>
            </div>
            <div class="col-md-6" v-if="allTracks.length > 0">
              <div v-if="tracksNotFound > 0">
                <p class="text-danger">{{tracksNotFound}} {{ tracksNotFound > 1 ? 'Tracks' : 'Track'}} not found on Spotify</p>
              </div>
              <div v-if="selectedArtistImage" class="artist-image">
                <img :src="selectedArtistImage">
                <div></div>
              </div>
              <div v-if="!savedPlaylist.id">
                <button v-if="!token" class="btn" @click="loginToSave">Login to save playlist</button>
                <button v-if="token" class="btn" @click="savePlayList">
                  <div v-if="loadingSave" class="loading"><img width="40" src="../assets/spinner.svg"></div>
                  <span v-if="!loadingSave">Save plalist</span>
                </button>
              </div>
              <a v-if="savedPlaylist.id" class="btn" :href="savedPlaylist.external_urls.spotify" target="_blank">Listen in spotify</a>
            </div>
          </div>
        </div>
      </div>
  </div>
</template>

<script>
import Vue from 'vue';
import axios from 'axios';
import VueLocalStorage from 'vue-localstorage';
Vue.use(VueLocalStorage);

import { mapGetters, mapActions } from 'vuex';

export default {
  name: 'selected-setlist',
  data : function () {
    return {
      loading: false,
      token : null,
      loadingSave: false,
      countLoaded: 0,
      playlist : {
        name: ''
      }
    }
  },
  computed : {
    ...mapGetters({
      selectedConcert: 'selectedConcert',
      allTracks: 'allTracks',
      tracksNotFound: 'tracksNotFound',
      selectedArtistImage: 'selectedArtistImage',
      savedPlaylist: 'savedPlaylist'
    }),
    playlistName () {
      return this.selectedConcert.artist.name + ' @ ' + this.selectedConcert.venue.name + ', ' +this.selectedConcert.venue.city.name + ', ' + this.selectedConcert.venue.city.country.code
    }
  },
  watch : {
    allTracks: function(allTracks) {
      const self =this;
      if (this.countLoaded === allTracks.length) {
        setTimeout(function(){
          self.loading = false;
        }, 500);
      }
    },
    selectedConcert : function(selectedConcert) {
      this.countLoaded = 0;
      const artistName = selectedConcert.artist.name;
      const self = this;
      self.loading = true;
      this.emptyTracks();
      selectedConcert.sets.set[0].song.forEach(function(item, index){
        self.getTracks(artistName, item.name, index, self.getSpotifyArtist).then(()=>{
          self.countLoaded++;
        });
      })
    }
  },
  beforeMount : function() {
    this.token = Vue.localStorage.get('token', null);
  },
  methods : {
    ...mapActions(['getSpotifyArtist', 'getTrack', 'emptyTracks', 'savePlaylist']),
    loginToSave : function() {
      const self = this;
      const url = Vue.config.BASE_API_URL + 'auth/spotify';
      window.open(url, "Login to Spotify", "width=600, height=550");
      var eventMethod = window.addEventListener ? "addEventListener" : "attachEvent";
      var eventer = window[eventMethod];
      var messageEvent = eventMethod == "attachEvent" ? "onmessage" : "message";
      eventer(messageEvent,function(e) {
        if( e.origin != location.origin ){ return }
        self.token = Vue.localStorage.get('token', null);
      }, false);
    },
    savePlayList : function() {
      const self = this;

      this.loadingSave = true;

      const userId = Vue.localStorage.get('userId', null);

      this.savePlaylist({
        "playlistName" : self.playlistName,
        "userId": userId
      }).then(() => {
        setTimeout(() => {
          self.loadingSave = false;
        }, 500);
        
      })
    },
    getTracks (artist, track, order) {
      if (artist && track) {
        return this.getTrack({artist, track, order});
      }
    }
  }
}
</script>

<style type="text/css">
  .selected-setlist-container {
    background-color: #f2f2f2;
    width: 66.66%;
    height: calc(100vh - 168px);
    overflow: scroll;
    position: relative;
  }

  .selected-setlist-header {
    height: 60px;
    overflow: hidden;
    padding: 0 15px;
  }

  .selected-setlist-header h3 {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  .selected-setlist-body {
    overflow: hidden;
    background-color: white;
    margin: 15px;
    padding: 15px;
  }

  .selected-setlist-body ul {
    list-style: none;
    margin: 0;
    padding: 0;
  }

  .artist-image {
    position: relative;
    overflow: hidden;
    line-height: 0;
  }

  .artist-image > div {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
  }

  .artist-image > div:after {
    content: "";
    position: absolute;
    width: 100%;
    height: 100%;
    background-color: #000;
    opacity: 0.5;
  }

  .artist-image > img {
    position: relative;
    height: 100%;
    width: 100%;
  }

  .track {
    padding: 2px 0;
    display: flex;
  }

  .track.not-found {
    opacity: 0.5;
  }

  .track h5 {
    font-weight: bold;
  }

  .track h5, .track h6 {
    margin-top: 2px;
    margin-bottom: 4px;
  }

  .album-img {
    margin-right: 15px;
    position: relative;
    width: 50px;
    height: 50px;
  }

  .album-img > div {
    position: absolute;
    left: 0;
    bottom: 0;
    background-color: black;
    text-align: center;
    color: white;
    height: 20px;
    width:20px;
    line-height: 21px;
    font-size: 12px;
  }

  .selected-setlist-body .btn {
    width: 100%;
    background-color: black;
    border-radius: 0;
    color: white;
    font-size: 22px;
    margin-top: 10px;
    padding: 1rem;
    font-size: 1.3em;
  }

  .selected-setlist-body .btn .loading {
    position: relative;
    transform: none;
    top: auto;
    left: auto;
  }

  .btn:hover {
    color: white;
    background-color: #312e2e;
  }
</style>