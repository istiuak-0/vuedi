<script setup lang="ts">
import { ref } from 'vue';
import { resolve } from '../lib/Getter';

 
 

class Getter{


  data=ref(0)



  plus(){
    this.data.value++
  }


  minus(){
    this.data.value++
  }
}

resolve(Getter)


 </script>
<template>

</template>