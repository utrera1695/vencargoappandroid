<template>
  <q-page>
    <div class="column q-pa-md q-pt-xl full-width items-center">
      <q-input outlined dense v-model="data.nombre_usuario" label="Nombre de usuario" class="full-width"
        :error="$v.data.nombre_usuario.$error" @blur="$v.data.nombre_usuario.$touch()"
      />
      <q-input outlined dense v-model="data.email" label="Correo electrónico" class="full-width" type="email"
        :error="$v.data.email.$error" @blur="$v.data.email.$touch()"
      />
      <q-input outlined dense v-model="data.nombres" label="Nombre" class="full-width"
        :error="$v.data.nombres.$error" @blur="$v.data.nombres.$touch()" @input="upper(data.nombres, data.apellidos)"
      />
      <q-input outlined dense v-model="data.apellidos" label="Apellido" class="full-width"
        :error="$v.data.apellidos.$error" @blur="$v.data.apellidos.$touch()" @input="upper(data.nombres, data.apellidos)"
      />
      <q-input outlined dense v-model.number="data.cedula" label="Cédula" class="full-width" type="number"
        :error="$v.data.cedula.$error" @blur="$v.data.cedula.$touch()"
      />
      <q-input outlined dense v-model.number="data.telefono" label="Teléfono" class="full-width" type="tel"
        :error="$v.data.telefono.$error" @blur="$v.data.telefono.$touch()"
      />
      <div class="row justify-center full-width titles-font">
        <q-btn
          label="guardar"
          style="width:200px"
          color="secondary"
          text-color="primary"
          push
          @click="changeDP()"
        />
      </div>
  </div>
  </q-page>
</template>

<script>
import { required, email, maxLength } from 'vuelidate/lib/validators'
import { mapGetters } from 'vuex'

export default {
  data () {
    return {
      data: {},
      id_usuario: ''
    }
  },
  validations () {
    return {
      data: {
        nombres: { required, maxLength: maxLength(40) },
        apellidos: { required, maxLength: maxLength(40) },
        email: { required, email },
        nombre_usuario: { required, maxLength: maxLength(40) },
        cedula: { required, maxLength: maxLength(40) },
        telefono: { required, maxLength: maxLength(40) }
      }
    }
  },
  mounted () {
    this.getData()
  },
  methods: {
    ...mapGetters('generals', ['UserInfo']),
    upper (name, last) {
      this.data.nombres = name.toUpperCase()
      this.data.apellidos = last.toUpperCase()
    },
    async changeDP () {
      this.$v.$touch()
      if (!this.$v.data.$error) {
        this.$q.loading.show()
        await this.$api.put('user/client/' + this.id_usuario, this.data).then(res => {
          this.$q.loading.hide()
          console.log(res, 'res')
          if (res && res.status === 200) {
            this.$q.notify({
              color: 'green-4',
              textColor: 'white',
              icon: 'cloud_done',
              message: 'Datos actualizados correctamente.'
            })
          }
        })
      }
    },
    async getData () {
      if (!this.$v.data.$error) {
        this.$q.loading.show()
        const userInfo = this.UserInfo()
        this.id_usuario = userInfo.user.usuario_id
        await this.$api.get(`edit-user/client?usuario_id=${this.id_usuario}`).then(res => {
          this.$q.loading.hide()
          console.log(res, 'res')
          const { result } = res
          if (result) {
            this.data = result
          }
        })
      }
    }

  }
}
</script>

<style>

</style>
