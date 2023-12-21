<template>
  <div id="q-app">
    <router-view />
  </div>
</template>
<script>
import { uid } from 'quasar'

export default {
  name: 'App',
  mounted () {
    var vm = this
    document.addEventListener('backbutton', function (e) {
      // alert(`se presiono el boton atras prueba 2 ${vm.$route.path}`)
      e.preventDefault()
      if (vm.$route.path === '/index' || vm.$route.path === '/login') {
        // alert('index o login')
        navigator.app.exitApp()
      } else {
        // alert('me voy para atras en la app')
        // navigator.app.backHistory()
        // vm.$router.go(-1)
        this.$q.loading.hide()
      }
      /* if (this.$route.path === '/login') {
        alert('es login')
        navigator.app.backHistory()
      } else {
        alert('no es login')
        e.preventDefault()
        navigator.app.exitApp()
      } */
    }, false)
    this.comprobarToken()

    if (this.$q.platform.is.mobile) {
      /* this.fbPlug()
      this.getDeviceToken() */
      this.onesignalSetup()
    }
  },
  computed: {
    verifyUidDispositive () {
      const dispositiveUid = localStorage.getItem('dispositiveUid')
      return dispositiveUid
    }
  },
  methods: {
    generateDispositiveUid () {
      const dispositiveUid = uid()
      localStorage.setItem('dispositiveUid', dispositiveUid)
      return dispositiveUid
    },
    // funcion para configurar onesignal
    onesignalSetup () {
      document.addEventListener('deviceready', OneSignalInit, false)
      function OneSignalInit () {
        window.plugins.OneSignal.setAppId('badde4cc-d96e-4417-85ef-e3d1fa312963')
        window.plugins.OneSignal.setNotificationOpenedHandler(function (
          jsonData
        ) {
          console.log('notificationOpenedCallback: ' + JSON.stringify(jsonData))
        })

        window.plugins.OneSignal.promptForPushNotificationsWithUserResponse(
          function (accepted) {
            console.log('User accepted notifications: ' + accepted)
          }
        )
      }

      const verify = this.verifyUidDispositive
      if (!verify) {
        const externalUserId = this.generateDispositiveUid()
        window.plugins.OneSignal.setExternalUserId(externalUserId);
      }
    },
    async comprobarToken () {
      const value = JSON.parse(this.$q.localStorage.getItem('CUR_SESSION_INFO'))
      if (value) {
        await this.$api.get('user').then(res => {
          if (res.status === 200 && res.user) {
            this.$router.push('index')
          } else {
            this.$router.push('login')
          }
        })
      } else {
        this.$router.push('login')
      }
    },
  }
}
</script>
