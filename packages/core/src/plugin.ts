import type { FunctionPlugin } from 'vue';
import { serviceRegistry } from './registry';
import type { ServiceConstructor } from './types';

type VueDIOptions = {
  services: ServiceConstructor[];
};

export const vuedi: FunctionPlugin<VueDIOptions> = (_app, options) => {
  options.services.forEach(item => {
    const serviceInstance = serviceRegistry.has(item);
    if (!serviceInstance) {
      serviceRegistry.set(item, new item());
    }
  });
};
