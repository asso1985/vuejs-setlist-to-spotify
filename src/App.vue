<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'app'
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  font-size: 14px;
}

#logo {
  font-family: 'Pacifico', cursive;
  color: white;
}

.main-search {
  padding: 20px 0;
  background-color: #1db954;
}
.main {
  display: flex;
}

.main-setlists {
  display: flex;
}

.setlists-container {
  width: 33.33%;
  height: calc(100vh - 168px);
  overflow: scroll;
  position: relative;
}

.loading {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.loading.relative {
  position: relative;
  width: 100%;
  text-align: center;
  transform: none;
  top: auto;
  left: auto;
}
</style>
