<template>
  <div class="selected-setlist-container" v-if="setlist">
      <div v-if="loading" class="loading"><img width="60" src="../assets/spinner.svg"></div>
      <div v-if="!loading">
        <div class="selected-setlist-header">
          <div class="row">
            <div class="col-md-12">
              <h3>{{setlist.artist.name}} @ {{setlist.venue.name}}, {{setlist.venue.city.name}}, {{setlist.venue.city.country.code}}</h3>
            </div>
          </div>
        </div>
        <div class="selected-setlist-body">
          <div class="row">
            <div class="col-md-6">
              <ul>
                <li v-for="track in tracks" v-bind:class="{'track  not-found' : track.notFound, 'track' : !track.notFound}">
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
            <div class="col-md-6" v-if="tracks.length > 0">
              <div v-if="tracksNotFound > 0">
                <p class="text-danger">{{tracksNotFound}} {{ tracksNotFound > 1 ? 'Tracks' : 'Track'}} not found on Spotify</p>
              </div>
              <div class="artist-image">
                <img :src="artistImage">
                <div></div>
              </div>
              <button class="btn" @click="loginToSave">Save playlist</button>
            </div>
          </div>
        </div>
      </div>
  </div>
</template>

<script>
import Vue from 'vue';
import _ from 'lodash';

export default {
  name: 'selected-setlist',
  props: ['setlist'],
  data : function () {
    return {
      tracks : [],
      loading: false,
      countLoaded: 0,
      artistImage: '',
      tracksNotFound: 0
    }
  },
  watch : {
    setlist : function() {
      this.tracks = [];
      this.countLoaded = 0;
      this.tracksNotFound = 0;
      this.artistImage;
      const artistName = this.setlist.artist.name;
      const self = this;
      self.loading = true;
      this.setlist.sets.set[0].song.forEach(function(item, index){
        self.getTracks(artistName, item.name, index);
      })
    }
  },
  methods : {
    loginToSave : function() {
      const url = Vue.config.BASE_API_URL + '/auth/spotify';
      var myWindow = window.open(url, "", "width=200,height=200");
    },
    getArtist : function(artistId) {
      var xhr = new XMLHttpRequest();
      var self = this;
      xhr.open('GET', Vue.config.BASE_API_URL + 'spotify/artist/'+artistId);
      xhr.onload = function () {
        const response = JSON.parse(xhr.response);
        self.artistImage = response.images[0].url;
      }
      xhr.send();
    },
    getTracks : function(artist, track, order) {
      if (artist && track) {
        var xhr = new XMLHttpRequest();
        var self = this;
        xhr.open('GET', Vue.config.BASE_API_URL + 'spotify/search/track/'+artist+'/' + track);
        xhr.onload = function () {
          const response = JSON.parse(xhr.response);
            response.playlist_order = order;
            if (!response.error) {
              self.tracks.push(response);
              self.countLoaded++;
              if (self.setlist.sets.set[0].song.length >= self.countLoaded) {
                self.tracks = _.orderBy(self.tracks, 'playlist_order', 'asc');
                self.loading = false;
              }

              if (self.countLoaded === 1 && self.tracks[0].artists[0].id) {
                self.getArtist(self.tracks[0].artists[0].id);
              }
            } else {
              self.tracks.push({
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
              self.tracksNotFound++;
            }
        }
        xhr.send();
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
    /*background-color: #ddd;*/
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

  .btn:hover {
    color: white;
    background-color: #312e2e;
  }
</style>