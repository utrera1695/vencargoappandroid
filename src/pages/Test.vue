<template>
  <q-page>
    <div class="q-ma-sm">
      <q-infinite-scroll @load="onChangePage" :offset="5">
        <q-card class="radio-bordes-item-prelerta q-mt-md box-shadow-card-listados padding-card" v-for="(item, index) in data" :key="index" style="height:auto" @click="prueba()">
        {{index + 1}}
          <q-card-section style="padding: 0 !important;margin:0px !important">
            <q-item dense style="padding: 0 !important;margin:0px !important">
              <q-item-section>
                <q-item-label class="text-bold text-primary titles-font" style="font-size:16px">Pre-alerta <label>#{{item.id}}</label></q-item-label>
                <q-item-label class="text-primary my-font-medium">Tracking: {{item.tracking}}</q-item-label>
                <q-item-label class="text-primary my-font-regular">Courier: <label> {{item.currier}} </label> </q-item-label>
                <q-item-label class="text-primary my-font-regular">Fecha de llegada: <label> {{item.date_in}} </label> </q-item-label>
                <div class="q-mt-sm titles-font status-design" style="width:60%;margin-top:10px;margin-bottom:5px">
                  PENDIENTE
                </div>
              </q-item-section>
            </q-item>
          </q-card-section>
          <div class="row justify-end titles-font">
            <q-btn label="Editar" color="primary" flat dense rounded @click="$router.push('prealertas/form/' + item.id)" />
          </div>

        </q-card>
        <template v-if="pagina <= limit" v-slot:loading>
          <div class="row justify-center q-my-md">
             <q-spinner-facebook
              color="secondary"
              size="40px"
            />
          </div>
        </template>
      </q-infinite-scroll>
    </div>
    <no-data v-if="nodataC" modulo="prealerta" icon="iconos/noti_acept.svg" caption="No tiene pre-alertas generadas." />
  </q-page>
</template>

<script>
export default {
  data () {
    return {
      loading: false,
      nodataC: false,
      pagina: 1,
      limit: 3,
      search: '',
      data: []
    }
  },
  mounted () {
    this.getData()
  },
  methods: {
    prueba () {
      console.log(this.pagina, 'paginaaaaa')
    },
    onChangePage (index, done) {
      console.log('cargando nuevas paginas', index)
      if (this.pagina <= this.limit) {
        setTimeout(() => {
          this.data.push({})
          this.pagina += 1
          console.log(this.pagina, 'pagina', this.limit, 'limit')
          done()
        }, 2000)
      }
    },
    async getData () {
      this.data = [{}, {}, {}, {}, {}]
    }
  }
}
</script>

<style scoped lang="scss">
.radio-bordes-item-prelerta {
  border-radius: 12px;
}

.status-design {
  border: 0px solid black;
  border-radius: 12px;
  background-color: $secondary;
  padding: 2px;
  text-align: center;
  color: $primary;
  font-size: 16px;
}

.padding-card {
  padding-left: 15px;
  padding-top: 11px;
  padding-right: 13px;
}

</style>
