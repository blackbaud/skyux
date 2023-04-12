import 'jest-preset-angular/setup-jest';

// jsdom (used by Jest) doesn't natively support ResizeObserver, so use a polyfill.
global.ResizeObserver = require('resize-observer-polyfill');
