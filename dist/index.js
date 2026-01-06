"use strict";

// src/libs/types.ts
function ImplementsDispose(instance) {
  return typeof instance.dispose === "function";
}

// src/libs/registry.ts
var serviceRegistry = /* @__PURE__ */ new Map();
var SERVICE_INTERNAL_METADATA = /* @__PURE__ */ Symbol("VUEDI_SERVICE_METADATA");

// src/decorators/register.ts
function Register(config) {
  return function(constructor) {
    constructor[SERVICE_INTERNAL_METADATA] = config;
    return constructor;
  };
}

// src/functions/resolve.ts
function resolve(serviceClass) {
  let config = serviceClass[SERVICE_INTERNAL_METADATA];
  if (!config) {
    throw new Error("No Config Metadate Found, Make Sure To Use @Register() in global Service Classes");
  }
  if (serviceRegistry.has(serviceClass)) {
    return serviceRegistry.get(serviceClass);
  } else {
    const instance = new serviceClass();
    serviceRegistry.set(serviceClass, instance);
    return instance;
  }
}

// src/functions/resolve-instance.ts
import { getCurrentInstance, onScopeDispose } from "vue";
function resolveInstance(serviceClass) {
  let instance = new serviceClass();
  const componentInstance = getCurrentInstance();
  if (componentInstance) {
    onScopeDispose(() => {
      if (ImplementsDispose(instance)) {
        try {
          instance.dispose();
        } catch (error) {
          console.error("Error in scope dispose:", error);
        }
      }
      instance = null;
    });
  }
  return instance;
}

// src/plugin/vuedi.plugin.ts
var vuedi = (_app, options) => {
  if (options?.services) {
    options.services.forEach((item) => {
      const serviceInstance = serviceRegistry.has(item);
      if (!serviceInstance) {
        serviceRegistry.set(item, new item());
      }
    });
  }
};

// src/functions/expose-children.ts
import { getCurrentInstance as getCurrentInstance2, onScopeDispose as onScopeDispose2, provide } from "vue";
function exposeToChildren(classOrInstance) {
  let instance;
  let shouldCleanUp = false;
  if (typeof classOrInstance === "function") {
    instance = new classOrInstance();
    shouldCleanUp = true;
  } else {
    instance = classOrInstance;
  }
  const constructor = instance.constructor;
  provide(constructor.name, instance);
  if (shouldCleanUp) {
    const componentInstance = getCurrentInstance2();
    if (componentInstance) {
      onScopeDispose2(() => {
        if (ImplementsDispose(instance)) {
          try {
            instance.dispose();
          } catch (error) {
            console.error("Error in context service onUnmounted:", error);
          }
        }
        instance = null;
      });
    }
  }
}

// src/functions/resolve-context.ts
import { inject } from "vue";
function resolveFromContext(serviceClass) {
  return inject(serviceClass.name);
}
export {
  Register,
  exposeToChildren,
  resolve,
  resolveFromContext,
  resolveInstance,
  vuedi
};
//# sourceMappingURL=index.js.map