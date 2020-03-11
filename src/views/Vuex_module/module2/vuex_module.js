import _ from 'lodash'

const ADD_PEOPLE = 'ADD_PEOPLE'
const DELETE_PEOPLE = 'DELETE_PEOPLE'

const state = {
  peopleList: [{
    name: '李军',
    age: 25,
    id: 0
  }]
}

const getters = {
  peopleName: state => {
    return state.peopleList.map(v => v.name)
  }
}

const mutations = {
  [ADD_PEOPLE] (state, obj) {
    state.peopleList = _.concat(state.peopleList, obj)
  },

  [DELETE_PEOPLE] (state, obj) {
    state.peopleList = _.filter(state.peopleList, item => item.id !== obj.id)
  }
}

const actions = {
  addPeople ({
    commit
  }, obj) {
    commit(ADD_PEOPLE, obj)
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
