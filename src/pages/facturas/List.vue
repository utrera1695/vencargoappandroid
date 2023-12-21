<template>
  <q-page class="q-pb-lg titles-font" style="padding: 0px !important;margin:0px !important">
    <div
      v-if="!$route.query.all"
      class="q-pt-md row justify-center"
    >
      <q-btn-toggle
        v-model="toggle"
        toggle-text-color="primary"
        text-color="secondary"
        toggle-color="secondary"
        :options="[{label: 'Pendientes', value: 'pen'},{label: 'Historial', value: 'his'}]"
        @input="onToggleInput()"
      />
    </div>
    <q-separator
      v-if="!$route.query.all"
      inset
      class="q-mt-md"
    />

    <q-tab-panels v-model="toggle" animated style="padding: 0px !important;margin:0px !important">
        <q-tab-panel
          name="his"
          style="padding: 10px;margin:0px !important;"
        >

          <!-- <div class="q-mt-xs row q-gutter-x-sm justify-center items-center my-font-regular" v-if="toggle === 'his'">
            <q-input
              v-model="range.fecha_inicio"
              mask="date"
              :rules="['date']"
              borderless
              dense
              label="DESDE"
              style="width:140px"
              readonly
              class="select-border"
            >
              <template v-slot:append>
                <q-icon name="event" class="cursor-pointer" color="primary">
                  <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
                    <q-date v-model="range.fecha_inicio">
                      <div class="row items-center justify-end">
                        <q-btn v-close-popup label="Cerrar" color="primary" flat/>
                      </div>
                    </q-date>
                  </q-popup-proxy>
                </q-icon>
              </template>
            </q-input>

            <q-input
              v-model="range.fecha_final"
              mask="date"
              :rules="['date']"
              borderless
              dense
              label="HASTA"
              style="width:140px"
              readonly
              class="select-border"
            >
              <template v-slot:append>
                <q-icon name="event" class="cursor-pointer" color="primary">
                  <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
                    <q-date v-model="range.fecha_final">
                      <div class="row items-center justify-end">
                        <q-btn v-close-popup label="Cerrar" color="primary" flat @click="filterRange()"/>
                      </div>
                    </q-date>
                  </q-popup-proxy>
                </q-icon>
              </template>
            </q-input>

            <q-icon
              name="refresh"
              size="20px"
              flat
              color="primary"
              clickable
              v-ripple
              @click="onToggleInput()"
            />
          </div> -->

          <!-- <div
            id="scroll-target-id"
            class="bg-green-4"
            style="height: calc(100vh - 150px) !important;"
          >
            <q-infinite-scroll
              style="padding: 0px !important;margin:0px !important"
              @load="onLoad"
              :offset="1"
              ref="infiniteScroll"
              class="q-pb-lg"
            >
              <q-card
                class="box-shadow-card-listados q-mt-md padding-card"
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
                      >Factura #{{item.nro_factura}}</q-item-label>
                      <q-item-label
                        class="text-primary my-font-regular"
                        lines="2"
                      >Fecha de emisión: {{ formatDate(item.fecha_creado) }} </q-item-label>
                      <q-item-label
                        class="text-primary my-font-regular"
                      >Total: ${{item.total_usd}} </q-item-label>
                      <div class="text-primary my-font-semibold row q-mt-sm items-center" style="font-size:14px" >
                        <div
                          style="width:10px;height:10px;border-radius:100%"
                          class="q-mr-sm"
                          :style="{ 'background-color': colorCircleF(item.estado_pago)}"
                        ></div> {{labelStatus(item.estado_pago)}}
                      </div>
                    </q-item-section>
                  </q-item>
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
                </div>
              </q-card>
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
          </div> -->
          <historial
            class="style-pendiente"
            @changeIsNoData="onChangeIsNoData"
          />
        </q-tab-panel>

        <q-tab-panel name="pen" style="padding: 10px !important;margin:0px !important">
          <pendientes
            class="style-pendiente"
            @changeIsNoData="onChangeIsNoData"
          />
        </q-tab-panel>
      </q-tab-panels>
      <no-data
        v-if="isNodata"
        :modulo="nodataForm.modulo"
        :icon="nodataForm.icon"
        :caption="nodataForm.caption"
      />
  </q-page>
</template>

<script>
import Pendientes from 'src/components/Facturacion/Pendientes.vue'
import Historial from 'src/components/Facturacion/Historial.vue'

// import { ListMixin } from '../../mixins/List'
import { date } from 'quasar'
const formattedString = date.formatDate(Date.now(), 'YYYY-MM-DD')

import { mapGetters } from 'vuex'
import env from 'src/env'

export default {
  // mixins: [ListMixin],
  components: {
    Pendientes,
    Historial
  },
  data () {
    return {
      /* nodataForm: {
        caption: 'No hay facturas generadas.',
        modulo: 'facturasHis',
        icon: 'iconos/factura.svg'
      }, */
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
      isLoading: false,
      isNodata: true
    }
  },
  computed: {
    filterData () {
      if (this.text === '') {
        return this.data
      } else {
        return this.data.filter(v => v.ware_house.toLowerCase().indexOf(this.text.toLowerCase()) > -1)
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
    onChangeIsNoData (val) {
      this.isNodata = val
    },
    async onLoad (index, done) {
      setTimeout(async () => {
        let res
        const userInfo = this.UserInfo()
        const route = this.route && this.page === 1 ? this.route : `shipments?usuario_id=${userInfo.user.usuario_id}&limit=${this.resultsPerPage}&page=${this.page}&ascending=0&orderBy=facturas.fecha_creado`
        console.log(route, 'route')
        // isFirstLoad para que cargue la primera vez
        if (this.isFirstLoad || this.totalPages === null) {
          this.isFirstLoad = false

          res = await this.$api.get(route, {
            usuario_id: userInfo.user.usuario_id,
          })
          if (res.pagination.totalResult !== undefined) {
            this.totalPages = Math.ceil(res.pagination.totalResult / this.resultsPerPage) // Cálculo del total de páginas
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
    },
    async filterRange () {
      const date1 = date.formatDate(this.range.fecha_inicio, 'YYYY-MM-DD')
      const date2 = date.formatDate(this.range.fecha_final, 'YYYY-MM-DD')
      this.$q.loading.show()
      const userInfo = this.UserInfo()
      await this.$api.get(`shipments?usuario_id=${userInfo.user.usuario_id}&fecha_inicio=${date1}&fecha_final=${date2}&ascending=0&orderBy=facturas.fecha_creado`).then(res => {
        this.$q.loading.hide()
        this.busqueda = true
        this.data = res.results
        this.afterGetRecord()
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
    async dfile(item) {
      const userInfo = this.UserInfo()
      const url = `${this.urlApi}invoice/print?id_factura=${item.id_factura}&usuario_id=${userInfo.user.usuario_id}`
      window.open(url)
    },
    colorCircleF (status) {
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
    },/*
    beforeMounted () {
      const userInfo = this.UserInfo()
      this.route = `shipments?usuario_id=${userInfo.user.usuario_id}`
    }, */
    formatDate (dateV) {
      const formatDate = date.formatDate(dateV, 'DD-MM-YYYY')
      return formatDate
    },
    afterGetRecord () {
      let uniqueInvoiceIds = {};

      if (this.toggle === 'his') {
        this.data = this.data.filter(v => {
          // Filtramos por estado_pago y que no haya sido procesado antes este id_factura
          if (v.estado_pago !== 'Pendiente' && !uniqueInvoiceIds[v.id_factura]) {
            uniqueInvoiceIds[v.id_factura] = true;  // Marcamos el id_factura como procesado
            return true;
          }
          return false;
        });
      } else {
        this.data = this.data.filter(v => {
          // Filtramos por estado_pago y que no haya sido procesado antes este id_factura
          if (v.estado_pago === 'Pendiente' && !uniqueInvoiceIds[v.id_factura]) {
            uniqueInvoiceIds[v.id_factura] = true;  // Marcamos el id_factura como procesado
            return true;
          }
          return false;
        });
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
  border: 1px solid #AAAAAA;
  border-radius: 10px;
  padding: 2px;
  padding-left: 5px;
  padding-right: 5px;
}

.style-pendiente {
  height: calc(100vh - 150px) !important;
}
</style>
