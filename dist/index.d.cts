import { FunctionPlugin } from 'vue';

type ServiceConstructor<T = unknown> = {
    new (): T;
};
type ServiceConfig = {
    in: 'app';
};
interface Disposable {
    dispose(): void;
}

declare function Register<T extends ServiceConfig>(config: T): <C extends ServiceConstructor>(constructor: C) => C;

declare function resolve<T extends ServiceConstructor>(serviceClass: T): InstanceType<T>;

declare function resolveInstance<T extends ServiceConstructor>(serviceClass: T): InstanceType<T>;

type VueDIOptions = {
    services: ServiceConstructor[];
};
declare const vuedi: FunctionPlugin<[Partial<VueDIOptions>?]>;

declare function exposeToChildren<T extends ServiceConstructor>(classOrInstance: T | InstanceType<T>): void;

declare function resolveFromContext<T extends ServiceConstructor>(serviceClass: T): InstanceType<T> | undefined;

export { type Disposable, Register, exposeToChildren, resolve, resolveFromContext, resolveInstance, vuedi };
