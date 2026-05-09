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
      <q-input outlined dense v-model="data.cedula" label="Cédula o RIF" class="full-width"
        :error="$v.data.cedula.$error"
        :error-message="cedulaErrorMessage"
        @blur="$v.data.cedula.$touch()"
        @input="checkCedula(data.cedula)"
        @keypress="filterCedula"
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
import { required, email, maxLength, minLength } from 'vuelidate/lib/validators'
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
        cedula: {
          required,
          validLength: (val) => {
            const strVal = val ? String(val) : ''
            const digits = strVal.replace(/[^0-9]/g, '').length
            return digits >= 5 && digits <= 9
          }
        },
        telefono: { required, maxLength: maxLength(40) }
      }
    }
  },
  computed: {
    cedulaErrorMessage () {
      if (!this.$v.data.cedula.required) return 'La cédula o RIF es requerida'
      if (!this.$v.data.cedula.validLength) return 'La cédula o RIF debe tener entre 5 y 8 números'
      return ''
    }
  },
  watch: {
    'data.cedula': function (val) {
      if (val) {
        const strVal = String(val)
        const text = strVal.toUpperCase().replace(/[^VJE0-9]/g, '')
        let formatted = text
        if (text.length > 0 && 'VJE'.includes(text.charAt(0))) {
          formatted = text.length > 1 ? `${text.charAt(0)}-${text.substring(1)}` : text
        }
        if (val !== formatted) {
          this.data.cedula = formatted
        }
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
    filterCedula (evt) {
      const char = String.fromCharCode(evt.keyCode || evt.which).toUpperCase()
      const val = this.data.cedula ? String(this.data.cedula) : ''
      if (/[0-9]/.test(char)) return true
      if (['V', 'J', 'E'].includes(char) && val.length === 0) return true
      evt.preventDefault()
      return false
    },
    checkCedula (val) {
      if (val) {
        const strVal = String(val)
        const text = strVal.toUpperCase().replace(/[^VJE0-9]/g, '')
        if (text.length > 0 && 'VJE'.includes(text.charAt(0))) {
          this.data.cedula = text.length > 1 ? `${text.charAt(0)}-${text.substring(1)}` : text
        } else {
          this.data.cedula = text
        }
      }
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
