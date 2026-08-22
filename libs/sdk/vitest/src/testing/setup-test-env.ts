import 'zone.js';
import 'zone.js/testing';

import { getTestBed } from '@angular/core/testing';
import {
  BrowserTestingModule,
  platformBrowserTesting,
} from '@angular/platform-browser/testing';
import { afterEach } from 'vitest';

import '../lib/matchers-setup.js';

getTestBed().initTestEnvironment(
  BrowserTestingModule,
  platformBrowserTesting(),
);

afterEach(() => {
  getTestBed().resetTestingModule();
});
