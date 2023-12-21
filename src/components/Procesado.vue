<template>
  <q-card class="column justify-center items-center q-pa-lg absolute-center radio-bordes" style="width:90%;min-width:270px">
    <img :src="src" style="width:70%;height:250px" />
    <div class="text-h6 text-bold text-positive"> {{title}} </div>
    <p style="text-align:justify" class="text-primary"> {{subtitle}} </p>
    <q-btn label="Continuar" class="q-mt-lg" push color="primary" style="width:50%;min-width:120px" :to="to" />
  </q-card>
</template>

<script>
export default {
  props: {
    src: {
      type: String,
      default: 'acept.png'
    },
    title: {
      type: String,
      default: 'Confirmado'
    },
    subtitle: {
      type: String,
      default: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Repudiandae eos dicta atque minus, eum dolore quod et impedit?'
    },
    to: {
      type: String,
      default: '/'
    }
  }
}
</script>

<style>

</style>
