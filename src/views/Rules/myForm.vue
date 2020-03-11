<template>
  <div>
    <el-form ref="mainForm" :model="form" :rules="rules" label-position="right" label-width="130px">
      <el-row>
        <el-col :span="12">
          <el-form-item prop="title" label="质检主题">
            <el-input v-model.trim="form.title" class="inputWidth"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row v-for="(item1, index1) in form.list" :key="item1.key" class="form-area">
        <el-row>
          <el-col :span="8">
            <el-form-item
              label="质检项目类型"
              :prop="'list.' + index1 + '.name'"
              :rules="rules1.name"
            >
              <el-input v-model="item1.name" class="inputWidth"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item
              label="总分值"
              :prop="'list.' + index1 + '.score'"
              :rules="rules1.score"
            >
              <el-input v-model.number="item1.score" class="inputWidth"></el-input>
            </el-form-item>
          </el-col>
          <el-button
            type="primary"
            plain
            @click.prevent="add1()"
            v-if="index1 === 0"
            class="fr"
            style="margin-left: 20px"
          >新增质检项目类型</el-button>
          <el-button
            type="danger"
            plain
            @click.prevent="remove1(item1)"
            v-if="index1 > 0"
            class="fr"
          >删除质检项目类型</el-button>
        </el-row>
        <section
          v-for="(item2, index2) in item1.list"
          :key="item2.key"
          style="padding:10px; background-color: #F2F2F2; margin-bottom: 10px"
        >
          <el-row>
            <el-col :span="8">
              <el-form-item
                :label="'二级质检类型'+(index2+1)"
                :prop="'list.' + index1 + '.list.' + index2 + '.name'"
                :rules="rules2.name"
              >
                <el-input v-model="item2.name" class="inputWidth"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="16">
              <el-form-item
                label="大项分值"
                :prop="'list.' + index1 + '.list.' + index2 + '.score'"
                :rules="rules2.score(index1)"
              >
                <el-input v-model.number="item2.score" class="inputWidth"></el-input>
                <el-button
                  type="primary"
                  plain
                  @click.prevent="add2(index1, item2)"
                  class="fr"
                  style="margin-left: 20px"
                  v-if="index2 === 0"
                >新增二级质检项目类型</el-button>
                <el-button
                  type="danger"
                  plain
                  @click.prevent="remove2(index1, item2)"
                  style="margin-left: 20px"
                  v-if="index2 > 0"
                  class="fr"
                >删除二级质检项目类型</el-button>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="16">
              <el-form-item
                label="内容/定义"
                :prop="'list.' + index1 + '.list.' + index2 + '.content'"
                :rules="rules2.content"
              >
                <el-input v-model="item2.content"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </section>
      </el-row>
    </el-form>
    <div>
      <el-button @click="doAdd">验证规则</el-button>
    </div>
  </div>
</template>

<script>
import _ from 'lodash'

export default {
  components: {},
  data () {
    return {
      form: {
        title: '',
        list: [
          {
            key: Date.now(),
            name: '',
            score: '',
            list: [
              {
                name: '',
                score: '',
                content: '',
                list: [
                  {
                    content: '',
                    score: ''
                  }
                ]
              }
            ]
          }
        ]
      }
    }
  },
  computed: {
    rules () {
      return {
        title: [
          { required: true, message: '请输入主题名称', trigger: 'blur' }
        ]
      }
    },
    rules1 () {
      return {
        name: [{ required: true, message: '请输入质检项目类型', trigger: 'blur' }],
        score: [{ required: true, message: '请输入总分值', trigger: 'blur' }]
      }
    },
    rules2 () {
      return {
        name: [{ required: true, message: '请输入二级质检项目类型', trigger: 'blur' }],
        score: (index1) => {
          const index = index1
          return [
            {
              validator: (rule, form, callback, source, options) => {
                return this.validateProjectTotal(rule, form, callback, source, options, index)
              },
              trigger: 'blur'
            },
            { required: true, message: '请输入大项分值', trigger: 'blur' }
          ]
        }
      }
    }
  },
  methods: {
    add1 (item1) {
      this.form.list.push({
        key: Date.now(),
        name: '',
        score: '',
        list: [
          {
            name: '',
            score: '',
            content: '',
            list: [
              {
                content: '',
                score: ''
              }
            ]
          }
        ]
      })
    },
    remove1 (item1) {
      const index = this.form.list.indexOf(item1)
      if (index !== -1) {
        this.form.list.splice(index, 1)
      }
    },
    // https://github.com/yiminghe/async-validator
    validateProjectTotal (rule, form, callback, source, options, index1) {
      const arr = this.form.list[index1].list.map(v => v.score)
      const sum = _.sum(arr)
      if (this.form.list[index1].score === sum) {
        callback()
      } else {
        callback(new Error('总分值应该等于大项分值之和'))
      }
    },
    add2 (index1, item2) {
      this.form.list[index1].list.push({
        key: Date.now(),
        name: '',
        score: '',
        content: '',
        list: [
          {
            content: '',
            score: ''
          }
        ]
      })
    },
    remove2 (index1, item2) {
      const index = this.form.list[index1].list.indexOf(item2)
      if (index !== -1) {
        this.form.list[index1].list.splice(index, 1)
      }
    },

    doAdd () {
      this.$refs.mainForm.validate(valid => {
        if (valid) {
          alert(JSON.stringify(this.form))
        }
      })
    },

    initForm () {
      this.$refs.mainForm.resetFields()
      this.form = {
        title: '',
        list: [
          {
            key: Date.now(),
            name: '',
            score: '',
            list: [
              {
                name: '',
                score: '',
                content: '',
                list: [
                  {
                    content: '',
                    score: ''
                  }
                ]
              }
            ]
          }
        ]
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.form-area {
  padding: 10px;
  margin-bottom: 10px;
  border: 1px solid #ebebeb;
}
.inputWidth {
  width: 200px;
}
</style>
