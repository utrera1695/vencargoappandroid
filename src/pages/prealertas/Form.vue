<template>
  <q-page
    class="flex flex-center q-pa-none q-ma-none"
  >
    <div class="q-ma-xs q-mt-lg">
      <q-card-section>
        <q-input
          outlined
          v-model="form.tracking"
          label="Número de tracking"
          class="full-width"
          :error="$v.form.tracking.$error"
          @blur="$v.form.tracking.$touch()"
          dense
        />
        <q-select
          outlined
          v-model="form.company_id"
          label="Selecciona un transporte"
          class="full-width"
          error-message="Campo Requerido"
          :error="$v.form.company_id.$error"
          @blur="$v.form.company_id.$touch()"
          :options="empresas"
          option-label="nombre"
          option-value="id_empresa_transporte"
          emit-value
          map-options
          dense
        />
        <q-input
          outlined
          v-model="form.date_in"
          label="Fecha estimada de llegada"
          class="full-width"
          error-message="Campo Requerido"
          :error="$v.form.date_in.$error"
          @blur="$v.form.date_in.$touch()"
          mask="date"
          :rules="['date']"
          @focus="openDate()"
          dense
        >
          <template v-slot:append>
            <q-icon name="event" class="cursor-pointer" id="qDateIcon" color="secondary">
              <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
                <q-date v-model="form.date_in">
                  <div class="row items-center justify-end">
                    <q-btn v-close-popup label="Cerrar" color="primary" flat />
                  </div>
                </q-date>
              </q-popup-proxy>
            </q-icon>
          </template>
        </q-input>

        <!-- Descripcion -->
        <q-input
          outlined
          v-model="form.description"
          label="Descripción"
          class="full-width"
          type="textarea"
          counter
          maxlength="180"
          dense
          :error="$v.form.description.$error"
          @blur="$v.form.description.$touch()"
        />

      </q-card-section>
      <q-card-actions align="center">
        <q-btn v-if="!id" label="Registrar" push color="secondary" text-color="primary" class="titles-font" style="height:36px;width:90%" @click="save()" />
        <q-btn v-if="id" label="Guardar" push color="secondary" text-color="primary" class="titles-font" style="height:36px;width:90%" @click="update()" />
      </q-card-actions>
    </div>
  </q-page>
</template>

<script>
import { mapGetters } from 'vuex'
import { required, maxLength } from 'vuelidate/lib/validators'
import { date } from 'quasar'
export default {
  data () {
    return {
      id: this.$route.params.id,
      title: 'Nueva Pre-Alerta',
      form: {
        tracking: '',
        company_id: '',
        date_in: '',
        description: ''
      },
      empresas: [],
      usuario_id: ''
    }
  },
  validations () {
    return {
      form: {
        tracking: { required },
        company_id: { required },
        date_in: { required },
        description: { required, maxLength: maxLength(180) }
      }
    }
  },
  mounted () {
    this.usuario_id = this.UserInfo().user.usuario_id
    this.getCompanies()
    if (this.$route.params.id) {
      this.getRecord()
    }
  },
  methods: {
    ...mapGetters('generals', ['UserInfo']),
    async update () {
      this.$q.loading.show()
      this.$v.$touch()
      if (!this.$v.form.$error) {
        const formattedString = date.formatDate(this.form.date_in, 'YYYY-MM-DD')
        var form = { tracking: this.form.tracking, date_in: this.form.date_in, company_id: this.form.company_id, id: this.form.id }
        form.date_in = formattedString
        await this.$api.patch('prealerts/update', form).then(res => {
          this.$q.loading.hide()
          if (!res.error) {
            this.$q.notify({
              message: 'Prealerta Actualizada Correctamente',
              color: 'positive'
            })
            this.$router.go(-1)
          }
        })
      }
    },
    async getRecord () {
      this.$q.loading.show()
      await this.$api.get(`solicitudes/${this.id}?usuario_id=${this.usuario_id}&&estado=pendiente`).then(res => {
        this.$q.loading.hide()
        if (res && res.status === 200) {
          const formattedString = date.formatDate(res.results.solicitud_fecha_llegada, 'YYYY/MM/DD')
          this.form.tracking = res.results.tracking[0].tracking
          this.form.description = res.results.tracking[0].descripcion
          this.form.company_id = res.results.id_empresa_transporte
          this.form.date_in = formattedString
        }
      })
    },
    async getCompanies () {
      this.$q.loading.show()
      await this.$api.get(`/transport-companies?usuario_id=${this.usuario_id}`).then(res => {
        this.$q.loading.hide()
        if (!res.error) {
          this.empresas = res.results
          this.form.company_id = this.empresas[0].id_empresa_transporte
        }
      })
    },
    openDate () {
      const iconDate = document.getElementById('qDateIcon')
      iconDate.click()
    },
    async save () {
      this.$q.loading.show()
      this.$v.$touch()
      if (!this.$v.form.$error) {
        const formattedString = date.formatDate(this.form.date_in, 'YYYY-MM-DD')
        const form = {
          usuario_id: this.usuario_id,
          trackings: [
            {
              id_empresa_transporte: this.form.company_id,
              fecha_llegada: formattedString,
              tracking: this.form.tracking,
              descripcion: this.form.description
            }
          ]
        }

        await this.$api.post('solicitudes', form).then(res => {
          this.$q.loading.hide()
          if (!res.error) {
            this.$q.notify({
              message: 'Prealerta Guardada Correctamente',
              color: 'positive'
            })
            this.$router.go(-1)
          }
        })
      }
      this.$q.loading.hide()
    }
  }
}
</script>

<style>

</style>
