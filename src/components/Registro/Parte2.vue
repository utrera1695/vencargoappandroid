<template>
  <section
    class="q-gutter-y-md"
  >
    <q-select
      v-model="ubigeoObj"
      label="Escribe tu ubicación"
      use-input
      hide-selected
      fill-input
      dense
      outlined
      input-debounce="200"
      :options="ubigeoOp"
      @filter="filterFn"
      :option-label="opt => opt.estado + ' - ' + opt.zona + ' - ' + opt.codigo_postal"
    >
      <template v-slot:no-option>
        <q-item>
          <q-item-section class="text-grey">
            Sin resultados
          </q-item-section>
        </q-item>
      </template>
    </q-select>

    <!-- direccion -->
    <q-input
      v-model="direccion"
      label="Dirección"
      dense
      outlined
      type="text"
    />

    <!-- Ref direccion -->
    <q-input
      v-model="ref_direccion"
      label="Referencia de la dirección"
      dense
      outlined
      type="text"
    />

  </section>
</template>
<script>
export default {
  name: 'Parte2',
  data () {
    return {
      ubigeoOp: [],
      ubigeoObj: null,
      direccion: null,
      ref_direccion: null
    }
  },
  // watch para escuchar cambios en cada variable
  watch: {
    ubigeoObj (val) {
      console.log(val, 'val')
      if (val) {
        this.$emit('returnCSC', {
          ubigeo: val,
          direccion: this.direccion,
          ref_direccion: this.ref_direccion
        })
      }
    },
    direccion (val) {
      if (val) {
        this.$emit('returnCSC', {
          ubigeo: this.ubigeoObj,
          direccion: val,
          ref_direccion: this.ref_direccion
        })
      }
    },
    ref_direccion (val) {
      if (val) {
        this.$emit('returnCSC', {
          ubigeo: this.ubigeoObj,
          direccion: this.direccion,
          ref_direccion: val
        })
      }
    }
  },
  methods: {
    filterFn (val, update) {
      // Defer the filter function to allow the API call
      update(() => {
        this.getUbigeo(val)
      })
    },
    async getUbigeo (val) {
      await this.$api.get(`ubigeos?search=${val}`).then(res => {
        if (res && res.results) {
          this.ubigeoOp = res.results
        }
      })
    }
  }
}
</script>
<style>
</style>
