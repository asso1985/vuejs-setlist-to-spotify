<template>
  <div class="form-group">
  	<div class="search-input">
  		<input class="form-control" v-model="query" placeholder="Search Artist" v-on:keyup="search" autocomplete="off" />
  		<div v-if="searching" class="loading"><img width="34" src="../assets/spinner.svg"></div>
  	</div>
   	
  </div>
</template>

<script>
export default {
  name: 'search',
  props: ['callBack', 'searching'],
  data : function () {
    return {
      query : ''
    }
  },
  methods : {
    search : function() {
      this.callBack(this.query)
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
</style>