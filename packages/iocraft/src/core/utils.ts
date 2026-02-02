import { RootRegistry, SERVICE_METADATA } from './internals';
import type { ServiceConstructor, ServiceMetadata } from './types';

/**
 * Get service metadata without instantiating
 *
 * @export
 * @param {(ServiceConstructor | object)} target
 * @returns {ServiceMetadata}
 */
export function GetServiceMetadata(target: ServiceConstructor | object): ServiceMetadata {
  const ctor = typeof target === 'function' ? target : target.constructor;

  const meta = (ctor as any)[SERVICE_METADATA] as ServiceMetadata;
  if (!meta?.token) {
    throw new Error(`[IOCRAFT]: ${ctor?.name || 'Unknown'} is not decorated with @Provide()`);
  }
  return meta;
}

export function HasService(serviceClass: ServiceConstructor) {
  const meta = GetServiceMetadata(serviceClass);
  return RootRegistry.has(meta.token);
}
