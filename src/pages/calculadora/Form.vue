<template>
  <q-page>
    <div class="column window-width q-mt-sm">
      <q-card class="q-ma-md q-pa-md no-shadow box-shadow-card" style="border-radius:10px">
        <div class="text-center titles-font" style="font-size:16px">TIPO DE ENVÍO</div>
        <div class="row q-mt-md justify-center full-width">
          <div class="column" @click="modelEnvio = 'maritimo'">
            <div :class="modelEnvio != 'maritimo' ? 'caja' : 'caja-seleccionada'">
              <q-img :src="modelEnvio != 'maritimo' ? 'ship-blue.svg' : 'ship-light.svg'" />
            </div>
            <div class="q-mt-xs text-center my-font-semibold text-uppercase color-label">Marítimo</div>
          </div>
          <div class="column q-ml-xl" @click="modelEnvio = 'aereo'">
            <div :class="modelEnvio != 'aereo' ? 'caja' : 'caja-seleccionada'">
              <q-img :src="modelEnvio != 'aereo' ? 'airplane-blue.svg' : 'airplane-light.svg'" />
            </div>
            <div class="q-mt-xs text-center my-font-semibold text-uppercase color-label">Aéreo</div>
          </div>
        </div>
        <div class="q-mt-lg text-center titles-font" style="font-size:16px">SELECCIONE EL DESTINO</div>
        <q-select
          class="q-pa-sm spacing-letter my-font-regular"
          outlined
          v-model="form.estado_id"
          label="Destino"
          dense
          style="width:100%"
          :options="destino"
          option-label="estado"
          option-value="id_estado"
          emit-value
          map-options
          :error="$v.form.estado_id.$error"
          @blur="$v.form.estado_id.$touch()"
        >
          <template v-slot:option="scope">
            <q-item
              v-bind="scope.itemProps"
              v-on="scope.itemEvents"
              >
              <q-item-section>
                <q-item-label class="my-font-regular" v-html="scope.opt.estado" />
              </q-item-section>
            </q-item>
          </template>
          <template v-slot:selected-item="scope">
            <div class="text-black">{{scope.opt.estado}}</div>
          </template>
        </q-select>
      </q-card>

      <q-card class="q-ma-md q-pa-md no-shadow box-shadow-card" style="border-radius:10px;margin-top:2px !important">
        <div class="row items-end">
          <div class="text-left titles-font text-uppercase" style="font-size:16px">Dimensiones</div>
          <div class="text-left my-font-regular color-labelT text-uppercase  q-ml-sm" style="font-size:14px">pulgadas</div>
        </div>

        <div class="row justify-between items-center full-width q-pa-sm q-mt-md">
          <div class="col-3 q-ml-xs q-mr-xs">
            <q-input
              v-model="form.ancho"
              dense
              label="Ancho"
              outlined
              type="number"
              class="my-font-semibold"
              :error="$v.form.ancho.$error"
              @blur="$v.form.ancho.$touch()"
              :input-style="{ color: 'black' }"
            />
          </div>
          <div class="my-font-semibold q-mb-sm"> X </div>
          <div class="col-3 q-ml-xs q-mr-xs">
            <q-input
              v-model="form.largo"
              dense
              label="Largo"
              outlined
              type="number"
              class="my-font-semibold"
              :error="$v.form.largo.$error"
              @blur="$v.form.largo.$touch()"
              :input-style="{ color: 'black' }"
            />
          </div>
          <div class="my-font-semibold q-mb-sm"> X </div>
          <div class="col-3 q-ml-xs q-mr-xs">
            <q-input
              v-model="form.alto"
              dense
              label="Alto"
              outlined
              type="number"
              class="my-font-semibold"
              :error="$v.form.alto.$error"
              @blur="$v.form.alto.$touch()"
              :input-style="{ color: 'black' }"
            />
          </div>
          <div class="col-3 q-ml-xs q-mr-xs q-mt-sm">
            <q-input
              v-model="form.peso"
              dense
              label="Peso"
              outlined
              type="number"
              class="my-font-semibold"
              :error="$v.form.peso.$error"
              @blur="$v.form.peso.$touch()"
              :input-style="{ color: 'black' }"
            />
          </div>
        </div>

        <div class=" q-mt-md titles-font text-uppercase" style="font-size:16px">¿Desea Reempaque?</div>
        <div class="q-mt-sm my-font-semibold">
          <q-radio
            v-model="form.reempaque"
            val="si"
            label="Si"
            color="secondary"
          />
          <q-radio
            v-model="form.reempaque"
            val="no"
            label="No"
            color="secondary"
            class="q-ml-md"
          />
        </div>

        <div class="row justify-center q-mt-lg titles-font">
          <q-btn color="secondary" text-color="primary" label="Calcular" push style="height:50px;width:150px" @click="calculate()" />
        </div>
      </q-card>

      <q-dialog v-model="alert" class="window-width" >
        <q-card class="my-font-regular window-width">
          <q-card-section>
            <div class="text-h6 text-bold text-uppercase my-font-extra-bold">COSTO DE ENVÍO</div>
          </q-card-section>

          <q-card-section class="q-pt-none color-siete row" style="font-size:16px">

            <div>
              TARIFA DE ENVIÓ: {{ message.tarifa }} USD <br>

              VOLUMEN: {{ message.volumen }} <br>

              PIE CUBICO: {{ message.pie_cubico }}  <br>

              COSTO REEMPAQUE: {{ message.cost_reempaque }} USD <br>

              COSTO X TRACKING: {{ message.cost_tracking }} USD <br>

              TOTAL DE ENVIÓ: {{ message.total }} USD <br>
            </div>
          </q-card-section>

          <q-card-actions align="right">
            <q-btn flat label="OK" color="primary" v-close-popup />
          </q-card-actions>
        </q-card>
      </q-dialog>

    </div>
  </q-page>
</template>

<script>
import { required } from 'vuelidate/lib/validators'
import { mapGetters } from 'vuex'
export default {
  data () {
    return {
      alert: false,
      message: 'Costo del Envio',
      form: {
        reempaque: 'si'
      },
      modelEnvio: 'maritimo',
      destino: [],
      toggle: true,
      repackage: '0'
    }
  },
  validations () {
    return {
      form: {
        estado_id: { required },
        ancho: { required },
        largo: { required },
        alto: { required },
        peso: { required }
      },
      modelEnvio: { required }
    }
  },
  mounted () {
    this.getDestinos()
  },
  methods: {
    ...mapGetters('generals', ['UserInfo']),
    async calculate () {
      this.$v.$touch()
      if (!this.$v.form.$error && !this.$v.modelEnvio.$error) {
        var form = { ...this.form }
        form.tipo_envio = this.modelEnvio
        console.log(form, 'form')
        this.$q.loading.show()

        const usuario_id = this.UserInfo().user.usuario_id
        form.usuario_id = usuario_id

        const params = new URLSearchParams(form)

        await this.$api.get(`calculadora?${params.toString()}`).then((res) => {
          console.log(res, 'res')
          this.$q.loading.hide()
          this.message = res.result
          this.alert = true
        });
      }
    },
    async getDestinos () {
      this.$q.loading.show()
      const res = await this.$api.get('estados')
      this.$q.loading.hide()
      if (res.results && res.results.all && res.results.all.length > 0) {
        this.destino = res.results.all
      }
    }
  }
}
</script>

<style scoped lang="scss">
.caja {
  border-radius: 10px;
  border: 4px solid $primary;
  padding: 10px;
  width: 100px;
  height: 100px;
}

.caja-seleccionada {
  border-radius: 10px;
  border: 3px solid $primary;
  padding: 10px;
  width: 100px;
  height: 100px;
  background-color: $primary;
}

.color-label {
  color: #777777 !important;
}

.color-labelT {
  color: #AAAAAA !important;
}

.spacing-letter {
  letter-spacing:-1px;
}
</style>
