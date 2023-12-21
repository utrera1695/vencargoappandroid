<template>
  <q-layout view="lHh Lpr lFf" class="my-font">
    <q-header v-if="toolbar" class="bg-secondary">
      <q-toolbar class="row justify-center items-center" style="height:90%">

        <div class="column items-center">
          <q-img src="iconlogo2.svg" width="40px" height="40px" />
        </div>

        <div>
          <!-- <q-btn round dense flat color="white" icon="notifications">
            <q-badge color="red" text-color="white" floating>
              {{notificaciones}}
            </q-badge>
            <q-menu>
              <q-list style="min-width: 100px;width:300px">
                <q-item-label header>Notificaciones</q-item-label>
                <q-separator inset />
                <q-item clickable v-ripple class="q-ma-sm">
                  <q-item-section>
                    <q-item-label>Titulo</q-item-label>
                    <q-item-label caption>Descripcion</q-item-label>
                  </q-item-section>
                  <q-item-section side top>
                    <q-item-label caption>5 min ago</q-item-label>
                  </q-item-section>
                </q-item>
              </q-list>
            </q-menu>
          </q-btn>
          <q-btn icon="logout" color="primary" flat round @click="$router.push('/login')" style="position: absolute;right:5px;top:5px" />-->
          <q-img src="iconos/logout1.svg" style="position: absolute;right:10px;top:15px" width="20px" height="20px" @click="confirmLogout()" />
        </div>
      </q-toolbar>
    </q-header>

    <q-header v-if="toolbarRoute" class="bg-secondary">
      <q-toolbar>
        <q-btn icon="arrow_back" color="primary" flat round dense @click="$router.go(-1)" />
        <q-toolbar-title class="text-primary titles-font text-uppercase">
          {{titleRoute}}
        </q-toolbar-title>
        <q-btn v-if="addButtonT" icon="add" color="primary" flat round @click="$router.push($route.path + '/form')" size="14px" />
      </q-toolbar>
    </q-header>

    <q-footer v-if="showFooter" class="bg-white box-shadow-footer" style="height:55px">
      <q-btn
        icon="add"
        dense
        size="22px"
        color="secondary"
        round
        style="position:absolute;bottom:15px;z-index:1;left:43%"
        to="/prealertas/form"
      />
      <template class="full-width">
        <div class="q-ml-md row items-center justify-between q-mt-xs" style="width:100%;">
          <div class="col">
            <q-btn dense style="height:100%;" size="20px" color="secondary" flat round to="/index" >
              <div style="width:35px;height:35px" v-html="iconos.home">  </div>
            </q-btn>
          </div>
          <div class="col">
            <q-btn
              style="height:100%;"
              dense
              size="16px"
              color="secondary"
              flat
              round
              to="calculadora"
            >
              <div style="width:35px;height:35px" v-html="iconos.calculadora"></div>
              <!-- <q-badge rounded color="red" floating>1</q-badge> -->
              <!-- <q-menu style="width:300px;height:100%;min-width:300px;min-height:300px" transition-show="flip-right" transition-hide="flip-left"
                anchor="bottom left"
              >
                <q-list v-if="notifications.length > 0" separator class="m-font-regular" style="width:250px">
                  <q-item-label header class="text-left text-primary titles-font text-uppercase" >Mis Notificaciones</q-item-label>
                  <q-separator />
                  <q-item v-for="(item, index) in notifications" :key="index">
                    <q-item-section>
                      <q-item-label class="text-bold" lines="3" style="font-size: 13px">{{item.title ? item.title : ''}}</q-item-label>
                      <q-item-label lines="4" style="font-size: 13px">{{item.description}}</q-item-label>
                      <q-item-label caption>{{item.date}}</q-item-label>
                    </q-item-section>

                  </q-item>
                  <q-separator inset />
                </q-list>
                <div v-else class="q-pa-md my-font-regular">
                  No tiene notificaciones.
                </div>
              </q-menu> -->
            </q-btn>
          </div>
          <div class="col" style="height:100%;"></div>
          <div class="col">
            <q-btn
              dense
              style="height:100%;"
              size="20px"
              color="secondary"
              flat
              round
              to="contacto"
            >
              <div style="width:35px;height:35px" v-html="iconos.contacto">  </div>
            </q-btn>
          </div>
          <div class="col">
            <q-btn dense style="height:100%;" size="20px" color="secondary" flat round to="perfil" >
              <div style="width:35px;height:35px" v-html="iconos.person">  </div>
            </q-btn>
          </div>
        </div>
      </template>
    </q-footer>

    <q-dialog v-model="alert" class="window-width" >
      <q-card class="my-font-regular window-width">
        <q-card-section>
          <div class="text-h6 text-bold text-uppercase my-font-extra-bold">¡Confirmación!</div>
        </q-card-section>

        <q-card-section class="q-pt-none color-siete" style="font-size:16px">
          ¿Desea cerrar su sesión?
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cancelar" color="primary" v-close-popup />
          <q-btn flat label="OK" color="primary" v-close-popup @click="mLogout()" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-page-container style="margin-top:0px !important;padding-top:40px !important">
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
// const colorPrimary = '#232784'
const colorSecondary = '#f0aa00'
import { mapMutations } from 'vuex'
export default {
  name: 'MainLayout',
  data () {
    return {
      alert: false,
      notifications: [],
      leftDrawerOpen: false,
      notificaciones: 1,
      user: {
        name: ''
      },
      text: '',
      iconos: {
        home: `<svg id="Layer_1" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><defs><style>.cls-1{fill:none;stroke:${colorSecondary};stroke-miterlimit:10;stroke-width:1.83px;}</style></defs><title>home, house, building, real estate, property</title><polyline class="cls-1" points="1 12 12 2.83 23 12"/><polyline class="cls-1" points="19.33 9.25 19.33 21.17 14.75 21.17 14.75 13.83 9.25 13.83 9.25 21.17 4.67 21.17 4.67 9.25"/></svg>`,
        calculadora: `
        <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
          width="35px" height="35px" viewBox="0 0 512 512" enable-background="new 0 0 512 512" xml:space="preserve">
        <g>
          <path fill="${colorSecondary}" d="M386.273,299.229V10.5H11.5v432.137h288.729V500H501V299.229H386.273z M386.273,327.91h28.682v28.682
            h-28.682V327.91z M357.592,39.182v86.045H40.182V39.182H357.592z M40.182,413.955V153.908h317.41v145.32H328.91V184.502
            c-50.396,0-198.71,0-258.135,0v200.771h229.453v28.682H40.182z M300.229,356.592h-28.682c0-40.711,0-79.72,0-143.408h28.682
            V356.592z M99.457,327.91h143.408v28.682H99.457V327.91z M214.184,270.547h28.682v28.682h-28.682V270.547z M185.502,299.229H156.82
            v-28.682h28.682V299.229z M214.184,241.865v-28.682h28.682v28.682H214.184z M185.502,241.865H156.82v-28.682h28.682V241.865z
            M128.139,241.865H99.457v-28.682h28.682V241.865z M128.139,270.547v28.682H99.457v-28.682H128.139z M472.318,471.318H328.91
            V327.91h28.682v57.363h86.045V327.91h28.682V471.318z"/>
          <path fill="${colorSecondary}" d="M300.229,67.863h28.682v28.682h-28.682V67.863z"/>
          <path fill="${colorSecondary}" d="M242.865,67.863h28.682v28.682h-28.682V67.863z"/>
          <path fill="${colorSecondary}" d="M185.502,67.863h28.682v28.682h-28.682V67.863z"/>
        </g>
        </svg>

        `,
        factura: `
          <?xml version="1.0" encoding="utf-8"?>
          <!-- Generator: Adobe Illustrator 16.0.0, SVG Export Plug-In . SVG Version: 6.00 Build 0)  -->
          <!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.0//EN" "http://www.w3.org/TR/2001/REC-SVG-20010904/DTD/svg10.dtd">
          <svg version="1.0" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
          width="38px" height="38px" viewBox="0 0 100 100" enable-background="new 0 0 100 100" xml:space="preserve" fill="${colorSecondary}">
          <path d="M66.667,43.333H60c-1.843,0-3.333-1.491-3.333-3.333H56.66h0.007c0-1.842,1.49-3.333,3.333-3.333v-0.003v0.003h6.667
          C68.509,36.667,70,38.158,70,40h6.667c0-5.521-4.479-10-10-10v-6.667H60V30l0,0c-5.521,0-10,4.479-10,10l0,0c0,5.521,4.479,10,10,10
          h6.667C68.509,50,70,51.49,70,53.333h-0.007c0,1.843-1.49,3.334-3.333,3.334H60c-1.843,0-3.333-1.491-3.333-3.334H50
          c0,5.521,4.479,10,10,10V70h6.667v-6.667c5.521-0.006,9.993-4.479,9.993-10h0.007C76.667,47.813,72.188,43.333,66.667,43.333z"/>
          <path d="M16.667,10v26.667H10v6.667h6.667V90L35,83.333L53.333,90l18.334-6.667L90,90V10H16.667z M83.333,80.481L71.667,76.24
          l-18.334,6.667L35,76.24l-11.667,4.241V43.333H35.29l-5.286,5.286l4.713,4.713l10.977-10.976c1.295-1.296,1.295-3.418,0-4.714
          L34.717,26.667l-4.713,4.714l5.286,5.286H23.333v-20h60V80.481z"/>
          </svg>
        `,
        person: `<svg id="Layer_1" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><defs><style>.cls-1{fill:none;stroke:${colorSecondary};stroke-miterlimit:10;stroke-width:1.91px;}</style></defs><title>user, person, profile, account, contact</title><circle class="cls-1" cx="12" cy="7.25" r="5.73"/><path class="cls-1" d="M1.5,23.48l.37-2.05A10.3,10.3,0,0,1,12,13h0a10.3,10.3,0,0,1,10.13,8.45l.37,2.05"/></svg>`,
        contacto: `
        <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
      width="35px" height="35px" viewBox="0 0 512 512" enable-background="new 0 0 512 512" xml:space="preserve">
    <g>
      <path fill="${colorSecondary}" d="M476.56,246.666v-20.356C476.56,104.274,377.799,5.5,255.75,5.5c-122.035,0-220.808,98.759-220.808,220.808
        v20.357C17.502,255.42,5.5,273.464,5.5,294.27v70.167c0,29.356,23.883,53.24,53.24,53.24h64.525V241.029H64.382
        c0.375-9.373-1.692-30.019,5.153-58.882h60.902l3.856-8.827c21.103-48.293,68.777-79.497,121.458-79.497
        c52.68,0,100.354,31.204,121.457,79.497l3.857,8.827h60.901c3.362,14.181,5.151,28.966,5.151,44.161v14.721h-58.882v176.647h44.163
        v29.439h-76.136c-6.077-17.131-22.438-29.439-41.629-29.439c-24.351,0-44.161,19.811-44.161,44.161S290.283,506,314.634,506
        c19.19,0,35.552-12.308,41.629-29.44h105.575v-59.673C486.884,412.563,506,390.698,506,364.438V294.27
        C506,273.464,493.997,255.42,476.56,246.666L476.56,246.666z M314.632,476.56c-8.116,0-14.722-6.604-14.722-14.722
        s6.605-14.722,14.722-14.722c8.118,0,14.721,6.604,14.721,14.722S322.75,476.56,314.632,476.56z M93.824,388.235H58.74
        c-13.124,0-23.798-10.676-23.798-23.799V294.27c0-13.125,10.674-23.799,23.798-23.799h35.084V388.235z M400.009,152.706
        c-27.544-53.963-83.146-88.324-144.259-88.324c-61.113,0-116.714,34.359-144.257,88.324H79.11
        c28.898-69.091,97.188-117.764,176.64-117.764c79.452,0,147.742,48.673,176.639,117.765L400.009,152.706L400.009,152.706z
        M476.56,364.438c0,13.123-10.676,23.799-23.799,23.799h-35.085V270.471h35.085c13.123,0,23.799,10.676,23.799,23.799V364.438z"/>
      <path fill="${colorSecondary}" d="M358.795,373.515V241.029H152.706v132.484h64.326l38.718,34.416l38.718-34.415H358.795z M255.75,368.54
        l-27.525-24.467h-46.078v-73.603h147.205v73.603h-46.078L255.75,368.54z"/>
    </g>
    </svg>


        `

      }
    }
  },
  computed: {
    showFooter () {
      return this.$route.meta.footer
    },
    toolbar () {
      return this.$route.meta.toolbar
    },
    toolbarRoute () {
      return this.$route.meta.toolbarRoute
    },
    titleRoute () {
      return this.$route.meta.title
    },
    goRoute () {
      return this.$route.meta.backroute
    },
    addButtonT () {
      return this.$route.meta.addButton
    }
  },
  mounted () {
    this.getNotifications()
  },
  methods: {
    ...mapMutations('generals', ['logout']),
    mLogout () {
      this.logout()
      this.$router.push('/login')
    },
    async confirmLogout () {
      /* this.$q.dialog({
        title: '¡Confirmación!',
        message: '¿Desea cerrar su sesión?',
        cancel: true,
        persistent: true,
        ok: 'Si',
        class: 'my-font-regular'
      }).onOk(() => {
        this.mLogout()
      }).onCancel(() => {
        // console.log('>>>> Cancel')
      }).onDismiss(() => {
        // console.log('I am triggered on both OK and Cancel')
      }) */
      this.alert = true
    },
    async getNotifications () {
      const res = await this.$api.get('notifications')
      if (res.success) {
        this.notifications = res.data
      }
      // this.notifications = [1, 2, 3, 4]
    }
  }
}
</script>

<style lang="scss">
.footer {
  position: absolute;
  left: 0;
  bottom: 0;
  width: 100%;
  height: 60px;
  background-color: $primary;
  text-align: center;
}
</style>
