<template>
  <q-page class="sin-padding-margin">
    <div class="q-pa-md q-pt-xl column items-center">
      <q-avatar color="primary" text-color="white" size="100px">{{form.name[0]}}</q-avatar>
      <div class="titles-font q-mt-sm"> {{form.name}} </div>
      <div class="my-font-regular"> {{form.email}} </div>
      <!-- <div class="my-font-regular text-bold"> {{form.code ? form.code + ' - ' : form.code}} </div> -->
    </div>
    <q-card class="q-mx-md box-shadow-card-listados" style="border-radius:10px">
      <q-list flat>
        <q-item clickable v-ripple @click="$router.push($route.path + '/datos_personales')">
          <q-item-section>Datos personales</q-item-section>
          <q-item-section avatar>
            <q-icon name="arrow_forward_ios" />
          </q-item-section>
        </q-item>
        <q-separator />
        <q-item clickable v-ripple @click="$router.push($route.path + '/cambiar_pass')">
          <q-item-section>Cambiar contraseña</q-item-section>
          <q-item-section avatar>
            <q-icon name="arrow_forward_ios" />
          </q-item-section>
        </q-item>
      </q-list>
    </q-card>

    <section
      class="q-pa-md"
    >
      <q-card
        class="col-12 q-pa-md my-font-regular row"
        style="box-shadow: 0px 0px 5px 0px #0000004d; position: relative"
      >
        <q-btn
          @click="copyToClipboard('j')"
          icon="content_copy"
          flat
          round
          dense
          color="secondary"
          style="position: absolute; top: 10px; right: 10px;"
        />

        <span class="col-12 text-bold">DATOS DE ENVÍO</span> <br><br>

        <span
          class="col-12"
        >
          <strong>Name:</strong>
          {{ form.codname }}
        </span>

        <span
          class="col-12"
        >
          <strong>Last name:</strong>
          VZLACARGO
        </span>

        <span
          class="col-12"
        >
          <strong>Address:</strong>
          6994 NW 82 Ave
        </span>

        <span
          class="col-12"
        >
          <strong>City:</strong>
          MIAMI
        </span>

        <span
          class="col-12"
        >
          <strong>State:</strong>
          FLORIDA
        </span>

        <span
          class="col-12"
        >
          <strong>Zip code:</strong>
          33166
        </span>
      </q-card>
    </section>
    <!-- <div class="q-ma-md q-mt-lg row">
      <div> Dirección actual de entrega: </div>
      <q-btn rounded label="cambiar" no-caps color="secondary" dense size="sm" class="q-px-sm q-ml-xs" @click="changeDir()" />
    </div>
    <div v-if="dir" class="q-ma-md" style="padding: 0px !important;height:400px">
      <div class="q-gutter-sm">
        <q-select outlined v-model="state" :options="optionsState" label="Estado" option-label="name" option-value="id" map-options emit-value dense
          @input="getCities()"
        />
        <q-select outlined v-model="city" :options="optionsCities" label="Ciudad" option-label="name" option-value="id" map-options emit-value dense />
        <q-input outlined v-model="address" label="Dirección de entrega" dense />
      </div>
      <div class="row justify-end">
        <q-btn label="guardar" color="secondary" class="q-mt-md titles-font" text-color="primary" @click="saveDir()" />
      </div>
    </div> -->
  </q-page>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  data () {
    return {
      data: {
      },
      dir: false,
      form: {
        name: ''
      }
    }
  },
  computed: {
    formN () {
      console.log(this.form, 'form')
      if (this.form.name) {
        return true
      } else { return false }
    }
  },
  mounted () {
    this.getUserInfo()
  },
  methods: {
    ...mapGetters('generals', ['UserInfo']),
    async getUserInfo () {
      this.$q.loading.show()
      const userInfo = this.UserInfo()
      const { result } = await this.$api.get('edit-user/client?usuario_id=' + userInfo.user.usuario_id)
      console.log(result, 'getUserInfo')
      this.$q.loading.hide()

      if (result) {
        this.form.name = result.nombres + ' ' + result.apellidos
        this.form.email = result.email
        this.form.code = result.cod_usuario ? result.cod_usuario : ''
        this.form.nombres = result.nombres
        this.form.cod_usuario = result.cod_usuario
        this.form.codname = result.nombres + result.cod_usuario
      }

      /* console.log(res, 'getUserInfo')
      if (res) {
        console.log(res, 'getUserInfo hay res')
        this.form.name = res.user.name + ' ' + res.user.last_name
        this.form.email = res.user.email
        this.form.city = res.user.address[0].cities_id
        this.form.state = res.user.address[0].states_id
        this.form.address = res.user.address[0].address
        this.form.code = res.user.code
        // this.data.city = res.user.address[0].cities_id
        console.log(this.form, 'form')
      } */
    },
    copyToClipboard () {
      let content = `Name: ${this.form.codname}\n`;

      // lastname
      content += `Last name: VZLACARGO\n`;
      // address
      content += `Address: 6994 NW 82 Ave\n`;
      // city
      content += `City: MIAMI\n`;
      // state
      content += `State: FLORIDA\n`;
      // zip code
      content += `Zip code: 33166\n`;

      const el = document.createElement('textarea');  // Crea un nuevo elemento textarea
      el.value = content;                             // Asigna el valor del texto a copiar
      document.body.appendChild(el);                  // Añade el textarea al cuerpo del documento
      el.select();                                    // Selecciona el contenido del textarea
      try {
        document.execCommand('copy');                 // Intenta copiar el contenido seleccionado
        this.$q.notify({
          message: 'La información ha sido copiada con éxito',
          color: 'positive',
        });
      } catch (err) {
        this.$q.notify('Failed to copy payment details');
        console.log('Something went wrong', err);
      }
      document.body.removeChild(el);                  // Elimina el textarea del cuerpo del documento después de copiar
    }
  }
}
</script>

<style>

</style>
