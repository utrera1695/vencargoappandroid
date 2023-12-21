<template>
  <div class="window-width window-height fondo-style my-font">
    <div class="absolute-center bg-transparent column items-center radio-bordes q-pa-sm q-pb-lg" style="width:90%">
      <q-img class="bg-transparent" src="logolight.svg" style="width:70%;height:15%;border-radius:12px" />
      <div class="column q-ma-sm q-mt-xl">
        <q-input v-model="form.email" dense placeholder="Correo electrónico" class="full-width" bg-color="white" color="secondary" outlined
          :error="$v.form.email.$error" @blur="$v.form.email.$touch()"
        >
          <template v-slot:prepend>
            <q-icon name="mail" color="primary"></q-icon>
          </template>
        </q-input>
      </div>
      <q-card class="column full-width items-center bg-transparent no-border no-box-shadow">
        <q-btn color="secondary" style="width:60%" label="Recuperar cuenta" @click="loguear()" push text-color="primary" class="titles-font" />
        <div class="column full-width items-center q-mt-md q-mt-xl">
          <!--  <q-btn text-color="white" label="Olvidé mi contraseña" flat dense color="primary" @click="recoveryD = true" />
          <q-space />
          -->
          <label class="text-white my-font2">¿Tienes cuenta?</label>
          <q-btn
            label="INICIA SESIÓN AQUÍ"
            style="font-size:15px;letter-spacing:3px;"
            text-color="white"
            class="q-mt-sm full-width titles-font"
            flat
            color="primary"
            dense
            rounded
            to="/login"
          />
        </div>
      </q-card>
    </div>
  </div>
</template>

<script>
import { mapMutations } from 'vuex'
import { required } from 'vuelidate/lib/validators'
export default {
  data () {
    return {
      form: {},
      recoveryD: false
    }
  },
  validations () {
    return {
      form: {
        email: { required }
      }
    }
  },
  methods: {
    ...mapMutations('generals', ['login']),
    async loguear () {
      this.$q.loading.show({
        message: 'Cargando...'
      })
      this.$v.$touch()
      if (!this.$v.form.$error) {
        const tokenDis = this.$q.localStorage.getItem('dT')
        this.form.dispositiveToken = tokenDis
        try {
          await this.$api.post('user/forgout_password', this.form).then(res => {
            if (res) {
              this.$q.notify({
                message: res.message,
                color: 'positive',
                icon: 'check',
                position: 'top',
                // tiempo fijo
                timeout: 999999999,
                actions: [
                  { label: 'OK', color: 'white', handler: () => { /* ... */ } }
                ]
              })
            } else {
              console.log('error de ususario')
            }
          })
        } catch (error) {
          console.log(error, 'error al recuperar')
        } finally {
          this.$q.loading.hide()
        }
      }
      this.$q.loading.hide()
    }
  }
}
</script>

<style scoped lang="scss">
</style>
