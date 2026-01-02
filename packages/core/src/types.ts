export type UnMounted = {
  onUnMounted(): void;
};

export type ServiceConstructor<T = unknown> = {
  new (): T;
};
export type ServiceConfig = {
  in: 'root' | 'component';
};
