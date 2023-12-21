<template>
  <q-page class="q-pb-lg titles-font">
    <div class="row items-center justify-center q-pa-sm q-pt-md">
      <q-input
        borderless
        v-model="text"
        placeholder="Buscar por código Warehouse"
        dense
        debounce="500"
        style="font-size:15px;width:100%"
        class="box-shadow-search my-font-semibold"
      >
        <template v-slot:append>
          <q-icon v-if="text === ''" name="search" color="secondary" />
          <q-icon v-else name="clear" class="cursor-pointer" @click="text = ''" color="secondary" />
        </template>
      </q-input>
    </div>
    <q-infinite-scroll
      class="q-pa-sm"
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
              <q-item-label class="text-bold text-primary titles-font" style="font-size:15px">WH-{{item.warehouse}}</q-item-label>
              <q-item-label class="text-primary my-font-regular" lines="2">Descripción: <label class="text-uppercase"> {{item.descripcion}} </label> </q-item-label>
              <q-item-label  class="text-primary my-font-regular" v-if="item.fecha_llegada" >Fecha de recepción: {{formatDate(item.fecha_llegada)}} </q-item-label>
              <div class="text-primary my-font-semibold row q-mt-sm items-center" style="font-size:14px" >
                <div
                  style="width:10px;height:10px;border-radius:100%"
                  class="q-mr-sm text-capitalize"
                  :style="{ 'background-color': colorCircle(7)}"
                ></div> {{capitalize(item.estado)}}
              </div>
            </q-item-section>
          </q-item>
          <q-separator class="q-ma-xs" inset />
        </q-card-section>
        <div class="row justify-start titles-font q-pb-xs q-gutter-x-xs">
          <q-btn
            :label="item.status === 0 ? 'asignar instrucción' : 'asignada'"
            :disable="item.status === 0 ? false : true "
            color="primary"
            style="letter-spacing:-1px;"
            flat
            dense
            rounded
            icon="menu"
            :to="'/instrucciones/form/paquete/' + item.id_solicitud"
          />
          <q-btn
            label="ver más"
            color="primary"
            style="letter-spacing:-1px;"
            flat
            dense
            rounded
            icon="add"
            :to="'/paqueteria/form/' + item.id_solicitud"
          />
        </div>
      </q-card>
      <!-- <div
        v-if="isLoading"
        class="row justify-center q-my-md"
      >
        <q-spinner-dots color="primary" size="40px" />
      </div> -->

      <template
        v-slot:loading
      >
        <div
          v-if="isLoading"
          class="row justify-center q-my-md"
        >
          <q-spinner-dots color="primary" size="40px" />
        </div>
      </template>
    </q-infinite-scroll>
    <no-data
      v-if="nodataC"
      modulo="paquetes"
      icon="almacen.svg"
      caption="No tiene paquete generados."
    />
  </q-page>
</template>

<script>
// import { ListMixin } from '../../mixins/List'
import { mapGetters } from 'vuex'
// import { date } from 'quasar'

import moment from 'moment'
export default {
  // mixins: [ListMixin],
  data () {
    return {
      route: 'packages',
      text: '',
      search: '',
      data: [],
      nodataC: false,
      page: 1,
      totalPages: null,
      isLastPage: false,
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
          return this.data.filter(v => v.warehouse.toLowerCase().indexOf(this.text.toLowerCase()) > -1)
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
    async resetPaginationAndLoadFirstPage () {
      this.isFirstLoad = true
      this.page = 1
      this.totalPages = null
      this.data = []
      await this.loadPage()
      this.isLoading = false
    },
    async loadPage () {
      let res
      const userInfo = this.UserInfo()
      const route = `almacen?usuario_id=${userInfo.user.usuario_id}&limit=${this.resultsPerPage}&page=${this.page}&query={"search": "${this.text}"}&ascending=0&orderBy=almacenes.fecha_creado`

      // isFirstLoad para que cargue la primera vez
      if (this.isFirstLoad || this.totalPages === null) {
        this.isFirstLoad = false
        this.isLoading = true
        res = await this.$api.get(route, {
          usuario_id: userInfo.user.usuario_id
        })
        if (res.pagination.totalResult !== undefined) {
          this.totalPages = Math.ceil(res.pagination.totalResult / this.resultsPerPage) // Cálculo del total de páginas
        }
      }

      if (this.page > this.totalPages) {
        this.isLastPage = true // No hay más páginas para cargar
        this.isLoading = false
        return
      }

      this.isLoading = true
      res = await this.$api.get(route, {
        usuario_id: userInfo.user.usuario_id
      })
      this.isLoading = false

      if (res.results.length > 0) {
        this.data.push(...res.results)
        this.validateNoDataC(this.data)
      }

      this.page++

      // Verificar si ya no quedan más páginas para cargar
      if (this.page > this.totalPages) {
        this.isLastPage = true
      }
    },
    async onLoad (index, done) {
      setTimeout(async () => {
        await this.loadPage()
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

      // Objeto para rastrear los ids que ya hemos visto.
      const seenIds = {}

      // Filtramos el array data para que sólo incluya elementos con ids que no hemos visto antes.
      // También actualizamos seenIds para cada id que vemos.
      this.data = data.filter(item => {
        if (seenIds[item.id_almacen]) {
          // Si ya hemos visto este id, excluimos el elemento.
          return false
        } else {
          // Si no hemos visto este id, lo incluimos y marcamos este id como visto.
          seenIds[item.id_almacen] = true
          return true
        }
      })
    },
    colorCircle (status) {
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
    },
    /*
    beforeMounted () {
      const userInfo = this.UserInfo()
      this.route = `almacen?usuario_id=${userInfo.user.usuario_id}`
    }, */
    formatDate (dateV) {
      const formatDate = moment(dateV).format('DD-MM-YYYY')
      return formatDate
    },
    // funcion para recibir una palabra y devolver la primera letra en mayuscula
    capitalize (word) {
      return word.charAt(0).toUpperCase() + word.slice(1)
    }/* ,
    afterMounted () {
      const data = this.data.filter(v => v.estado === 'recibido')
      this.data = data
    } */
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
  padding-left: 15px;
  padding-top: 11px;
  padding-right: 13px;
}
</style>
