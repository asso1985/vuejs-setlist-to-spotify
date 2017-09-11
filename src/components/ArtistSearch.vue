<template>
   <div class="artist-search">
     <search :callBack="searchQuery" :searching="searching"/>
     <div class="artist-search-results" v-if="showResults">
       <ul>
         <li v-for="artist in artists"><a @click="selectArtist(artist)">{{artist.name}}</a></li>
       </ul>
     </div>
   </div>
</template>

<script>
import Search from '@/components/Search';
export default {
  name: 'artist-search',
  props: ['searchArtist', 'searchSetlists', 'artists'],
  components : { Search },
  data : function () {
    return {
      searching: false,
      results : null,
      showResults: false
    }
  },
  updated : function() {
    if (this.artists) {
      this.searching = false;
    }
  },
  methods: {
    searchQuery: function (query) {
      this.searching = true;
      this.showResults = true;
      this.searchArtist(query);
    },
    selectArtist: function(artist) {
      this.showResults = false;
      this.searchSetlists(artist.mbid);
    }
  }
}
</script>

<style type="text/css">
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
</style>