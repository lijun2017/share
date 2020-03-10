<template>
  <div class="object-lodash">
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
  name: 'objectLodash',
  data () {
    return {
      lodashData: [
        {
          name: '_.assign(object, [sources])',
          introduction: '分配来源对象的可枚举属性到目标对象上。 来源对象的应用规则是从左到右，随后的下一个对象的属性会覆盖上一个对象的属性。',
          example: "function Foo() {<br>this.a = 1;<br>}<br>function Bar() {<br>this.c = 3;;<br>}<br>Foo.prototype.b = 2;<br>Bar.prototype.d = 4;<br>_.assign({ 'a': 0 }, new Foo, new Bar);",
          result: "{ 'a': 1, 'c': 3 }",
          remark: '这方法会改变 object，参考自 Object.assign; 通过构造函数的原型设置属性默认不可枚举，所以会被_assign()忽略'
        },
        {
          name: '_.merge(object, [sources])',
          introduction: '该方法类似_.assign， 除了它递归合并 sources 来源对象自身和继承的可枚举属性到 object 目标对象。如果目标值存在，被解析为undefined的sources 来源对象属性将被跳过。数组和普通对象会递归合并，其他对象和值会被直接分配覆盖。源对象从从左到右分配。后续的来源对象属性会覆盖之前分配的属性。',
          example: "var object = {<br/>'a': [{ 'b': 2 }, { 'd': 4 }]<br/>}<br/>var other  = {<br/>'a': [{ 'c': 3 }, { 'e': 5 }]<br/>}<br/>_.merge(object, other);",
          result: "{ 'a': [{ 'b': 2, 'c': 3 }, { 'd': 4, 'e': 5 }] }.",
          remark: '这方法会改变对象 object.'
        },
        {
          name: '_.pick(object, [props])',
          introduction: '创建一个从 object 中选中的属性的对象。',
          example: "var object = { 'a': 1, 'b': '2', 'c': 3 };<br>_.pick(object, ['a', 'c']);",
          result: "{ 'a': 1, 'c': 3 }",
          remark: '我经常和上面merge方法连用，用来更新一个大对象中的属性，然后选取需要的属性传递给后台：var qeryObj = _.pick(_.assign({}, this.detailObj, this.formObj), ["id", "name"])'
        },
        {
          name: '_.values(object)',
          introduction: '创建 object 自身可枚举属性的值为数组。',
          example: "function Foo() {<br>this.a = 1;<br>}<br>Foo.prototype.c = 3;<br>_.values(new Foo);<br>_.values('hi');",
          result: "[1, 2] (无法保证遍历的顺序)<br>['h', 'i']",
          remark: '非对象的值会强制转换为对象。'
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
