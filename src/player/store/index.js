import Vue from 'vue'
import Vuex from 'vuex'
import ipc from '../../feature/r_ipc';
const {
  ipcRenderer
} = window.require('electron')

Vue.use(Vuex)

const _store = new Vuex.Store({
  state: {
    last_tip: {
      tip: false,
      tip_msg: '',
      tip_type: 'info'
    },
    edit_doc: null,
    sele_doc: null,
    sele_count: 0,
    redo_count: 0,
    undo_count: 0,
    proj: null,
    winid: 1,
    copys: { device: '', protocol: '', panel: ''},
    check_result: null,
  },
  mutations: {
    setMsgInfo: function (state, msg) {
      state.last_tip.tip_msg = msg
      state.last_tip.tip_type = 'info'
      state.last_tip.tip = true
    },
    setUser: function (state, user) {
      state.user = user;
      state.lock = false;
    },
    setMsgSuccess: function (state, msg) {
      state.last_tip.tip_msg = msg
      state.last_tip.tip_type = 'success'
      state.last_tip.tip = true
    },
    setMsgError: function (state, msg) {
      state.last_tip.tip_msg = msg
      state.last_tip.tip_type = 'error'
      state.last_tip.tip = true
    },
    clearMsg: function (state) {
      state.last_tip.tip_msg = '$'
      state.last_tip.tip = false
    },
    setProj: function(state, proj) {
      if(proj && state.proj && proj.id===state.proj.id) {
        return;
      }
      state.proj = proj;
      ipc.bind_proj(state.winid, proj ? proj.id : null);
      state.edit_doc = null;
    },
    setWinId: function(state, id) {
      state.winid = id;
    },
    setEditDoc: function(state, info) {
      // console.log('open doc', info.doc.id);
      state.edit_doc = info;
    },
    setSeleDoc: function(state, info) {
      state.sele_doc = info;
    },
    setSeleCount: function(state, count) {
      state.sele_count = count;
    },
    setCopyObject: function(state, info) {
      if(!info.kind || !info.obj){
        return;
      }
      state.copys[info.kind] = JSON.stringify(info.obj);
    },
    setRedoUndo: function(state, info) {
      state.redo_count = info.redo_count;
      state.undo_count = info.undo_count;
    },
    clearEditor: function(state) {
      state.sele_count = 0;
      state.undo_count = 0;
      state.redo_count = 0;
    },
    deletedDoc: function(state, id) {
      if(state.edit_doc && state.edit_doc.doc.id === id) {
        state.edit_doc = null;
      }
    },
    setCheckResult: function(state, info) {
      state.check_result = info;
      // console.log('check result', info);
    }
  },
  actions: {},
  modules: {},
  getters: {
    check_result: state => {
      if(state.check_result && state.proj && state.check_result.proj_id === state.proj.id) {
        return state.check_result.results;
      }
      return null;
    },
  }
})

//更新执行机状态
ipcRenderer.on('check_result', (_, proj_id, results) => {
  _store.commit('setCheckResult', {proj_id: proj_id, results: results});
});

export default _store