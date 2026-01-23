import { inject } from 'vue';
import type { ServiceConstructor } from '../utils/core.types';
import { getServiceToken } from '../utils/core.utils';

export function resolveFromContext<T extends ServiceConstructor>(serviceClass: T) {
  const serviceToken = getServiceToken(serviceClass);
  return inject<InstanceType<T>>(serviceToken);
}
