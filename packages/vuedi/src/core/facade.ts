import type { ServiceConstructor } from '../utils/core.types';

export class ReactiveFacade {
  private hasKey(obj: Record<PropertyKey, unknown>, key: PropertyKey): boolean {
    if (typeof key === 'symbol') {
      return Object.getOwnPropertySymbols(obj).includes(key);
    }
    return Object.hasOwn(obj, key);
  }

  private NativeObjectKeys = new Set([
    ...Object.getOwnPropertyNames(Object.prototype),
    ...Object.getOwnPropertySymbols(Object.prototype),
  ]);

  /**
   * Copies all instance properties (including symbols) from a service instance
   * to the target object as reactive getters/setters.
   *
   * - Skips methods (functions) — they should live on the prototype
   * - Skips accessors (getters/setters) — also handled via prototype
   * - Wraps properties (e.g., refs, state) in get/set accessors
   *
   * @template {object} T
   * @param {InstanceType<ServiceConstructor<T>>} serviceInstance
   * @param {Record<PropertyKey, unknown>} targetObj
   */
  private addInstanceProperties<T extends object>(
    serviceInstance: InstanceType<ServiceConstructor<T>>,
    targetObj: Record<PropertyKey, unknown>
  ) {
    const ownKeys = [...Object.getOwnPropertyNames(serviceInstance), ...Object.getOwnPropertySymbols(serviceInstance)];

    for (const key of ownKeys) {
      if (this.hasKey(targetObj, key)) continue;
      const descriptor = Object.getOwnPropertyDescriptor(serviceInstance, key)!;

      if (typeof descriptor.value === 'function') {
        console.warn(`[VUE DI]: Instance method "${String(key)}" found as own property. Consider moving to prototype.`);
        continue;
      }

      if (descriptor.get || descriptor.set) {
        continue;
      }

      Object.defineProperty(targetObj, key, {
        get() {
          return serviceInstance[key as keyof typeof serviceInstance];
        },
        set(v) {
          serviceInstance[key as keyof typeof serviceInstance] = v;
        },
        enumerable: true,
        configurable: true,
      });
    }
  }

  /**
   * Copies all static members (including symbols) from a service class
   * to the target object, preserving correct context and reactivity.
   *
   * - Static methods → bound to the class
   * - Static accessors → wrapped with get/set that call original
   * - Static data properties → wrapped in reactive getter/setter
   *
   * Skips built-in statics like 'name', 'length', 'prototype'.
   * @template T
   * @param {ServiceConstructor<T>} serviceClass
   * @param {Record<PropertyKey, unknown>} targetObj
   */
  private addStaticProperties<T extends object>(
    serviceClass: ServiceConstructor<T>,
    targetObj: Record<PropertyKey, unknown>
  ) {
    const staticKeys = [...Object.getOwnPropertyNames(serviceClass), ...Object.getOwnPropertySymbols(serviceClass)];

    const BUILTIN_KEYS = new Set(['length', 'name', 'prototype']);

    for (const key of staticKeys) {
      if (typeof key === 'string' && BUILTIN_KEYS.has(key)) {
        continue;
      }
      if (this.hasKey(targetObj, key)) {
        continue;
      }

      const descriptor = Object.getOwnPropertyDescriptor(serviceClass, key)!;

      if (typeof descriptor.value === 'function') {
        targetObj[key] = descriptor.value.bind(serviceClass);
      } else if (descriptor.get || descriptor.set) {
        Object.defineProperty(targetObj, key, {
          get: descriptor.get ? () => descriptor.get!.call(serviceClass) : undefined,
          set: descriptor.set ? (v: any) => descriptor.set!.call(serviceClass, v) : undefined,
          enumerable: true,
          configurable: true,
        });
      } else {
        Object.defineProperty(targetObj, key, {
          get() {
            return serviceClass[key as keyof typeof serviceClass];
          },
          set(v) {
            (serviceClass[key as keyof typeof serviceClass] as unknown) = v;
          },
          enumerable: true,
          configurable: true,
        });
      }
    }
  }

  /**
   * Copies all Prototype Properties from a service class
   * to the target object, preserving correct context and reactivity.
   *
   * @template {object} T
   * @param {InstanceType<ServiceConstructor<T>>} serviceInstance
   * @param {Record<PropertyKey, unknown>} targetObj
   */

  private addPrototypeProperties<T extends object>(
    serviceInstance: InstanceType<ServiceConstructor<T>>,
    targetObj: Record<PropertyKey, unknown>
  ) {
    let currentProto = Object.getPrototypeOf(serviceInstance);

    while (currentProto && currentProto !== Object.prototype) {
      const protoKeys = [...Object.getOwnPropertyNames(currentProto), ...Object.getOwnPropertySymbols(currentProto)];

      for (const key of protoKeys) {
        if (this.hasKey(targetObj, key)) continue;
        if (this.NativeObjectKeys.has(key)) continue;
        const descriptor = Object.getOwnPropertyDescriptor(currentProto, key)!;

        if (descriptor.get || descriptor.set) {
          Object.defineProperty(targetObj, key, {
            get: descriptor.get ? () => descriptor.get!.call(serviceInstance) : undefined,
            set: descriptor.set ? (v: any) => descriptor.set!.call(serviceInstance, v) : undefined,
            enumerable: true,
            configurable: true,
          });
        } else if (typeof descriptor.value === 'function') {
          targetObj[key] = descriptor.value.bind(serviceInstance);
        }
      }

      currentProto = Object.getPrototypeOf(currentProto);
    }
  }

  createFacadeObj<T extends object>(
    serviceClass: ServiceConstructor<T>,
    serviceInstance: InstanceType<ServiceConstructor<T>>
  ) {
    const targetObj = {};

    this.addStaticProperties(serviceClass, targetObj);
    this.addInstanceProperties(serviceInstance, targetObj);
    this.addPrototypeProperties(serviceInstance, targetObj);

    return targetObj
  }
}
