import { serviceRegistry } from "../libs/registry";
import { getServiceToken } from "../libs/service-token";
import type { ServiceConstructor } from "../libs/types";

/**
 * Resolves a global singleton service into a destructurable object with:
 * - Live getters for reactive state (ref, computed, etc.)
 * - Bound methods that preserve correct `this` context
 */
export function resolve<T extends ServiceConstructor>(serviceClass: T) {
  const serviceToken = getServiceToken(serviceClass);

  // Ensure singleton: create once, reuse forever
  if (!serviceRegistry.has(serviceToken)) {
    serviceRegistry.set(serviceToken, new serviceClass());
  }

  const instance = serviceRegistry.get(serviceToken)!;
  const obj: Record<string, any> = {};

  // ┌───────────────────────────────────────────────────────┐
  // │ PART 1: LIVE GETTERS FOR INSTANCE PROPERTIES          │
  // │                                                       │
  // │ For every enumerable property on the instance         │
  // │ (e.g. `count = ref(0)`, `message = "hello"`),         │
  // │ create a *getter* that always reads from the          │
  // │ original singleton instance.                          │
  // │                                                       │
  // │ This ensures:                                         │
  // │ - No stale copies                                     │
  // │ - Vue sees raw refs/computed → auto-unwraps in template│
  // │ - Mutations affect the real singleton state           │
  // └───────────────────────────────────────────────────────┘
  for (const key in instance) {
    Object.defineProperty(obj, key, {
      get: () => (instance as any)[key],
      enumerable: true,
    });
  }

  // ┌───────────────────────────────────────────────────────┐
  // │ PART 2: BIND METHODS FROM PROTOTYPE CHAIN             │
  // │                                                       │
  // │ Class methods (e.g. `increment()`) live on the        │
  // │ prototype and are *non-enumerable*, so they don't     │
  // │ appear in `for...in`.                                 │
  // │                                                       │
  // │ We walk up the prototype chain and collect all        │
  // │ own method names (like 'increment', 'reset'), then    │
  // │ bind them to the singleton instance so `this` works   │
  // │ even after destructuring.                             │
  // └───────────────────────────────────────────────────────┘
  let proto = instance;
  while ((proto = Object.getPrototypeOf(proto)) && proto !== Object.prototype) {
    for (const name of Object.getOwnPropertyNames(proto)) {
      // Skip constructor and properties already added (e.g. from instance)
      if (name !== 'constructor' && !(name in obj)) {
        const value = (proto as any)[name];
        if (typeof value === 'function') {
          obj[name] = value.bind(instance);
        }
      }
    }
  }

  return obj as InstanceType<T>;
}