<script setup lang="ts">
import { resolve } from '@vuedi/core';
import { CountService } from '../services/Count.service';

const { date, plus, minus } = resolve(CountService);

console.log(typeof plus);
</script>
<template>
  <div>{{ date }}</div>
  <button @click="plus()">plus</button>
  <button @click="minus()">minus</button>
  <div>l</div>
</template>
