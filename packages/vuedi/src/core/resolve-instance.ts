import { getCurrentInstance, onScopeDispose } from 'vue';
import type { ServiceConstructor, ServiceWithDispose } from '../utils/core.types';
import { ImplementsDispose, serviceRefView } from '../utils/core.utils';

export function resolveInstance<T extends ServiceConstructor>(serviceClass: T): InstanceType<T> {
  let instance = new serviceClass();
  const componentInstance = getCurrentInstance();

  /// here if i want i can tap into other hooks
  if (componentInstance) {
    onScopeDispose(() => {
      if (ImplementsDispose(instance)) {
        try {
          (instance as ServiceWithDispose<typeof instance>).dispose();
        } catch (error) {
          console.error('[VUE DI]: Error in scope dispose:', error);
        }
      }

      if (serviceRefView.has(instance)) {
        serviceRefView.delete(instance);
      }
    });
  }
  return instance as InstanceType<T>;
}
