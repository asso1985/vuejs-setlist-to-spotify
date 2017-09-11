<template>
  <div>auth</div>
</template>

<script>
import Vue from 'vue';

export default {
  name: 'auth',
  created : function() {
    console.log(this.$route.query.code);
  },
  methods: {
    auth : function () {
      const url = 'localhost:3000/auth/spotify';
      var myWindow = window.open(url, "", "width=600,height=500");
    }
  }
}
</script>
