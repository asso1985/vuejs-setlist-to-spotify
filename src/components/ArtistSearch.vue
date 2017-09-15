<template>
  <div class="artist-search">
    <div class="form-group">
      <div class="search-input">
        <input class="form-control" v-model="query" placeholder="Search Artist" v-on:keyup="searchQuery" autocomplete="off" />
        <div v-if="searchArtistLoading" class="loading"><img width="34" src="../assets/spinner.svg"></div>
      </div>
    </div>
    <div class="artist-search-results" v-if="showResults">
      <ul>
        <li v-for="artist in allArtists"><a @click="selectArtist(artist)">{{artist.name}}</a></li>
      </ul>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import _ from 'lodash';

export default {
  name: 'artist-search',
  props : ['onGetConcerts'],
  data : function () {
    return {
      query: '',
      showResults: false
    }
  },
  computed : mapGetters({
    allArtists: 'allArtists',
    showSearchArtistResults: 'showSearchArtistResults',
    searchArtistLoading: 'searchArtistLoading'
  }),
  methods: {
    ...mapActions(['getArtists']),
    searchQuery: _.debounce(function (e) {
      if (this.query.length === 0) {
        return;
      }

      this.showResults = true;
      this.getArtists(this.query);

    }, 500),
    selectArtist: function(artist) {
      this.showResults = false;
      this.onGetConcerts(artist);
    }
  }
}
</script>

<style type="text/css">
  .search-input {
    position: relative;
  }
  .search-input > input {

  }
  .search-input .loading {
    right: 10px;
    position: absolute;
    transform: none;
    left: auto;
    top: 1px;
  }

  .artist-search {
    position: relative;
  }
  .artist-search .form-control {
   background-color: rgb(71, 189, 113);
   border: 0;
   border-radius: 0;
   color: white;
  }

  .artist-search .form-control:focus {
  	outline: none;
  	border: 0;
  	box-shadow:none;
  }

.artist-search .form-control::-webkit-input-placeholder { /* Chrome */
  color: white;
}
.artist-search .form-control:-ms-input-placeholder { /* IE 10+ */
  color: white;
}
.artist-search .form-control::-moz-placeholder { /* Firefox 19+ */
  color: white;
}
.artist-search .form-control:-moz-placeholder { /* Firefox 4 - 18 */
 color: white;
}
  .artist-search-results  {
    position: absolute;
    width: 100%;
    top: 34px;
    left: 0;
    right: 0;
    background-color: white;
    border-bottom: 1px solid #f2f2f2;
    z-index: 2;
    box-shadow: 0px 1px 1px 0px #ccc;
  }
  .artist-search-results ul {
    max-height: 200px;
    overflow: scroll;
    padding: 0;margin: 0; list-style: none;
  }
  .artist-search-results ul li a {
    padding: 10px 15px;
    display: block;
    cursor: pointer;
    text-decoration: none;
    color: black;
  }
  .artist-search-results ul li a:hover {
    background-color: #f2f2f2;
  }
</style>