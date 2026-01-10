import { ref } from 'vue';

// --- Symbols ---
export const INTERNAL_SYMBOL = Symbol('internal');
export const USER_SYMBOL = Symbol('user');

// --- Base Service ---
class BaseService {
  baseRef = ref(0);
  basePlain = 'base';

  get baseComputed() {
    return this.baseRef.value * 2;
  }

  set baseComputed(v: number) {
    this.baseRef.value = v / 2;
  }

  baseMethod() {
    return 'base method';
  }

  [INTERNAL_SYMBOL] = 'base internal';
  [USER_SYMBOL] = ref('base user symbol');
}

// --- Intermediate Service ---
class MiddleService extends BaseService {
  middleRef = ref(10);
  override basePlain = 'middle'; // shadowing

  get middleComputed() {
    return this.middleRef.value + this.baseRef.value;
  }

  middleMethod() {
    return 'middle method';
  }

 override [USER_SYMBOL] = ref('middle user symbol'); // overrides base
}

// --- Final Service with Statics & Edge Cases ---
export class GetterTestService extends MiddleService {
  // Instance properties
  instanceRef = ref(100);
  private _private = 'secret'; // non-enumerable (won't appear)
  readonly readOnly = 'readonly';

  // Non-enumerable property (manual)
  constructor() {
    super();
    Object.defineProperty(this, 'nonEnum', {
      value: ref(999),
      enumerable: false, // ← won't be in Object.keys()
      writable: true,
      configurable: true,
    });
  }

  // Getters/Setters
  get doubleInstance() {
    return this.instanceRef.value * 2;
  }

  set doubleInstance(v: number) {
    this.instanceRef.value = v / 2;
  }

  // Method
  complexMethod(a: number, b: string) {
    return `${a}-${b}`;
  }

  // Static members
  static staticRef = ref(500);
  static staticPlain = 'static plain';

  static get staticDouble() {
    return this.staticRef.value * 2;
  }

  static set staticDouble(v: number) {
    this.staticRef.value = v / 2;
  }

  static staticMethod() {
    return 'static method';
  }

  // Static symbols
  static [INTERNAL_SYMBOL] = { token: 'complex-service' };
  static [USER_SYMBOL] = 'static user symbol';

  // Non-configurable static (edge case)
  static get lockedStatic() {
    return 'locked';
  }
}
// Make one static non-configurable
Object.defineProperty(GetterTestService, 'lockedStatic', {
  configurable: false,
});
