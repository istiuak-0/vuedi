<script setup lang="ts">
import { obtain } from 'vuedi';
import { CountService } from '../services/Count.service';
import { RouterService } from 'vuedi/helpers';

const { data, computedData, plus, minus } = obtain(CountService);

const { push } = obtain(RouterService);
</script>
<template>
  <button @click="plus()">plus</button>
  <p>data: {{ data }}</p>
  <p>computed data : {{ computedData }}</p>
  <button @click="minus()">minus</button>

  <button @click="push('/')">navigate</button>
</template>
