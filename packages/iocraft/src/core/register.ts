import { SERVICE_METADATA } from './internals';
import type { ServiceConstructor, ServiceMetadata } from './types';

/**
 * Registers A Class as Service
 *
 * @export
 * @returns {<C extends ServiceConstructor>(constructor: C) => C}
 */
export function Register() {
  return function <C extends ServiceConstructor>(constructor: C) {
    if ((constructor as any)[SERVICE_METADATA]?.token) {
      return constructor;
    }

    // Add more metadata here if needed
    (constructor as any)[SERVICE_METADATA] = {
      token: Symbol(`[IOCRAFT]: Service - ${constructor.name || 'Anonymous'}`),
    } satisfies ServiceMetadata;

    return constructor;
  };
}
