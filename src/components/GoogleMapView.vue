<template>
  <GmapMap ref="mapRef" :center="centerC" :zoom="15" style="width: 100%; height: 100%; border-radius:12px">
    <GmapMarker :key="index" v-for="(m, index) in markers" :position="m.position" :clickable="true"
      :draggable="false" @click="centerC=m.position" />
  </GmapMap>
</template>

<script>
import { gmapApi } from 'vue2-google-maps'
export default {
  props: ['center'],
  computed: {
    google: gmapApi
  },
  data () {
    return {
      centerC: {},
      markers: [
        {
          title: 'Envio',
          position: { /* lat: 10, lng: 10 */ }
        }
      ]
    }
  },
  mounted () {
    this.centerC = this.center
    this.markers = [
      { title: 'Envio', position: this.center }
    ]
  }
}
</script>

<style>

</style>
