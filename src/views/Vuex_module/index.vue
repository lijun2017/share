<template>
  <div class="vuex-page">
    关于vuex的模块化使用，命名空间其实很有必要，在调用vuex提供的各种map辅助函数，命名空间可以作为第一个参数，确认你操作的是哪个模块，从而防止变量名冲突的问题。
    <p class="url" @click="clickUrl">
      文档地址：https://vuex.vuejs.org/zh/guide/modules.html
    </p>
    <module1></module1>
    <hr>
    <module2></module2>
    <hr>
    <el-button
      @click="addStorage"
      class="add-btn"
    >添加Storage</el-button>
    <el-button
      @click="deleteStorage"
      class="add-btn"
    >删除Storage</el-button>
    <div>
      {{localstorageTest}}
    </div>
  </div>
</template>

<script>
import module1 from './module1/index'
import module2 from './module2/index'
import storage from '../../utils/storage'
export default {
  name: 'Vuex',
  components: {
    module1,
    module2
  },
  data () {
    return {
      localstorageTest: JSON.stringify(storage.get('test'))
    }
  },
  // computed: {
  //   localstorageTest () {
  //     return JSON.stringify(storage.get('test'))
  //   }
  // },
  methods: {
    clickUrl (url) {
      window.open('https://vuex.vuejs.org/zh/guide/modules.html', '_blank')
    },
    addStorage () {
      storage.set('test', {
        name: 'lijun',
        age: 25
      })
    },
    deleteStorage () {
      storage.remove('test')
    }
  }
}
</script>

<style lang="scss">
  .vuex-page {
    text-align: left;
    .url {
      &:hover {
        cursor: pointer;
      }
    }
  }
</style>
