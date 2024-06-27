<template>
  <q-page class="window-width">
    <div class="column items-center q-pa-md">
      <q-input
        borderless
        v-model="text"
        placeholder="Buscar por Tracking / Warehouse"
        dense
        style="font-size:15px;width:100%"
        class="box-shadow-search my-font-semibold"
        label-color="primary"
        @keyup.enter="rastrearEnvio"
      >
        <template v-slot:append>
          <q-icon name="search" color="secondary" @click="rastrearEnvio()" />
        </template>
      </q-input>
    </div>
    <div class="full-width q-mb-sm" v-if="ads">
      <q-carousel
        v-if="ads.length > 1"
        v-model="adsModel"
        animated
        arrows
        infinite
        :autoplay="7000"
        style="height:18vh"
        class="no-border-radius q-mb-md"
      >
        <q-carousel-slide v-for="(img, index) in ads" :key="index" :name="index" :img-src="img.ruta_image" style="border-radius:10px" class="no-border-radius" />
      </q-carousel>
      <q-img v-else-if="ads.length === 1" :src="ads[0].ruta_image" class="full-width q-mb-sm" style="height:18vh" />
    </div>

    <div class="column items-center justify-center q-mt-sm">
      <div class="row items-center q-gutter-md justify-center full-height" style="width:90%">
        <q-card
          class="items-option column items-center justify-center box-shadow-card"
          v-for="(item, index) in items"
          :key="index"
          v-ripple
          clickable
          @click="$router.push(item.to)"
        >
          <div
            class="badge-style-s row justify-center items-center"
            v-if="item.count > 0"
          >
            {{item.count}}
          </div>
          <img :src="item.img" style="width:70px;height:70px;padding-top:5px" />
          <div class="text-primary titles-font text-bold text-uppercase q-mt-sm"> {{item.title}} </div>
        </q-card>
        <q-card
          class="items-option-invisible column items-center justify-center box-shadow-card"
        >

        </q-card>
      </div>
    </div>
    <q-dialog v-model="alert">
      <q-card class="my-font-regular">
        <q-card-section>
          <div class="text-h6 text-bold text-uppercase my-font-extra-bold">¡Atención!</div>
        </q-card-section>

        <q-card-section class="q-pt-none color-siete" style="font-size:16px">
          No existe un paquete registrado con ese código. Por favor intente nuevamente con otro valor.
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="OK" color="primary" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- <q-dialog
      v-model="dEnvio"
      transition-show="slide-up"
      transition-hide="slide-down"
    >
      <q-card
        class="q-pa-sm"
      >
        <div
          v-html="showMessageLabelRastreo()"
        >
        </div>
      </q-card>
    </q-dialog> -->

    <q-dialog
      v-model="dEnvio"
      class="window-width"
    >
      <q-card class="my-font-regular window-width">
        <q-card-section>
          <div class="text-h6 text-bold text-uppercase my-font-extra-bold">INFORMACIÓN</div>
        </q-card-section>

        <q-card-section class="q-pt-none color-siete row" style="font-size:16px">

          <div
            v-html="showMessageLabelRastreo()"
          >
          </div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="OK" color="primary" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
// import GoogleMap from '../components/GoogleMapView.vue'
import { mapGetters } from 'vuex'
import env from 'src/env.js'

export default {
  components: {
    // GoogleMap
  },
  name: 'PageIndex',
  data () {
    return {
      alert: false,
      center: { lat: 10, lng: 10 },
      detailEnvio: {
        data: {},
        module: ''
      },
      dEnvio: false,
      adsModel: 1,
      ads: [],
      text: '', // trackin de ejemplo para prueba UENYUAVUDBOCNOPNODNOCN
      items: [
        {
          title: 'Pre-Alertas',
          to: 'prealertas',
          img: 'iconos/noti_acept.svg',
          count: 0
        },
        { title: 'Almacén', img: 'iconos/warehouse-2.svg', to: 'paqueteria', count: 0 },
        { title: 'Instrucciones', img: 'iconos/instrucciones.svg', to: 'instrucciones', count: 0 },
        { title: 'Envíos', img: 'iconos/package1.svg', to: 'envios', count: 0 },
        { title: 'Facturación', img: 'iconos/factura.svg', to: '/facturas', count: 0 }/* ,
        { title: 'Contacto', img: 'iconos/contacto.svg', to: 'contacto' } */
      ],
      params: {
      },
      count_package: 0,
      count_shippings: 0,
      count_invoice: 0,
      alertNoEnvio: false,
      env
    }
  },
  mounted () {
    this.getAds()
    this.countData()
  },
  methods: {
    ...mapGetters('generals', ['UserInfo']),
    async getAds () {
      const res = await this.$api.get('banner-app')
      if (res.results && res.results.length > 0) {
        const ads = res.results.filter(item => item.estado === 'visible')
        this.ads = ads.map(item => {
          return {
            ruta_image: `${env.apiUrlImg}/${item.ruta_image}`
          }
        })
      }
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
        {
          title: 'ALMACÉN VENEZUELA',
          value: 'ALMACEN-VENEZUELA'
        },
        {
          title: 'ENTREGADO',
          value: 'ENTREGADO'
        }
      ]

      // devolver el titulo del envio segun el valor
      const envio = enviosEstados.find(item => item.value === val)
      return envio ? envio.title : ''
    },
    async rastrearEnvio () {
      if (this.text) {
        this.$q.loading.show()
        const userInfo = this.UserInfo()
        await this.$api.get(`rastreo?usuario_id=${userInfo.user.usuario_id}&nro_search=${this.text}`).then(res => {
          this.$q.loading.hide()
          console.log(res, 'resssss')
          if (res && res.status === 200) {
            const data = res.result
            this.detailEnvio = data
            this.dEnvio = true
          }
          /* if (!res.error) {
            const data = res.data[0]
            this.center.lat = parseFloat(data.latitude)
            this.center.lng = parseFloat(data.longitude)
            this.detailEnvio = data
            console.log(this.center, 'center')
            this.dEnvio = true
          } else {
            this.alert = true
          } */
        })
      }
    },
    showMessageLabelRastreo () {
      const dataEnvio = this.detailEnvio.data
      const moduleData = this.detailEnvio.module

      if (dataEnvio && !dataEnvio.tipo_envio && moduleData === 'Almacen' && dataEnvio.estado === 'recibido') {
        return `
          <div class="q-mt-sm">El WH-${dataEnvio.warehouse} se encuentra en Almacén.</div>
        `
      } else if (dataEnvio && dataEnvio.estado === 'recibido' && moduleData === 'Almacen' && (dataEnvio.tipo_envio === 'maritimo' || dataEnvio.tipo_envio === 'aereo')) {
        return `
          <div class="q-mt-sm">
            El WH-${dataEnvio.warehouse} tiene asignada una instrucción: ${dataEnvio.tipo_envio === 'maritimo' ? 'Marítimo' : 'Aéreo'}.
          </div>
        `
      } else if (dataEnvio && dataEnvio.estado === 'FACTURADO' && moduleData === 'Almacen') {
        return `
          <div class="q-mt-sm">
            El WH-${dataEnvio.warehouse} se encuentra en proceso de envío.
          </div>
        `
      } else if (dataEnvio && dataEnvio.estado_pago === 'Pendiente' && moduleData === 'Factura-Envio') {
        return `
          <div class="q-mt-sm">
            El paquete ee encuentra pendiente por pagar con estado ${dataEnvio?.shipment_status?.title}.
          </div>
        `
      } else if (dataEnvio && dataEnvio.estado_pago === 'Verificacion-Pago' && moduleData === 'Factura-Envio') {
        return `
          <div class="q-mt-sm">
            Nos encontramos verificando el pago de su paquete con estado ${dataEnvio?.shipment_status?.title}.
          </div>
        `
      } else if (dataEnvio && dataEnvio.estado_pago === 'Pago-Verificado' && moduleData === 'Factura-Envio') {
        return `
          <div class="q-mt-sm">
            El paquete se encuentra con estado ${dataEnvio?.shipment_status?.title}.
          </div>
        `
      } else if (!dataEnvio) {
        return `
          <div class="q-mt-sm">
            El paquete no existe en nuestros registros.
          </div>
        `
      } else if (dataEnvio && dataEnvio.estado === 'pendiente' && moduleData === 'Solicitud') {
        return `
          <div class="q-mt-sm">
            El tracking aún no se encuentra en nuestro almacén, estado: Pendiente
          </div>
        `
      } else {
        return `
          <div class="q-mt-sm">
            Algo salió mal, por favor intente nuevamente.
          </div>
        `
      }
    },
    async countData () {
      const userInfo = this.UserInfo()
      const resShipment = await this.$api.get(`count-shipment?usuario_id=${userInfo.user.usuario_id}`)
      this.items[3].count = resShipment.result

      const resInvoice = await this.$api.get(`count-invoice?usuario_id=${userInfo.user.usuario_id}`)
      this.items[4].count = resInvoice.result

      const resWarehouse = await this.$api.get(`count-warehouse?usuario_id=${userInfo.user.usuario_id}&estado=recibido`)
      this.items[1].count = resWarehouse.result
    }
  }
}
</script>

<style scoped lang="scss">
.items-option {
  width: 45%;
  max-width: 150px;
  height: 140px;
  border-radius: 12px;
}

.items-option-invisible {
  width: 45%;
  max-width: 150px;
  height: 140px;
  border-radius: 12px;
  visibility: hidden;
}
.container {
  display: grid;
  grid-template-columns: auto auto;
}

.badge-style-s {
  position:absolute;
  top: 10px;
  right:10px;
  z-index:1;
  height:20px;
  font-size: 10px;
  color: white;
  width:20px;
  background-color: $red;
  border-radius: 100% !important;
}
</style>
