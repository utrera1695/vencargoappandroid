<template>
  <q-page>
    <q-infinite-scroll
      class="q-pa-sm"
      @load="onLoad"
      :offset="1"
    >
      <q-card
        class="radio-bordes-item-prelerta q-mt-md box-shadow-card-listados padding-card"
        v-for="(item, index) in data"
        :key="index"
        style="height:auto"
      >
        <q-card-section style="padding: 0 !important;margin:0px !important">
          <q-item dense style="padding: 0 !important;margin:0px !important">
            <q-item-section>
              <q-item-label class="text-bold text-primary titles-font" style="font-size:16px">Pre-alerta <label>#{{item.id}}</label></q-item-label>
              <q-item-label class="text-primary my-font-medium">Tracking: {{item.tracking}}</q-item-label>
              <q-item-label class="text-primary my-font-regular">Courier: <label> {{item.nombre}} </label> </q-item-label>
              <q-item-label
                class="text-primary my-font-regular"
              >Fecha de llegada: <label> {{formatDate(item.fecha_llegada)}} </label> </q-item-label>
              <div class="text-primary my-font-semibold row q-mt-sm items-center" style="font-size:14px" >
                <div style="width:10px;height:10px;border-radius:100%" class="q-mr-sm" :style="{ 'background-color': colorCircle(item.estado)}" ></div> {{item.estado === 'pendiente' ? 'Pendiente' : 'Recibido'}}
              </div>
            </q-item-section>
          </q-item>
        </q-card-section>
        <div class="row justify-end titles-font">
          <!-- <q-btn label="Editar" color="primary" flat dense rounded @click="$router.push('prealertas/form/' + item.id_solicitud)" /> -->
          <!-- <q-btn label="Eliminar" color="negative" flat dense rounded @click="confirmDelete(item.id_solicitud)" /> -->
        </div>
      </q-card>
      <!--
        No mostrar el loading cuando se llegue al final de la lista
      -->
      <template
        v-slot:loading
      >
        <div
          v-if="isLastPage != true"
          class="row justify-center q-my-md"
        >
          <q-spinner-dots color="primary" size="40px" />
        </div>
      </template>
    </q-infinite-scroll>
    <no-data v-if="nodataC" modulo="prealerta" icon="iconos/noti_acept.svg" caption="No tiene pre-alertas generadas." />
    <q-dialog v-model="alert" class="window-width" >
      <q-card class="my-font-regular window-width">
        <q-card-section>
          <div class="text-h6 text-bold text-uppercase my-font-extra-bold">¡Atención!</div>
        </q-card-section>

        <q-card-section class="q-pt-none color-siete" style="font-size:16px">
          ¿Esta seguro que quiere eliminar?
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cancelar" color="primary" v-close-popup />
          <q-btn flat label="OK" color="primary" v-close-popup @click="eliminar(id)" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import { mapGetters } from 'vuex'
// import { date } from 'quasar'

import moment from 'moment'

export default {
  data () {
    return {
      alert: false,
      id: null,
      nodataC: false,
      pagina: 1,
      search: '',
      data: [],
      page: 1,
      totalPages: null,
      isLastPage: false,
      isFirstLoad: true,
      resultsPerPage: 5
    }
  },
  mounted () {
    // this.getData()
  },
  methods: {
    ...mapGetters('generals', ['UserInfo']),
    async onLoad (index, done) {
      setTimeout(async () => {
        let res
        const userInfo = this.UserInfo()
        const route = `solicitudes?usuario_id=${userInfo.user.usuario_id}&query={"search":"","estado":"pendiente"}&limit=${this.resultsPerPage}&page=${this.page}&ascending=0&orderBy=solicitudes_envios.fecha_llegada`

        // isFirstLoad para que cargue la primera vez
        if (this.isFirstLoad || this.totalPages === null) {
          this.isFirstLoad = false

          res = await this.$api.get(route, {
            usuario_id: userInfo.user.usuario_id
          })
          if (res.pagination.totalResult !== undefined) {
            this.totalPages = Math.ceil(res.pagination.totalResult / this.resultsPerPage) // Cálculo del total de páginas
          }
        }

        if (this.page > this.totalPages) {
          this.isLastPage = true // No hay más páginas para cargar
          this.validateNoDataC(this.data)
          done()
          return
        }

        res = await this.$api.get(route, {
          usuario_id: userInfo.user.usuario_id
        })

        if (res.results.length > 0) {
          this.data.push(...res.results)
          this.validateNoDataC(this.data)
        }

        this.page++

        // Verificar si ya no quedan más páginas para cargar
        if (this.page > this.totalPages) {
          this.isLastPage = true
        }

        this.validateNoDataC(this.data)

        done()
      }, 500)
    },
    validateNoDataC (data) {
      if (data.length === 0) {
        this.nodataC = true
      } else {
        this.nodataC = false
      }
    },
    formatDate (dateF) {
      return moment(dateF).format('DD-MM-YYYY')
    },
    colorCircle (status) {
      switch (status) {
        case 'pendiente':
          return '#ffc600' // amarillo
        case 'recibido':
          return '#00ea06 ' // verde
        default:
          return '#ffc600' // azul
      }
    },
    onChangePage (ind, done) {
      console.log('cargando nuevas paginas')
      setTimeout(() => {
        this.data.push({})
      }, 2000)
    },
    async getData () {
      this.$q.loading.show()
      const userInfo = this.UserInfo()
      console.log(userInfo, 'userInfo')
      await this.$api.get(`solicitudes?usuario_id=${userInfo.user.usuario_id}&query={"search":"","estado":"pendiente"}`).then(res => {
        this.$q.loading.hide()
        if (!res.error) {
          this.data = res.results
          this.nodataC = this.data.length === 0
        }
      })
    },
    async confirmDelete (id) {
      this.id = id
      this.alert = true
    },
    async eliminar (id) {
      this.$q.loading.show()
      await this.$api.delete('prealerts/delete/' + id).then(res => {
        this.$q.loading.hide()
        if (!res.error) {
          console.log(res, 'res')
          this.$q.notify({
            message: res.message,
            color: 'positive'
          })
          this.getData()
        }
      })
    }
  }
}
</script>

<style scoped lang="scss">
.radio-bordes-item-prelerta {
  border-radius: 12px;
}

.status-design {
  border: 0px solid black;
  border-radius: 12px;
  background-color: $secondary;
  padding: 2px;
  text-align: center;
  color: $primary;
  font-size: 16px;
}

.padding-card {
  padding-left: 15px;
  padding-top: 11px;
  padding-right: 13px;
  padding-bottom: 11px;
}

</style>
