<!-- views/GetterTest.vue -->
<script setup lang="ts">
import { Getter, resolve } from '../lib/Getter';

// Resolve both statics and instance methods
const service = resolve(Getter);

// Destructure for easy access
const { 
  demoData,   // Ref<number> (static)
  getAll,     // Static method
  plus,       // Instance method
  minus,      // Instance method
  instanceData // Instance state getter
} = service;

// Verify bindings
console.log('Static demoData:', demoData.value); // 0
console.log('Is static method bound?', typeof getAll === 'function'); // true
console.log('Is instance method bound?', typeof plus === 'function'); // true
</script>

<template>
  <div class="getter-test">
    <h2>Static State (Shared Globally)</h2>
    <p>demoData: {{ demoData }}</p>
    <button @click="demoData++">+ Static</button>
    <button @click="demoData--">- Static</button>
    <button @click="getAll()">Log Static Value</button>

    <h2>Instance State (Per-Resolve)</h2>
    <p>instanceData: {{ instanceData }}</p>
    <button @click="plus()">+ Instance</button>
    <button @click="minus()">- Instance</button>

    <h3>How It Works</h3>
    <ul>
      <li>Static state (<code>demoData</code>) is shared across all resolves</li>
      <li>Instance state (<code>instanceData</code>) is unique per <code>resolve()</code> call</li>
      <li>Check console for logs!</li>
    </ul>
  </div>
</template>

<style scoped>
.getter-test {
  padding: 20px;
  max-width: 600px;
  margin: 0 auto;
}
button {
  margin: 5px;
  padding: 8px 12px;
}
</style>