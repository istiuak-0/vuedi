import type { ServiceConstructor, ServiceMetadata } from './core.types';

export const SERVICE_METADATA = Symbol('IOCRAFT_SERVICE_METADATA');
export const RootRegistry = new Map<symbol, object>();
export const TempRegistry = new Map<symbol, object>();

export function getServiceMeta(target: ServiceConstructor | object) {
  const ctor = typeof target === 'function' ? target : target.constructor;

  const meta = (ctor as any)[SERVICE_METADATA] as ServiceMetadata;
  if (!meta?.token) {
    throw new Error(`[IOCRAFT]: ${ctor?.name || 'Unknown'} is not decorated with @Provide()`);
  }
  return meta;
}
