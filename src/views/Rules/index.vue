<template>
  <div class="rules-page">
    <el-tabs
       v-model="activeName"
       @tab-click="handleClick"
    >
      <el-tab-pane label="事例表格" name="eleForm">
        <eleForm></eleForm>
      </el-tab-pane>
      <el-tab-pane label="我的表格" name="myForm">
        <myForm></myForm>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import myForm from './myForm'
import eleForm from './eleForm'

export default {
  components: {
    myForm,
    eleForm
  },
  data () {
    return {
      activeName: 'myForm'
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
.rules-page {
  text-align: left;
}
.form-area {
  padding: 10px;
  margin-bottom: 10px;
  border: 1px solid #ebebeb;
}
.inputWidth {
  width: 200px;
}
</style>
