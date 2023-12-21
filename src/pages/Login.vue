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
        <q-input :type="isPwd ? 'password' : 'text'" v-model="form.password" placeholder="Contraseña" dense class="full-width" bg-color="white" color="secondary" outlined
          :error="$v.form.password.$error" @blur="$v.form.password.$touch()"
        >
          <template v-slot:prepend>
            <q-icon name="lock" color="primary" />
          </template>
          <template v-slot:append>
            <q-icon :name="isPwd ? 'visibility' : 'visibility_off'" class="cursor-pointer" color="primary" @click="isPwd = !isPwd" />
          </template>
        </q-input>
      </div>
      <q-card class="column full-width items-center bg-transparent no-border no-box-shadow">
        <q-btn color="secondary" style="width:60%" label="Ingresar" @click="loguear()" push text-color="primary" class="titles-font" />
        <div class="column full-width items-center q-mt-md q-mt-xl">
          <!--  <q-btn text-color="white" label="Olvidé mi contraseña" flat dense color="primary" @click="recoveryD = true" />
          <q-space />
          -->
          <label class="text-white my-font2">¿Aún no tienes cuenta?</label>
          <q-btn label="Registrate Aquí" style="font-size:15px;letter-spacing:3px;" text-color="white" class="q-mt-sm full-width titles-font" flat color="primary" dense rounded to="/registro" />

          <label class="text-white my-font2 q-pt-md">¿Olvidó su contraseña?</label>
          <q-btn
            label="RECUPERAR CUENTA"
            style="font-size:15px;letter-spacing:3px;"
            text-color="white"
            class="q-mt-sm full-width titles-font"
            flat
            color="primary"
            dense
            rounded
            to="/forgot_password"
          />
        </div>
      </q-card>
    </div>
    <q-dialog v-model="recoveryD" class="full-width">
      <recovery :dialogo="0" class="full-width" />
    </q-dialog>
  </div>
</template>

<script>
import { mapMutations } from 'vuex'
import Recovery from '../components/RecoveryPassword'
import { required } from 'vuelidate/lib/validators'
export default {
  components: {
    Recovery
  },
  data () {
    return {
      isPwd: true,
      form: {},
      recoveryD: false
    }
  },
  validations () {
    return {
      form: {
        email: { required },
        password: { required }
      }
    }
  },
  methods: {
    ...mapMutations('generals', ['login']),
    async loguear () {
      this.$q.loading.show({
        message: 'Iniciando sesión'
      })
      this.$v.$touch()
      if (!this.$v.form.$error) {
        const tokenDis = this.$q.localStorage.getItem('dT')
        this.form.dispositiveToken = tokenDis
        try {
          await this.$api.post('login', this.form).then(res => {
            if (res) {
              if (res.user && res.user.roles[0].pivot.role_id === 1) {
                this.$q.notify({
                  message: 'No hay autorización para este nivel de usuario',
                  color: 'red-5',
                  textColor: 'white'
                })
                return
              }
              this.login(res)
              if (this.$q.platform.is.mobile) {
                window.plugins.OneSignal.sendTags({
                  email: this.form.email
                })
              }
              this.$router.push('/index')
            } else {
              console.log('error de ususario')
            }
          })
        } catch (error) {
          console.log(error, 'error login')
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
