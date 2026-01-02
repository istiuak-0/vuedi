import type { ServiceConstructor } from "./types";

export const serviceRegistry = new Map<ServiceConstructor, unknown>();
export const SERVICE_INTERNAL_METADATA = Symbol('VUEDI_SERVICE_METADATA');