<script setup lang="ts">

import { obtain } from 'vuedi';
import { CountService } from '../services/Count.service';

const { data, computedData, plus, minus } = obtain(CountService);


console.log(plus);
console.log(minus);

</script>
<template>
  <button @click="plus()">plus</button>
  <p>data: {{ data }}</p>
  <p>computed data : {{ computedData }}</p>
  <button @click="minus()">minus</button>
</template>
