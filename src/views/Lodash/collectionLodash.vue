<template>
  <div class="collection-lodash">
    <div class="tip"> 集合的方法的有很多和js的array方法类似，但大多数情况也可以对对象调用，但是注意操作对象时迭代顺序无法保证。下表只展示了两个方法，更多方法自己去找一下</div><br/>
    <el-table
    :data="lodashData"
    border
    style="width: 100%">
      <template v-for="(item, index) in keys">
        <el-table-column v-if="item.key === 'example' || item.key === 'result'" :label="item.label" :key="index">
          <template slot-scope="scope">
            <div v-html="scope.row.example" v-if="item.key === 'example'"></div>
            <div v-html="scope.row.result" v-if="item.key === 'result'"></div>
          </template>
        </el-table-column>
        <el-table-column
          v-else
          :prop="item.key"
          :label="item.label"
          :type="item.type"
          :key="index"
          :column-key="item.key"
          :formatter="item.formatter"
        >
        </el-table-column>
      </template>
    </el-table>
  </div>
</template>

<script>
// import _ from 'lodash'
export default {
  name: 'collectionLodash',
  data () {
    return {
      lodashData: [
        {
          name: '_.forEach(collection, [iteratee=_.identity])',
          introduction: '调用 iteratee 遍历 collection(集合) 中的每个元素， iteratee 调用3个参数： (value, index|key, collection)。 如果迭代函数（iteratee）显式的返回 false ，迭代会提前退出。',
          example: "_([1, 2]).forEach(function(value){<br/> console.log(value) <br/>});<br/> _.forEach({ 'a': 1, 'b': 2 }, function(value, key) {<br/> console.log(key)<br/>});",
          result: "Logs `1` then `2`;<br/> Logs 'a' then 'b' (iteration order is not guaranteed:迭代顺序没有保证)."
        },
        {
          name: '_.map(collection, [iteratee=_.identity])',
          introduction: '创建一个数组， value（值） 是 iteratee（迭代函数）遍历 collection（集合）中的每个元素后返回的结果。 iteratee（迭代函数）调用3个参数：(value, index|key, collection).',
          example: "function square(n) {<br/>return n * n;<br/>}<br/>_.map([4, 8], square)<br/>_.map({ 'a': 4, 'b': 8 }, square)",
          result: '[16, 64];<br/> [16, 64] (iteration order is not guaranteed:迭代顺序没有保证).'
        }
      ]
    }
  },
  computed: {
    keys () {
      return [
        {
          key: 'name',
          label: '方法名'
        },
        {
          key: 'introduction',
          label: '介绍'
        },
        {
          key: 'example',
          label: '例子'
        },
        {
          key: 'result',
          label: '结果'
        },
        {
          key: 'remark',
          label: '备注'
        }
      ]
    }
  }
}
</script>

<style lang="scss" scoped>
.tip {
  color: red;
}
</style>
