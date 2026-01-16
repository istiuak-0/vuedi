import { hasKey } from "../has-key";
import type { ServiceConstructor } from "../types";

/**
 *  Copies All Prototype members (methods, accessors, and properties) from a object ( service instance )
 *  to the resolved object .
 *
 * @export
 * @template {object} T
 * @param {InstanceType<ServiceConstructor<T>>} serviceInstance
 * @param {Record<PropertyKey, unknown>} targetObj
 */
export function addPrototypeProperties<T extends object>(
  serviceInstance: InstanceType<ServiceConstructor<T>>,
  targetObj: Record<PropertyKey, unknown>
) {
  let currentProto = Object.getPrototypeOf(serviceInstance);

  /// Loop Over The Whole Prototype Chain To Get All inherited Properties
  while (currentProto && currentProto !== Object.prototype) {
    const protoKeys = Object.getOwnPropertyNames(currentProto);
    const filteredKeys = protoKeys.filter(key => key !== 'constructor');

    filteredKeys.forEach(key => {
      if (hasKey(targetObj, key)) return;

      const descriptor = Object.getOwnPropertyDescriptor(currentProto, key)!;

      if (descriptor.get || descriptor.set) {
        const newDesc: PropertyDescriptor = {
          enumerable: true,
          configurable: true,
        };

        if (descriptor.get) {
          newDesc.get = () => descriptor.get!.call(serviceInstance);
        }

        if (descriptor.set) {
          newDesc.set = (value: any) => descriptor.set!.call(serviceInstance, value);
        }

        Object.defineProperty(targetObj, key, newDesc);
      } else if (typeof descriptor.value === 'function') {
        targetObj[key as keyof typeof targetObj] = descriptor.value.bind(serviceInstance);
      }
      // } else {
      //   Object.defineProperty(targetObj, key, {
      //     get() {
      //       return serviceInstance[key as keyof typeof serviceInstance];
      //     },
      //     set(v) {
      //       serviceInstance[key as keyof typeof serviceInstance] = v;
      //     },
      //     enumerable: true,
      //     configurable: true,
      //   });
      // }
    });

    currentProto = Object.getPrototypeOf(currentProto);
  }
}