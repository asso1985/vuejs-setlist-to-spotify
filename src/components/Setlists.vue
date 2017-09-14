<template>
  <div class="setlists-container" v-on:scroll="handleScroll">
    <div class="setlists">
      <ul>
        <li v-for="concert in concertsFormatted" v-bind:class="{ selected: concert.id === selectedSet.id,  disabled: concert.sets.set.length === 0}" @click="selectSetlist(concert)">
          <div class="set-date">
            <span>{{concert.eventDateObj.month}}</span>
            <strong>{{concert.eventDateObj.day}}</strong>
            <span class="year">{{concert.eventDateObj.year}}</span>
          </div>
          <div class="set-infos">
            <span><b>{{concert.artist.name}}</b></span>
            <p>{{concert.venue.name}}, {{concert.venue.city.name}}, {{concert.venue.city.country.code}}</p>
            <small><b>{{concert.songsCount}} songs</b></small>
          </div>
        </li>
        <div v-if="concertsLoading" class="loading relative"><img width="60" src="../assets/spinner.svg"></div>
      </ul>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

export default {
  name: 'setlists',
  props: ['onGetConcerts'],
  data : function(){
    return {
      selectedSet: {},
      currentPage: 1,
      canLoadMore : false
    }
  },
  computed : {
    ...mapGetters({
      allConcerts: 'allConcerts',
      concertsLoading: 'concertsLoading'
    }),
    concertsFormatted () {
      this.allConcerts.forEach((concert, index) => {
        let songsCount = 0;
        concert.sets.set.forEach((set) => {
          songsCount = songsCount + set.song.length;
        });
        this.allConcerts[index].songsCount = songsCount;
      });
      return this.allConcerts;
    }
  },
  watch : {
    allConcerts (allConcerts) {
      if (allConcerts.length === 0) {
        document.querySelector('.setlists-container').scrollTop = 0;
      }
      this.canLoadMore = true;
    }
  },
  methods : {
    ...mapActions(['getConcerts', 'updateSelectedConcert', 'loadMoreConcerts']),
    selectSetlist (concert) {
      if (concert.sets.set.length > 0) {
        this.selectedSet = concert;
        this.updateSelectedConcert(concert.id);
      }
    },
    handleScroll (a) {
      if ((a.target.scrollHeight - a.target.offsetHeight) - 2 < a.target.scrollTop) {
        if (this.canLoadMore) {
          this.canLoadMore = false;
          const self = this;
          this.loadMoreConcerts();
        }
      }
    }
  }
}
</script>

<style type="text/css">
  .setlists ul { list-style: none; padding: 0; margin: 0 }
  .setlists ul li {display: flex; padding: 10px 15px}
  .setlists ul li:hover {
    background-color: #f2f2f2;
    cursor: pointer;
  }
  .setlists ul li.selected {
    background-color: #f2f2f2;
  }
  .set-date {
    display: flex;
    flex-direction: column;
    text-align: center;
    line-height: 1;
  }
  .set-date span {margin: 2px 0; font-size: 1.4rem;}
  .set-date span.year {font-size: 1.2rem;}
  .set-date strong {font-size: 2.5rem;}
  .set-infos {
    padding-left: 20px;
  }
  .set-infos p {
    margin: 3px 0 3px 0;
    line-height: 1;
  }

  .set-infos span {
    display: block;
  }

  .setlists ul li.disabled {
    opacity: 0.5;
  }
  .setlists ul li.disabled:hover {
    background-color: inherit;
  }
</style>