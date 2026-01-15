import { setupZoneTestEnv } from 'jest-preset-angular/setup-env/zone';
import 'resize-observer-polyfill';

setupZoneTestEnv();

// jsdom (used by Jest) doesn't natively support ResizeObserver, so use a polyfill.
