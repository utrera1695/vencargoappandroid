<template>
  <q-page>
    <q-img
      v-if="form.tracking && form.tracking.length > 0"
      :src="env.apiUrlImg + form.tracking[0].ruta_image"
      width="100%"
      height="250px"
    >
      <div
        v-if="form.tracking && form.tracking.length > 0"
        class="absolute-bottom text-center my-font-semibold"
        style="font-size:18px;background-color:rgba(0, 0, 0, 0.3);"
      >
        WH-{{form.almacen_warehouse}}
      </div>
    </q-img>
    <div class="q-pa-sm q-ma-sm bordes-d my-font-semibold">
      <div class="row">
        <div class="column col-5">
          <div>Fecha de ingreso:</div>
          <div class="my-font-regular"> {{form.almacen_fecha_recibido}} </div>
        </div>
        <q-separator vertical class="q-ml-sm" />
        <div class="column q-ml-xs col-5 q-ml-sm">
          <div>Cantidad de piezas:</div>
          <div
            v-if="form.tracking && form.tracking.length > 0"
            class="my-font-regular"
          > {{form.tracking[0].num_piezas}} </div>
        </div>
      </div>
      <q-separator class="q-mt-sm" />
      <div class="column q-mt-sm">
        <div>Descripción:</div>
        <div
          v-if="form.tracking && form.tracking.length > 0"
          class="my-font-regular text-uppercase"
        > {{form.tracking[0].descripcion}} </div>
      </div>
      <q-separator class="q-mt-sm" />
      <div class="column q-mt-sm">
        <div>Tracking:</div>
        <div
          v-if="form.tracking && form.tracking.length > 0"
          class="my-font-regular text-uppercase"
        > {{form.tracking[0].tracking}} </div>
      </div>
    </div>

    <div class="q-pa-sm q-ma-sm bordes-d my-font-semibold">
      <div class="column">
        <div>Medidas LxWxH (pulgadas):</div>
        <div
          v-if="form.tracking && form.tracking.length > 0"
          class="my-font-regular"
        >
          {{form.tracking[0].largo}}" X {{form.tracking[0].ancho}}" X {{form.tracking[0].alto}}"
        </div>
      </div>
      <q-separator class="q-mt-sm" />
      <div class="row">
        <div class="column q-mt-sm col-5">
          <div>Pie cúbico:</div>
          <div
            v-if="form.tracking && form.tracking.length > 0"
            class="my-font-regular"
          > {{form.tracking[0].pie_cubico}} </div>
        </div>
        <q-separator vertical class="q-ml-sm q-mt-sm" />
        <div class="column q-mt-sm col-5 q-ml-sm">
          <div>Volumen lb:</div>
          <div
            v-if="form.tracking && form.tracking.length > 0"
            class="my-font-regular"
          > {{form.tracking[0].volumen}} </div>
        </div>
      </div>
      <q-separator class="q-mt-sm" />
      <div class="row">
        <div class="column q-mt-sm col-5">
          <div>Peso lb:</div>
          <div
            v-if="form.tracking && form.tracking.length > 0"
            class="my-font-regular"
          > {{form.tracking[0].peso}} </div>
        </div>
      </div>
      <q-separator class="q-mt-sm"
        v-if="form.almacen_tipo_envio"
      />
      <div
        class="row"
        v-if="form.almacen_tipo_envio"
      >
        <div class="column q-mt-sm col-5">
          <div>Con Reempaque:</div>
          <div
            v-if="form.tracking && form.tracking.length > 0"
            class="my-font-regular text-capitalize"
          >
            {{form.tracking[0].reempaque}}
          </div>
        </div>
        <q-separator vertical class="q-ml-sm q-mt-sm" />
        <div class="column q-mt-sm col-5 q-ml-sm">
          <div>Seguro:</div>
          <div
            v-if="form.tracking && form.tracking.length > 0"
            class="my-font-regular"
          > ${{form.tracking[0].total_seguro}} </div>
        </div>
      </div>
    </div>

    <!-- <div style="height:300px; width: 96%">
      <google-map class="q-ma-sm" :center="center" />
    </div> -->
  </q-page>
</template>

<script>
// import GoogleMap from '../../components/GoogleMapView'
import { FormMixin } from '../../mixins/Form'
import { date } from 'quasar'
import { mapGetters } from 'vuex'
import env from 'src/env.js'

export default {
  mixins: [FormMixin],
  components: {
    // GoogleMap
  },
  data () {
    return {
      form: {},
      route: 'solicitudes',
      id: this.$route.params.id,
      center: { lat: 10, lng: 10 },
      env
    }
  },
  mounted () {
    this.getOtherData()
  },
  methods: {
    ...mapGetters('generals', ['UserInfo']),
    afterMounted () {
      console.log(this.form, 'form after mounted')
      /* this.center.lat = parseFloat(this.form.latitude)
      this.center.lng = parseFloat(this.form.longitude) */
      // en la fecha solo dejar la fecha y no la hora
      this.formatDate()
    },
    formatDate () {
      if (this.form.almacen_fecha_recibido) {
        const formatDate = date.formatDate(this.form.almacen_fecha_recibido, 'DD-MM-YYYY')
        this.form.almacen_fecha_recibido = formatDate
      }
    },
    beforeMounted () {
      const userInfo = this.UserInfo()
      this.route = `solicitudes/${this.id}?usuario_id=${userInfo.user.usuario_id}&estado=recibido`
    }
  }
}
</script>

<style scoped>
.bordes-d {
 border: 1px solid #d1d1cf;
 border-radius: 12px;
}
</style>
