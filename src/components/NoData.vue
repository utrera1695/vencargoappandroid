<template>
  <div class="absolute-center column items-center" style="width:100%">
    <q-img :src="icon" width="100px" />
    <div class="my-font-regular text-center text-uppercase color-letter q-pa-md" style="font-size:16px;"> {{caption}} </div>
  </div>
</template>

<script>
export default {
  props: ['modulo', 'caption', 'icon']
}
</script>

<style>
.color-letter {
  color: #AAAAAA;
  letter-spacing:-1px;
}
</style>
