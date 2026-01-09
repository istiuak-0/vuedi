import { ref, watch } from 'vue';

export class Getter {
  static demoData = ref(0);

  private data = ref(0);
  static getAll() {
    console.log('the static method runned', this.demoData.value);
  }

  unwatch = watch(Getter.demoData, newvalue => {
    console.log(newvalue);
  });

  plus() {
    console.log('before:', this.data.value);
    this.data.value++;
    console.log('after:', this.data.value);
  }

  minus() {
    this.data.value--;
  }
}

export function resolve(data: any) {
  new data();
  const instance: any = {};

  /// it also includes objects internals that is not defined by user
  const allStatics = Object.getOwnPropertyNames(data);

  /// filtering out the the statics that are not defined in service class
  const staticsDefinedInClass = allStatics.filter(k => !['length', 'name', 'prototype'].includes(k));

  staticsDefinedInClass.forEach(item => {
    const staticItem = data[item];

    if (typeof staticItem === 'function') {
      instance[item] = staticItem.bind(data);
    } else {
      instance[item] = staticItem;
      console.log('from resolve', staticItem);
    }
  });

  console.log('All static values', instance);

  return instance;
  // const instance = new data();
  // const prototype = Object.getPrototypeOf(instance);
  // const prototypeKeys = Object.getOwnPropertyNames(prototype);

  // console.log('instance', instance);
  // console.log('prototype', prototype);
  // console.log('prototype keys', prototypeKeys);

  // console.log(prototype['constructor']);

  // console.log(instance[prototypeKeys[1]]);
}
