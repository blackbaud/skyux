import { SkyInstrumentationContextType } from './instrumentation-context-type';

export interface SkyInstrumentationUserEvent {
  eventName: string;
  eventProperties?: Record<string, unknown>;
  context?: SkyInstrumentationContextType;
}
