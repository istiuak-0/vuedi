import { serviceRegistry } from './registry';
import type { ServiceConstructor } from './types';

export function resolve<T extends ServiceConstructor>(serviceClass: T): InstanceType<T> {
  let instance = serviceRegistry.get(serviceClass);

  if (instance === null) {
    instance = new serviceClass();
    serviceRegistry.set(serviceClass, instance);
  }

  if (!instance) {
    throw new Error(`Service ${serviceClass.name} not registered`);
  }

  return instance as InstanceType<T>;
}
