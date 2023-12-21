<template>
  <q-page class="q-pb-lg">
    <div class="column q-ma-md text-primary q-mt-xl my-font">
      <label style="font-size:16px" v-if="form.tracking">Tracking: {{form.tracking}}</label>
      <p class="my-font-regular">Asigna las instrucciones de envió de tu paquete.</p>
    </div>

    <!-- <div class="row q-pa-sm items-center">
      <q-card class="col-10 q-pa-sm card-list-radios box-shadow-card-listados text-primary">
        <div class="column q-ml-sm">
          <div class="text-h6 titles-font">HOLD</div>
          <p class="my-font-regular"> Tu paquete no está listo para ser enviado </p>
        </div>
      </q-card>
      <div class="col-1 q-ml-sm">
        <q-toggle v-model="form.hold" keep-color color="primary" />
      </div>
    </div> -->

    <div class="row q-pa-sm items-center">
      <q-card class="col-10 q-pa-sm card-list-radios box-shadow-card-listados text-primary">
        <div class="column q-ml-sm">
          <div class="text-h6 titles-font">REEMPAQUE</div>
          <p class="my-font-regular"> Solicita el servicio de reempaque para este paquete </p>
        </div>
      </q-card>
      <div class="col-1 q-ml-sm">
        <q-toggle v-model="form.repackage" keep-color color="primary" />
      </div>
    </div>

    <div class="row q-pa-sm items-center">
      <q-card class="col-10 q-pa-sm card-list-radios box-shadow-card-listados text-primary">
        <div class="column q-ml-sm">
          <div class="text-h6 titles-font">ASEGURADO</div>
          <p class="my-font-regular"> Solicita seguro para <br> este paquete </p>
        </div>
        <div v-if="form.insured" style="position:absolute;top:30%;right:8px;width:100px">
          <q-input type="number" v-model.number="insured" outlined dense />
        </div>
      </q-card>
      <div class="col-1 q-ml-sm">
        <q-toggle v-model="form.insured" keep-color color="primary" @input="insured = 0" />
      </div>
    </div>

    <div class="row justify-center q-mt-sm q-ma-sm">
      <q-card class="q-pa-sm card-list-radios box-shadow-card-listados text-primary" style="width:100%">
        <div style="position:absolute;top:20px;right:8px;width:100px">
          <q-select
            outlined
            rounded
            v-model="form.shippins_id"
            :options="options"
            dense
            style="font-size:10px"
            emit-value
            map-options
            option-value="id"
            option-label="label"
          />
        </div>
        <div class="col-9">
          <div class="column q-ml-sm">
            <div class="text-h6 titles-font">TIPO DE ENVÍO</div>
            <p class="my-font-regular"> Elige el modo de  envío</p>
          </div>
        </div>
      </q-card>
    </div>

    <div class="q-mt-xl row justify-center">
      <q-btn class="titles-font" label="Asignar" color="secondary" text-color="primary" push style="width:60%" @click="onsubmit()" />
    </div>
  </q-page>
</template>

<script>
import { FormMixin } from '../../mixins/Form'
import { mapGetters } from 'vuex'
export default {
  mixins: [FormMixin],
  data () {
    return {
      track: '',
      convertTogleInstrucction: true,
      route: 'solicitudes-instruccion',
      insured: 0,
      options: [
        {
          label: 'Aéreo',
          id: 'aereo'
        },
        {
          label: 'Marítimo',
          id: 'maritimo'
        }
      ],
      form: {
        shippins_id: 1,
        insured: 0,
        repackage: 0
      },
      id_almacen: null,
      id_tracking: null
    }
  },
  computed: {
    btnInsured () {
      return this.form.insured >= 1
    }
  },
  methods: {
    ...mapGetters('generals', ['UserInfo']),
    async onsubmit () {
      this.$q.loading.show()
      const form = { ...this.form }
      // form.id = this.form.id
      form.repackage = this.form.repackage === true ? 1 : 0
      form.hold = this.form.hold === true ? 1 : 0
      form.insured = this.form.insured === true ? this.insured : 0
      console.log(form, 'form')
      const sendForm = {
        id: form.id, repackage: form.repackage, hold: form.hold, insured: form.insured, shippins_id: form.shippins_id
      }
      if (this.$route.params.paquete_id) {
        await this.$api.patch(this.route + '/update', sendForm).then(res => {
          this.$q.loading.hide()
          if (res.success) { this.$router.go(-1) }
          this.$q.notify({
            message: res.message,
            color: res.success ? 'positive' : 'negative'
          })
        })
      } else {
        console.log('se esta creando', this.UserInfo().user.usuario_id)
        sendForm.id = this.$route.params.crear_id
        console.log(sendForm, 'sendForm')
        await this.$api.post('solicitudes-instruccion/' + sendForm.id, {
          usuario_id: this.UserInfo().user.usuario_id,
          id_almacen: this.id_almacen,
          id_tracking: this.id_tracking,
          tipo_envio: this.form.shippins_id,
          reempaque: this.form.repackage ? 'si' : 'no',
          // en caso de no tener seguro debe enviarse 0.00. el parametro solo recibe numero flotantes con dos decimales
          total_seguro: this.form.insured ? this.toFixedFN(this.insured) : '0.00',
        }).then(res => {
          this.$q.loading.hide()
          console.log(res, 'res')
          if (res && res.status === 200) {
            this.$router.go(-1)
          } else {
            this.$q.notify({
              message: res.message,
              color: res.status === 200 ? 'positive' : 'negative'
            })
          }
        })
      }
    },
    // funcion para devolver 2 decimales de un numero
    toFixedFN (num) {
      const floatValue = parseFloat(num);
      if (isNaN(floatValue)) {
          throw new Error("El valor proporcionado no es un número válido");
      }
      return floatValue.toFixed(2);
    },
    async getPaquete () {
      await this.$api.get('packages/' + this.$route.params.crear_id).then(res => {
        console.log(res.tracking, 'res')
        this.form.tracking = res.tracking
      })
    },
    async afterMounted () {
      console.log(this.form.data, 'form despues del mixin')
      console.log(this.$route.params.crear_id, 'crear id')

      this.id_almacen = this.form.id_almacen
      this.id_tracking = this.form.tracking[0].id_tracking

      if (this.$route.params.paquete_id) {
        const form = { ...this.form.data }
        form.repackage = this.form.data.repackage === 1
        form.hold = this.form.data.hold === 1
        form.insured = this.form.data.insured >= 1
        if (this.form.data.insured >= 1) {
          this.insured = this.form.data.insured
        }
        console.log(form, 'form')
        this.form = { ...form }
      } else {
        console.log('entro aqui', this.form)
        this.form = {
          shippins_id: 'maritimo',
          hold: false,
          insured: false,
          repackage: false
        }
        this.insured = 0
        // await this.getPaquete()
      }
      console.log(this.form, 'form despues del mixin')
    },
    beforeMounted () {
      const userInfo = this.UserInfo()
      this.route = `solicitudes/${this.$route.params.crear_id}?usuario_id=${userInfo.user.usuario_id}&estado=pendiente`
    },
  }
}
</script>

<style>

</style>
