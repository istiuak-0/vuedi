<script setup lang="ts">
import { ref, watch, computed } from 'vue';
import { resolve } from '../lib/Getter';
import { GetterTestService, USER_SYMBOL } from '../services/getter-test.service';


// Resolve the complex service
const svc = resolve(GetterTestService);

// Destructure everything
let {
  // Instance
  instanceRef,
  baseRef,
  middleRef,
  doubleInstance,
  complexMethod,

  // Inherited
  basePlain,
  middlePlain,

  // Static
  staticRef,
  staticDouble,
  staticMethod,

  // Symbols
  [USER_SYMBOL]: userSymbolInstance,
} = svc;

// Reactive controls
const dynamicValue = ref(42);

// Watchers to test reactivity
watch(instanceRef, (val) => {
  console.log('instanceRef changed:', val);
});

watch(staticRef, (val) => {
  console.log('staticRef changed:', val);
});

// Computed from resolved refs
const total = computed(() => 
  instanceRef.value + baseRef.value + middleRef.value + staticRef.value
);

// Methods
function testMethods() {
  console.log('complexMethod:', complexMethod(1, 'test'));
  console.log('staticMethod:', staticMethod());
  console.log('basePlain (shadowed):', basePlain); // should be 'middle'
}

function mutateState() {
  // Instance mutations
  instanceRef.value += 1;
  baseRef.value += 1;
  middleRef.value += 1;

  // Setter usage
  doubleInstance = 200; // → instanceRef becomes 100

  // Static mutations
  staticRef.value += 10;
  staticDouble = 1200; // → staticRef becomes 600
}

// Symbol access
function logSymbols() {
  console.log('User symbol (instance):', userSymbolInstance.value); // 'middle user symbol'
  console.log('Internal symbol:', svc[Symbol.for('vuedi:service:metadata')]); // if you preserve it
}
</script>

<template>
  <div class="test-container">
    <h2>Complex Service Resolver Test</h2>

    <!-- Instance State -->
    <section>
      <h3>Instance State</h3>
      <p>instanceRef: {{ instanceRef }}</p>
      <p>baseRef: {{ baseRef }}</p>
      <p>middleRef: {{ middleRef }}</p>
      <p>doubleInstance (getter): {{ doubleInstance }}</p>
      <p>basePlain (inherited/shadowed): {{ basePlain }}</p>
    </section>

    <!-- Static State -->
    <section>
      <h3>Static State</h3>
      <p>staticRef: {{ staticRef }}</p>
      <p>staticDouble (getter): {{ staticDouble }}</p>
    </section>

    <!-- Computed Total -->
    <section>
      <h3>Total (instance + static): {{ total }}</h3>
    </section>

    <!-- Controls -->
    <section>
      <button @click="mutateState">Mutate All States</button>
      <button @click="testMethods">Test Methods</button>
      <button @click="logSymbols">Log Symbols</button>
    </section>

    <!-- Symbol-Specific Display -->
    <section v-if="userSymbolInstance">
      <h3>User Symbol (Instance)</h3>
      <p>{{ userSymbolInstance }}</p>
    </section>

    <!-- Dynamic Binding Test -->
    <input v-model="dynamicValue" placeholder="Type here" />
    <p>Dynamic value: {{ dynamicValue }}</p>
  </div>
</template>

<style scoped>
.test-container {
  padding: 20px;
  font-family: sans-serif;
}
section {
  margin: 15px 0;
  padding: 10px;
  border: 1px solid #eee;
  border-radius: 4px;
}
button {
  margin: 5px;
  padding: 8px 12px;
}
</style>