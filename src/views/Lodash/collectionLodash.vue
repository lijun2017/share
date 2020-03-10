<template>
  <div class="array-lodash">
    <el-table
    :data="lodashData"
    border
    style="width: 100%">
      <template v-for="(item, index) in keys">
        <el-table-column
          :prop="item.key"
          :label="item.label"
          :type="item.type"
          :key="index"
          :column-key="item.key"
          :formatter="item.formatter"
        ></el-table-column>
      </template>
    </el-table>
  </div>
</template>

<script>
import _ from 'lodash'
export default {
  name: 'Lodash',
  data () {
    return {
      lodashData: [
        {
          name: '_.chunk(array, [size=1])',
          introduction: '将数组（array）拆分成多个 size 长度的区块，并将这些区块组成一个新数组。 如果array 无法被分割成全部等长的区块，那么最后剩余的元素将组成一个区块。',
          example: "_.chunk(['a', 'b', 'c', 'd'], 3)",
          result: JSON.stringify(_.chunk(['a', 'b', 'c', 'd'], 3))
        },
        {
          name: '_.flatten(array)',
          introduction: '减少一级array嵌套深度。',
          example: '_.flatten([1, [2, [3, [4]], 5]])',
          result: JSON.stringify(_.flatten([1, [2, [3, [4]], 5]]))
        },
        {
          name: '_.flattenDeep(array)',
          introduction: '将array递归为一维数组。',
          example: '_.flattenDeep([1, [2, [3, [4]], 5]])',
          result: JSON.stringify(_.flattenDeep([1, [2, [3, [4]], 5]]))
        },
        {
          name: '_.flattenDepth(array, [depth=1])',
          introduction: '根据 depth 递归减少 array 的嵌套层级。',
          example: '_.flattenDeep([1, [2, [3, [4]], 5]], 2)',
          result: JSON.stringify(_.flattenDepth([1, [2, [3, [4]], 5]], 2)),
          remark: 'es9的数组有个新方法，arr.flat(num), 可以拉平数组，但是兼容性可能有待提高'
        },
        {
          name: '_.without(array, [values])',
          introduction: '创建一个剔除所有给定值的新数组，剔除值的时候，使用SameValueZero做相等比较。',
          example: '_.without([2, 1, 2, 3], 1, 2)',
          result: JSON.stringify(_.without([2, 1, 2, 3], 1, 2))
        },
        {
          name: '_.uniq(array)',
          introduction: '创建一个去重后的array数组副本。使用了 SameValueZero 做等值比较。只有第一次出现的元素才会被保留。',
          example: '_.uniq([2, 1, 2])',
          result: JSON.stringify(_.uniq([2, 1, 2]))
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
</style>
