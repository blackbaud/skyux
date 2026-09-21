export interface SkyInstrumentationUserEvent {
  eventName: string;
  eventProperties?: Record<string, unknown>;
  context?: Record<string, unknown>;
}
