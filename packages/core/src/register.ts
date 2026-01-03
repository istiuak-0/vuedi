import { SERVICE_INTERNAL_METADATA, serviceRegistry } from './registry';
import type { ServiceConfig, ServiceConstructor } from './types';

export function Register(config: ServiceConfig) {

  return (constructor: ServiceConstructor) => {
    (constructor as any)[SERVICE_INTERNAL_METADATA] = config;
    serviceRegistry.set(constructor, null);
    return constructor;
  };
  
}
