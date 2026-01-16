import { FunctionPlugin } from 'vue';

type ServiceConstructor<T extends object = object> = new () => T;
interface Disposable {
    dispose(): void;
}
declare function ImplementsDispose(instance: unknown): boolean;
type ServiceWithDispose<T> = T & {
    dispose(): void;
};
type ServiceMetadata = {
    token: symbol;
};

declare function exposeToChildren<T extends ServiceConstructor>(classOrInstance: T | InstanceType<T>): void;

type ResolvedService<T extends ServiceConstructor> = {
    [K in keyof InstanceType<T>]: InstanceType<T>[K];
} & {
    [K in keyof T]: T[K];
};
/**
 * Resolves a global singleton service into a destructurable object with:
 * - Live getters for reactive state (ref, computed, etc.)
 * - Bound methods that preserve correct `this` context
 *
 * @export
 * @template {ServiceConstructor} T
 * @param {T} serviceClass
 * @returns {InstanceType<T>}
 */
declare function resolve<T extends ServiceConstructor>(serviceClass: T): ResolvedService<T>;

declare function resolveFromContext<T extends ServiceConstructor>(serviceClass: T): InstanceType<T> | undefined;

declare function resolveInstance<T extends ServiceConstructor>(serviceClass: T): InstanceType<T>;

declare const SERVICE_INTERNAL_METADATA: unique symbol;
declare const serviceRegistry: Map<symbol, object>;
declare const serviceRefView: WeakMap<object, any>;

declare function getServiceRef<T extends InstanceType<ServiceConstructor>>(instance: T): T;

declare function Register(): <C extends ServiceConstructor>(constructor: C) => C;

type VueDIOptions = {
    services: ServiceConstructor[];
};
declare const vuediPlugin: FunctionPlugin<[Partial<VueDIOptions>?]>;

export { type Disposable, ImplementsDispose, Register, SERVICE_INTERNAL_METADATA, type ServiceConstructor, type ServiceMetadata, type ServiceWithDispose, exposeToChildren, getServiceRef, resolve, resolveFromContext, resolveInstance, serviceRefView, serviceRegistry, vuediPlugin };
