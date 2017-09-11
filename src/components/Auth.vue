<template>
  <div>auth</div>
</template>

<script>
import Vue from 'vue';

import VueLocalStorage from 'vue-localstorage';
Vue.use(VueLocalStorage);

export default {
  name: 'auth',
  created : function() {
    Vue.localStorage.set('token', this.$route.query.token);
    window.opener.postMessage('udpate', location.origin);
    window.close();
  }
}
</script>
