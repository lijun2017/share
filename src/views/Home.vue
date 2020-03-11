<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png">
    <HelloWorld msg="Welcome to Your Vue.js App"/>
  </div>
</template>

<script>
// @ is an alias to /src
import HelloWorld from '@/components/HelloWorld.vue'
import storage from '../utils/storage'

export default {
  name: 'Home',
  components: {
    HelloWorld
  },
  mounted () {
    storage.set('test', {
      name: 'lijun',
      age: 25
    })
  }
}
</script>
