<template>
  <q-page>
    <div class="column items-center full-width q-pa-lg" style="padding-bottom:0px">
      <q-input outlined dense v-model="pass" :type="isPwd ? 'password' : 'text'" label="Nueva contraseña" class="full-width"
        :error="$v.pass.$error" @blur="$v.pass.$touch()"
      >
        <template v-slot:append>
          <q-icon :name="isPwd ? 'visibility' : 'visibility_off'" class="cursor-pointer" color="primary" @click="isPwd = !isPwd" />
        </template>
      </q-input>
      <q-input outlined dense :type="isPwd ? 'password' : 'text'" v-model="repeatPass" label="Repita su contraseña" class="full-width"
      :error="$v.repeatPass.$error" @blur="$v.repeatPass.$touch()"
      >
        <template v-slot:append>
          <q-icon :name="isPwd ? 'visibility' : 'visibility_off'" class="cursor-pointer" color="primary" @click="isPwd = !isPwd" />
        </template>
      </q-input>
    </div>
    <div class="row justify-center full-width titles-font">
      <q-btn label="guardar" style="width:200px" color="secondary" text-color="primary" push @click="changePass()" />
    </div>
  </q-page>
</template>

<script>
import { required, maxLength, minLength, sameAs } from 'vuelidate/lib/validators'
import { mapGetters } from 'vuex'
export default {
  data () {
    return {
      form: {},
      oldPass: '',
      isPwd: true,
      pass: '',
      repeatPass: ''
    }
  },
  validations () {
    return {
      repeatPass: { sameAsPassword: sameAs('pass') },
      pass: { required, maxLength: maxLength(256), minLength: minLength(6) }
    }
  },
  methods: {
    ...mapGetters('generals', ['UserInfo']),
    async changePass () {
      const userInfo = await this.UserInfo()
      this.$v.$touch()
      if (!this.$v.pass.$error && !this.$v.repeatPass.$error) {
        const form = {
          password: this.pass,
          usuario_id: userInfo.user.usuario_id
        }
        this.$q.loading.show()
        await this.$api.put('user/client/' + userInfo.user.usuario_id, form).then(res => {
          this.$q.loading.hide()
          if (res.status === 200) {
            this.$q.notify({
              message: 'Contraseña cambiada con éxito',
              color: 'positive',
              icon: 'check'
            })
            this.$router.go(-1)
          }
        })
      }
    }
  }
}
</script>

<style>

</style>
