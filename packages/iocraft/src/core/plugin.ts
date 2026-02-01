import { type FunctionPlugin } from 'vue';
import { Nav } from '../helpers';
import { createFacadeObj, generateRouterFacade } from './facade';
import { RootRegistry, TempRegistry } from './internals';
import type { PluginOptions } from './types';
import { GetServiceMetadata } from './utils';

export const IocRaftPlugin: FunctionPlugin<[Partial<PluginOptions>?]> = (_app, options?: Partial<PluginOptions>) => {
  if (options?.router) {
    RootRegistry.set(GetServiceMetadata(Nav).token, generateRouterFacade(options.router));
  }

  ///Eagerly create Service instances
  if (options?.EagerLoad) {
    options.EagerLoad.forEach(service => {
      const serviceMeta = GetServiceMetadata(service);

      if (!RootRegistry.has(serviceMeta.token)) {
        RootRegistry.set(serviceMeta.token, new service());
      }

      const instance = RootRegistry.get(serviceMeta.token)!;

      if (serviceMeta.facade) {
        if (!TempRegistry.has(serviceMeta.token)) {
          TempRegistry.set(serviceMeta.token, createFacadeObj(instance));
        }
      }
    });
  }
};
