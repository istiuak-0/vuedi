import type { Plugin, App } from 'vue';
import { serviceRegistry } from './registry';
import type { ServiceConstructor } from './types';

type VueDIOptions = {
  services: ServiceConstructor[];
};

export const vuedi: Plugin = {
  install(_app: App, options: VueDIOptions) {
    options.services.forEach(item => {
      const serviceInstance = serviceRegistry.has(item);
      if (!serviceInstance) {
        serviceRegistry.set(item, new item());
      }
    });
  },
};
