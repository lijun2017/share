<template>
  <div class="other-lodash">
    <div class="tip">lodash中很多常用的方法，例如数据值得判断，字符串相关，Math相关，下面简单列几个</div><br/>
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
  name: 'otherLodash',
  data () {
    return {
      lodashData: [
        {
          name: '_.debounce(func, [wait=0], [options={}])',
          introduction: '创建一个 debounced（防抖动）函数，该函数会从上一次被调用后，延迟 wait 毫秒后调用 func 方法。 debounced（防抖动）函数提供一个 cancel 方法取消延迟的函数调用以及 flush 方法立即调用。 可以提供一个 options（选项） 对象决定如何调用 func 方法，options.leading 与|或 options.trailing 决定延迟前后如何触发（注：是 先调用后等待 还是 先等待后调用）。 func 调用时会传入最后一次提供给 debounced（防抖动）函数 的参数。 后续调用的 debounced（防抖动）函数返回是最后一次 func 调用的结果。',
          example: "// 避免窗口在变动时出现昂贵的计算开销。<br>jQuery(window).on('resize', _.debounce(calculateLayout, 150));<br>// 当点击时 `sendMail` 随后就被调用。<br>jQuery(element).on('click', _.debounce(sendMail, 300, {<br>'leading': true,<br>'trailing': false<br>}));",
          result: '',
          remark: '如果 leading 和 trailing 选项为 true, 则 func 允许 trailing 方式调用的条件为: 在 wait 期间多次调用防抖方法。'
        },
        {
          name: '_.throttle(func, [wait=0], [options={}])',
          introduction: '创建一个节流函数，在 wait 秒内最多执行 func 一次的函数。 该函数提供一个 cancel 方法取消延迟的函数调用以及 flush 方法立即调用。 可以提供一个 options 对象决定如何调用 func 方法， options.leading 与|或 options.trailing 决定 wait 前后如何触发。 func 会传入最后一次传入的参数给这个函数。 随后调用的函数返回是最后一次 func 调用的结果。',
          example: "// 避免在滚动时过分的更新定位<br>jQuery(window).on('scroll', _.throttle(updatePosition, 100));",
          result: '',
          remark: '如果 leading 和 trailing 都设定为 true 则 func 允许 trailing 方式调用的条件为: 在 wait 期间多次调用。'
        },
        {
          name: '_.once(func)',
          introduction: '创建一个只能调用 func 一次的函数。 重复调用返回第一次调用的结果。 func 调用时， this 绑定到创建的函数，并传入对应参数。',
          example: 'var initialize = _.once(createApplication);initialize();<br>initialize();',
          result: '(Function): 返回新的受限函数。',
          remark: '`initialize` 只能调用 `createApplication` 一次。'
        },
        {
          name: '_.clone(value)',
          introduction: '创建一个 value 的浅拷贝。',
          example: "var objects = [{ 'a': 1 }, { 'b': 2 }];<br>var shallow = _.clone(objects);",
          result: 'console.log(shallow[0] === objects[0]);<br>// => true 判断指针相等，所以是个浅拷贝',
          remark: '这个方法参考自 structured clone algorithm 以及支持 arrays、array buffers、 booleans、 date objects、maps、 numbers， Object 对象, regexes, sets, strings, symbols, 以及 typed arrays。 arguments对象的可枚举属性会拷贝为普通对象。 一些不可拷贝的对象，例如error objects、functions, DOM nodes, 以及 WeakMaps 会返回空对象。'
        },
        {
          name: '_.cloneDeep(value)',
          introduction: '这个方法类似_.clone，除了它会递归拷贝 value。（注：也叫深拷贝）。',
          example: "var objects = [{ 'a': 1 }, { 'b': 2 }];<br>var shallow = _.cloneDeep(objects);",
          result: 'console.log(shallow[0] === objects[0]);<br>// => false 判断指针不相等，所以是个深拷贝',
          remark: '我看到过有人说慎用这个方法，拷贝一些很复杂的对象就有可能报错。比如用cloneDeep克隆一个vue实例，就有可能包key.charAt is not a Function的错。实际情况一般来说复杂的对象都会内置拷贝方法，上面的例子正确的拷贝方法是Vue.extend()'
        },
        {
          name: '_.isNull(value)',
          introduction: '检查 value 是否是 null。',
          example: '_.isNull(null);<br>_.isNull(void 0);',
          result: '// => true<br>// => false',
          remark: '还有很多类似的判断方法，_.isNaN(value)，_.isNumber(value)'
        },
        {
          name: '_.sumBy(array, [iteratee=_.identity])',
          introduction: '它接受 iteratee 来调用 array中的每一个元素，来生成其值排序的标准。 iteratee 会调用1个参数: (value) 。',
          example: "var objects = [{ 'n': 4 }, { 'n': 2 }, { 'n': 8 }, { 'n': 6 }];",
          result: '_.sumBy(objects, function(o) { return o.n; }); // => 20 <br>_.sumBy(objects, "n") // => 20',
          remark: '可以接受属性简写'
        },
        {
          name: "_.padStart([string=''], [length=0], [chars=' '])",
          introduction: '如果string字符串长度小于 length 则在左侧填充字符。 如果超出length长度则截断超出的部分。',
          example: "_.padStart('123', 6, '0');",
          result: '000123',
          remark: "_.padEnd()从右边开始；ES2017 引入了字符串补全长度的功能，'abc'.padStart(10, '0123456789')// '0123456abc'"
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
