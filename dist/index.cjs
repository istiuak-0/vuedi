"use strict";
"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var index_exports = {};
__export(index_exports, {
  Register: () => Register,
  exposeToChildren: () => exposeToChildren,
  resolve: () => resolve,
  resolveFromContext: () => resolveFromContext,
  resolveInstance: () => resolveInstance,
  vuedi: () => vuedi
});
module.exports = __toCommonJS(index_exports);

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
var import_vue = require("vue");
function resolveInstance(serviceClass) {
  let instance = new serviceClass();
  const componentInstance = (0, import_vue.getCurrentInstance)();
  if (componentInstance) {
    (0, import_vue.onScopeDispose)(() => {
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
var import_vue2 = require("vue");
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
  (0, import_vue2.provide)(constructor.name, instance);
  if (shouldCleanUp) {
    const componentInstance = (0, import_vue2.getCurrentInstance)();
    if (componentInstance) {
      (0, import_vue2.onScopeDispose)(() => {
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
var import_vue3 = require("vue");
function resolveFromContext(serviceClass) {
  return (0, import_vue3.inject)(serviceClass.name);
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  Register,
  exposeToChildren,
  resolve,
  resolveFromContext,
  resolveInstance,
  vuedi
});
//# sourceMappingURL=index.cjs.map