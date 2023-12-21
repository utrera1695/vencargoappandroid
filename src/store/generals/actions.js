export function fetchAccessToken ({ commit }) {
  commit('updateAccessToken', JSON.parse(localStorage.getItem('CUR_SESSION_INFO')))
}
export function logout ({ commit }) {
  localStorage.removeItem('CUR_SESSION_INFO')
  commit('logout')
}
export async function saveUser ({ commit }) {
  await this._vm.$api.get('userInfoWithRole').then(v => {
    if (v) {
      commit('dataUser', v[0])
    }
  })
}
