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
    <q-input outlined dense v-model.number="data.cedula" label="Cédula" class="full-width" type="number"
      :error="$v.data.cedula.$error" @blur="$v.data.cedula.$touch()"
    />
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
        apellidos: ''
      },
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
        cedula: { required, maxLength: maxLength(40) },
        telefono: { required, maxLength: maxLength(40) }
      },
      repeatPass: { sameAsPassword: sameAs('pass') },
      pass: { required, maxLength: maxLength(256), minLength: minLength(6) }
    }
  },
  methods: {
    upper (name, last) {
      this.data.nombres = name.toUpperCase()
      this.data.apellidos = last.toUpperCase()
    },
    next () {
      this.$v.$touch()
      if (!this.$v.data.$error && !this.$v.pass.$error && !this.$v.repeatPass.$error) {
        this.data.password = this.pass

        this.$emit('next', this.data)
      }
    }
  }
}
</script>
