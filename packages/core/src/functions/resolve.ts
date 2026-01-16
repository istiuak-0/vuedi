import { addInstanceProperties } from '../libs/live-access/instance-properties';
import { addInstanceSymbols } from '../libs/live-access/instance-symbols';
import { addPrototypeProperties } from '../libs/live-access/prototype-properties';
import { addStaticProperties } from '../libs/live-access/static-properties';
import { addStaticSymbols } from '../libs/live-access/static-symbols';
import { serviceRegistry } from '../libs/registry';
import { getServiceToken } from '../libs/service-token';
import type { ServiceConstructor } from '../libs/types';

type ResolvedService<T extends ServiceConstructor> = {
  [K in keyof InstanceType<T>]: InstanceType<T>[K];
} & {
  [K in keyof T]: T[K];
};

/**
 * Resolves a global singleton service into a destructurable object with:
 * - Live getters for reactive state (ref, computed, etc.)
 * - Bound methods that preserve correct `this` context
 *
 * @export
 * @template {ServiceConstructor} T
 * @param {T} serviceClass
 * @returns {InstanceType<T>}
 */
export function resolve<T extends ServiceConstructor>(serviceClass: T) {
  const serviceToken = getServiceToken(serviceClass);

  // Ensure singleton: create once, reuse forever
  if (!serviceRegistry.has(serviceToken)) {
    serviceRegistry.set(serviceToken, new serviceClass());
  }

  const instance = serviceRegistry.get(serviceToken)!;
  const obj: Record<string, any> = {};

  addStaticProperties(serviceClass, obj);
  addStaticSymbols(serviceClass, obj);

  addInstanceProperties(instance, obj);
  addInstanceSymbols(instance, obj);

  addPrototypeProperties(instance, obj);

  return obj as ResolvedService<T>;
}
