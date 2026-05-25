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
      <div class="row q-col-gutter-sm full-width q-pb-md">
        <div class="col-4">
          <q-select
            outlined
            dense
            v-model="cedulaPrefix"
            :options="['V', 'J', 'E']"
            label="Prefijo"
            class="full-width"
          />
        </div>
        <div class="col-8">
          <q-input
            outlined
            dense
            v-model="cedulaNumber"
            label="Cédula o RIF"
            class="full-width"
            type="tel"
            :maxlength="cedulaPrefix === 'J' ? 9 : 8"
            :error="$v.cedulaNumber.$error"
            :error-message="cedulaErrorMessage"
            @blur="$v.cedulaNumber.$touch()"
            @keypress="onlyDigits"
          />
        </div>
      </div>
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
      cedulaPrefix: 'V',
      cedulaNumber: '',
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
        telefono: { required, maxLength: maxLength(40) }
      },
      cedulaNumber: {
        required,
        validLength: (val) => {
          const strVal = val ? String(val) : ''
          const len = strVal.length
          const maxLen = this.cedulaPrefix === 'J' ? 9 : 8
          return len >= 6 && len <= maxLen
        }
      }
    }
  },
  computed: {
    cedulaErrorMessage () {
      if (!this.$v.cedulaNumber.required) return 'La cédula o RIF es requerida'
      if (!this.$v.cedulaNumber.validLength) {
        const maxLen = this.cedulaPrefix === 'J' ? 9 : 8
        return `La cédula o RIF debe tener entre 6 y ${maxLen} números`
      }
      return ''
    }
  },
  watch: {
    cedulaPrefix (newVal) {
      const maxLen = newVal === 'J' ? 9 : 8
      if (this.cedulaNumber.length > maxLen) {
        this.cedulaNumber = this.cedulaNumber.substring(0, maxLen)
      }
      this.data.cedula = newVal + this.cedulaNumber
    },
    cedulaNumber (newVal) {
      const filtered = newVal.replace(/[^0-9]/g, '')
      const maxLength = this.cedulaPrefix === 'J' ? 9 : 8
      let finalVal = filtered
      if (filtered.length > maxLength) {
        finalVal = filtered.substring(0, maxLength)
      }
      if (newVal !== finalVal) {
        this.cedulaNumber = finalVal
      }
      this.data.cedula = this.cedulaPrefix + this.cedulaNumber
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
    onlyDigits (evt) {
      const char = String.fromCharCode(evt.keyCode || evt.which)
      if (/[0-9]/.test(char)) return true
      evt.preventDefault()
      return false
    },
    async changeDP () {
      this.$v.$touch()
      if (
        !this.$v.data.nombres.$error &&
        !this.$v.data.apellidos.$error &&
        !this.$v.data.email.$error &&
        !this.$v.data.nombre_usuario.$error &&
        !this.$v.data.telefono.$error &&
        !this.$v.cedulaNumber.$error
      ) {
        this.data.cedula = this.cedulaPrefix + this.cedulaNumber
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
      this.$q.loading.show()
      const userInfo = this.UserInfo()
      this.id_usuario = userInfo.user.usuario_id
      await this.$api.get(`edit-user/client?usuario_id=${this.id_usuario}`).then(res => {
        this.$q.loading.hide()
        console.log(res, 'res')
        const { result } = res
        if (result) {
          this.data = result
          // Parse cedula
          let prefix = 'V'
          let number = ''
          if (result.cedula) {
            const cleanCedula = result.cedula.trim()
            const match = cleanCedula.match(/^([VJE])?-?([0-9]+)$/i)
            if (match) {
              prefix = match[1] ? match[1].toUpperCase() : 'V'
              number = match[2] || ''
            } else {
              const firstChar = cleanCedula.charAt(0).toUpperCase()
              if (firstChar === 'V' || firstChar === 'J' || firstChar === 'E') {
                prefix = firstChar
              } else {
                prefix = 'V'
              }
              number = cleanCedula.replace(/[^0-9]/g, '')
            }
          }
          this.cedulaPrefix = prefix
          this.cedulaNumber = number
        }
      })
    }

  }
}
</script>

<style>

</style>
