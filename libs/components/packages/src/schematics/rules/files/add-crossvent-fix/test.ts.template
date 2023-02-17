// This file is required by karma.conf.js and loads recursively all the .spec and framework files
import { getTestBed } from '@angular/core/testing';
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting,
} from '@angular/platform-browser-dynamic/testing';

// Fix for crossvent "global is not defined" error. The crossvent library
// is used by Dragula, which in turn is used by multiple SKY UX components.
// See: https://github.com/bevacqua/dragula/issues/602
(window as any).global = window;

// First, initialize the Angular testing environment.
getTestBed().initTestEnvironment(
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting()
);
