import { Loading } from 'quasar'
export const FormMixin = {
  data () {
    return {
      id: this.$route.params.id,
      insert: true
    }
  },
  async mounted () {
    if (typeof this.beforeMounted === 'function') {
      this.beforeMounted()
    }
    // Si en la ruta hay más de un id obtengo el ultimo valor de la ruta
    const route = this.$route.fullPath.split('/')
    console.log(route, 'route')
    const last = route[route.length - 1]
    console.log(last, 'last')

    this.id = last ? last : undefined // Si el ultimo valor de la ruta es un número es el ID que usaremos en modo de edición

    if (this.id) { // Si es un número entonces es modo de edición sin importar si hay otros ids
      await this.getRecord()
      this.insert = false
    }
    if (typeof this.afterMounted === 'function') {
      this.afterMounted()
    }
  },
  methods: {
    async getRecord () {
      console.log('se ejecuto getRecordMixin')
      Loading.show()
      await this.$api.get(`${this.route}/${this.id}`).then(res => {
        console.log(res, 'res getRecord')
        this.form = res.results
        // console.log(this.form, 'mostrando form desde mixins form')
        if (typeof this.afterGetRecord === 'function') {
          this.afterGetRecord(res)
        }
        Loading.hide()
      })
    }
  }
}
