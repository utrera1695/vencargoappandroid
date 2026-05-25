<template>
  <div class="column full-width items-center">
    <q-input outlined dense v-model="data.nombre_usuario" label="Nombre de usuario" class="full-width"
      :error="$v.data.nombre_usuario.$error" @blur="$v.data.nombre_usuario.$touch()"
    />
    <q-input outlined dense v-model="pass" :type="isPwd ? 'password' : 'text'" label="Contraseña" class="full-width"
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
    <q-input
      outlined
      dense
      v-model="data.email"
      label="Correo electrónico"
      class="full-width"
      type="email"
      :error="$v.data.email.$error"
      @blur="$v.data.email.$touch()"
    />
    <q-input
      outlined
      dense
      v-model="data.nombres"
      label="Nombre"
      class="full-width"
      :error="$v.data.nombres.$error"
      @blur="$v.data.nombres.$touch()"
      @input="upper(data.nombres, data.apellidos)"
    />
    <q-input
      outlined
      dense
      v-model="data.apellidos"
      label="Apellido"
      class="full-width"
      :error="$v.data.apellidos.$error"
      @blur="$v.data.apellidos.$touch()"
      @input="upper(data.nombres, data.apellidos)"
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
    <div class="row justify-end full-width titles-font">
      <q-btn label="siguiente" color="secondary" text-color="primary" push @click="next()" />
    </div>
  </div>
</template>

<script>
import { required, email, maxLength, minLength, sameAs } from 'vuelidate/lib/validators'
export default {
  props: ['form'],
  data () {
    return {
      data: {
        nombres: '',
        apellidos: '',
        cedula: ''
      },
      cedulaPrefix: 'V',
      cedulaNumber: '',
      isPwd: true,
      pass: '',
      repeatPass: ''
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
      },
      repeatPass: { sameAsPassword: sameAs('pass') },
      pass: { required, maxLength: maxLength(256), minLength: minLength(6) }
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
  methods: {
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
    next () {
      this.$v.$touch()
      if (
        !this.$v.data.nombres.$error &&
        !this.$v.data.apellidos.$error &&
        !this.$v.data.email.$error &&
        !this.$v.data.nombre_usuario.$error &&
        !this.$v.data.telefono.$error &&
        !this.$v.cedulaNumber.$error &&
        !this.$v.pass.$error &&
        !this.$v.repeatPass.$error
      ) {
        this.data.password = this.pass
        this.data.cedula = this.cedulaPrefix + this.cedulaNumber

        this.$emit('next', this.data)
      }
    }
  }
}
</script>
