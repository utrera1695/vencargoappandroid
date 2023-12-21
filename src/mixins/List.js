import { Loading } from 'quasar'
export const ListMixin = {
  data () {
    return {
      insert: true,
      nodataC: false,
      pagina: 1
    }
  },
  async mounted () {
    if (typeof this.beforeMounted === 'function') {
      this.beforeMounted()
    }
    /* // Si en la ruta hay más de un id obtengo el ultimo valor de la ruta
    const route = this.$route.fullPath.split('/')
    const last = route[route.length - 1]

    this.id = !isNaN(last) ? last : undefined // Si el ultimo valor de la ruta es un número es el ID que usaremos en modo de edición */

    /* if (this.id) { // Si es un número entonces es modo de edición sin importar si hay otros ids
      await this.getRecord()
      this.insert = false
    } */

    await this.getRecord()
    if (typeof this.afterMounted === 'function') {
      this.afterMounted()
    }
  },
  methods: {
    async getRecord () {
      Loading.show()
      await this.$api.get(`${this.route}`).then(res => {
        console.log(res, 'res getRecord')
        this.data = res && res.results ? res.results : []
        if (res.status === 200) {
          this.nodataC = this.data.length === 0
        } else {
          this.nodataC = true
        }
        if (typeof this.afterGetRecord === 'function') {
          this.afterGetRecord(res)
        }
        Loading.hide()
      })
    },
    colorCircle (status) {
      console.log(status, 'status')
      // convertir a integer
      status = parseInt(status)
      switch (status) {
        case 1: // 'En almacén MIAMI':
          return '#ffc600' // amarillo
        case 2: // 'En proceso de envío a Venezuela':
          return 'orange' // naranga
        case 3: // 'En tránsito':
        case 4: // 'En aduana VENEZUELA':
        case 5: // 'En almacén LA GUAIRA VENEZUELA':
        case 6: // 'En tránsito VENEZUELA':
          return '#014dd9' // azul
        case 7: // 'Entregado':
          return '#00ea06 ' // verde
      }
    },
    onChangePage () {
      console.log('se ejecuto esta funcion')
    }
    /* save () {
      if (typeof this.beforeValidate === 'function') {
        this.beforeValidate()
      }
      this.$v.form.$touch()
      if (typeof this.afterValidate === 'function') {
        this.afterValidate()
      }
      if (!this.$v.form.$error) {
        this.$q.loading.show()
        if (typeof this.beforeSave === 'function') {
          this.beforeSave()
        }
        if (this.insert) { // modo inserción
          this.$api.post(this.route, this.form).then(res => {
            this.$q.loading.hide()
            if (res) {
              if (typeof this.afterSave === 'function') {
                this.afterSave(res)
              }
              this.$q.notify({
                type: 'positive',
                message: 'Registro guardado exitosamente'
              })
              if (!this.stayAfterSave) {
                this.$router.go(-1)
              }
            }
          })
        } else { // modo edición
          console.log('Modo de edición')
          this.$api.put(`${this.route}/${this.id}`, this.form).then(res => {
            this.$q.loading.hide()
            console.log('typeof this.afterSave', typeof this.afterSave)
            if (res) {
              console.log('typeof this.afterSave', typeof this.afterSave)
              if (typeof this.afterSave === 'function') {
                this.afterSave(res)
              }
              this.$q.notify({
                type: 'positive',
                message: 'Registro modificado exitosamente'
              })
              this.$router.go(-1)
            }
          })
        }
      }
    } */
  },

  created () {
  }
}
