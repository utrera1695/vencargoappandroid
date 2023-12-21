<template>
  <q-page class="q-mt-sm">
    <section
      class="row q-pa-md my-font-regular q-gutter-y-xs"
    >
      <span
        class="col-12"
      >
        Número de factura: <strong> {{ nro_factura }} </strong>
      </span>
      <span class="col-12">
        Monto en USD: <strong> {{ montoShowUsd }}$ </strong>
      </span>
      <span>
        <strong>Nota: </strong> Para el pago en bolivares, la tasa de cambio a considerar, es esta:<strong> {{ !isLoadedTasa ? 'Cargando...' : tasa }} VES</strong>
        y el monto total en Bolivares es: <strong> {{ !isLoadedTasa ? 'Cargando...' : montoTotalBs }} VES</strong>
      </span>
    </section>

    <section
      class="row q-pa-md q-gutter-y-md"
    >
      <div
        class="col-12"
      >
        <q-select
          v-model="form.tipo_moneda"
          :options="moneyOpt"
          outlined
          label="Tipo de moneda"
          map-options
          option-value="value"
          option-label="label"
          emit-value
        />
      </div>

      <!-- Titular  -->
      <div
        class="col-12"
      >
        <q-input
          v-model="form.titular"
          label="Titular"
          outlined
        />
      </div>

      <!-- Numero de comprobante -->
      <div
        class="col-12"
      >
        <q-input
          v-model="form.nro_comprobante"
          label="Número de comprobante"
          outlined
        />
      </div>

      <!-- Subir comprobante de pago -->
      <div
        class="col-12 row"
      >
        <q-file
          outlined
          v-model="form.comprobante_pago"
          label="Sube el comprobante de pago"
        />
      </div>

      <!-- Mostrar card de los datos del pago segun el tipo de moneda -->
      <!-- <div
        class="col-12 row"
      >
        <q-card
          class="col-12 q-pa-md my-font-regular"
        >
          <span class="col-12 text-bold">BANK OF AMERICA</span> <br><br>

          <span
            class="col-12"
          >
            <strong>NRO DE CUENTA:</strong>
            3340 4444 5555 6666
          </span>

          <span
            class="col-12"
          >
            <strong>TIPO:</strong>
            CTA CORRIENTE
          </span>

          <span
            class="col-12"
          >
            <strong>ABA ROUTING NUMBER:</strong>
            BOFAUS3N
          </span>
        </q-card>
      </div> -->
      <div
        class="col-12 row q-gutter-y-md"
      >
        <q-card
            v-for="(payment, index) in filteredPaymentsMethods"
            :key="index"
            class="col-12 q-pa-md my-font-regular row"
            style="box-shadow: 0px 0px 5px 0px #0000004d; position: relative"
        >
          <q-btn
          @click="copyToClipboard(payment)"
            icon="content_copy"
            flat
            round
            dense
            color="secondary"
            style="position: absolute; top: 10px; right: 10px;"
          />

          <span class="col-12 text-bold">{{ payment.name }}</span> <br><br>

          <span
              v-if="payment.account"
              class="col-12"
          >
              <strong>NRO DE CUENTA:</strong>
              {{ payment.account }}
          </span>

          <span
              v-if="payment.type"
              class="col-12"
          >
              <strong>TIPO:</strong>
              {{ payment.type }}
          </span>

          <span
              v-if="payment.headline"
              class="col-12"
          >
              <strong>TITULAR:</strong>
              {{ payment.headline }}
          </span>

          <span
              v-if="payment.id"
              class="col-12"
          >
              <strong>C.I:</strong>
              {{ payment.id }}
          </span>

          <span
              v-if="payment.phone"
              class="col-12"
          >
              <strong>TELÉFONO:</strong>
              {{ payment.phone }}
          </span>

          <span
              v-if="payment.extra && payment.extra['ABA ROUTING NUMBER']"
              class="col-12"
          >
              <strong>ABA ROUTING NUMBER:</strong>
              {{ payment.extra['ABA ROUTING NUMBER'] }}
          </span>

          <span
              v-if="payment.nota"
              class="col-12"
          >
              <strong>NOTA:</strong>
              {{ payment.nota }}
          </span>

          <span
              v-if="payment.email"
              class="col-12"
          >
              <strong>CORREO ELECTRÓNICO:</strong>
              {{ payment.email }}
          </span>
        </q-card>
      </div>

      <!-- Boton de enviar -->
      <div
        class="col-12 flex flex-center"
      >
        <q-btn
          label="Enviar"
          class="q-px-md bg-secondary text-primary my-font-extra-bold"
          @click="onSumbit"
        />
      </div>
    </section>
  </q-page>
</template>

<script>
import { mapGetters } from 'vuex'
import Big from 'big.js';
import { required } from 'vuelidate/lib/validators'
export default {
  data () {
    return {
      id: this.$route.params.id,
      form: {
        tipo_moneda: 'USD',
        titular: '',
        nro_comprobante: '',
        comprobante_pago: null
      },
      usuario_id: null,
      tasa: 5.89,
      tasaSubmit: 5.89,
      montoShowUsd: 0,
      montoTotalBs: 0,
      montoTotalBsSubmit: 0,
      nro_factura: '',
      moneyOpt: [
        {
          label: 'Dolares',
          value: 'USD'
        },
        {
          label: 'Bolivares',
          value: 'VES'
        }
      ],
      paymentsMethods: [],
      isLoadedTasa: false,
      // filteredPaymentsMethods: []
    }
  },
  validations () {
    return {
      form: {
        tipo_moneda: {
          required
        },
        titular: {
          required
        },
        nro_comprobante: {
          required
        },
        comprobante_pago: {
          required
        }
      }
    }
  },
  async mounted() {
    this.usuario_id = this.UserInfo().user.usuario_id
    this.getPaymentsMethod()
    await this.getFactura()
    this.getTasa()
  },
  computed: {
    filteredPaymentsMethods () {
      // return this.paymentsMethods.filter(payment => payment.type_payment === this.form.tipo_moneda)
      // validar de que si es USD, filtre los metodos de pago que tengan USD y a su vez tambien USDT, si es VES normal
      if (this.form.tipo_moneda === 'USD') {
        return this.paymentsMethods.filter(payment => payment.type_payment === 'USD' || payment.type_payment === 'USDT')
      } else {
        return this.paymentsMethods.filter(payment => payment.type_payment === 'VES')
      }
    }
  },
  methods: {
    ...mapGetters('generals', ['UserInfo']),
    async onSumbit () {
      // validar los campos
      this.$v.$touch()
      if (!this.$v.form.$error) {
        // enviar el formulario
        const formData = new FormData()
        formData.append('tipo_moneda', this.form.tipo_moneda)
        formData.append('titular', this.form.titular)
        formData.append('nro_comprobante', this.form.nro_comprobante)
        formData.append('comprobante', this.form.comprobante_pago)
        formData.append('usuario_id', this.usuario_id)
        formData.append('id_factura', this.id)
        formData.append('tasa', this.tasaSubmit)
        formData.append('total_ves', this.montoTotalBsSubmit)
        this.$q.loading.show()
        await this.$api.post('save-pago', formData).then(res => {
          this.$q.loading.hide()
          if (res) {
            this.$q.notify({
              message: 'Pago reportado con éxito',
              color: 'positive',
              icon: 'check'
            })
            this.$router.go(-1)
          }
        })
      }
    },
    async getFactura () {
      await this.$api.get('shipments/' + this.id + '?usuario_id=' + this.usuario_id).then(res => {
        if (res) {
          this.montoShowUsd = res.result.total_usd
          // this.montoTotalBs = res.result.total_ves
          // this.tasa = res.result.monto_tc
          this.nro_factura = res.result.nro_factura
        }
      })
    },
    parseEuropeanNumber (str) {
      return parseFloat(str.replace(/\./g, '').replace(',', '.'));
    },
    // hace lo mismo que parseEuropeanNumber pero al revez, cambia el punto por una coma, sin parse float
    parseEuropeanNumber2 (str) {
      return str.replace(/\./g, ',');
    },
    async getTasa() {
      try {
        const res = await this.$api.get(`tasas-monedas?usuario_id=${this.usuario_id}`);
        if (res) {
          const tasaValue = this.parseEuropeanNumber(res.results.monto_tc.toString());
          const montoShowUsd = this.montoShowUsd

          this.tasa = new Big(tasaValue);
          this.tasaSubmit = res.results.monto_tc
          this.montoShowUsd = new Big(montoShowUsd);

          const montoTotalBs = this.tasa.times(this.montoShowUsd).toFixed(2);
          this.montoTotalBs = montoTotalBs;
          this.isLoadedTasa = true;

          this.montoTotalBsSubmit = this.parseEuropeanNumber2(montoTotalBs.toString());
        }
      } catch (error) {
        console.error('Error al obtener la tasa:', error);
      }
    },
    getPaymentsMethod () {
      this.$api.get('methods-payments').then(res => {
        if (res) {
          this.paymentsMethods = res.results
        }
      })
    },
    copyToClipboard (payment) {
      let content = `NOMBRE: ${payment.name}\n`;

      if (payment.account) content += `NRO DE CUENTA: ${payment.account}\n`;
      if (payment.type) content += `TIPO: ${payment.type}\n`;
      if (payment.headline) content += `TITULAR: ${payment.headline}\n`;
      if (payment.id) content += `C.I: ${payment.id}\n`;
      if (payment.phone) content += `TELÉFONO: ${payment.phone}\n`;
      if (payment.extra && payment.extra['ABA ROUTING NUMBER']) content += `ABA ROUTING NUMBER: ${payment.extra['ABA ROUTING NUMBER']}\n`;
      if (payment.nota) content += `NOTA: ${payment.nota}\n`;
      if (payment.email) content += `CORREO ELECTRÓNICO: ${payment.email}\n`;

      const el = document.createElement('textarea');  // Crea un nuevo elemento textarea
      el.value = content;                             // Asigna el valor del texto a copiar
      document.body.appendChild(el);                  // Añade el textarea al cuerpo del documento
      el.select();                                    // Selecciona el contenido del textarea
      try {
        document.execCommand('copy');                 // Intenta copiar el contenido seleccionado
        this.$q.notify({
          message: 'La información ha sido copiada con éxito',
          color: 'positive',
        });
      } catch (err) {
        this.$q.notify('Failed to copy payment details');
        console.log('Something went wrong', err);
      }
      document.body.removeChild(el);                  // Elimina el textarea del cuerpo del documento después de copiar
    }

  }
}
</script>
