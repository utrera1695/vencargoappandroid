import axios from 'axios'
import env from '../env'
import { Notify, Loading } from 'quasar'
// import router from '../router/index'

const axiosInstance = axios.create({
  baseURL: env.apiUrl// url base cargada de archivo env.js
})

export default async ({ store, Vue, router }) => {
  Vue.prototype.$axios = axios
  Vue.prototype.$api = axiosInstance

  axiosInstance.interceptors.response.use(function (response) {
    // console.log('axiosResponse', response)
    // Todo bien con la respuesta
    if (response.config.method === 'post') {
      if (response.status === 201) {
        if (response.data.api_token === undefined) { // Si no es login
          Notify.create({
            color: 'green-4',
            textColor: 'white',
            icon: 'done',
            message: 'El registro fue exitoso!'
          })
        } else { // Es Login
          localStorage.setItem('CUR_SESSION_INFO', JSON.stringify(response.data))
        }
      }
    }
    console.log(response, 'response')
    if (response.data.error) {
      if (response.data.code === 400) {
        Notify.create({
          message: 'Su sesión expiró',
          color: 'negative',
          class: 'my-font-regular',
          actions: [
            { label: 'Iniciar sesion', color: 'white', handler: () => { router.push('/login') } }
          ]
        })
      }
      /* if (response.data.code === 400) {
        Notify.create({
          message: response.data.message,
          color: 'negative'
          /* actions: [
            { label: 'Iniciar Sesion', color: 'white', handler: () => { router.push('/login') } }
          ]
        })
      }
      if (response.data.code === 200) {
        Notify.create({
          message: response.data.message,
          color: 'positive'
        })
      }
      Notify.create({
        message: 'error code: ' + response.data.code + ' ' + response.data.message,
        icon: 'error',
        color: 'negative'
      }) */
    }
    return response.data
  }, function (error) {
    // Error en la respuesta
    console.log('debug', error.response)
    Loading.hide()
    if (error.response === undefined) { // Si no hubo comunicación con el servidor
      console.log('no hay conexion con el servidor', error)
      Notify.create({
        color: 'red-5',
        textColor: 'white',
        icon: 'fas fa-exclamation-triangle',
        message: 'No se pudo establecer conexión con el servidor. Revisa tu conexión a internet. ' + error
      })
    } else {
      if (error.response.status === 401) {
        console.log(error.response, 'error 401')
        Notify.create({
          message: error.response.data.message ? error.response.data.message : 'Correo o contraseña incorrectos',
          color: 'warning'
        })
        console.log('error.response.data AAAAAAAAAAAAA', error.response.data)
        localStorage.removeItem('CUR_SESSION_INFO')
      } else if (error.response.status === 403) {
        Notify.create({
          message: error.response.data.message,
          color: 'red'
        })
        // localStorage.removeItem('CUR_SESSION_INFO')
      } else if (error.response.status === 404) {
        Notify.create({
          message: 'Ruta no encontrada - 404',
          color: 'black'
        })
      } else if (error.response.status === 422) {
        console.log('error.response.data', error.response.data)
        Notify.create({
          message: error.response.data.message,
          color: 'red',
          position: 'bottom'
        })
      } else if (error.response.status === 500) {
        Notify.create({
          message: 'Error de conexión con el servidor',
          color: 'red',
          position: 'bottom'
        })
      }
      var data = error.response.data
      // console.log('error.response.data.error', data)
      if (data) {
        if (data.statusCode === 403) {
          Notify.create({
            color: 'red-5',
            textColor: 'white',
            icon: 'fas fa-exclamation-triangle',
            message: data.message
          })
        }
        if (data.statusCode === 500) {
          Notify.create({
            color: 'red-5',
            textColor: 'white',
            icon: 'fas fa-exclamation-triangle',
            message: 'Error interno en servidor' + data.message
          })
          // return Promise.reject(data.response.data.error)
        }
        // Añadir mas mensajes segun codigos de error especificos y mostrar las notificaciones correspondientes

        // Notify.create(error.response.data.error.message)
        // console.log(error.response.status);
        // console.log(error.response.headers);
      } else if (error.request) {
        // The request was made but no response was received
        // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
        // http.ClientRequest in node.js
        // console.log(error.request)
      } else {
        // Something happened in setting up the request that triggered an Error
        // console.log('Error', error.message)
      }
      // console.log(error.config)
    }

    // return Promise.reject(data)
  })

  axiosInstance.interceptors.request.use(async function (config) {
    // Antes de enviar cada petición se añade el token si existe

    store.dispatch('generals/fetchAccessToken')
    const token = (store.state.generals.CUR_SESSION_INFO !== null) ? store.state.generals.CUR_SESSION_INFO.access_token : false
    if (token) {
      if (!config.headers) { config.headers = {} }
      config.headers = {
        Authorization: 'Bearer ' + token
      }
    }
    return config
  }, function (error) {
    // Do something with request error
    return Promise.reject(error)
  })
}

export { axiosInstance }
