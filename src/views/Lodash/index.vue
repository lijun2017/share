<template>
  <div class="lodash">
    <div>
      Lodash是一个著名的javascript原生库，不需要引入其他第三方依赖。是一个意在提高开发者效率,提高JS原生方法性能的JS库。简单的说就是，很多方法lodash已经帮你写好了，直接调用就行，不用自己费尽心思去写了，而且可以统一方法的一致性。Lodash使用了一个简单的 _ 符号，就像Jquery的 $ 一样，十分简洁。
    </div><br>
    <div class="url" @click="clickUrl">
      中文文档地址：https://www.lodashjs.com/docs/lodash.chunk
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
      <el-tab-pane label="“Object” Methods" name="object">
        <objectLodash></objectLodash>
      </el-tab-pane>
      <el-tab-pane label="其他常用方法" name="other">
        <otherLodash></otherLodash>
      </el-tab-pane>
      <el-tab-pane label="写在最后" name="opinion">
        <div>
          实际上，我用lodash的方法也不是很多，但它对于想偷懒的人来说，真的是个宝库，如果真的对lodash熟悉，你处理数据时会减少很多时间。
        </div>
        <div>
          我感觉身边的人很少用lodash，可能随着es规范的不断推进，各种新方法也不断在对象中添加，某些lodash的方法就被替代了，导致有人抛弃它；抛去思考，只要调用api，这也是可以很多人不愿意使用它的一个原因吧。
        </div>
        <div>
           最后我想说的是，不强求大家使用它，但是希望大家知道这个库，其实它的源码似乎是函数式编程（函数注释）的典范，有兴趣的可以自己去看一下。
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import arrayLodash from './arrayLodash'
import collectionLodash from './collectionLodash'
import objectLodash from './objectLodash'
import otherLodash from './otherLodash'
export default {
  name: 'Lodash',
  components: {
    arrayLodash,
    collectionLodash,
    objectLodash,
    otherLodash
  },
  data () {
    return {
      activeName: 'array'
    }
  },
  methods: {
    handleClick (tab, event) {
      console.log(tab, event)
    },
    clickUrl (url) {
      window.open('https://www.lodashjs.com/docs/lodash.chunk', '_blank')
    }
  }
}
</script>

<style lang="scss" scoped>
.lodash {
  text-align: left;
  .url {
    &:hover {
      cursor: pointer;
    }
  }
}
</style>
