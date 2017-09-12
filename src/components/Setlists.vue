<template>
  <div class='setlists'>
    <ul v-if="!loading">
      <li v-for="concert in allConcerts" v-bind:class="{ selected: concert.id === selectedSet.id,  disabled: concert.sets.set.length === 0}" @click="selectSetlist(concert)">
        <div class="set-date">
          <span>{{concert.eventDateObj.month}}</span>
          <strong>{{concert.eventDateObj.day}}</strong>
          <span>{{concert.eventDateObj.year}}</span>
        </div>
        <div class="set-infos">
          <p>{{concert.artist.name}}</p>
          <p>{{concert.venue.name}}, {{concert.venue.city.name}}, {{concert.venue.city.country.code}}</p>
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
  props: ['loading', 'setlists', 'updateSelectedSetlist'],
  data : function(){
    return {
      selectedSet: {}
    }
  },
  computed : mapGetters({
    allConcerts: 'allConcerts'
  }),
  methods : {
    ...mapActions(['getConcerts']),
    selectSetlist (concert) {
      if (concert.sets.set.length > 0) {
        this.selectedSet = concert;
        this.updateSelectedSetlist(concert);
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
    margin-bottom: 3px;
  }

  .setlists ul li.disabled {
    opacity: 0.5;
  }
  .setlists ul li.disabled:hover {
    background-color: inherit;
  }
</style>