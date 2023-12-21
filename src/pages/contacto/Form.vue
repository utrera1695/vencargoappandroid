<template>
  <q-page>
    <div class="column items-center q-pt-lg">
      <q-item v-ripple clickable @click="irtel()">
        <div class="column items-center">
          <q-img src="contacto/tel.svg" width="40px"  />
          <q-item-label class="q-mt-xs text-primary text-uppercase my-font-extra-bold" style="font-size:20px"> teléfono </q-item-label>
          <q-item-label class="q-mt-xs text-primary text-uppercase my-font-medium" style="font-size:20px"> +58 (412) 181 2469 </q-item-label>
        </div>
      </q-item>

      <q-item v-ripple clickable @click="ircorreo()">
        <div class="column items-center">
          <q-img src="contacto/mail.svg" width="40px"  />
          <q-item-label class="q-mt-xs text-primary text-uppercase my-font-extra-bold" style="font-size:20px"> email </q-item-label>
          <q-item-label class="q-mt-xs text-primary my-font-medium" style="font-size:20px"> venezuelacargo@icloud.com </q-item-label>
        </div>
      </q-item>

      <q-item v-ripple clickable @click="irpagina()">
        <div class="column items-center">
          <q-img src="contacto/mun.svg" width="40px"  />
          <q-item-label class="q-mt-xs text-primary text-uppercase my-font-extra-bold" style="font-size:20px"> website </q-item-label>
          <q-item-label class="q-mt-xs text-primary my-font-medium" style="font-size:20px"> venezuelacargo.com </q-item-label>
        </div>
      </q-item>

      <q-item>
        <div class="column items-center">
          <q-img src="contacto/gps.svg" width="40px"  />
          <q-item-label class="q-mt-xs text-primary text-uppercase my-font-extra-bold" style="font-size:20px"> ubicación </q-item-label>
          <q-item-label class="q-mt-xs text-primary my-font-medium" style="font-size:20px"> 8601 NW 72nd </q-item-label>
          <q-item-label class="q-mt-xs text-primary my-font-medium" style="font-size:20px"> Miami, FL - 33166 </q-item-label>
        </div>
      </q-item>

      <div class="column items-center q-pt-xl">
        <div class="text-uppercase text-primary my-font-extra-bold"> contáctanos vía </div>
        <div class="style-wp" @click="irwp()">
          <q-img src="contacto/wp.svg" width="120px" />
        </div>
      </div>
      <!-- <q-item v-ripple clickable @click="irtel()">
        <div class="row q-pa-md items-center">
          <q-icon name="phone" size="50px" color="primary"  />
          <q-item-label class="q-ml-sm text-primary" style="font-size:13px"> Teléfono: 04121812469 </q-item-label>
        </div>
      </q-item>

      <q-item v-ripple>
        <div class="row q-pa-md items-center">
          <q-icon name="alternate_email" size="50px" color="primary"  />
          <q-item-label class="q-ml-sm text-primary" style="font-size:13px"> Email: Venezuelacargo@icloud.com </q-item-label>
        </div>
      </q-item>

      <q-item clickable v-ripple @click="irpagina()">
        <div class="row q-pa-md items-center">
          <q-icon name="travel_explore" size="50px" color="primary"  />
          <q-item-label class="q-ml-sm text-primary" style="font-size:13px"> Site: venezuelacargo.com </q-item-label>
        </div>
      </q-item>

      <q-item v-ripple @click="irwp()" clickable style="position:absolute; bottom: 3%" class="full-width">
        <div class="row q-pa-md items-center">
          <q-img src="wpicon.png" style="width:50px;height:50px"  />
          <q-item-label class="q-ml-sm text-primary" style="font-size:13px"> Ir a whatsapp </q-item-label>
        </div>
      </q-item> -->

      <a style="display:none" ref="irwplink" href="https://wa.me/584121812469">Link</a>
      <a style="display:none" ref="irvencargolink" href="https://venezuelacargo.com">Link</a>
    </div>
  </q-page>
</template>

<script>
// PAGINA WEB https://venezuelacargo.com
export default {
  methods: {
    irwp () {
      const ir = this.$refs.irwplink
      ir.click()
      // window.open('whatsapp://send?text=Tu mensaje&phone=+34123456789&abid=+34123456789', '_system')
    },
    irpagina () {
      const ir = this.$refs.irvencargolink
      ir.click()
    },
    irtel () {
      try {
        window.open('tel:04121812469', '_blank')
        document.location.href = 'tel:04121812469'
      } catch (error) {
        alert(error)
      }
    },
    ircorreo () {
      window.open('mailto:venezuelacargo@icloud.com')
    }
  }
}
</script>

<style scoped lang="scss">
.style-wp {
  border: 1px solid rgb(255, 255, 255);
  border-radius: 12px;
  padding-left: 50px;
  padding-right: 50px;
  box-shadow: 0 3px 4px rgba(114, 114, 114, 0.1), 0 3px 14px rgba(116, 116, 116, 0.2);
}
</style>
