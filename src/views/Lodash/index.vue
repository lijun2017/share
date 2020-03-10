<template>
  <div class="lodash">
    <div>
      Lodash是一个著名的javascript原生库，不需要引入其他第三方依赖。是一个意在提高开发者效率,提高JS原生方法性能的JS库。简单的说就是，很多方法lodash已经帮你写好了，直接调用就行，不用自己费尽心思去写了，而且可以统一方法的一致性。Lodash使用了一个简单的 _ 符号，就像Jquery的 $ 一样，十分简洁。
    </div><br>
    <el-tabs
       v-model="activeName"
       @tab-click="handleClick"
    >
      <el-tab-pane label="数组“Array” 方法" name="array">
        <arrayLodash></arrayLodash>
      </el-tab-pane>
      <el-tab-pane label="“集合” 方法" name="collection">
        <collectionLodash></collectionLodash>
      </el-tab-pane>
      <el-tab-pane label="角色管理" name="third">角色管理</el-tab-pane>
      <el-tab-pane label="定时任务补偿" name="fourth">定时任务补偿</el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import arrayLodash from './arrayLodash'
import collectionLodash from './collectionLodash'
export default {
  name: 'Lodash',
  components: {
    arrayLodash,
    collectionLodash
  },
  data () {
    return {
      activeName: 'array'
    }
  },
  methods: {
    handleClick (tab, event) {
      console.log(tab, event)
    }
  }
}
</script>

<style lang="scss" scoped>
.lodash {
  text-align: left;
}
</style>
