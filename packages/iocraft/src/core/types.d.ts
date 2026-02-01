import type { Router } from 'vue-router';

export type ServiceConstructor<T extends object = object> = new () => T;

export type PluginOptions = {
  EagerLoad: ServiceConstructor[];
  router: Router;
};

export interface ServiceOptions {
  facade?: boolean;
}

export type ServiceMetadata = {
  token: symbol;
  facade: boolean;
};

export interface OnMounted {
  onMounted(): void;
}

export interface OnUpdated {
  onUpdated(): void;
}

export interface OnUnmounted {
  onUnmounted(): void;
}

export interface OnBeforeMount {
  onBeforeMount(): void;
}

export interface OnBeforeUpdate {
  onBeforeUpdate(): void;
}

export interface OnBeforeUnmount {
  onBeforeUnmount(): void;
}

export interface OnErrorCaptured {
  onErrorCaptured(): void;
}

export interface OnRenderTracked {
  onRenderTracked(): void;
}

export interface OnRenderTriggered {
  onRenderTriggered(): void;
}

export interface OnActivated {
  onActivated(): void;
}

export interface OnDeactivated {
  onDeactivated(): void;
}

export interface OnServerPrefetch {
  onServerPrefetch(): void;
}

export interface OnScopeDispose {
  onScopeDispose(): void;
}

