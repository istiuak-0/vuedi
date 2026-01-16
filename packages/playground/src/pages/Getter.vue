<script setup lang="ts">
import { resolve } from '@vuedi/core';

import { CountService } from '../services/Count.service';

const { computed,plus,minus} = resolve(CountService);
</script>
<template>
<button @click="plus">plus</button>

<p>{{computed}}</p>

<button @click="minus">minus</button>



</template>
