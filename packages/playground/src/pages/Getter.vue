<script setup lang="ts">
import { resolve } from '@vuedi/core';

import { CountService } from '../services/Count.service';

const servive = resolve(CountService);
console.log(servive);

</script>
<template>
<p>{{servive}}</p>



</template>
