<template>
  <div id="map">
    <div v-if="type !== 1" id="btnLocation"><q-btn class="q-mx-sm" round color="primary" icon="my_location" /></div>
    <q-input
      ref="autocomp"
      for="input"
      class="col-xs-12 col-sm-6 q-pa-md"
      v-model="place"
      label="Dirección"
      placeholder="Ingrese su dirección"
      stack-label
      disabled
      outlined
      dense
      v-show="!withoutDirection"
    />
    <br>
    <gmap-map
      class=""
      :center="center"
      :zoom="zoom"
      @input="changedMarker"
      style="height: 300px;"
      ref="myMap"
      :options="{ disableDefaultUi: false, streetViewControl: false }">
    </gmap-map>
  </div>
</template>
<script>
import { gmapApi } from 'vue2-google-maps'
export default {
  computed: {
    google: gmapApi
  },
  name: 'GoogleMap',
  props: ['zoom', 'type', 'withoutDirection', 'cadenaDir'],
  data () {
    return {
      center: { lat: 7.160324358507094, lng: -66.12789678449094 },
      directionsService: {},
      showControl: false,
      mapGlobal: '',
      place: '',
      marker: '',
      autocomplete: {},
      visiblePolygon: false,
      primera: true,
      state: '',
      city: '',
      country: '',
      address: ''
    }
  },
  async mounted () {
    // this.place = `Venezuela ${this.cadenaDir.state} ${this.cadenaDir.city}`
    await this.ejecutar()
    this.prueba()
  },
  methods: {
    async prueba () {
      console.log(this.$refs.autocomp.$refs.input, 'place prueba')
      const vm = this
      await this.$refs.myMap.$mapPromise.then((map) => {
        var autocomplete = new this.google.maps.places.Autocomplete(this.$refs.autocomp.$refs.input)
        autocomplete.addListener('place_changed', function () {
          const placeAutocomplete = autocomplete.getPlace()
          const latLng = { lat: placeAutocomplete.geometry.location.lat(), lng: placeAutocomplete.geometry.location.lng() }
          console.log(latLng, 'asdPRueba')
          map.setCenter(latLng)
          vm.marker.setPosition(latLng)
          vm.place = placeAutocomplete.formatted_address
          map.setZoom(10)
          vm.retornarPais()
        })
      })
    },
    async ejecutar () {
      console.log('withoutDirection', this.withoutDirection)
      var vm = this
      // instanciar mapa
      await this.$refs.myMap.$mapPromise.then((map) => {
        // agregar librerias automplete de google maps a un input
        var autocomplete = new this.google.maps.places.Autocomplete(this.$refs.autocomp.$refs.input)
        vm.mapGlobal = map
        this.getPolygon()
        // marcador objetivo
        vm.marker = new this.google.maps.Marker({
          draggable: true,
          animation: this.google.maps.Animation.DROP,
          position: vm.center,
          map: map
        })
        console.log(vm.center, 'centerrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrr')
        // obtener direccion del marcador a traves de coordenadas
        var geocoder = new this.google.maps.Geocoder()
        geocoder.geocode({ location: this.marker.getPosition() }, function (results, status) {
          if (status === 'OK') {
            if (results[0]) {
              console.log(vm.primera, 'primara')
              vm.place = vm.primera ? vm.place : results[0].formatted_address
              vm.primera = false
            }
          } else {
            alert('Geocode was not successful for the following reason: ' + status)
          }
        })
        // boton de geolocalizacion de ubicacion actual

        if (vm.type !== 1) {
          var myLocation = document.getElementById('btnLocation')
          myLocation.index = 1
          map.controls[this.google.maps.ControlPosition.RIGHT_BOTTOM].push(myLocation)
          myLocation.addEventListener('click', function () {
            navigator.geolocation.getCurrentPosition(function (position) {
              map.setCenter({ lat: position.coords.latitude, lng: position.coords.longitude })
              vm.marker.setPosition({ lat: position.coords.latitude, lng: position.coords.longitude })
              vm.retornarPais()
              vm.$emit('newPlace', vm.place, { lat: position.coords.latitude, lng: position.coords.longitude }, vm.bounds)
            })
          })
        }
        vm.marker.addListener('click', vm.toggleBounce)
        vm.marker.addListener('dragend', vm.changedMarker)
        // seleccionar nueva ubicacion cambia el centro del mapa
        autocomplete.addListener('place_changed', function () {
          const placeAutocomplete = autocomplete.getPlace()
          const latLng = { lat: placeAutocomplete.geometry.location.lat(), lng: placeAutocomplete.geometry.location.lng() }
          console.log(latLng, 'asd')
          vm.retornarPais()
          map.setCenter(latLng)
          vm.marker.setPosition(latLng)
          vm.place = placeAutocomplete.formatted_address
          map.setZoom(10)
        })
      })
      // mostrar la ruta de origen a destino
      // if (this.type === 1) this.showDirections()
    },
    retornarPais () {
      const vm = this
      var geocoder = new this.google.maps.Geocoder()
      geocoder.geocode({
        location: this.marker.getPosition()
        // ej. "-34.653015, -58.674850"
      }, function (results, status) {
        // si la solicitud fue exitosa
        if (status === vm.google.maps.GeocoderStatus.OK) {
          // si encontró algún resultado.
          vm.city = ''
          vm.state = ''
          vm.country = ''
          console.log(results, 'resultadosssssss')
          if (results[0]) {
            console.log(results, 'RETORNAR PAISSSSSSSS2')
            for (const j of results[0].address_components) {
              for (const h of j.types) {
                if (h === 'country') {
                  vm.country = j.long_name
                } else if (h === 'administrative_area_level_1') {
                  vm.state = j.long_name
                } else if (h === 'administrative_area_level_2') {
                  vm.city = j.long_name
                }
              }
            }
            vm.place = results[0].formatted_address
            vm.$emit('returnCSC', { state: vm.state, city: vm.city, country: vm.country, address: results[0].formatted_address })
          }
        }
      })
    },
    // Crear un poligono rectangular alrededor del marcador
    getPolygon () {
      var circle = new this.google.maps.Circle()
      circle.setCenter(this.center)
      circle.setRadius(5000)
      circle.setVisible(true)
      var bounds = circle.getBounds()
      /* var rectangle = new this.google.maps.Rectangle({
        map: map,
        bounds: bounds,
        strokeColor: '#FF0000',
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: '#FF0000',
        fillOpacity: 0.35
      }) */
      var ne = bounds.getNorthEast()
      var sw = bounds.getSouthWest()
      var nw = new this.google.maps.LatLng(ne.lat(), sw.lng())
      var se = new this.google.maps.LatLng(sw.lat(), ne.lng())
      this.$emit('getBounds', [ne, nw, sw, se], this.center)
    },
    // Monstrar la ruta en el mapa de origen a destino
    showDirections () {
      var vm = this
      this.directionsService = new this.google.maps.DirectionsService()
      var request = {
        origin: this.center,
        destination: { lat: 10.1502113, lng: -68.40239009999999 },
        travelMode: this.google.maps.TravelMode.DRIVING
      }
      this.directionsService.route(request, function (response, status) {
        if (status === vm.google.maps.DirectionsStatus.OK) {
          console.log(vm.mapGlobal)
          console.log(response)
          vm.mapGlobal.fitBounds(response.routes[0].bounds)
          var line = new vm.google.maps.Polyline({
            path: response.routes[0].overview_path,
            strokeColor: '#FF0000',
            strokeOpacity: 0.5,
            strokeWeight: 4,
            geodesic: true
          })
          line.setMap(vm.mapGlobal)
          return new vm.google.maps.Marker({
            position: request.destination,
            map: vm.mapGlobal
          })
        }
      })
      var service = new this.google.maps.DistanceMatrixService()
      var distances = { unitSystem: this.google.maps.UnitSystem.METRIC, travelMode: this.google.maps.TravelMode.DRIVING }
      distances.origins = [{ lat: 10.1557595, lng: -68.5632614 }/* , { lat: 10.1783166, lng: -68.4876905 }, { lat: 10.0763215, lng: -69.1191154 }, { lat: 10.1771427, lng: -68.2594012 } */]
      distances.destinations = [{ lat: 10.4564914, lng: -68.3249843 }/* , { lat: 10.1579312, lng: -67.9972104 }, { lat: 10.35, lng: -67.8833329 }, { lat: 10.2133466, lng: -68.3249843 } */]
      service.getDistanceMatrix(distances, function (response, status) {
        if (status !== 'OK') {
          alert('Error was: ' + status)
        } else {
          console.log(response)
        }
      })
    },
    // cambiar posicion del marcador y mostrar direccion en el input
    changedMarker () {
      var vm = this
      var geocoder = new this.google.maps.Geocoder()
      this.center = this.marker.getPosition()
      geocoder.geocode({ location: this.marker.getPosition() }, function (results, status) {
        if (status === 'OK') {
          if (results[0]) {
            vm.getPolygon()
            vm.place = results[0].formatted_address
            const coordinates = {
              lat: results[0].geometry.location.lat(),
              lng: results[0].geometry.location.lng()
            }
            vm.retornarPais()
            vm.$emit('newPlace', vm.place, coordinates, vm.bounds)
          }
        } else {
          alert('Geocode was not successful for the following reason: ' + status)
        }
      })
    },
    // animacion del marcador al hacer click sobre el
    toggleBounce () {
      if (this.marker.getAnimation() !== null) {
        this.marker.setAnimation(null)
      } else {
        this.marker.setAnimation(this.google.maps.Animation.BOUNCE)
      }
    }
  }
}
</script>
<style>
</style>
