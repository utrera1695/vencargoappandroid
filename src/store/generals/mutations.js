import Vue from 'vue'

export function loginStart (state) {
  state.loggingIn = true
}
export function loginStop (state, errorMessage) {
  state.loggingIn = false
  state.loginError = errorMessage
}

export function updateAccessToken (state, CUR_SESSION_INFO) {
  if (CUR_SESSION_INFO) {
    state.CUR_SESSION_INFO = CUR_SESSION_INFO
    // state.userFullName = CUR_SESSION_INFO.name + ' ' + CUR_SESSION_INFO.lastName
  } else {
    state.CUR_SESSION_INFO = {}
  }
}
export function setCurrentModule (state, payload) {
  state.currentModel = payload.currentModel
  state.currentModule = payload.currentModule
}
export function googleBtnShow (state) {
  state.isContacts = true
}

export function googleBtnHide (state) {
  state.isContacts = false
}

export function tabInfoSales (state) {
  state.listCustomerInfo = true
}

export function tabInfoDependents (state) {
  state.listCustomerInfo = false
}

export function showAll (state) {
  state.customShowListable = 'Todos'
}

export function showNextMonth (state) {
  state.customShowListable = 'Mes Siguiente'
}

export function showCurrentMonth (state) {
  state.customShowListable = 'Mes Actual'
}
export function login (state, data) {
  localStorage.setItem('CUR_SESSION_INFO', JSON.stringify(data))
  state.CUR_SESSION_INFO = data
  state.user = data.user
  state.UserInfo = data.user
}
export function dataUser (state, data) {
  state.user = data
}
export function logout (state) {
  // Elimina las propiedades del estado de una manera que Vue puede detectar.
  Vue.delete(state, 'CUR_SESSION_INFO')
  Vue.delete(state, 'user')
  Vue.delete(state, 'UserInfo')

  // Elimina la información de sesión del almacenamiento local.
  localStorage.removeItem('CUR_SESSION_INFO')
}
