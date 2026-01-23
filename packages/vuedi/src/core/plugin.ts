import type { FunctionPlugin } from 'vue';
import type { VueDIOptions } from '../utils/core.types';
import { getServiceMeta, RootRegistry } from '../utils/core.utils';

export const vuediPlugin: FunctionPlugin<[Partial<VueDIOptions>?]> = (_app, options?: Partial<VueDIOptions>) => {
  ///Eagerly create instances
  if (options?.services) {
    options.services.forEach(item => {
      const serviceMeta = getServiceMeta(item);

      const serviceInstance = RootRegistry.has(serviceMeta.token);
      if (!serviceInstance) {
        RootRegistry.set(serviceMeta.token, new item());
      }
    });
  }
};
