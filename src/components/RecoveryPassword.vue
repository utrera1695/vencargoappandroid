<template>
  <div>
    <q-card v-if="dialogo === 0" class="radio-bordes">
      <q-card-section>
        <div class="text-subtitle1">Recupera tu Contraseña</div>
      </q-card-section>
      <q-card-section>
        <div>
          <q-input label="Ingresa tu Correo" v-model="form.email" filled dense type="email"  />
        </div>
      </q-card-section>
      <q-card-actions align="right">
        <q-btn label="Recuperar" push color="primary" @click="recuperar()" dense />
      </q-card-actions>
    </q-card>
  </div>
</template>

<script>
export default {
  props: ['dialogo'],
  data () {
    return {
      form: {}
    }
  },
  methods: {
    async recuperar () {
      await this.$api.post('clients/forgotPassword').then(res => {
        if (res) {
          this.$q.notify({
            message: res.message,
            color: res.success ? 'positive' : 'negative'
          })
        }
      })
    }
  }
}
</script>

<style>

</style>
