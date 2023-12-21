<template>
  <div
    class="full-width full-height"
  >
    <q-infinite-scroll
      v-if="mostrar"
      style="padding: 0px !important;margin:0px !important"
      @load="onLoad"
      :offset="1"
    >
      <q-card
        class="shadow-3 box-shadow-card-listados q-mt-md padding-card"
        v-for="(item, index) in filterData"
        :key="index"
        style="border-radius:15px"
      >
        <q-card-section style="padding: 0 !important;margin:0px !important">
          <q-item style="padding: 0 !important;margin:0px !important">
            <q-item-section>
              <q-item-label
                class="text-bold text-primary titles-font"
                style="font-size:15px"
                >Factura #{{ item.nro_factura }}</q-item-label
              >
              <q-item-label class="text-primary my-font-regular" lines="2"
                >Fecha de emisión: {{ formatDate(item.fecha_creado) }}
              </q-item-label>
              <q-item-label class="text-primary my-font-regular"
                >Total (USD): ${{ item.total_usd }}
              </q-item-label>
              <div
                class="text-primary my-font-semibold row q-mt-sm items-center"
                style="font-size:14px"
              >
                <div
                  style="width:10px;height:10px;border-radius:100%"
                  class="q-mr-sm"
                  :style="{
                    'background-color': colorCircleF(item.estado_pago)
                  }"
                ></div>
                {{ labelStatus(item.estado_pago) }}
              </div>
            </q-item-section>
          </q-item>
          <q-separator class="q-ma-xs" inset />
        </q-card-section>
        <div class="row justify-end titles-font q-pb-xs q-gutter-x-xs">
          <q-btn
            label="descargar factura"
            color="primary"
            style="letter-spacing:-1px;"
            flat
            dense
            rounded
            @click="dfile(item)"
          />
          <q-btn
            :label="
              item.estado_pago === 'Pendiente' ? 'reportar pago' : 'ver factura'
            "
            color="primary"
            style="letter-spacing:-1px;"
            flat
            dense
            rounded
            :to="'/reportar_pago/form/' + item.id_factura"
          />
        </div>
      </q-card>
      <!--
              No mostrar el loading cuando se llegue al final de la lista
            -->
      <template v-slot:loading>
        <div v-if="isLastPage != true" class="row justify-center q-my-md">
          <q-spinner-dots color="primary" size="40px" />
        </div>
      </template>
    </q-infinite-scroll>
    <!-- <no-data
      v-if="nodataF"
      :modulo="nodataForm.modulo"
      :icon="nodataForm.icon"
      :caption="nodataForm.caption"
      :style="{
        position: 'absolute',
        top: '50%',
        left: '50%',
        zIndex: '1000'
      }"
    /> -->
  </div>
</template>

<script>
import { date } from 'quasar'
const formattedString = date.formatDate(Date.now(), 'YYYY-MM-DD')

import { mapGetters } from 'vuex'
import env from 'src/env'

import moment from 'moment'

export default {
  data () {
    return {
      range: {
        fecha_inicio: '',
        fecha_final: ''
      },
      toggle: 'pen',
      route: null,
      text: '',
      data2: [],
      data: [],
      busqueda: false,
      urlApi: env.apiUrl,
      page: 1,
      totalPages: null,
      isLastPage: false,
      isFirstLoad: true,
      resultsPerPage: 5,
      mostrar: true,
      isLoading: false
    }
  },
  watch: {
    filterData (val) {
      if (val.length === 0) {
        this.$emit('changeIsNoData', true)
      } else {
        this.$emit('changeIsNoData', false)
      }
    }
  },
  computed: {
    filterData () {
      if (this.text === '') {
        return this.data
      } else {
        return this.data.filter(
          v => v.ware_house.toLowerCase().indexOf(this.text.toLowerCase()) > -1
        )
      }
    },
    nodataForm () {
      if (this.busqueda) {
        return {
          caption: 'No se encontraron resultados.',
          modulo: 'facturasHis',
          icon: 'nodata.svg'
        }
      } else if (this.toggle === 'his') {
        return {
          caption: 'No hay facturas generadas.',
          modulo: 'facturasHis',
          icon: 'iconos/factura.svg'
        }
      } else {
        return {
          caption: 'No hay facturas pendientes.',
          modulo: 'facturasPen',
          icon: 'iconos/factura.svg'
        }
      }
    },
    nodataF () {
      if (this.data) {
        if (this.data.length > 0) {
          return false
        } else {
          return true
        }
      } else {
        return true
      }
    }
  },
  mounted () {
    this.range.fecha_inicio = formattedString
    this.range.fecha_final = formattedString

    if (this.$route.query.all) {
      this.toggle = 'pen'
    }
  },
  methods: {
    ...mapGetters('generals', ['UserInfo']),
    async onLoad (index, done) {
      try {
        setTimeout(async () => {
          this.isLoading = true
          let res
          const userInfo = this.UserInfo()
          const route = this.route
            ? this.route
            : `shipments?usuario_id=${userInfo.user.usuario_id}&limit=${this.resultsPerPage}&page=${this.page}&ascending=0&orderBy=facturas.fecha_creado`

          // isFirstLoad para que cargue la primera vez
          if (this.isFirstLoad || this.totalPages === null) {
            this.isFirstLoad = false

            res = await this.$api.get(route, {
              usuario_id: userInfo.user.usuario_id
            })
            if (res.pagination.totalResult !== undefined) {
              this.totalPages = Math.ceil(
                res.pagination.totalResult / this.resultsPerPage
              ) // Cálculo del total de páginas
            }
          }

          if (this.page > this.totalPages) {
            this.isLastPage = true // No hay más páginas para cargar
            done()
            return
          }

          res = await this.$api.get(route, {
            usuario_id: userInfo.user.usuario_id
          })
          if (res.results.length > 0) {
            this.data.push(...res.results)
            this.afterGetRecord()
            // this.validateNoDataC(this.data)
          }

          this.page++

          // Verificar si ya no quedan más páginas para cargar
          if (this.page > this.totalPages) {
            this.isLastPage = true
          }

          done()
        }, 500)
      } catch (error) {
        console.log(error)
      } finally {
        this.isLoading = false
      }
    },
    async filterRange () {
      const date1 = date.formatDate(this.range.fecha_inicio, 'YYYY-MM-DD')
      const date2 = date.formatDate(this.range.fecha_final, 'YYYY-MM-DD')
      console.log(date1, 'date 1', date2, 'date 2')
      this.$q.loading.show()
      const userInfo = this.UserInfo()
      await this.$api
        .get(
          `shipments?usuario_id=${userInfo.user.usuario_id}&fecha_inicio=${date1}&fecha_final=${date2}&ascending=0&orderBy=facturas.fecha_creado`
        )
        .then(res => {
          this.$q.loading.hide()
          this.busqueda = true
          console.log(res, 'res filter')
          this.data = res.results
          this.afterGetRecord()
          console.log(res, 'res filter')
        })
    },
    async onToggleInput () {
      const userInfo = this.UserInfo()

      this.resetPagination()

      const route = `shipments?usuario_id=${userInfo.user.usuario_id}&limit=${this.resultsPerPage}&page=${this.page}&ascending=0&orderBy=facturas.fecha_creado`

      this.data = []

      if (this.toggle === 'his') {
        this.route = route
        // this.onLoad()
        this.busqueda = false
        // this.nodataForm()
      } else {
        this.route = route
        // this.onLoad()
      }
    },
    resetPagination () {
      this.page = 1
      this.totalPages = null
      this.isLastPage = false
      this.isFirstLoad = true
    },
    async dfile (item) {
      const userInfo = this.UserInfo()
      const url = `${this.urlApi}invoice/print?id_factura=${item.id_factura}&usuario_id=${userInfo.user.usuario_id}`
      window.open(url)
    },
    colorCircleF (status) {
      console.log(status, 'status')
      switch (status) {
        case 'Verificacion-Pago':
          return 'orange'
        case 'Pendiente':
          return 'orange'
        case 'Pagado':
          return '#00ea06'
        case 'Pago-Verificado':
          return '#00ea06'
        case 2:
          return '#00ea06'
      }
    },
    // para devolver el estado de pago sin los guiones
    labelStatus (status) {
      switch (status) {
        case 'Verificacion-Pago':
          return 'Verificando Pago' // naranja
        case 'Pendiente':
          return status
        case 'Pagado':
          return status
        case 'Pago-Verificado':
          return 'Pago Verificado'
        case 2:
          return status
      }
    } /*
    beforeMounted () {
      const userInfo = this.UserInfo()
      this.route = `shipments?usuario_id=${userInfo.user.usuario_id}`
    }, */,
    formatDate (dateV) {
      const formatDate = moment(dateV).format('DD-MM-YYYY')
      return formatDate
    },
    afterGetRecord () {
      let uniqueInvoiceIds = {}

      if (this.toggle === 'his') {
        this.data = this.data.filter(v => {
          // Filtramos por estado_pago y que no haya sido procesado antes este id_factura
          if (
            v.estado_pago !== 'Pendiente' &&
            !uniqueInvoiceIds[v.id_factura]
          ) {
            uniqueInvoiceIds[v.id_factura] = true // Marcamos el id_factura como procesado
            return true
          }
          return false
        })
      } else {
        this.data = this.data.filter(v => {
          // Filtramos por estado_pago y que no haya sido procesado antes este id_factura
          if (
            v.estado_pago === 'Pendiente' &&
            !uniqueInvoiceIds[v.id_factura]
          ) {
            uniqueInvoiceIds[v.id_factura] = true // Marcamos el id_factura como procesado
            return true
          }
          return false
        })
      }
    }
  }
}
</script>

<style scoped lang="scss">
.radio-bordes-item-paqueteria {
  border-radius: 12px;
  border: 1px solid rgb(92, 92, 92);
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
  padding-left: 12px;
  padding-top: 11px;
  padding-right: 13px;
}

.select-border {
  border: 1px solid #aaaaaa;
  border-radius: 10px;
  padding: 2px;
  padding-left: 5px;
  padding-right: 5px;
}
</style>
