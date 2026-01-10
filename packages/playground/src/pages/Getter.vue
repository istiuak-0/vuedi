<script setup lang="ts">
import { ref, watch } from 'vue';
import { resolve } from '../lib/Getter';

class Getter {
  data = ref(0);

  plus() {
    this.data.value++;
  }

  minus() {
    this.data.value++;
  }


unwatch=watch(this.data,(newValue)=>{
  console.log(newValue);
  
})



}

const { data,plus } = resolve(Getter);

console.log(data);

</script>
<template>


  <p>{{data}}</p>

  <button @click="data++">click</button>
</template>
