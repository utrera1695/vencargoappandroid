<template>
  <div class="window-width window-height bg-white my-font">
    <q-toolbar class="text-primary bg-secondary absolute-top shadow-2">
      <q-btn flat round dense icon="arrow_back" color="primary" @click="volver()" />
      <q-toolbar-title class="text-primary titles-font text-uppercase">
        Registro
      </q-toolbar-title>
    </q-toolbar>
    <div class="column full-width items-center" style="padding-top:70px">
      <div class="column items-center q-pb-lg" style="width:90%">
        <q-tab-panels v-model="panel" animated class="full-width">
        <q-tab-panel name="1" class="full-width full-height">
          <q-scroll-area style="height: 80vh; width: 100%;">
            <!-- <div class="text-h6 text-primary text-center q-mt-sm text-bold titles-font">Ingresa tus Datos:</div> -->
            <parte-uno :form="form" @next="next" class="q-pa-sm" />
          </q-scroll-area>
        </q-tab-panel>

        <q-tab-panel name="2">
          <!-- <div class="text-h6 titles-font text-primary text-center">Direccion de Entrega:</div>

          <div class="column">
            <q-select outlined dense v-model="cadena.state" label="Estado" class="full-width" type="email"
              error-message="Campo Requerido" :error="$v.cadena.state.$error" @blur="$v.cadena.state.$touch()"
              :options="states" @input="showMap = false, cadena.city = null"
            />
            <q-select v-if="!$v.cadena.state.$error && cadena.state" outlined dense v-model="cadena.city" label="Ciudad" class="full-width" type="email"
              error-message="Campo Requerido" :error="$v.cadena.city.$error" @blur="$v.cadena.city.$touch()"
              :options="cities" @input="showMapF()"
            />
          </div>-->
          <div class="full-width" v-if="showMap">
            <parte-dos
              @returnCSC="returnCSC"
            />
          </div>
          <div class="row full-width q-mt-md titles-font">
            <q-btn label="Volver" flat icon="arrow_back" color="primary" text-color="secondary" push @click="previous()" />
            <q-space />
            <q-btn label="Regístrate" color="secondary" text-color="primary" push @click="registrar()" />
          </div>
        </q-tab-panel>

      </q-tab-panels>
      </div>
    </div>
  </div>
</template>

<script>
import ParteUno from '../components/Registro/Parte1.vue'
import ParteDos from '../components/Registro/Parte2.vue'
import { required } from 'vuelidate/lib/validators'
export default {
  components: {
    ParteUno, ParteDos
  },
  data () {
    return {
      states: ['Carabobo', 'Yaracuy'],
      cities: ['Valencia', 'Nirgua'],
      showMap: true,
      center: { lat: 7.160324358507094, lng: -66.12789678449094 },
      form: {},
      panel: '1',
      cadena: {},
      respuesta: {}
    }
  },
  validations () {
    return {
      cadena: {
        state: { required },
        city: { required }
      }
    }
  },
  methods: {
    volver () {
      if (this.panel === '1') {
        this.$router.push('/login')
      } else {
        this.panel = '1'
      }
    },
    showMapF () {
      this.showMap = true
    },
    previous () {
      this.panel = '1'
    },
    async registrar () {
      this.$q.loading.show()
      const form = {
        ...this.form
      }
      await this.$api.post('user/crear-cuenta', form).then(res => {
        if (res) {
          window.plugins.OneSignal.sendTags({
            email: this.form.email
          })
          this.$router.push('/login')
        }
      })
      this.$q.loading.hide()
    },
    next (data) {
      this.form = data
      this.panel = '2'
    },
    returnCSC (csc) {
      this.form.direccion = csc.direccion
      this.form.ref_direccion = csc.ref_direccion
      this.form.id_estado = csc.ubigeo.id_estado
      this.form.id_ubigeo = csc.ubigeo.id_ubigeo
    }
  }
}
</script>
