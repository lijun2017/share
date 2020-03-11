<template>
  <div class="vuex-page">
    关于vuex的模块化时候，命名空间其实很有必要，在调用vuex提供的各种map辅助函数，命名空间可以作为第一个参数，确认你操作的是哪个模块，从而防止名称冲突的问题。
    <br>
    文档地址：https://vuex.vuejs.org/zh/guide/modules.html
    <br>
    <br>
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
    }
  },
  computed: {
    localstorageTest () {
      return JSON.stringify(storage.get('test'))
    }
  },
  methods: {
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
  }
</style>
