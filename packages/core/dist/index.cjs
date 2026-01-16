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
  ImplementsDispose: () => ImplementsDispose,
  Register: () => Register,
  SERVICE_INTERNAL_METADATA: () => SERVICE_INTERNAL_METADATA,
  exposeToChildren: () => exposeToChildren,
  getServiceRef: () => getServiceRef,
  resolve: () => resolve,
  resolveFromContext: () => resolveFromContext,
  resolveInstance: () => resolveInstance,
  serviceRefView: () => serviceRefView,
  serviceRegistry: () => serviceRegistry,
  vuediPlugin: () => vuediPlugin
});
module.exports = __toCommonJS(index_exports);

// src/functions/expose-children.ts
var import_vue2 = require("vue");

// src/libs/types.ts
function ImplementsDispose(instance) {
  return typeof instance.dispose === "function";
}

// src/libs/registry.ts
var SERVICE_INTERNAL_METADATA = /* @__PURE__ */ Symbol("VUEDI_SERVICE_METADATA");
var serviceRegistry = /* @__PURE__ */ new Map();
var serviceRefView = /* @__PURE__ */ new WeakMap();

// src/libs/service-refs.ts
var import_vue = require("vue");
function serviceToRefs(service) {
  const rawService = (0, import_vue.toRaw)(service);
  const refs = {};
  for (const key in service) {
    const value = rawService[key];
    if (value != null && typeof value === "object" && "effect" in value) {
      refs[key] = (0, import_vue.computed)({
        get: () => service[key],
        set: (newValue) => {
          service[key] = newValue;
        }
      });
    } else if ((0, import_vue.isRef)(value) || (0, import_vue.isReactive)(value)) {
      refs[key] = (0, import_vue.toRef)(service, key);
    } else if (typeof value === "function") {
      refs[key] = value.bind(service);
    } else {
      refs[key] = value;
    }
  }
  return refs;
}
function getServiceRef(instance) {
  const cached = serviceRefView.get(instance);
  if (cached) return cached;
  const refs = serviceToRefs(instance);
  serviceRefView.set(instance, refs);
  return refs;
}

// src/libs/service-token.ts
function getServiceToken(target) {
  const ctor = typeof target === "function" ? target : target.constructor;
  const meta = ctor[SERVICE_INTERNAL_METADATA];
  if (!meta?.token) {
    throw new Error(`[VUE DI]: ${ctor?.name || "Unknown"} is not decorated with @Register()`);
  }
  return meta.token;
}

// src/functions/expose-children.ts
function exposeToChildren(classOrInstance) {
  let instance;
  let ownsInstance = false;
  if (typeof classOrInstance === "function") {
    instance = new classOrInstance();
    ownsInstance = true;
  } else {
    instance = classOrInstance;
  }
  const refView = getServiceRef(instance);
  const serviceToken = getServiceToken(instance);
  (0, import_vue2.provide)(serviceToken, refView);
  if (ownsInstance) {
    const componentInstance = (0, import_vue2.getCurrentInstance)();
    if (componentInstance) {
      (0, import_vue2.onScopeDispose)(() => {
        if (ImplementsDispose(instance)) {
          try {
            instance.dispose();
          } catch (error) {
            console.error("[VUE DI]: Error in scope dispose:", error);
          }
        }
        if (serviceRefView.has(instance)) {
          serviceRefView.delete(instance);
        }
      });
    }
  }
}

// src/libs/live-access/instance-properties.ts
function addInstanceProperties(serviceInstance, targetObj) {
  const instanceKeys = Object.getOwnPropertyNames(serviceInstance);
  instanceKeys.forEach((key) => {
    if (key in targetObj) return;
    const descriptor = Object.getOwnPropertyDescriptor(serviceInstance, key);
    if (typeof descriptor.value === "function") {
      console.log("Instance method is in object keys instead of prototype");
      return;
    }
    if (descriptor.get || descriptor.set) {
      return;
    }
    Object.defineProperty(targetObj, key, {
      get() {
        return serviceInstance[key];
      },
      set(v) {
        serviceInstance[key] = v;
      },
      enumerable: true,
      configurable: true
    });
  });
}

// src/libs/live-access/instance-symbols.ts
function addInstanceSymbols(serviceInstance, targetObj) {
  const instanceSymbolKeys = Object.getOwnPropertySymbols(serviceInstance);
  instanceSymbolKeys.forEach((key) => {
    Object.defineProperty(targetObj, key, {
      get() {
        return serviceInstance[key];
      },
      set(v) {
        serviceInstance[key] = v;
      },
      enumerable: true,
      configurable: true
    });
  });
}

// src/libs/live-access/prototype-properties.ts
function addPrototypeProperties(serviceInstance, targetObj) {
  let currentProto = Object.getPrototypeOf(serviceInstance);
  while (currentProto && currentProto !== Object.prototype) {
    const protoKeys = Object.getOwnPropertyNames(currentProto);
    const filteredKeys = protoKeys.filter((key) => key !== "constructor");
    filteredKeys.forEach((key) => {
      if (hasKey(targetObj, key)) return;
      const descriptor = Object.getOwnPropertyDescriptor(currentProto, key);
      if (descriptor.get || descriptor.set) {
        const newDesc = {
          enumerable: true,
          configurable: true
        };
        if (descriptor.get) {
          newDesc.get = () => descriptor.get.call(serviceInstance);
        }
        if (descriptor.set) {
          newDesc.set = (value) => descriptor.set.call(serviceInstance, value);
        }
        Object.defineProperty(targetObj, key, newDesc);
      } else if (typeof descriptor.value === "function") {
        targetObj[key] = descriptor.value.bind(serviceInstance);
      }
    });
    currentProto = Object.getPrototypeOf(currentProto);
  }
}

// src/libs/live-access/static-properties.ts
function addStaticProperties(serviceClass, targetObj) {
  const allStaticKeys = Object.getOwnPropertyNames(serviceClass);
  const userDefinedStaticKeys = allStaticKeys.filter((key) => !["length", "name", "prototype"].includes(key));
  userDefinedStaticKeys.forEach((key) => {
    const descriptor = Object.getOwnPropertyDescriptor(serviceClass, key);
    if (typeof descriptor.value === "function") {
      targetObj[key] = descriptor.value.bind(serviceClass);
    } else if (descriptor.get || descriptor.set) {
      const newDesc = {
        enumerable: true,
        configurable: true
      };
      if (descriptor.get) {
        newDesc.get = () => descriptor.get.call(serviceClass);
      }
      if (descriptor.set) {
        newDesc.set = (value) => descriptor.set.call(serviceClass, value);
      }
      Object.defineProperty(targetObj, key, newDesc);
    } else {
      Object.defineProperty(targetObj, key, {
        get() {
          return serviceClass[key];
        },
        set(v) {
          serviceClass[key] = v;
        },
        enumerable: true,
        configurable: true
      });
    }
  });
}

// src/libs/live-access/static-symbols.ts
function addStaticSymbols(serviceClass, targeObj) {
  const staticSymbolKeys = Object.getOwnPropertySymbols(serviceClass);
  staticSymbolKeys.forEach((key) => {
    const descriptor = Object.getOwnPropertyDescriptor(serviceClass, key);
    if (typeof descriptor.value === "function") {
      targeObj[key] = descriptor.value.bind(serviceClass);
    } else if (descriptor.get || descriptor.set) {
      const newDesc = {
        enumerable: true,
        configurable: true
      };
      if (descriptor.get) {
        newDesc.get = () => descriptor.get.call(serviceClass);
      }
      if (descriptor.set) {
        newDesc.set = (value) => descriptor.set.call(serviceClass, value);
      }
      Object.defineProperty(targeObj, key, newDesc);
    } else {
      Object.defineProperty(targeObj, key, {
        get() {
          return serviceClass[key];
        },
        set(v) {
          serviceClass[key] = v;
        },
        enumerable: true,
        configurable: true
      });
    }
  });
}

// src/functions/resolve.ts
function resolve(serviceClass) {
  const serviceToken = getServiceToken(serviceClass);
  if (!serviceRegistry.has(serviceToken)) {
    serviceRegistry.set(serviceToken, new serviceClass());
  }
  const instance = serviceRegistry.get(serviceToken);
  const obj = {};
  addStaticProperties(serviceClass, obj);
  addStaticSymbols(serviceClass, obj);
  addInstanceProperties(instance, obj);
  addInstanceSymbols(instance, obj);
  addPrototypeProperties(instance, obj);
  return obj;
}

// src/functions/resolve-context.ts
var import_vue3 = require("vue");
function resolveFromContext(serviceClass) {
  const serviceToken = getServiceToken(serviceClass);
  return (0, import_vue3.inject)(serviceToken);
}

// src/functions/resolve-instance.ts
var import_vue4 = require("vue");
function resolveInstance(serviceClass) {
  let instance = new serviceClass();
  const componentInstance = (0, import_vue4.getCurrentInstance)();
  if (componentInstance) {
    (0, import_vue4.onScopeDispose)(() => {
      if (ImplementsDispose(instance)) {
        try {
          instance.dispose();
        } catch (error) {
          console.error("[VUE DI]: Error in scope dispose:", error);
        }
      }
      if (serviceRefView.has(instance)) {
        serviceRefView.delete(instance);
      }
    });
  }
  return instance;
}

// src/register.decorator.ts
function Register() {
  return function(constructor) {
    if (constructor[SERVICE_INTERNAL_METADATA]?.token) {
      return constructor;
    }
    const token = /* @__PURE__ */ Symbol(`vuedi:service:${constructor.name || "Anonymous"}`);
    constructor[SERVICE_INTERNAL_METADATA] = { token };
    return constructor;
  };
}

// src/vuedi.plugin.ts
var vuediPlugin = (_app, options) => {
  if (options?.services) {
    options.services.forEach((item) => {
      const serviceToken = getServiceToken(item);
      const serviceInstance = serviceRegistry.has(serviceToken);
      if (!serviceInstance) {
        serviceRegistry.set(serviceToken, new item());
      }
    });
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  ImplementsDispose,
  Register,
  SERVICE_INTERNAL_METADATA,
  exposeToChildren,
  getServiceRef,
  resolve,
  resolveFromContext,
  resolveInstance,
  serviceRefView,
  serviceRegistry,
  vuediPlugin
});
//# sourceMappingURL=index.cjs.map