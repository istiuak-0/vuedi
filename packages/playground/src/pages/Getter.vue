<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import { Getter, resolve } from '../lib/Getter';

const { getAll, demoData } = resolve(Getter);
console.log('from component', demoData);

onMounted(() => {
  console.log(demoData.value);

  demoData.value++;

  console.log('from componewnt', demoData.value);
});

const show = ref(false);

watch(show, n => {
  console.log(n);
});
</script>
<template>
  <p>this is getter page</p>
  <button @click="demoData++">update static data</button>

  <button @click="show=!show">{{show}}</button>
</template>
