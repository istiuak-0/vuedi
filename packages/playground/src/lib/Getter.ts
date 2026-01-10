import { ref, watch } from 'vue';

export class Getter {
  // Static reactive state
  static demoData = ref(0);

  // Instance reactive state
  private data = ref(0);

  // Static method (bound to class)
  static getAll() {
    console.log('[Static] demoData:', this.demoData.value);
  }

  // Instance methods (bound to instance)
  plus() {
    console.log('[Instance] before:', this.data.value);
    this.data.value++;
    console.log('[Instance] after:', this.data.value);
  }

  minus() {
    console.log('[Instance] before:', this.data.value);
    this.data.value--;
    console.log('[Instance] after:', this.data.value);
  }

  // Getter for private data (optional but useful for testing)
  get instanceData() {
    return this.data;
  }

  set isntaceUpdateDate(data: number) {
    this.data.value = data;
  }

  unwatchStatic = watch(Getter.demoData, newVal => {
    console.log('[Watcher] Static demoData changed:', newVal);
  });
}

///data is the class
export function resolve(data: any) {
  const instance = new data();
  const getterObj: any = {};
  const allPropertyKeys = new Set<string>();

  /* --- --- Logics For Handling Static Properties/Methods --- ---   */

  /// it also includes objects internals that is not defined by user
  const staticKeys = Object.getOwnPropertyNames(data);

  /// filtering out the the static's that are not defined in service class
  const ownStatics = staticKeys.filter(key => !['length', 'name', 'prototype'].includes(key));

  ownStatics.forEach(item => {
    const staticItem = data[item];

    if (typeof staticItem === 'function') {
      getterObj[item] = staticItem.bind(data);
    } else {
      getterObj[item] = staticItem;
    }
  });

  /*  --- --- Logics For Handling Instance Methods & Getter/Setter --- ---  */
  const proto = Object.getPrototypeOf(instance);

  /// It Contains All Keys Including Constructor
  const protoKeys = Object.getOwnPropertyNames(proto);

  const methodKeys = protoKeys.filter(key => key !== 'constructor');

  methodKeys.forEach(item => {

    const descriptor = Object.getOwnPropertyDescriptor(proto, item)!;
    if (descriptor.get || descriptor.set) {

      const newDesc: PropertyDescriptor = {
        enumerable: true,
        configurable: true,
      };

      if (descriptor.get) {
        newDesc.get = () => descriptor.get!.call(instance);
      }

      if (descriptor.set) {
        newDesc.set = (value: any) => descriptor.set!.call(instance, value);
      }

      Object.defineProperty(getterObj, item, newDesc);
      
    } else if (typeof descriptor.value === 'function') {
      getterObj[item] = descriptor.value.bind(instance);
    } else {
      getterObj[item] = descriptor.value;
    }
  });

  return getterObj;
}
