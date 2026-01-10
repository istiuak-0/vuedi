export function resolve(serviceClass: any) {
  const instance = new serviceClass();
  const getterObj: any = {};

  /* --- --- Logics For Handling Static Properties/Methods --- ---   */

  /// it also includes objects internals that is not defined by user
  const staticKeys = Object.getOwnPropertyNames(serviceClass);

  /// filtering out the the static's that are not defined in service class
  const ownStatics = staticKeys.filter(key => !['length', 'name', 'prototype'].includes(key));

  ownStatics.forEach(key => {
    const descriptor = Object.getOwnPropertyDescriptor(serviceClass, key)!;

    if (typeof descriptor.value === 'function') {
      /// Static Methods :: Binding to the class
      getterObj[key] = descriptor.value.bind(serviceClass);
    } else if (descriptor.get || descriptor.set) {
      /// Static Getters/Setters :: Attaching to new Getter/Setter
      const newDesc: PropertyDescriptor = {
        enumerable: true,
        configurable: true,
      };

      if (descriptor.get) {
        newDesc.get = () => descriptor.get!.call(serviceClass);
      }

      if (descriptor.set) {
        newDesc.set = (value: any) => descriptor.set!.call(serviceClass, value);
      }

      Object.defineProperty(getterObj, key, newDesc);
    } else {
      /// Static Properties :: Creating Live Getters

      Object.defineProperty(getterObj, key, {
        get() {
          return serviceClass[key];
        },
        set(v) {
          serviceClass[key] = v;
        },
        enumerable: true,
        configurable: true,
      });
    }
  });

  /*  --- --- Logics For Handling ProtoType Properties  (Methods, Getter/Setter, Property) --- ---  */

  const proto = Object.getPrototypeOf(instance);

  /// It Contains All Keys Including Constructor
  const protoKeys = Object.getOwnPropertyNames(proto);

  const filteredKeys = protoKeys.filter(key => key !== 'constructor');

  filteredKeys.forEach(key => {
    const descriptor = Object.getOwnPropertyDescriptor(proto, key)!;

    /// Instance Getters/Setters :: Attaching to new Getter/Setter
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

      Object.defineProperty(getterObj, key, newDesc);
    } else if (typeof descriptor.value === 'function') {
      /// Instance Methods :: Binding to the Instance
      getterObj[key] = descriptor.value.bind(instance);
    } else {
      /// Prototype Properties :: Creating Live Getters
      Object.defineProperty(getterObj, key, {
        get() {
          return instance[key];
        },
        set(v) {
          instance[key] = v;
        },
        enumerable: true,
        configurable: true,
      });
    }
  });



console.log(instance);


  return getterObj;
}
