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
    Vue.localStorage.set('expires', this.$route.query.expires_in);
    Vue.localStorage.set('userId', this.$route.query.userId);
    // Vue.localStorage.set('user', JSON.parse(this.$route.query.user));
    window.opener.postMessage('udpate', location.origin);
    window.close();
  }
}
</script>
