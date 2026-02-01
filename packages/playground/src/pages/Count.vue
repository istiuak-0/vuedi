<script setup lang="ts">
import { Inject, InjectInstance } from 'iocraft';
import { Nav } from 'iocraft/helpers';
import { CountService } from '../services/Count.service';

const countService = InjectInstance(CountService);

const { push } = Inject(Nav);
</script>
<template>
  <button @click="push('/')">navigate</button>
</template>
