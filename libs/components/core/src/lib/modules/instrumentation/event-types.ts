export interface SkyInstrumentationUserEvent {
  context?: Record<string, unknown>;
  eventName: string;
  eventDetail?: Record<string, unknown>;
  eventType: 'user';
}

export type SkyInstrumentationEvent = SkyInstrumentationUserEvent;
