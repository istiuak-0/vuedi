import type { FunctionPlugin } from 'vue';
import type { PluginOptions } from '../utils/core.types';
import { getServiceMeta, RootRegistry, TempRegistry } from '../utils/core.utils';
import { ReactiveFacade } from './facade';

export const VuediPlugin: FunctionPlugin<[Partial<PluginOptions>?]> = (_app, options?: Partial<PluginOptions>) => {
  const facade = new ReactiveFacade();
  ///Eagerly create instances
  if (options?.EagerLoad) {
    options.EagerLoad.forEach(service => {
      const serviceMeta = getServiceMeta(service);

      if (!RootRegistry.has(serviceMeta.token)) {
        RootRegistry.set(serviceMeta.token, new service());
      }

      const instance = RootRegistry.get(serviceMeta.token)!;

      if (serviceMeta.facade) {
        if (!TempRegistry.has(serviceMeta.token)) {
          TempRegistry.set(serviceMeta.token, facade.createFacadeObj(service, instance));
        }
      }
    });
  }
};
