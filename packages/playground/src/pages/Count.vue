<script setup lang="ts">

import { Inject } from 'iocraft';
import { CountStore } from '../services/Count.service';
import { Nav } from 'iocraft/helpers';

const store = Inject(CountStore);

const { push } = Inject(Nav);
</script>
<template>
<p>{{store.select('name')}}</p>
<p>{{store.getState()}}</p>
  <button @click="push('/')">navigate</button>
</template>
