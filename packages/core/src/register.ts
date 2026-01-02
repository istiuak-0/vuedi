import { SERVICE_INTERNAL_METADATA, serviceRegistry } from './registry';
import type { ServiceConfig, ServiceConstructor } from './types';

export function Register(config: ServiceConfig) {
  return function <T extends ServiceConstructor>(constructor: T) {
    serviceRegistry.set(constructor, null);
    (constructor as any)[SERVICE_INTERNAL_METADATA] = config;

    return constructor;
  };
}
