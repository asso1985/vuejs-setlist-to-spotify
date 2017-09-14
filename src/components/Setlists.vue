<template>
  <div class='setlists'>
    <ul v-if="!loading">
      <li v-for="concert in concertsFormatted" v-bind:class="{ selected: concert.id === selectedSet.id,  disabled: concert.sets.set.length === 0}" @click="selectSetlist(concert)">
        <div class="set-date">
          <span>{{concert.eventDateObj.month}}</span>
          <strong>{{concert.eventDateObj.day}}</strong>
          <span>{{concert.eventDateObj.year}}</span>
        </div>
        <div class="set-infos">
          <p>{{concert.artist.name}}</p>
          <p>{{concert.venue.name}}, {{concert.venue.city.name}}, {{concert.venue.city.country.code}}</p>
          <small>{{concert.songsCount}} songs</small>
        </div>
      </li>
    </ul>
    <div v-if="loading" class="loading"><img width="60" src="../assets/spinner.svg"></div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

export default {
  name: 'setlists',
  props: ['loading', 'setlists'],
  data : function(){
    return {
      selectedSet: {}
    }
  },
  computed : {
    ...mapGetters({
      allConcerts: 'allConcerts'
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
  methods : {
    ...mapActions(['getConcerts', 'updateSelectedConcert']),
    selectSetlist (concert) {
      if (concert.sets.set.length > 0) {
        this.selectedSet = concert;
        this.updateSelectedConcert(concert.id);
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
  .set-date span {margin: 2px 0; font-size: 1.1rem;}
  .set-date strong {font-size: 2.2rem;}
  .set-infos {
    padding-left: 20px;
  }
  .set-infos p {
    margin: 3px 0;
    line-height: 1;
  }

  .setlists ul li.disabled {
    opacity: 0.5;
  }
  .setlists ul li.disabled:hover {
    background-color: inherit;
  }
</style>