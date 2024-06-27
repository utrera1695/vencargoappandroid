<template>
  <q-page
    class="q-pb-lg"
  >
    <!-- <div class="q-pt-md row justify-center">
      <q-btn-toggle
        v-model="toggle"
        toggle-text-color="primary"
        text-color="secondary"
        toggle-color="secondary"
        :options="[{label: 'No facturados', value: 'nofac'},{label: 'Facturados', value: 'fac'}]"
        @input="onToggleInput()"
      />
    </div> -->
    <div class="row items-center justify-center q-pa-sm q-pt-md">
      <q-input
        borderless
        v-model="text"
        placeholder="Buscar por nro de factura"
        dense
        style="font-size:15px;width:100%"
        class="box-shadow-search my-font-semibold"
        debounce="500"
      >
        <template v-slot:append>
          <q-icon v-if="text === ''" name="search" color="secondary" />
          <q-icon v-else name="clear" class="cursor-pointer" @click="text = ''" color="secondary" />
        </template>
      </q-input>
    </div>
    <div
      class="q-px-sm"
      id="scroll-target-id"

    >
      <q-infinite-scroll
        @load="onLoad"
        :offset="1"
        ref="infiniteScroll"
        class="q-pb-lg"
      >
        <q-card
          class="radio-bordes-item-prelerta q-mt-md box-shadow-card-listados padding-card"
          v-for="(item, index) in filterData"
          :key="index"
          style="height:auto"
        >
          <q-card-section style="padding: 0 !important;margin:0px !important">
            <q-item dense style="padding: 0 !important;margin:0px !important">
              <q-item-section>
                <q-item-label class="text-bold text-primary titles-font" style="font-size:16px">Factura <label>#{{item.nro_factura}}</label></q-item-label>
                <q-item-label
                  v-if="item.warehouse"
                  class="text-bold text-primary titles-font"
                  style="font-size:15px"
                >WH-{{item.warehouse}}</q-item-label>
                <q-item-label v-if="item.nro_container" class="text-primary my-font-regular">Contenedor: <label> {{item.nro_container}} </label> </q-item-label>

                <q-item-label class="text-primary my-font-regular">Fecha de llegada: <label class="my-font"> {{formatDate(item.fecha_llegada ? item.fecha_llegada : item.fecha_estimada)}} </label> </q-item-label>
                <q-item-label class="text-primary my-font-regular">Fecha de actualización: <label class="my-font"> {{formatDate(item.fecha_editado ? item.fecha_editado : item.fecha_editado)}} </label> </q-item-label>
                <q-item-label
                  v-if="item.tipo_envio"
                  class="text-primary my-font-regular"
                >
                  Envío: <label> {{formatEnvio(item.tipo_envio)}} </label>
                </q-item-label>
                <div
                  class="text-primary my-font-semibold row q-mt-sm items-center"
                  style="font-size:14px"
                >
                  <div style="width:10px;height:10px;border-radius:100%" class="q-mr-sm" :style="{ 'background-color': colorCircle(7)}" ></div>
                  <div v-if="item.shipment_status"> {{ item.shipment_status.title }} </div>
                </div>
                <div
                  class="q-mb-sm"
                  v-if="isMapItem(item)"
                />
              </q-item-section>
            </q-item>
            <q-separator
              v-if="!isMapItem(item)"
              class="q-ma-xs"
              inset
            />
          </q-card-section>
          <div class="row justify-end titles-font q-gutter-x-xs">
            <q-btn
              v-if="!isMapItem(item)"
              icon="my_location"
              label="Ver mapa"
              color="primary"
              style="letter-spacing:-1px;"
              flat
              dense
              :ripple="false"
              rounded
              @click="verEnvio(item.map.position.lat, item.map.position.lng, item)"
            />
            <div
              v-if="!isMapItem(item)"
              class="q-mb-xs col-12"
            />
            <q-btn
              v-if="item.flag === 1"
              label="recibo"
              color="primary"
              style="letter-spacing:-1px;"
              flat
              dense
              rounded
              @click="dfile(item.link_print)"
            />
          </div>
        </q-card>
        <div
          v-if="isLoading"
          class="row justify-center q-my-md"
        >
          <q-spinner-dots color="primary" size="40px" />
        </div>
      </q-infinite-scroll>
    </div>
    <q-dialog v-model="dEnvio" :maximized="true" transition-show="slide-up" transition-hide="slide-down" >
      <q-layout view="Lhh lpR fff" container class="bg-white">
        <q-header class="bg-secondary">
          <q-toolbar>
            <q-btn icon="arrow_back" color="primary" flat round dense v-close-popup />
            <q-toolbar-title class="text-primary titles-font text-uppercase">
              ubicación
            </q-toolbar-title>
          </q-toolbar>
        </q-header>

        <q-page-container>
          <q-page>
            <q-scroll-area
              style="height:35vh;width:100%;padding-bottom: 7px;"
              v-if="infoShippings"
            >
              <div class="column text-center text-primary" style="padding-top:7px;">
                <div class="column q-pt-sm">
                  <div class="text-uppercase my-font-extra-bold text-h6 text-bold text-primary">Nro Factura</div>
                  <div class="text-uppercase my-font-semibold text-subtitle1" style="line-height:10px"> {{infoShippings.nro_factura}} </div>
                </div>

                <div class="column q-pt-sm">
                  <div class="text-uppercase my-font-extra-bold text-h6 text-bold text-primary">Tracking</div>
                  <div
                    v-for="(item, index) in infoShippings.warehouses_filter"
                    :key="index"
                    class="text-uppercase my-font-semibold text-subtitle1"
                    style="line-height:10px"
                  >
                    <span
                      v-if="item.tracking"
                      style="line-height:23px"
                    > {{ item.tracking }} </span>
                  </div>
                </div>

                <div class="column q-pt-md">
                  <div class="text-uppercase my-font-extra-bold text-h6 text-bold text-primary q-px-xl" style="line-height:20px">estatus</div>
                  <div
                    class="text-uppercase my-font-semibold text-subtitle1 q-pt-xs"
                    style="line-height:auto"
                  > {{infoShippings.estado_envio}} </div>
                </div>
              </div>
            </q-scroll-area>
            <q-card class="bg-secondary text-white">
              <q-card-section style="padding: 0px !important;height:60vh">
                <google-map :center="center" style="height: 100%; width:100%" />
              </q-card-section>
            </q-card>
          </q-page>
        </q-page-container>
      </q-layout>
    </q-dialog>
    <no-data
      v-if="nodataC"
      modulo="envios"
      icon="package1.svg"
      caption="No hay envíos en este momento."
    />
  </q-page>
</template>

<script>
// import { ListMixin } from '../../mixins/List'
import GoogleMap from '../../components/GoogleMapView'
import { mapGetters } from 'vuex'
import moment from 'moment'

export default {
  // mixins: [ListMixin],
  components: {
    GoogleMap
  },
  data () {
    return {
      toggle: 'fac',
      center: { lat: 10, lng: 10 },
      dEnvio: false,
      route: 'shipments',
      infoShippings: null,
      search: '',
      data: [],
      text: '',
      page: 1,
      totalPages: null,
      isLastPage: false,
      nodataC: false,
      isFirstLoad: true,
      resultsPerPage: 5,
      isLoading: false
    }
  },
  computed: {
    filterData () {
      return this.data
      /* if (this.data && this.data.length > 0) {
        if (this.text === '') {
          return this.data
        } else {
          return this.data.filter(v => v.nro_factura.toLowerCase().indexOf(this.text.toLowerCase()) > -1)
        }
      } else {
        return []
      } */
    }
  },
  watch: {
    text () {
      this.resetPaginationAndLoadFirstPage()
    }
  },
  methods: {
    ...mapGetters('generals', ['UserInfo']),
    isMapItem (item) {
      return !item.map || item.map.length <= 0 || item.estado_envio === 'ENTREGADO'
    },
    async resetPaginationAndLoadFirstPage () {
      this.isFirstLoad = true
      this.page = 1
      this.totalPages = null
      this.data = []
      this.isLoading = true
      await this.loadPage()
      this.isLoading = false
    },
    async loadPage () {
      let res
      const userInfo = this.UserInfo()

      const url = `shipments?usuario_id=${userInfo.user.usuario_id}&limit=${this.resultsPerPage}&page=${this.page}&query={"search": "${this.text}"}&ascending=0&orderBy=envios.fecha_editado`

      if (this.isFirstLoad || this.totalPages === null) {
        this.isFirstLoad = false
        this.isLoading = true
        res = await this.$api.get(url, {
          usuario_id: userInfo.user.usuario_id
        })
        if (res.pagination.totalResult !== undefined) {
          this.totalPages = Math.ceil(res.pagination.totalResult / this.resultsPerPage)
        }
      }

      if (this.page > this.totalPages) {
        this.isLastPage = true
        this.validateNoDataC()
        return
      }

      this.isLoading = true
      res = await this.$api.get(url, {
        usuario_id: userInfo.user.usuario_id
      })

      if (res.results.length > 0) {
        this.data.push(...res.results)
        this.validateNoDataC()
      }

      this.page++

      if (this.page > this.totalPages) {
        this.isLastPage = true
      }
    },
    validateNoDataC () {
      if (this.data.length === 0) {
        this.nodataC = true
      } else {
        this.nodataC = false

        // Objeto para rastrear los ids que ya hemos visto.
        const seenIds = {}

        // Filtramos el array data para que sólo incluya elementos con ids que no hemos visto antes.
        // También actualizamos seenIds para cada id que vemos.
        this.data = this.data.filter(item => {
          if (seenIds[item.id_factura]) {
            // Si ya hemos visto este id, excluimos el elemento.
            return false
          } else {
            // Si no hemos visto este id, lo incluimos y marcamos este id como visto.
            seenIds[item.id_factura] = true
            return true
          }
        })
      }
      this.isLoading = false
    },
    async onLoad (index, done) {
      setTimeout(async () => {
        await this.loadPage()
        done()
      }, 500)
    },
    afterGetRecord (res) {
      console.log(res, 'res')
      this.data = []
    },
    async verEnvio (lat, lng, itm) {
      this.center.lat = parseFloat(lat)
      this.center.lng = parseFloat(lng)

      const userInfo = this.UserInfo()
      // consultar la info del envio
      const res = await this.$api.get(`shipments/${itm.id_factura}?usuario_id=${userInfo.user.usuario_id}`)
      this.infoShippings = {
        ...res.result,
        warehouses_filter: [...res.result.warehouses.filter(item => item.tracking)],
        estado_envio: itm?.shipment_status?.title || ''
      }
      console.log(res, 'res')

      this.dEnvio = true
    },
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
    },
    onToggleInput (notGetRecord) {
      const userInfo = this.UserInfo()
      const tg = this.toggle
      if (tg === 'fac') {
        this.route = `shipments?usuario_id=${userInfo.user.usuario_id}`
      } else {
        this.route = `almacen?usuario_id=${userInfo.user.usuario_id}`
      }

      if (!notGetRecord) {
        this.getRecord()
      }
    },
    async dfile (item) {
      console.log(item, 'item')
      window.open(item.link_print)
    },
    beforeMounted () {
      this.onToggleInput(true)
    },
    formatDate (dateFormat) {
      const formatDate = moment(dateFormat).format('DD-MM-YYYY')
      return formatDate
    },
    formatEnvio (envio) {
      if (envio === 'aereo') return 'Aéreo'
      if (envio === 'maritimo') return 'Marítimo'
    },
    capitalize (word) {
      return word.charAt(0).toUpperCase() + word.slice(1)
    },
    showLabelEnvio (val) {
      const enviosEstados = [
        {
          title: 'ALMACÉN MIAMI',
          value: 'FACTURADO'
        },
        {
          title: 'ENVIADO HACIA VENEZUELA',
          value: 'ENVIO-VENEZUELA'
        },
        {
          title: 'EN TRÁNSITO HACIA VENEZUELA',
          value: 'ENTRANSITO-VENEZUELA'
        },
        {
          title: 'ADUANA DE VENEZUELA',
          value: 'ADUANA-VENEZUELA'
        },
        // almacen venezuela
        {
          title: 'ALMACÉN VENEZUELA',
          value: 'ALMACEN-VENEZUELA'
        },
        // ENTREGADO
        {
          title: 'ENTREGADO',
          value: 'ENTREGADO'
        }
      ]

      // devolver el titulo del envio segun el valor
      const envio = enviosEstados.find(item => item.value === val)
      return envio ? envio.title : ''
    },
    colorCircle (status) {
      console.log(status, 'status')
      // convertir a integer
      status = parseInt(status)
      switch (status) {
        case 1: // 'En almacén MIAMI':
          return '#ffc600' // amarillo
        case 2: // 'En proceso de envío a Venezuela':
          return 'orange' // naranga
        case 3: // 'En tránsito':
        case 4: // 'En aduana VENEZUELA':
        case 5: // 'En almacén LA GUAIRA VENEZUELA':
        case 6: // 'En tránsito VENEZUELA':
          return '#014dd9' // azul
        case 7: // 'Entregado':
          return '#00ea06 ' // verde
      }
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
}

.style-container-list {
  height: calc(100vh - 150px);
}

</style>
