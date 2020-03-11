<template>
  <div>
    <el-button
      @click="dialogFormVisible = true"
      class="add-btn"
    >新增人员</el-button>
    <el-table
    :data="peopleList"
    border
    style="width: 100%">
      <template v-for="(item, index) in keys">
        <el-table-column v-if="item.key === 'action'" :label="item.label" :key="index">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="danger"
              @click="handleDelete(scope.$index, scope.row)"
              class="spanStyle"
            >删除</el-button>
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
        ></el-table-column>
      </template>
    </el-table>
    <el-dialog title="人员" :visible.sync="dialogFormVisible">
      <el-form :model="form">
        <el-form-item label="姓名" :label-width="formLabelWidth">
          <el-input v-model="form.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="年龄" :label-width="formLabelWidth">
          <el-input v-model="form.age" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirm">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import _ from 'lodash'
import { mapState, mapGetters, mapMutations, mapActions } from 'vuex'
export default {
  name: 'Vue_module2',
  data () {
    return {
      dialogFormVisible: false,
      formLabelWidth: '120px',
      form: {
        name: '',
        age: ''
      }
    }
  },
  computed: {
    ...mapState('module2', {
      peopleList: 'peopleList'
    }),
    ...mapGetters('module2', {
      peopleName: 'peopleName'
    }),
    keys () {
      return [
        {
          key: 'name',
          label: '姓名'
        },
        {
          key: 'age',
          label: '年龄'
        },
        {
          key: 'id',
          label: '唯一表示符'
        },
        {
          key: 'action',
          label: '操作'
        }
      ]
    }
  },
  methods: {
    ...mapMutations('module2', {
      deletePeople: 'DELETE_PEOPLE'
    }),
    ...mapActions('module2', {
      addPeople: 'addPeople'
    }),
    handleDelete (index, row) {
      this.deletePeople(row)
    },
    confirm () {
      setTimeout(() => {
        this.addPeople(_.merge({
          id: Date.now()
        }, this.form))
        this.dialogFormVisible = false
      }, 1000)
    }
  }
}
</script>

<style lang="scss" scoped>
.add-btn {
  margin-bottom: 20px;
}
</style>
