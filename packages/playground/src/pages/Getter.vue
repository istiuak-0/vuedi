<script setup lang="ts">

import { obtain } from 'vuedi';
import { CountService } from '../services/Count.service';

const servive = obtain(CountService);
console.log(servive);

</script>
<template>
<p>{{servive}}</p>



</template>
